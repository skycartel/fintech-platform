import { TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight, ArrowDownRight, Activity, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, StatCard, PageHeader, EmptyState, Badge } from '../ui';

function MiniChart({ up = true }: { up?: boolean }) {
  const color = up ? '#34d399' : '#f43f5e';
  const path = up
    ? 'M0,60 C20,55 35,40 55,38 C75,36 95,20 115,22 C135,24 155,12 200,8'
    : 'M0,12 C20,18 35,30 55,32 C75,34 95,48 115,46 C135,44 155,56 200,60';
  return (
    <svg width="100%" height="70" viewBox="0 0 200 70" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`dash-chart-${up ? 'u' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L200,70 L0,70 Z`} fill={`url(#dash-chart-${up ? 'u' : 'd'})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardOverview({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const { account, transactions, holdings, investments, loading, error, refresh } = data;

  if (loading) return <div className="py-20 text-center text-slate-500 text-sm">Loading dashboard...</div>;
  if (error) return <div className="py-20 text-center text-rose-400 text-sm">{error}</div>;

  const balance = account?.balance ?? 0;
  const equity = account?.equity ?? 0;
  const totalInvested = investments.reduce((s, i) => s + Number(i.amount), 0);
  const portfolioValue = holdings.reduce((s, h) => s + Number(h.quantity) * Number(h.current_price), 0);

  const firstName = (user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Trader').split(' ')[0];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's your portfolio summary for today."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Account Balance" value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="Available cash" icon={Wallet} accent="emerald" />
        <StatCard label="Equity" value={`$${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="Total account value" icon={DollarSign} accent="blue" />
        <StatCard label="Invested" value={`$${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="In active plans" icon={PieChart} accent="amber" />
        <StatCard label="Portfolio" value={`$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="Holdings value" icon={BarChart3} accent="emerald" />
      </div>

      {/* Chart + market overview */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <DashCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white">Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Account equity over time</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label="+12.4%" color="emerald" />
              <span className="text-xs text-slate-600">30D</span>
            </div>
          </div>
          <MiniChart up />
          <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800/60">
            {[
              { l: 'Today', v: '+$1,240', up: true },
              { l: '7D', v: '+$3,820', up: true },
              { l: '30D', v: '+$12,400', up: true },
              { l: 'All time', v: '+$28,450', up: true },
            ].map((p) => (
              <div key={p.l}>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{p.l}</div>
                <div className={`text-sm font-semibold mt-0.5 ${p.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {p.v}
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Market Overview</h3>
          <div className="space-y-3">
            {[
              { sym: 'BTC/USD', price: '67,420', chg: +2.34 },
              { sym: 'ETH/USD', price: '3,512', chg: +1.87 },
              { sym: 'S&P 500', price: '5,298', chg: +0.31 },
              { sym: 'XAU/USD', price: '2,384', chg: -0.62 },
            ].map((m) => (
              <div key={m.sym} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{m.sym}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-display text-white tabular-nums">${m.price}</span>
                  <span className={`text-xs font-medium flex items-center ${m.chg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.chg >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(m.chg).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center gap-2">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-500">Markets are open</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot relative" />
          </div>
        </DashCard>
      </div>

      {/* Recent transactions + holdings */}
      <div className="grid lg:grid-cols-2 gap-5">
        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <EmptyState title="No transactions yet" message="Your deposit and withdrawal history will appear here." icon={Wallet} />
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-slate-800/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {tx.type === 'deposit' ? <ArrowDownRight size={15} /> : tx.type === 'withdrawal' ? <ArrowUpRight size={15} /> : <Activity size={15} />}
                    </div>
                    <div>
                      <div className="text-sm text-white">{tx.description || tx.type}</div>
                      <div className="text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${Number(tx.amount) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(tx.amount) >= 0 ? '+' : ''}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Portfolio Holdings</h3>
          {holdings.length === 0 ? (
            <EmptyState title="No holdings yet" message="Your investment holdings will appear here once you start trading." icon={PieChart} />
          ) : (
            <div className="space-y-2">
              {holdings.slice(0, 6).map((h) => {
                const val = Number(h.quantity) * Number(h.current_price);
                const pnl = (Number(h.current_price) - Number(h.avg_price)) * Number(h.quantity);
                const pnlPct = Number(h.avg_price) > 0 ? ((Number(h.current_price) - Number(h.avg_price)) / Number(h.avg_price)) * 100 : 0;
                return (
                  <div key={h.id} className="flex items-center justify-between py-2.5 border-b border-slate-800/40 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">{h.symbol}</div>
                      <div className="text-[10px] text-slate-500">{h.quantity} @ ${Number(h.avg_price).toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white tabular-nums">${val.toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
                      <div className={`text-[10px] flex items-center justify-end gap-0.5 ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pnl >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {pnlPct.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashCard>
      </div>
    </div>
  );
}
