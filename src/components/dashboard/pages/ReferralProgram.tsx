import { Gift, Copy, Users, DollarSign, Share2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, EmptyState, StatCard, Badge } from '../ui';

export default function ReferralProgram({ data }: { data: DashboardData }) {
  const { profile, referrals } = data;
  const [copied, setCopied] = useState(false);

  const referralCode = profile?.referral_code ?? '—';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === 'active' || r.status === 'completed').length;
  const totalReward = referrals.reduce((s, r) => s + Number(r.reward), 0);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Referral Program" subtitle="Invite friends and earn rewards on their activity." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Total Referrals" value={String(totalReferrals)} sub="People you've invited" icon={Users} accent="blue" />
        <StatCard label="Active Referrals" value={String(activeReferrals)} sub="With completed signup" icon={Gift} accent="emerald" />
        <StatCard label="Total Rewards" value={`$${totalReward.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="Earned from referrals" icon={DollarSign} accent="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Your Referral Link</h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 px-4 py-3 rounded-xl bg-[#0b1124] border border-slate-700/60 text-sm text-white font-mono truncate">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-400 text-[#04070f] hover:shadow-lg hover:shadow-emerald-500/30'
              }`}
            >
              <Copy size={15} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-3 rounded-xl bg-[#0b1124] border border-slate-700/60 text-sm text-white font-mono text-center">
              Code: <span className="text-emerald-400 font-bold">{referralCode}</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:text-white transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            <p className="text-xs text-slate-500 leading-relaxed">
              You earn <span className="text-emerald-400 font-semibold">5%</span> of every referral's first deposit. Your friend also receives a bonus when they sign up using your link.
            </p>
          </div>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">How It Works</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Share your link', desc: 'Send your referral link to friends and family.' },
              { step: '2', title: 'They sign up', desc: 'Your friend creates an account using your link.' },
              { step: '3', title: 'You both earn', desc: 'You get 5% of their first deposit. They get a signup bonus.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>

      <DashCard className="p-6">
        <h3 className="font-display font-semibold text-white mb-4">Referral History</h3>
        {referrals.length === 0 ? (
          <EmptyState title="No referrals yet" message="Share your referral link to start earning rewards." icon={Gift} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-4 py-2 font-medium">Referred Email</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-right px-4 py-2 font-medium">Reward</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/40">
                    <td className="px-4 py-3 text-slate-300">{r.referred_email ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-semibold tabular-nums">${Number(r.reward).toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
                    <td className="px-4 py-3"><Badge label={r.status} color={r.status === 'completed' ? 'emerald' : r.status === 'pending' ? 'amber' : 'slate'} /></td>
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
