import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { Users, Search } from 'lucide-react';

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: string;
  kyc_status: string;
  identity_status: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error) setUsers((data as UserRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await supabase.from('profiles').update({ role: newRole }).eq('id', id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  if (loading) return <LoadingState message="Loading users..." />;

  return (
    <div>
      <PageHeader title="User Management" subtitle="View and manage all platform users." />

      <DashCard className="p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full bg-[#0b1124] border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/40 focus:outline-none"
          />
        </div>
      </DashCard>

      <DashCard className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No users found" message="Users will appear here once they register." icon={Users} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Role</th>
                  <th className="text-left px-6 py-3 font-medium">KYC</th>
                  <th className="text-left px-6 py-3 font-medium">Identity</th>
                  <th className="text-left px-6 py-3 font-medium">Joined</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/40 hover:bg-white/5">
                    <td className="px-6 py-3.5 text-white font-medium">{u.full_name || '—'}</td>
                    <td className="px-6 py-3.5 text-slate-400">{u.email}</td>
                    <td className="px-6 py-3.5"><Badge label={u.role} color={u.role === 'admin' ? 'emerald' : 'slate'} /></td>
                    <td className="px-6 py-3.5 capitalize text-slate-400">{u.kyc_status}</td>
                    <td className="px-6 py-3.5"><Badge label={u.identity_status} color={u.identity_status === 'verified' ? 'emerald' : u.identity_status === 'pending' ? 'amber' : u.identity_status === 'rejected' ? 'rose' : 'slate'} /></td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                    </td>
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
