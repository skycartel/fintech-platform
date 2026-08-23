import { useState, FormEvent, useEffect } from 'react';
import { BadgeCheck, Upload, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, Badge, EmptyState } from '../ui';

export default function IdentityVerification({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const { profile, refresh } = data;
  const [docType, setDocType] = useState('passport');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<any[]>([]);

  const loadDocs = async () => {
    if (!user) return;
    const { data: dd } = await supabase.from('kyc_documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setDocs(dd ?? []);
  };

  useEffect(() => { loadDocs(); }, [user]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!docNumber.trim()) {
      setError('Please enter your document number.');
      return;
    }
    setLoading(true);
    try {
      const { error: insErr } = await supabase.from('kyc_documents').insert({
        document_type: docType,
        document_number: docNumber.trim(),
        status: 'pending',
      });
      if (insErr) throw insErr;

      // Update profile identity status
      await supabase.from('profiles').update({
        identity_status: 'pending',
        updated_at: new Date().toISOString(),
      }).eq('id', user?.id ?? '');

      setSuccess(true);
      setDocNumber('');
      refresh();
      loadDocs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    }
    setLoading(false);
  };

  const status = profile?.identity_status ?? 'not_started';
  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    not_started: { icon: Clock, color: 'slate', label: 'Not Started' },
    pending: { icon: Clock, color: 'amber', label: 'Pending Review' },
    verified: { icon: CheckCircle2, color: 'emerald', label: 'Verified' },
    rejected: { icon: XCircle, color: 'rose', label: 'Rejected' },
  };
  const cfg = statusConfig[status] ?? statusConfig.not_started;

  return (
    <div>
      <PageHeader title="Identity Verification" subtitle="Verify your identity to unlock all platform features." />

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <DashCard className="p-6 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
            status === 'verified' ? 'bg-emerald-500/10 border border-emerald-500/20' :
            status === 'pending' ? 'bg-amber-500/10 border border-amber-500/20' :
            status === 'rejected' ? 'bg-rose-500/10 border border-rose-500/20' :
            'bg-slate-800/40 border border-slate-700/40'
          }`}>
            <cfg.icon size={28} className={
              status === 'verified' ? 'text-emerald-400' :
              status === 'pending' ? 'text-amber-400' :
              status === 'rejected' ? 'text-rose-400' : 'text-slate-500'
            } />
          </div>
          <h3 className="font-display font-semibold text-white">{cfg.label}</h3>
          <p className="text-xs text-slate-500 mt-1">Your verification status</p>
        </DashCard>

        <DashCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-white mb-4">Submit Document</h3>

          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} /> Document submitted for review. We will notify you once it has been processed.
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>
          )}

          {status === 'verified' ? (
            <div className="py-8 text-center">
              <BadgeCheck size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300">Your identity has been verified. No further action needed.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Document Type</label>
                <select
                  value={docType} onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
                >
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="national_id">National ID Card</option>
                  <option value="residence_permit">Residence Permit</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Document Number</label>
                <input
                  type="text" required value={docNumber} onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. P1234567"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              <div className="px-4 py-3 rounded-lg bg-[#0b1124] border border-dashed border-slate-700/60 text-center">
                <Upload size={20} className="text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Document upload (file storage to be configured)</p>
              </div>
              <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </form>
          )}
        </DashCard>
      </div>

      <DashCard className="p-6">
        <h3 className="font-display font-semibold text-white mb-4">Document History</h3>
        {docs.length === 0 ? (
          <EmptyState title="No documents submitted" message="Your verification documents will appear here." icon={FileText} />
        ) : (
          <div className="space-y-3">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-slate-800/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800/40 flex items-center justify-center">
                    <FileText size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm text-white capitalize">{d.document_type.replace(/_/g, ' ')}</div>
                    <div className="text-[10px] text-slate-500">{d.document_number} · {new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <Badge label={d.status} color={d.status === 'verified' ? 'emerald' : d.status === 'pending' ? 'amber' : 'rose'} />
              </div>
            ))}
          </div>
        )}
      </DashCard>
    </div>
  );
}
