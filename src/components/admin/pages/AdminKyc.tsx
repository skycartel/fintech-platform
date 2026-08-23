import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { BadgeCheck, CheckCircle2, XCircle } from 'lucide-react';

interface KycRow {
  id: string;
  user_id: string;
  document_type: string;
  document_number: string | null;
  status: string;
  review_notes: string | null;
  created_at: string;
}

export default function AdminKyc() {
  const [docs, setDocs] = useState<KycRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('kyc_documents').select('*').order('created_at', { ascending: false });
    setDocs((data as KycRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string, userId: string, status: 'verified' | 'rejected') => {
    await supabase.from('kyc_documents').update({
      status,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id);

    await supabase.from('profiles').update({ identity_status: status }).eq('id', userId);

    await supabase.from('admin_logs').insert({
      action: `kyc_${status}`,
      target_type: 'kyc_document',
      target_id: id,
      details: { user_id: userId },
    });

    await supabase.from('notifications').insert({
      user_id: userId,
      title: `Identity ${status === 'verified' ? 'Verified' : 'Rejected'}`,
      body: status === 'verified' ? 'Your identity verification has been approved.' : 'Your identity verification was rejected. Please submit a new document.',
      type: status === 'verified' ? 'success' : 'error',
    });

    load();
  };

  if (loading) return <LoadingState message="Loading KYC submissions..." />;

  return (
    <div>
      <PageHeader title="Identity Verification" subtitle="Review and process user identity verification submissions." />

      <DashCard className="overflow-hidden">
        {docs.length === 0 ? (
          <EmptyState title="No KYC submissions" message="User identity documents will appear here for review." icon={BadgeCheck} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">User</th>
                  <th className="text-left px-6 py-3 font-medium">Document Type</th>
                  <th className="text-left px-6 py-3 font-medium">Doc Number</th>
                  <th className="text-left px-6 py-3 font-medium">Submitted</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-slate-800/40 hover:bg-white/5">
                    <td className="px-6 py-3.5 text-slate-500 font-mono text-xs">{d.user_id.substring(0, 8)}...</td>
                    <td className="px-6 py-3.5 capitalize text-slate-300">{d.document_type.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-3.5 text-slate-400 font-mono text-xs">{d.document_number ?? '—'}</td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5"><Badge label={d.status} color={d.status === 'verified' ? 'emerald' : d.status === 'pending' ? 'amber' : 'rose'} /></td>
                    <td className="px-6 py-3.5">
                      {d.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => review(d.id, d.user_id, 'verified')} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium">
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button onClick={() => review(d.id, d.user_id, 'rejected')} className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium">
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">Reviewed</span>
                      )}
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
