import { useState, FormEvent } from 'react';
import { Bot, Plus, Pause, Play, Trash2, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, Badge, EmptyState } from '../ui';

export default function AiTradingBots({ data }: { data: DashboardData }) {
  const { user } = useAuth();
  const { aiBots, refresh } = data;
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [strategy, setStrategy] = useState('grid');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [allocated, setAllocated] = useState('1000');
  const [error, setError] = useState<string | null>(null);

  const createBot = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const amt = parseFloat(allocated);
    if (!name.trim() || isNaN(amt) || amt <= 0) {
      setError('Please provide a valid name and allocation amount.');
      return;
    }
    const { error: insErr } = await supabase.from('ai_bots').insert({
      name: name.trim(),
      strategy,
      risk_level: riskLevel,
      allocated: amt,
      status: 'paused',
    });
    if (insErr) { setError(insErr.message); return; }
    setShowForm(false);
    setName('');
    setAllocated('1000');
    refresh();
  };

  const toggleBot = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paused' ? 'running' : 'paused';
    await supabase.from('ai_bots').update({ status: newStatus }).eq('id', id);
    refresh();
  };

  const deleteBot = async (id: string) => {
    await supabase.from('ai_bots').delete().eq('id', id);
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="AI Trading Bots"
        subtitle="Automate your trading with AI-powered bots. Demo/paper trading only."
        action={
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            <Plus size={16} /> New Bot
          </button>
        }
      />

      <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        All AI bots run in demo/paper trading mode. No real trades are executed. Bot performance data is simulated and does not represent actual trading results.
      </div>

      {showForm && (
        <DashCard className="p-6 mb-6">
          <h3 className="font-display font-semibold text-white mb-4">Create New Bot</h3>
          <form onSubmit={createBot} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Bot Name</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Grid Bot #1"
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Allocation (USD)</label>
              <input
                type="number" required value={allocated} onChange={(e) => setAllocated(e.target.value)}
                placeholder="1000"
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Strategy</label>
              <select
                value={strategy} onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
              >
                <option value="grid">Grid Trading</option>
                <option value="dca">Dollar Cost Averaging</option>
                <option value="momentum">Momentum</option>
                <option value="mean_reversion">Mean Reversion</option>
                <option value="arbitrage">Arbitrage</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Risk Level</label>
              <select
                value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            {error && <div className="sm:col-span-2 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">{error}</div>}
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">Create Bot</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm text-slate-400 border border-slate-700 hover:text-white transition-colors">Cancel</button>
            </div>
          </form>
        </DashCard>
      )}

      {aiBots.length === 0 ? (
        <DashCard className="p-6">
          <EmptyState title="No bots configured" message="Create your first AI trading bot to start automating your strategy." icon={Bot} />
        </DashCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiBots.map((bot) => (
            <DashCard key={bot.id} className="p-5 card-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Bot size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{bot.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{bot.strategy} strategy</div>
                  </div>
                </div>
                <Badge label={bot.status} color={bot.status === 'running' ? 'emerald' : 'slate'} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Allocated</div>
                  <div className="text-sm font-semibold text-white">${Number(bot.allocated).toLocaleString('en-US', { minimumFractionDigits: 0 })}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">P&L</div>
                  <div className={`text-sm font-semibold ${Number(bot.pnl) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(bot.pnl) >= 0 ? '+' : ''}${Number(bot.pnl).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 uppercase">Win Rate</div>
                  <div className="text-sm font-semibold text-white">{Number(bot.win_rate).toFixed(1)}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBot(bot.id, bot.status)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    bot.status === 'running' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  {bot.status === 'running' ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Start</>}
                </button>
                <button
                  onClick={() => deleteBot(bot.id)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </DashCard>
          ))}
        </div>
      )}
    </div>
  );
}
