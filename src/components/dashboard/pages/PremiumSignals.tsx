import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, Badge, EmptyState } from '../ui';

export default function PremiumSignals({ data }: { data: DashboardData }) {
  const { signals } = data;

  return (
    <div>
      <PageHeader title="Premium Signals" subtitle="Expert trading signals from our market analysis team." />

      <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        Trading signals are provided for informational purposes only and do not constitute financial advice. Past performance does not guarantee future results.
      </div>

      {signals.length === 0 ? (
        <DashCard className="p-6">
          <EmptyState title="No signals available" message="Premium signals will appear here when published by our analysts." icon={Zap} />
        </DashCard>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {signals.map((sig) => {
            const isBuy = sig.action.toUpperCase() === 'BUY';
            return (
              <DashCard key={sig.id} className="p-6 card-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBuy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {isBuy ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white">{sig.symbol}</h3>
                      <span className="text-xs text-slate-500">{new Date(sig.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge label={sig.action} color={isBuy ? 'emerald' : 'rose'} />
                </div>

                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{sig.analysis}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-[#0b1124] border border-slate-800/40">
                    <div className="text-[9px] text-slate-500 uppercase">Entry</div>
                    <div className="text-sm font-semibold text-white tabular-nums">${sig.entry_price.toLocaleString()}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <div className="text-[9px] text-emerald-500 uppercase">Target</div>
                    <div className="text-sm font-semibold text-emerald-400 tabular-nums">${sig.target_price.toLocaleString()}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                    <div className="text-[9px] text-rose-500 uppercase">Stop</div>
                    <div className="text-sm font-semibold text-rose-400 tabular-nums">${sig.stop_loss.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Confidence:</span>
                    <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sig.confidence >= 70 ? 'bg-emerald-400' : sig.confidence >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                        style={{ width: `${sig.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-white">{sig.confidence}%</span>
                  </div>
                  <Badge label={sig.status} color={sig.status === 'active' ? 'blue' : 'slate'} />
                </div>
              </DashCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
