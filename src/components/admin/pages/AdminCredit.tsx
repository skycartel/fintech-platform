import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { CreditCard, CheckCircle2, XCircle } from 'lucide-react';

interface CreditRow {
  id: string;
  user_id: string;
  amount: number;
  term_months: number;
  purpose: string;
  status: string;
  interest_rate: number;
  created_at: string;
}

export default function AdminCredit() {
  const [apps, setApps] = useState<CreditRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('credit_applications').select('*').order('created_at', { ascending: false });
    setApps((data as CreditRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string, userId: string, status: 'approved' | 'rejected') => {
    await supabase.from('credit_applications').update({ status }).eq('id', id);
    await supabase.from('admin_logs').insert({
      action: `credit_${status}`,
      target_type: 'credit_application',
      target_id: id,
      details: { user_id: userId },
    });
    await supabase.from('notifications').insert({
      user_id: userId,
      title: `Credit Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      body: status === 'approved' ? 'Your credit application has been approved. Funds will be credited to your account.' : 'Your credit application was rejected. Please contact support for more information.',
      type: status === 'approved' ? 'success' : 'error',
    });
    load();
  };

  if (loading) return <LoadingState message="Loading credit applications..." />;

  return (
    <div>
      <PageHeader title="Credit Applications" subtitle="Review and process user credit applications." />

      <DashCard className="overflow-hidden">
        {apps.length === 0 ? (
          <EmptyState title="No credit applications" message="User credit applications will appear here." icon={CreditCard} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">User</th>
                  <th className="text-right px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Term</th>
                  <th className="text-left px-6 py-3 font-medium">Rate</th>
                  <th className="text-left px-6 py-3 font-medium">Purpose</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b border-slate-800/40 hover:bg-white/5">
                    <td className="px-6 py-3.5 text-slate-500 font-mono text-xs">{a.user_id.substring(0, 8)}...</td>
                    <td className="px-6 py-3.5 text-right font-semibold text-white tabular-nums">${Number(a.amount).toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                    <td className="px-6 py-3.5 text-slate-300">{a.term_months}mo</td>
                    <td className="px-6 py-3.5 text-slate-400">{Number(a.interest_rate).toFixed(1)}%</td>
                    <td className="px-6 py-3.5 text-slate-400 max-w-xs truncate">{a.purpose}</td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5"><Badge label={a.status} color={a.status === 'approved' ? 'emerald' : a.status === 'pending' ? 'amber' : 'rose'} /></td>
                    <td className="px-6 py-3.5">
                      {a.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => review(a.id, a.user_id, 'approved')} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"><CheckCircle2 size={14} /> Approve</button>
                          <button onClick={() => review(a.id, a.user_id, 'rejected')} className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium"><XCircle size={14} /> Reject</button>
                        </div>
                      ) : <span className="text-xs text-slate-600">Reviewed</span>}
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
