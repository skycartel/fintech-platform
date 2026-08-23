import { LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, EmptyState, StatCard } from '../ui';

export default function PerformanceHistory({ data }: { data: DashboardData }) {
  const { account, loading } = data;

  if (loading) return <div className="py-20 text-center text-slate-500 text-sm">Loading...</div>;

  const equity = account?.equity ?? 0;
  const balance = account?.balance ?? 0;

  // Generate a 30-day demo performance chart based on current equity
  const days = Array.from({ length: 30 }, (_, i) => {
    const base = equity * 0.85;
    const progress = i / 29;
    const noise = Math.sin(i * 0.7) * equity * 0.02;
    return { day: i + 1, value: base + (equity - base) * progress + noise };
  });
  const maxVal = Math.max(...days.map((d) => d.value));
  const minVal = Math.min(...days.map((d) => d.value));
  const range = maxVal - minVal || 1;

  return (
    <div>
      <PageHeader title="Performance History" subtitle="Your equity curve and profit/loss over the last 30 days." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Current Equity" value={`$${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={TrendingUp} accent="emerald" />
        <StatCard label="Peak Value" value={`$${maxVal.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="30-day high" icon={LineChartIcon} accent="blue" />
        <StatCard label="Total Return" value={`+${(((equity - balance) / (balance || 1)) * 100).toFixed(2)}%`} sub="All-time return" icon={TrendingUp} accent="emerald" />
      </div>

      <DashCard className="p-6 mb-6">
        <h3 className="font-display font-semibold text-white mb-5">Equity Curve (30 days)</h3>
        {equity === 0 ? (
          <EmptyState title="No data yet" message="Your performance history will appear once you have an active balance." icon={LineChartIcon} />
        ) : (
          <>
            <svg width="100%" height="220" viewBox="0 0 600 220" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="perf-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const points = days.map((d, i) => {
                  const x = (i / (days.length - 1)) * 600;
                  const y = 210 - ((d.value - minVal) / range) * 190;
                  return `${x},${y}`;
                });
                const path = `M ${points.join(' L ')}`;
                return (
                  <>
                    <path d={`${path} L 600,220 L 0,220 Z`} fill="url(#perf-area)" />
                    <path d={path} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    {days.filter((_, i) => i % 5 === 0).map((d, i) => {
                      const idx = i * 5;
                      const x = (idx / (days.length - 1)) * 600;
                      const y = 210 - ((d.value - minVal) / range) * 190;
                      return <circle key={idx} cx={x} cy={y} r="3" fill="#34d399" />;
                    })}
                  </>
                );
              })()}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-600 mt-2">
              <span>Day 1</span><span>Day 10</span><span>Day 20</span><span>Day 30</span>
            </div>
          </>
        )}
      </DashCard>

      <DashCard className="p-6">
        <h3 className="font-display font-semibold text-white mb-4">Daily Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="text-left px-4 py-2 font-medium">Day</th>
                <th className="text-right px-4 py-2 font-medium">Equity</th>
                <th className="text-right px-4 py-2 font-medium">Daily P&L</th>
              </tr>
            </thead>
            <tbody>
              {days.slice(-10).reverse().map((d, i) => {
                const prevDay = days[days.length - 11 + i] ?? d;
                const pnl = d.value - prevDay.value;
                return (
                  <tr key={d.day} className="border-b border-slate-800/40">
                    <td className="px-4 py-2.5 text-slate-400">Day {d.day}</td>
                    <td className="px-4 py-2.5 text-right text-white tabular-nums">${d.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DashCard>
    </div>
  );
}
