import { useEffect, useState } from 'react';
import { Users, TrendingUp, Copy, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, Badge, LoadingState } from '../ui';

interface Trader {
  id: string;
  name: string;
  bio: string;
  strategy: string;
  risk_level: string;
  followers: number;
  roi: number;
  win_rate: number;
}

export default function CopyTrading({ data }: { data: DashboardData }) {
  const { copyPositions } = data;
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: td } = await supabase.from('traders').select('*').eq('active', true).order('followers', { ascending: false });
      setTraders((td as Trader[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <PageHeader title="Copy Trading" subtitle="Automatically copy the trades of top-performing traders." />

      {loading ? (
        <LoadingState message="Loading traders..." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {traders.map((t) => (
            <DashCard key={t.id} className="p-6 card-lift">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center font-display font-bold text-[#04070f] flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white">{t.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t.bio}</p>
                </div>
                <button className="text-slate-600 hover:text-amber-400"><Star size={18} /></button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">ROI</div>
                  <div className="font-display font-bold text-emerald-400">+{t.roi}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Win Rate</div>
                  <div className="font-display font-bold text-white">{t.win_rate}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Followers</div>
                  <div className="font-display font-bold text-white">{t.followers.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500">Strategy: <span className="text-slate-300">{t.strategy}</span></span>
                <Badge label={t.risk_level} color={t.risk_level === 'low' ? 'emerald' : t.risk_level === 'medium' ? 'amber' : 'rose'} />
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                <Copy size={15} /> Copy Trader
              </button>
            </DashCard>
          ))}
        </div>
      )}

      <DashCard className="p-6">
        <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-emerald-400" /> Your Copy Positions</h3>
        {copyPositions.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">You are not copying any traders yet. Pick a trader above to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-4 py-2 font-medium">Trader</th>
                  <th className="text-left px-4 py-2 font-medium">Symbol</th>
                  <th className="text-left px-4 py-2 font-medium">Direction</th>
                  <th className="text-right px-4 py-2 font-medium">Amount</th>
                  <th className="text-right px-4 py-2 font-medium">P&L</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {copyPositions.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/40">
                    <td className="px-4 py-3 text-white">{p.trader_name}</td>
                    <td className="px-4 py-3 text-slate-300">{p.symbol}</td>
                    <td className="px-4 py-3"><Badge label={p.direction} color={p.direction === 'buy' ? 'emerald' : 'rose'} /></td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">${Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${Number(p.pnl) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {Number(p.pnl) >= 0 ? '+' : ''}${Number(p.pnl).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3"><Badge label={p.status} color={p.status === 'open' ? 'blue' : 'slate'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>
    </div>
  );
}
