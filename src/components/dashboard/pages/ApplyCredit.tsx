import { useState, FormEvent } from 'react';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader } from '../ui';

export default function ApplyCredit({ data }: { data: DashboardData }) {
  const { refresh } = data;
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 1000) {
      setError('Minimum credit amount is $1,000.');
      return;
    }
    if (amt > 500000) {
      setError('Maximum credit amount is $500,000.');
      return;
    }
    setLoading(true);
    try {
      const { error: insErr } = await supabase.from('credit_applications').insert({
        amount: amt,
        term_months: parseInt(term),
        purpose: purpose.trim() || 'General purpose',
        status: 'pending',
        interest_rate: 8.5,
      });
      if (insErr) throw insErr;

      setSuccess(`Credit application for $${amt.toLocaleString()} submitted. Our team will review it within 2-3 business days.`);
      setAmount('');
      setPurpose('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application failed. Please try again.');
    }
    setLoading(false);
  };

  const amt = parseFloat(amount) || 0;
  const rate = 8.5;
  const months = parseInt(term) || 1;
  const monthlyPayment = amt > 0 ? (amt * (1 + rate / 100)) / months : 0;

  return (
    <div>
      <PageHeader title="Apply for Credit" subtitle="Access flexible credit facilities backed by your portfolio." />

      <div className="grid lg:grid-cols-3 gap-5">
        <DashCard className="lg:col-span-2 p-6">
          <h3 className="font-display font-semibold text-white mb-5">Credit Application</h3>

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
              <label className="text-xs text-slate-400 mb-1.5 block">Credit Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-display font-semibold">$</span>
                <input
                  type="number" required min="1000" max="500000" value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-8 pr-4 py-3.5 text-lg font-display font-semibold text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">Range: $1,000 - $500,000</p>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Repayment Term</label>
              <div className="grid grid-cols-4 gap-3">
                {[6, 12, 24, 36].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(String(t))}
                    className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                      term === String(t) ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800/60 bg-[#0b1124] text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {t} months
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Purpose (optional)</label>
              <textarea
                value={purpose} onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe what you need the credit for..."
                rows={3}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><CreditCard size={16} /> Submit Application</>}
            </button>
          </form>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Loan Summary</h3>
          {amt > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Principal</span>
                <span className="text-sm font-semibold text-white">${amt.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Interest Rate</span>
                <span className="text-sm font-semibold text-white">{rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Term</span>
                <span className="text-sm font-semibold text-white">{months} months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Repayment</span>
                <span className="text-sm font-semibold text-white">${(amt * (1 + rate / 100)).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
              </div>
              <div className="border-t border-slate-800/60 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400">Monthly Payment</span>
                  <span className="font-display font-bold text-xl text-emerald-400">${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 text-center py-8">Enter an amount to see your loan summary.</p>
          )}
        </DashCard>
      </div>
    </div>
  );
}
