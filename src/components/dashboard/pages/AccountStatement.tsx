import { ReceiptText, ArrowUpRight, ArrowDownRight, Activity, Download } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, EmptyState, Badge } from '../ui';

export default function AccountStatement({ data }: { data: DashboardData }) {
  const { transactions, loading } = data;

  return (
    <div>
      <PageHeader
        title="Account Statement"
        subtitle="Complete record of all your account activity."
        action={
          <button className="flex items-center gap-2 text-xs font-medium text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-colors">
            <Download size={14} /> Export CSV
          </button>
        }
      />

      <DashCard className="overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading...</div>
        ) : transactions.length === 0 ? (
          <EmptyState title="No transactions" message="Your full transaction history will appear here." icon={ReceiptText} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">Type</th>
                  <th className="text-left px-6 py-3 font-medium">Description</th>
                  <th className="text-left px-6 py-3 font-medium">Reference</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {tx.type === 'deposit' ? <ArrowDownRight size={15} /> : tx.type === 'withdrawal' ? <ArrowUpRight size={15} /> : <Activity size={15} />}
                        </div>
                        <span className="text-white capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{tx.description || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{tx.reference || '—'}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><Badge label={tx.status} color={tx.status === 'completed' ? 'emerald' : 'amber'} /></td>
                    <td className={`px-6 py-4 text-right font-semibold tabular-nums ${Number(tx.amount) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {Number(tx.amount) >= 0 ? '+' : ''}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
