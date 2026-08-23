import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function Platform() {
  const { openPhone } = useUI();
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="aurora w-[800px] h-[400px] bottom-0 right-0"
        style={{ background: 'radial-gradient(ellipse, #10b981, transparent 70%)', opacity: 0.15 }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="reveal relative">
            <div className="relative glass rounded-3xl p-2 shadow-2xl shadow-emerald-500/10">
              {/* Faux trading dashboard */}
              <div className="rounded-2xl bg-[#070b18] overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="ml-3 text-xs text-slate-500 font-mono">
                    meridian · EUR/USD · M15
                  </div>
                </div>

                {/* Chart area */}
                <div className="relative p-6 h-64 flex items-end gap-1.5">
                  {/* Faux candlesticks */}
                  {candles.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                      style={{ animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.1}s infinite` }}
                    >
                      <div className="w-1 h-full bg-slate-800/40" />
                      <div
                        className="w-3 rounded-sm"
                        style={{
                          height: `${c.h}%`,
                          background: c.up ? '#34d399' : '#f43f5e',
                          marginTop: `-${c.wick}%`,
                        }}
                      />
                    </div>
                  ))}
                  {/* Overlay line */}
                  <svg className="absolute inset-6 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
                        <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,160 C50,140 80,100 120,110 C160,120 200,60 240,70 C280,80 320,40 400,30"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Bottom bar */}
                <div className="grid grid-cols-3 border-t border-slate-800/60">
                  {[
                    { l: 'Bid', v: '1.08412', c: 'text-rose-400' },
                    { l: 'Ask', v: '1.08428', c: 'text-emerald-400' },
                    { l: 'Spread', v: '0.16', c: 'text-slate-300' },
                  ].map((b) => (
                    <div key={b.l} className="px-4 py-3 text-center border-r border-slate-800/60 last:border-0">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{b.l}</div>
                      <div className={`text-sm font-mono font-semibold ${b.c}`}>{b.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-5 -left-5 glass rounded-xl px-4 py-2.5 animate-float">
              <div className="text-[10px] text-slate-500 uppercase">Execution</div>
              <div className="font-display font-bold text-emerald-400">11.2 ms</div>
            </div>
            <div className="absolute -bottom-5 -right-5 glass rounded-xl px-4 py-2.5 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="text-[10px] text-slate-500 uppercase">Latency</div>
              <div className="font-display font-bold text-blue-400">99.99%</div>
            </div>
          </div>

          {/* Copy */}
          <div>
            <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
              The platform
            </p>
            <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight mb-6">
              A workspace
              <br />
              <span className="gradient-text">built for traders</span>
            </h2>
            <p className="reveal reveal-delay-2 text-slate-400 leading-relaxed mb-8">
              One-click order entry, customizable layouts, and real-time P&L tracking. Your
              workspace syncs across every device — pick up exactly where you left off.
            </p>

            <div className="space-y-5">
              {[
                { icon: Monitor, title: 'Web & Desktop', desc: 'Full-featured terminal for macOS, Windows, and browser.' },
                { icon: Smartphone, title: 'Mobile (iOS / Android)', desc: 'Trade and manage positions on the go with native apps.' },
                { icon: Tablet, title: 'Tablet optimized', desc: 'A touch-first interface tuned for larger touchscreens.' },
              ].map((d, i) => (
                <div
                  key={d.title}
                  className={`reveal reveal-delay-${i + 2} flex items-start gap-4`}
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <d.icon className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white text-base">{d.title}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>

              <button
                onClick={openPhone}
                className="reveal reveal-delay-5 mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-xl hover:bg-emerald-500/10 transition-colors"
              >
                <Smartphone size={16} />
                Preview the mobile app
              </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const candles = Array.from({ length: 28 }, (_, i) => ({
  h: 30 + Math.sin(i * 0.5) * 20 + Math.random() * 30,
  wick: Math.random() * 15,
  up: Math.sin(i * 0.4) > 0 || (i % 3 === 0),
}));
