import { TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, EmptyState, StatCard } from '../ui';

export default function MyPortfolio({ data }: { data: DashboardData }) {
  const { holdings, loading } = data;

  const totalValue = holdings.reduce((s, h) => s + Number(h.quantity) * Number(h.current_price), 0);
  const totalCost = holdings.reduce((s, h) => s + Number(h.quantity) * Number(h.avg_price), 0);
  const totalPnl = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  if (loading) return <div className="py-20 text-center text-slate-500 text-sm">Loading...</div>;

  return (
    <div>
      <PageHeader title="My Portfolio" subtitle="Your complete holdings across all asset classes." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Total Value" value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={PieChart} accent="emerald" />
        <StatCard label="Total P&L" value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={BarChart3} accent={totalPnl >= 0 ? 'emerald' : 'rose'} />
        <StatCard label="Return" value={`${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`} icon={TrendingUp} accent={pnlPct >= 0 ? 'emerald' : 'rose'} />
      </div>

      <DashCard className="overflow-hidden">
        {holdings.length === 0 ? (
          <EmptyState title="No holdings yet" message="Start trading to build your portfolio." icon={PieChart} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">Asset</th>
                  <th className="text-left px-6 py-3 font-medium">Class</th>
                  <th className="text-right px-6 py-3 font-medium">Qty</th>
                  <th className="text-right px-6 py-3 font-medium">Avg. Price</th>
                  <th className="text-right px-6 py-3 font-medium">Current</th>
                  <th className="text-right px-6 py-3 font-medium">Value</th>
                  <th className="text-right px-6 py-3 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const val = Number(h.quantity) * Number(h.current_price);
                  const pnl = (Number(h.current_price) - Number(h.avg_price)) * Number(h.quantity);
                  const pct = Number(h.avg_price) > 0 ? ((Number(h.current_price) - Number(h.avg_price)) / Number(h.avg_price)) * 100 : 0;
                  return (
                    <tr key={h.id} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{h.symbol}</div>
                        <div className="text-xs text-slate-500">{h.name}</div>
                      </td>
                      <td className="px-6 py-4"><span className="text-xs text-slate-400 capitalize">{h.asset_class}</span></td>
                      <td className="px-6 py-4 text-right text-slate-300 tabular-nums">{h.quantity}</td>
                      <td className="px-6 py-4 text-right text-slate-300 tabular-nums">${Number(h.avg_price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-white tabular-nums">${Number(h.current_price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-white font-medium tabular-nums">${val.toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                      <td className={`px-6 py-4 text-right tabular-nums font-semibold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <span className="flex items-center justify-end gap-0.5">
                          {pnl >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {pct.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>
    </div>
  );
}
