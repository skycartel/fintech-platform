import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { Activity } from 'lucide-react';

interface TxRow {
  id: string;
  user_id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
}

export default function AdminTransactions() {
  const [txs, setTxs] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100);
      setTxs((data as TxRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === 'all' ? txs : txs.filter((t) => t.type === filter);

  if (loading) return <LoadingState message="Loading transactions..." />;

  return (
    <div>
      <PageHeader title="Transactions" subtitle="All platform transactions across all users." />

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'deposit', 'withdrawal', 'transfer'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
              filter === f ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#0b1124] text-slate-500 border border-slate-800/60 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <DashCard className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No transactions" message="Platform transactions will appear here." icon={Activity} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">Type</th>
                  <th className="text-left px-6 py-3 font-medium">User</th>
                  <th className="text-left px-6 py-3 font-medium">Description</th>
                  <th className="text-right px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Reference</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-800/40 hover:bg-white/5">
                    <td className="px-6 py-3 capitalize text-slate-300">{tx.type}</td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{tx.user_id.substring(0, 8)}...</td>
                    <td className="px-6 py-3 text-slate-400 max-w-xs truncate">{tx.description}</td>
                    <td className={`px-6 py-3 text-right tabular-nums font-semibold ${Number(tx.amount) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {Number(tx.amount) >= 0 ? '+' : ''}${Math.abs(Number(tx.amount)).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-3"><Badge label={tx.status} color={tx.status === 'completed' ? 'emerald' : tx.status === 'pending' ? 'amber' : 'slate'} /></td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{tx.reference ?? '—'}</td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
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
