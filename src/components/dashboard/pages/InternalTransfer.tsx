import { useState, FormEvent } from 'react';
import { ArrowLeftRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader } from '../ui';

export default function InternalTransfer({ data }: { data: DashboardData }) {
  const { account, refresh } = data;
  const [amount, setAmount] = useState('');
  const [toAccount, setToAccount] = useState('savings');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const balance = account?.balance ?? 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (amt > balance) {
      setError('Insufficient balance for this transfer.');
      return;
    }
    setLoading(true);
    try {
      const ref = `TRF-${Date.now().toString(36).toUpperCase()}`;

      const { error: txErr } = await supabase.from('transactions').insert({
        type: 'transfer',
        description: `Transfer to ${toAccount} account`,
        amount: -amt,
        status: 'completed',
        reference: ref,
      });
      if (txErr) throw txErr;

      await supabase.from('notifications').insert({
        title: 'Transfer Completed',
        body: `$${amt.toLocaleString()} transferred to ${toAccount} account. Reference: ${ref}`,
        type: 'info',
      });

      setSuccess(`$${amt.toLocaleString()} transferred to ${toAccount} account. Reference: ${ref}`);
      setAmount('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Internal Transfer" subtitle="Move funds between your account types." />

      <div className="grid lg:grid-cols-3 gap-5">
        <DashCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-white mb-5">Transfer Details</h3>

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
              <label className="text-xs text-slate-400 mb-1.5 block">From Account</label>
              <div className="px-4 py-3 rounded-xl bg-[#0b1124] border border-slate-700/60 text-sm text-white">
                Main Trading Account · ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">To Account</label>
              <select
                value={toAccount} onChange={(e) => setToAccount(e.target.value)}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
              >
                <option value="savings">Savings Account</option>
                <option value="investment">Investment Account</option>
                <option value="copy_trading">Copy Trading Account</option>
                <option value="ai_bots">AI Bots Account</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-display font-semibold">$</span>
                <input
                  type="number" required value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-8 pr-4 py-3.5 text-lg font-display font-semibold text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowLeftRight size={16} /> Transfer ${amount || '0'}</>}
            </button>
          </form>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Current Balance</h3>
          <div className="text-center py-4">
            <div className="font-display font-bold text-3xl text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-slate-500 mt-2">Main trading account</p>
          </div>
          <div className="border-t border-slate-800/60 pt-4 mt-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Internal transfers are instant and free. Funds move between your sub-accounts without processing delays.
            </p>
          </div>
        </DashCard>
      </div>
    </div>
  );
}
