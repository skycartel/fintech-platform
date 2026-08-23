import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { FolderOpen, Plus, Trash2, Loader2, Edit3, X } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  min_amount: number;
  expected_return: number;
  duration_days: number;
  risk_level: string;
  description: string;
  active: boolean;
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', min_amount: '100', expected_return: '10', duration_days: '30', risk_level: 'medium', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('investment_plans').select('*').order('created_at', { ascending: false });
    setPlans((data as Plan[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', min_amount: '100', expected_return: '10', duration_days: '30', risk_level: 'medium', description: '' });
    setEditId(null);
    setShowForm(false);
    setError(null);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      min_amount: parseFloat(form.min_amount),
      expected_return: parseFloat(form.expected_return),
      duration_days: parseInt(form.duration_days),
      risk_level: form.risk_level,
      description: form.description.trim(),
    };
    try {
      if (editId) {
        const { error: uErr } = await supabase.from('investment_plans').update(payload).eq('id', editId);
        if (uErr) throw uErr;
      } else {
        const { error: iErr } = await supabase.from('investment_plans').insert(payload);
        if (iErr) throw iErr;
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plan.');
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('investment_plans').update({ active: !current }).eq('id', id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('investment_plans').delete().eq('id', id);
    load();
  };

  const startEdit = (p: Plan) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      min_amount: String(p.min_amount),
      expected_return: String(p.expected_return),
      duration_days: String(p.duration_days),
      risk_level: p.risk_level,
      description: p.description,
    });
    setShowForm(true);
  };

  if (loading) return <LoadingState message="Loading investment plans..." />;

  return (
    <div>
      <PageHeader
        title="Investment Plans"
        subtitle="Create and manage investment plans available to users."
        action={
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
            <Plus size={16} /> New Plan
          </button>
        }
      />

      {showForm && (
        <DashCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">{editId ? 'Edit Plan' : 'Create Plan'}</h3>
            <button onClick={resetForm} className="text-slate-500 hover:text-white"><X size={18} /></button>
          </div>
          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>}
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1.5 block">Plan Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Growth Portfolio"
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Min Amount ($)</label>
              <input type="number" required value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Expected Return (%)</label>
              <input type="number" required value={form.expected_return} onChange={(e) => setForm({ ...form, expected_return: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Duration (days)</label>
              <input type="number" required value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Risk Level</label>
              <select value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : editId ? 'Update Plan' : 'Create Plan'}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-lg text-sm text-slate-400 border border-slate-700 hover:text-white">Cancel</button>
            </div>
          </form>
        </DashCard>
      )}

      {plans.length === 0 && !showForm ? (
        <DashCard className="p-6"><EmptyState title="No investment plans" message="Create plans for users to invest in." icon={FolderOpen} /></DashCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((p) => (
            <DashCard key={p.id} className={`p-5 ${!p.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-white">{p.name}</h3>
                  <Badge label={p.risk_level} color={p.risk_level === 'low' ? 'emerald' : p.risk_level === 'medium' ? 'amber' : 'rose'} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(p)} className="p-2 text-slate-500 hover:text-emerald-400"><Edit3 size={14} /></button>
                  <button onClick={() => remove(p.id)} className="p-2 text-slate-500 hover:text-rose-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.description || 'No description'}</p>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div><div className="text-[9px] text-slate-500 uppercase">Min</div><div className="text-sm font-semibold text-white">${p.min_amount}</div></div>
                <div><div className="text-[9px] text-slate-500 uppercase">Return</div><div className="text-sm font-semibold text-emerald-400">{p.expected_return}%</div></div>
                <div><div className="text-[9px] text-slate-500 uppercase">Days</div><div className="text-sm font-semibold text-white">{p.duration_days}</div></div>
              </div>
              <button onClick={() => toggleActive(p.id, p.active)} className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${p.active ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                {p.active ? 'Deactivate' : 'Activate'}
              </button>
            </DashCard>
          ))}
        </div>
      )}
    </div>
  );
}
