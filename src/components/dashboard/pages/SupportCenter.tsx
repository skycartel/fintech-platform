import { useState, FormEvent, useEffect } from 'react';
import { LifeBuoy, Send, MessageSquare, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, Badge, EmptyState } from '../ui';

interface TicketMessage {
  id: string;
  sender_role: string;
  message: string;
  created_at: string;
}

export default function SupportCenter({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const { tickets, refresh } = data;
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [reply, setReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const loadMessages = async (ticketId: string) => {
    const { data: msgs } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    setMessages((msgs as TicketMessage[]) ?? []);
  };

  useEffect(() => {
    if (selectedTicket) loadMessages(selectedTicket);
  }, [selectedTicket]);

  const submitTicket = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data: ticket, error: tErr } = await supabase.from('support_tickets').insert({
        subject: subject.trim(),
        category,
        message: message.trim(),
        priority,
        status: 'open',
      }).select().single();
      if (tErr) throw tErr;

      // Insert initial message
      await supabase.from('support_messages').insert({
        ticket_id: ticket.id,
        user_id: user?.id,
        sender_role: 'user',
        message: message.trim(),
      });

      setShowForm(false);
      setSubject('');
      setMessage('');
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket.');
    }
    setLoading(false);
  };

  const sendReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;
    setSendingReply(true);
    const { error } = await supabase.from('support_messages').insert({
      ticket_id: selectedTicket,
      user_id: user?.id,
      sender_role: 'user',
      message: reply.trim(),
    });
    if (!error) {
      setReply('');
      loadMessages(selectedTicket);
    }
    setSendingReply(false);
  };

  const selectedTicketData = tickets.find((t) => t.id === selectedTicket);

  return (
    <div>
      <PageHeader
        title="Support Center"
        subtitle="Get help from our support team."
        action={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            <Plus size={16} /> New Ticket
          </button>
        }
      />

      {showForm && (
        <DashCard className="p-6 mb-6">
          <h3 className="font-display font-semibold text-white mb-4">Create Support Ticket</h3>
          {error && <div className="mb-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>}
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Subject</label>
              <input
                type="text" required value={subject} onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none">
                  <option value="general">General</option>
                  <option value="account">Account</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="trading">Trading</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Message</label>
              <textarea
                required value={message} onChange={(e) => setMessage(e.target.value)}
                rows={4} placeholder="Describe your issue in detail..."
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Submit Ticket'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm text-slate-400 border border-slate-700 hover:text-white transition-colors">Cancel</button>
            </div>
          </form>
        </DashCard>
      )}

      {selectedTicket ? (
        <DashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button onClick={() => setSelectedTicket(null)} className="text-xs text-slate-500 hover:text-emerald-400 mb-2">&larr; Back to tickets</button>
              <h3 className="font-display font-semibold text-white">{selectedTicketData?.subject}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge label={selectedTicketData?.category ?? ''} color="blue" />
                <Badge label={selectedTicketData?.status ?? ''} color={selectedTicketData?.status === 'open' ? 'emerald' : 'slate'} />
                <Badge label={selectedTicketData?.priority ?? ''} color={selectedTicketData?.priority === 'urgent' ? 'rose' : 'slate'} />
              </div>
            </div>
          </div>
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.sender_role === 'user' ? 'bg-emerald-500/10 border border-emerald-500/20 text-white' : 'bg-[#0b1124] border border-slate-800/60 text-slate-300'
                  }`}>
                    <p>{m.message}</p>
                    <span className="text-[10px] text-slate-600 mt-1 block">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendReply} className="flex gap-2">
            <input
              type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..."
              className="flex-1 bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
            />
            <button type="submit" disabled={sendingReply || !reply.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#04070f] bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-60">
              <Send size={15} /> {sendingReply ? '...' : 'Send'}
            </button>
          </form>
        </DashCard>
      ) : (
        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Your Tickets</h3>
          {tickets.length === 0 ? (
            <EmptyState title="No support tickets" message="Create a ticket if you need help with anything." icon={LifeBuoy} />
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0b1124] border border-slate-800/40 hover:border-emerald-400/30 transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-800/40 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={16} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{t.subject}</div>
                      <div className="text-[10px] text-slate-500">{t.category} · {new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge label={t.priority} color={t.priority === 'urgent' ? 'rose' : 'slate'} />
                    <Badge label={t.status} color={t.status === 'open' ? 'emerald' : 'slate'} />
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
