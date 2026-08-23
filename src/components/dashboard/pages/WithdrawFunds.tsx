import { useState, FormEvent } from 'react';
import { ArrowUpFromLine, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader } from '../ui';

export default function WithdrawFunds({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const { account, refresh } = data;
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balance = account?.balance ?? 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 50) {
      setError('Minimum withdrawal is $50.');
      return;
    }
    if (amt > balance) {
      setError('Insufficient balance. You cannot withdraw more than your available balance.');
      return;
    }
    if (!address.trim()) {
      setError('Please provide a withdrawal address.');
      return;
    }
    setLoading(true);
    try {
      const ref = `WDR-${Date.now().toString(36).toUpperCase()}`;

      // Deduct from account balance immediately
      const newBalance = balance - amt;
      const { error: accErr } = await supabase.from('accounts').update({
        balance: newBalance,
        equity: newBalance,
        updated_at: new Date().toISOString(),
      }).eq('user_id', account?.user_id ?? '');
      if (accErr) throw accErr;

      // Create withdrawal transaction
      const { error: txErr } = await supabase.from('transactions').insert({
        type: 'withdrawal',
        description: `Withdrawal to ${address.substring(0, 12)}...`,
        amount: -amt,
        status: 'pending',
        reference: ref,
      });
      if (txErr) throw txErr;

      // Create notification
      await supabase.from('notifications').insert({
        title: 'Withdrawal Submitted',
        body: `Withdrawal of $${amt.toLocaleString()} is being processed. Reference: ${ref}`,
        type: 'info',
      });

      setSuccess(`Withdrawal of $${amt.toLocaleString()} submitted. Reference: ${ref}`);
      setAmount('');
      setAddress('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Withdraw Funds" subtitle="Withdraw money from your trading account." />

      <div className="grid lg:grid-cols-3 gap-5">
        <DashCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-white mb-5">Withdrawal Details</h3>

          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} /> {success}
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-display font-semibold">$</span>
                <input
                  type="number" required min="50" max={balance} value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-8 pr-4 py-3.5 text-lg font-display font-semibold text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-600">Minimum: $50 · Maximum: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <button type="button" onClick={() => setAmount(String(balance))} className="text-xs text-emerald-400 hover:text-emerald-300">Max</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Withdrawal Address</label>
              <input
                type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Bank account number or crypto wallet address"
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowUpFromLine size={16} /> Withdraw ${amount || '0'}</>}
            </button>
          </form>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Available Balance</h3>
          <div className="text-center py-4">
            <div className="font-display font-bold text-3xl text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-slate-500 mt-2">Available for withdrawal</p>
          </div>
          <div className="border-t border-slate-800/60 pt-4 mt-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Withdrawals are processed within 1-3 business days. A small fee may apply depending on the withdrawal method.
            </p>
          </div>
        </DashCard>
      </div>
    </div>
  );
}
