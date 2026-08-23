import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Wallet, BadgeCheck, CreditCard, LifeBuoy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashCard, StatCard, PageHeader, Badge, LoadingState } from '@/components/dashboard/ui';

interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingKyc: number;
  pendingCredit: number;
  openTickets: number;
  totalAum: number;
  activeInvestments: number;
}

interface RecentTx {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentTx, setRecentTx] = useState<RecentTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, depRes, wdRes, kycRes, creditRes, ticketRes, accRes, invRes, txRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('transactions').select('amount').eq('type', 'deposit').eq('status', 'completed'),
          supabase.from('transactions').select('amount').eq('type', 'withdrawal').eq('status', 'completed'),
          supabase.from('kyc_documents').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('credit_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('accounts').select('balance'),
          supabase.from('investments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(8),
        ]);

        const totalDeposits = (depRes.data ?? []).reduce((s: number, t: any) => s + Number(t.amount), 0);
        const totalWithdrawals = Math.abs((wdRes.data ?? []).reduce((s: number, t: any) => s + Number(t.amount), 0));
        const totalAum = (accRes.data ?? []).reduce((s: number, a: any) => s + Number(a.balance), 0);

        setStats({
          totalUsers: usersRes.count ?? 0,
          totalDeposits,
          totalWithdrawals,
          pendingKyc: kycRes.count ?? 0,
          pendingCredit: creditRes.count ?? 0,
          openTickets: ticketRes.count ?? 0,
          totalAum,
          activeInvestments: invRes.count ?? 0,
        });
        setRecentTx((txRes.data as RecentTx[]) ?? []);
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState message="Loading admin dashboard..." />;
  if (!stats) return <div className="py-20 text-center text-slate-500 text-sm">Failed to load data.</div>;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and key metrics." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} sub="Registered accounts" icon={Users} accent="blue" />
        <StatCard label="Total AUM" value={`$${stats.totalAum.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="Assets under management" icon={Wallet} accent="emerald" />
        <StatCard label="Total Deposits" value={`$${stats.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="All-time completed" icon={TrendingUp} accent="emerald" />
        <StatCard label="Withdrawals" value={`$${stats.totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} sub="All-time completed" icon={Activity} accent="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <DashCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"><BadgeCheck size={22} className="text-amber-400" /></div>
          <div><div className="text-2xl font-display font-bold text-white">{stats.pendingKyc}</div><div className="text-xs text-slate-500">Pending KYC Reviews</div></div>
        </DashCard>
        <DashCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><CreditCard size={22} className="text-blue-400" /></div>
          <div><div className="text-2xl font-display font-bold text-white">{stats.pendingCredit}</div><div className="text-xs text-slate-500">Pending Credit Apps</div></div>
        </DashCard>
        <DashCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center"><LifeBuoy size={22} className="text-rose-400" /></div>
          <div><div className="text-2xl font-display font-bold text-white">{stats.openTickets}</div><div className="text-xs text-slate-500">Open Support Tickets</div></div>
        </DashCard>
      </div>

      <DashCard className="p-6">
        <h3 className="font-display font-semibold text-white mb-4">Recent Transactions</h3>
        {recentTx.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">User</th>
                  <th className="text-right px-4 py-2 font-medium">Amount</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-800/40">
                    <td className="px-4 py-3 capitalize text-slate-300">{tx.type}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{tx.user_id.substring(0, 8)}...</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${Number(tx.amount) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {Number(tx.amount) >= 0 ? '+' : ''}${Math.abs(Number(tx.amount)).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3"><Badge label={tx.status} color={tx.status === 'completed' ? 'emerald' : tx.status === 'pending' ? 'amber' : 'slate'} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
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
