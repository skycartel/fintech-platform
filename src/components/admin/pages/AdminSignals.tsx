import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { Zap, Plus, Trash2, Loader2, X } from 'lucide-react';

interface Signal {
  id: string;
  symbol: string;
  action: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  analysis: string;
  status: string;
  created_at: string;
}

export default function AdminSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol: '', action: 'BUY', entry_price: '', target_price: '', stop_loss: '', confidence: '70', analysis: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('trading_signals').select('*').order('created_at', { ascending: false });
    setSignals((data as Signal[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { error: iErr } = await supabase.from('trading_signals').insert({
        symbol: form.symbol.toUpperCase().trim(),
        action: form.action,
        entry_price: parseFloat(form.entry_price),
        target_price: parseFloat(form.target_price),
        stop_loss: parseFloat(form.stop_loss),
        confidence: parseInt(form.confidence),
        analysis: form.analysis.trim(),
        status: 'active',
      });
      if (iErr) throw iErr;
      setForm({ symbol: '', action: 'BUY', entry_price: '', target_price: '', stop_loss: '', confidence: '70', analysis: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create signal.');
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    await supabase.from('trading_signals').delete().eq('id', id);
    load();
  };

  if (loading) return <LoadingState message="Loading signals..." />;

  return (
    <div>
      <PageHeader
        title="Premium Signals"
        subtitle="Create and manage trading signals for users."
        action={
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            <Plus size={16} /> New Signal
          </button>
        }
      />

      {showForm && (
        <DashCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Create Signal</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
          </div>
          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>}
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Symbol</label>
              <input type="text" required value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="BTC/USD"
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Action</label>
              <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none">
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Entry Price</label>
              <input type="number" step="any" required value={form.entry_price} onChange={(e) => setForm({ ...form, entry_price: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Target Price</label>
              <input type="number" step="any" required value={form.target_price} onChange={(e) => setForm({ ...form, target_price: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Stop Loss</label>
              <input type="number" step="any" required value={form.stop_loss} onChange={(e) => setForm({ ...form, stop_loss: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Confidence (%)</label>
              <input type="number" min="0" max="100" required value={form.confidence} onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1.5 block">Analysis</label>
              <textarea required value={form.analysis} onChange={(e) => setForm({ ...form, analysis: e.target.value })} rows={3} placeholder="Brief market analysis..."
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Publish Signal'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm text-slate-400 border border-slate-700 hover:text-white">Cancel</button>
            </div>
          </form>
        </DashCard>
      )}

      {signals.length === 0 && !showForm ? (
        <DashCard className="p-6"><EmptyState title="No signals" message="Create trading signals for your users." icon={Zap} /></DashCard>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {signals.map((s) => (
            <DashCard key={s.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-white">{s.symbol}</span>
                  <Badge label={s.action} color={s.action === 'BUY' ? 'emerald' : 'rose'} />
                </div>
                <button onClick={() => remove(s.id)} className="text-slate-500 hover:text-rose-400"><Trash2 size={14} /></button>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{s.analysis}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">Entry: <span className="text-white">${s.entry_price}</span></span>
                <span className="text-emerald-400">Target: ${s.target_price}</span>
                <span className="text-rose-400">Stop: ${s.stop_loss}</span>
                <span className="ml-auto text-slate-500">{s.confidence}% conf.</span>
              </div>
            </DashCard>
          ))}
        </div>
      )}
    </div>
  );
}
