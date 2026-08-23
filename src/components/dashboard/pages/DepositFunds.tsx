import { useState, FormEvent } from 'react';
import { ArrowDownToLine, Loader2, CheckCircle2, Bitcoin, Building2, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader } from '../ui';

export default function DepositFunds({ data }: { data: DashboardData }) {
  const { account, refresh } = data;
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balance = account?.balance ?? 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 100) {
      setError('Minimum deposit is $100.');
      return;
    }
    setLoading(true);
    try {
      // Create a pending deposit transaction
      const ref = `DEP-${Date.now().toString(36).toUpperCase()}`;
      const { error: txErr } = await supabase.from('transactions').insert({
        type: 'deposit',
        description: `Deposit via ${method}`,
        amount: amt,
        status: 'pending',
        reference: ref,
      });
      if (txErr) throw txErr;

      // Credit the account balance immediately (demo — in production, this would
      // wait for payment confirmation via a webhook)
      const newBalance = balance + amt;
      const { error: accErr } = await supabase.from('accounts').update({
        balance: newBalance,
        equity: newBalance,
        updated_at: new Date().toISOString(),
      }).eq('user_id', account?.user_id ?? '');
      if (accErr) throw accErr;

      // Mark transaction as completed
      await supabase.from('transactions').update({ status: 'completed' }).eq('reference', ref);

      // Create notification
      await supabase.from('notifications').insert({
        title: 'Deposit Confirmed',
        body: `$${amt.toLocaleString()} has been credited to your account.`,
        type: 'success',
      });

      setSuccess(`$${amt.toLocaleString()} has been deposited successfully. Reference: ${ref}`);
      setAmount('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Deposit Funds" subtitle="Add money to your trading account." />

      <div className="grid lg:grid-cols-3 gap-5">
        <DashCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-white mb-5">Deposit Details</h3>

          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={16} /> {success}
            </div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'bank', label: 'Bank Transfer', icon: Building2 },
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      method === m.id
                        ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800/60 bg-[#0b1124] text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <m.icon size={20} />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-display font-semibold">$</span>
                <input
                  type="number" required min="100" value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-8 pr-4 py-3.5 text-lg font-display font-semibold text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">Minimum deposit: $100</p>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowDownToLine size={16} /> Deposit ${amount || '0'}</>}
            </button>
          </form>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Account Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Current Balance</span>
              <span className="font-display font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Currency</span>
              <span className="text-sm text-white">{account?.currency ?? 'USD'}</span>
            </div>
            <div className="border-t border-slate-800/60 pt-3 mt-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Deposits are typically credited within 1-2 business hours. Crypto deposits may take longer depending on network confirmations.
              </p>
            </div>
          </div>
        </DashCard>
      </div>
    </div>
  );
}
