import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, LoadingState } from '@/components/dashboard/ui';
import { Settings, Save, Loader2, CheckCircle2 } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('platform_settings').select('*').order('key');
    setSettings((data as Setting[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    for (const s of settings) {
      await supabase.from('platform_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('key', s.key);
    }
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) return <LoadingState message="Loading settings..." />;

  return (
    <div>
      <PageHeader title="Platform Settings" subtitle="Configure platform-wide parameters." />

      <DashCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings size={18} className="text-emerald-400" />
          <h3 className="font-display font-semibold text-white">Configuration</h3>
        </div>

        {success && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} /> Settings saved successfully.
          </div>
        )}

        <form onSubmit={save} className="space-y-4">
          {settings.map((s) => (
            <div key={s.key} className="grid sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block">{s.description}</label>
                <p className="text-[10px] text-slate-600 font-mono">{s.key}</p>
              </div>
              <input
                type="text" value={s.value} onChange={(e) => updateValue(s.key, e.target.value)}
                className="bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
              />
            </div>
          ))}
          {settings.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No settings configured.</p>}
          {settings.length > 0 && (
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Settings</>}
            </button>
          )}
        </form>
      </DashCard>
    </div>
  );
}
