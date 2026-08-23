import { useState, FormEvent, useEffect } from 'react';
import { UserCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader } from '../ui';

export default function ProfileSettings({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const { profile, refresh } = data;
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone(profile.phone ?? '');
      setCountry(profile.country ?? '');
    }
  }, [profile]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      phone,
      country,
      updated_at: new Date().toISOString(),
    }).eq('id', user?.id ?? '');
    if (!error) {
      setSuccess(true);
      refresh();
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Profile Settings" subtitle="Manage your personal information." />

      <div className="grid lg:grid-cols-3 gap-5">
        <DashCard className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center font-display font-bold text-[#04070f] text-2xl mx-auto mb-4">
            {(fullName || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <h3 className="font-display font-semibold text-white">{fullName || 'User'}</h3>
          <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          <div className="mt-4 pt-4 border-t border-slate-800/60 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Role</span>
              <span className="text-emerald-400 capitalize">{profile?.role ?? 'user'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Referral Code</span>
              <span className="text-white font-mono">{profile?.referral_code ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Identity</span>
              <span className="capitalize text-slate-300">{profile?.identity_status ?? 'not_started'}</span>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-white mb-5">Personal Information</h3>

          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} /> Profile updated successfully.
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
                <input
                  type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Email (read-only)</label>
                <input
                  type="email" disabled value={user?.email ?? ''}
                  className="w-full bg-[#0b1124]/50 border border-slate-800/40 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Phone</label>
                <input
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0123"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Country</label>
                <input
                  type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><UserCircle size={16} /> Save Changes</>}
            </button>
          </form>
        </DashCard>
      </div>
    </div>
  );
}
