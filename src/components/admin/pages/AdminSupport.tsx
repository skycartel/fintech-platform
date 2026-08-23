import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { DashCard, PageHeader, Badge, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { LifeBuoy, Send, MessageSquare } from 'lucide-react';

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
}

interface Msg {
  id: string;
  sender_role: string;
  message: string;
  created_at: string;
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    setTickets((data as Ticket[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const loadMessages = async (id: string) => {
    const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', id).order('created_at', { ascending: true });
    setMessages((data as Msg[]) ?? []);
  };

  useEffect(() => { if (selected) loadMessages(selected); }, [selected]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('support_tickets').update({ status }).eq('id', id);
    load();
  };

  const sendReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSending(true);
    const { error } = await supabase.from('support_messages').insert({
      ticket_id: selected,
      sender_role: 'admin',
      message: reply.trim(),
    });
    if (!error) {
      setReply('');
      loadMessages(selected);
    }
    setSending(false);
  };

  if (loading) return <LoadingState message="Loading support tickets..." />;

  const selTicket = tickets.find((t) => t.id === selected);

  return (
    <div>
      <PageHeader title="Support Tickets" subtitle="Manage and respond to user support requests." />

      {selected ? (
        <DashCard className="p-6">
          <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-emerald-400 mb-3">&larr; Back to tickets</button>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white">{selTicket?.subject}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge label={selTicket?.category ?? ''} color="blue" />
                <Badge label={selTicket?.priority ?? ''} color={selTicket?.priority === 'urgent' ? 'rose' : 'slate'} />
              </div>
            </div>
            <select
              value={selTicket?.status ?? 'open'}
              onChange={(e) => updateStatus(selected, e.target.value)}
              className="bg-[#0b1124] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.sender_role === 'admin' ? 'bg-emerald-500/10 border border-emerald-500/20 text-white' : 'bg-[#0b1124] border border-slate-800/60 text-slate-300'}`}>
                    <p>{m.message}</p>
                    <span className="text-[10px] text-slate-600 mt-1 block">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendReply} className="flex gap-2">
            <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..."
              className="flex-1 bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none" />
            <button type="submit" disabled={sending || !reply.trim()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#04070f] bg-emerald-400 disabled:opacity-60">
              <Send size={15} /> Send
            </button>
          </form>
        </DashCard>
      ) : (
        <DashCard className="overflow-hidden">
          {tickets.length === 0 ? (
            <EmptyState title="No support tickets" message="User support tickets will appear here." icon={LifeBuoy} />
          ) : (
            <div className="space-y-2">
              {tickets.map((t) => (
                <button key={t.id} onClick={() => setSelected(t.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0b1124] border border-slate-800/40 hover:border-emerald-400/30 transition-all text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-800/40 flex items-center justify-center flex-shrink-0"><MessageSquare size={16} className="text-slate-500" /></div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{t.subject}</div>
                      <div className="text-[10px] text-slate-500">{t.category} · {new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge label={t.priority} color={t.priority === 'urgent' ? 'rose' : 'slate'} />
                    <Badge label={t.status} color={t.status === 'open' ? 'emerald' : t.status === 'resolved' ? 'blue' : 'slate'} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </DashCard>
      )}
    </div>
  );
}
