import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { ScrollText } from 'lucide-react';

interface LogRow {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: any;
  created_at: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(200);
      setLogs((data as LogRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState message="Loading audit logs..." />;

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Track all administrative actions on the platform." />

      <DashCard className="overflow-hidden">
        {logs.length === 0 ? (
          <EmptyState title="No audit logs" message="Admin actions will be logged here." icon={ScrollText} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">Action</th>
                  <th className="text-left px-6 py-3 font-medium">Admin</th>
                  <th className="text-left px-6 py-3 font-medium">Target</th>
                  <th className="text-left px-6 py-3 font-medium">Target ID</th>
                  <th className="text-left px-6 py-3 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-slate-800/40 hover:bg-white/5">
                    <td className="px-6 py-3"><Badge label={l.action} color="blue" /></td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{l.admin_id?.substring(0, 8) ?? 'system'}...</td>
                    <td className="px-6 py-3 text-slate-400">{l.target_type ?? '—'}</td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{l.target_id?.substring(0, 8) ?? '—'}</td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{new Date(l.created_at).toLocaleString()}</td>
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
