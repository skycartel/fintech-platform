import { Wallet, Clock } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, EmptyState, Badge } from '../ui';

export default function CreditHistory({ data }: { data: DashboardData }) {
  const { creditApps } = data;

  return (
    <div>
      <PageHeader title="Credit History" subtitle="Your credit applications and their status." />

      <DashCard className="overflow-hidden">
        {creditApps.length === 0 ? (
          <EmptyState title="No credit applications" message="Your credit application history will appear here once you apply." icon={Wallet} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Term</th>
                  <th className="text-left px-6 py-3 font-medium">Interest Rate</th>
                  <th className="text-left px-6 py-3 font-medium">Purpose</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {creditApps.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white tabular-nums">${Number(app.amount).toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                    <td className="px-6 py-4 text-slate-300">{app.term_months} months</td>
                    <td className="px-6 py-4 text-slate-300">{Number(app.interest_rate).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{app.purpose}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge
                        label={app.status}
                        color={app.status === 'approved' ? 'emerald' : app.status === 'pending' ? 'amber' : app.status === 'rejected' ? 'rose' : 'slate'}
                      />
                    </td>
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
