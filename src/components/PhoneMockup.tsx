import { useEffect, useRef, useState } from 'react';
import { X, TrendingUp, TrendingDown, Wifi, BatteryFull, Signal } from 'lucide-react';
import { useUI } from '@/context/UIContext';

type Screen = 'dashboard' | 'chart' | 'portfolio';

function MiniSpark({ up }: { up: boolean }) {
  const color = up ? '#34d399' : '#f43f5e';
  const path = up
    ? 'M0,30 L10,28 L20,22 L30,25 L40,18 L50,14 L60,10'
    : 'M0,10 L10,14 L20,16 L30,12 L40,20 L50,24 L60,30';
  return (
    <svg width="60" height="32" viewBox="0 0 60 36" className="overflow-visible">
      <path d={`${path} L60,36 L0,36 Z`} fill={color} fillOpacity="0.15" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-white/80">
      <span className="font-display font-semibold">9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={11} />
        <Wifi size={11} />
        <BatteryFull size={13} />
      </div>
    </div>
  );
}

function DashboardScreen() {
  const positions = [
    { sym: 'BTC/USD', price: '67,420', chg: +2.34, up: true },
    { sym: 'ETH/USD', price: '3,512', chg: +1.87, up: true },
    { sym: 'XAU/USD', price: '2,384', chg: -0.62, up: false },
    { sym: 'EUR/USD', price: '1.0842', chg: +0.12, up: true },
  ];
  return (
    <div className="px-4 pb-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-slate-500">Portfolio value</p>
          <p className="font-display font-bold text-xl text-white">$128,450.32</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <TrendingUp size={10} /> +$2,841.20 today
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center font-display font-bold text-[#04070f] text-sm">
          JM
        </div>
      </div>

      {/* Balance chart */}
      <div className="rounded-xl bg-[#0b1124] border border-slate-800/60 p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Equity curve</span>
          <span className="text-[10px] text-emerald-400">7D</span>
        </div>
        <svg width="100%" height="48" viewBox="0 0 200 48" preserveAspectRatio="none">
          <defs>
            <linearGradient id="phoneChart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,38 C20,34 35,28 55,26 C75,24 95,14 115,16 C135,18 155,8 200,6 L200,48 L0,48 Z"
            fill="url(#phoneChart)"
          />
          <path
            d="M0,38 C20,34 35,28 55,26 C75,24 95,14 115,16 C135,18 155,8 200,6"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Open positions</p>
      <div className="space-y-2">
        {positions.map((p) => (
          <div
            key={p.sym}
            className="flex items-center justify-between rounded-lg bg-[#0b1124]/60 border border-slate-800/40 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[9px] font-bold text-emerald-400">
                {p.sym.slice(0, 3)}
              </div>
              <div>
                <div className="text-[11px] font-medium text-white">{p.sym}</div>
                <div className="text-[9px] text-slate-500">{p.price}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MiniSpark up={p.up} />
              <span
                className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                  p.up ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {p.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(p.chg).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartScreen() {
  return (
    <div className="px-4 pb-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] font-medium text-white">BTC/USD</p>
          <p className="font-display font-bold text-lg text-white">$67,420</p>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
          <TrendingUp size={11} /> +2.34%
        </span>
      </div>

      {/* Candlestick chart */}
      <div className="relative rounded-xl bg-[#0b1124] border border-slate-800/60 p-3 h-44 flex items-end gap-1">
        {Array.from({ length: 24 }).map((_, i) => {
          const h = 30 + Math.sin(i * 0.6) * 25 + Math.random() * 20;
          const up = Math.sin(i * 0.4) > -0.1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="w-px h-full bg-slate-800/40" />
              <div
                className="w-1.5 rounded-sm"
                style={{
                  height: `${h}%`,
                  background: up ? '#34d399' : '#f43f5e',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { l: 'Bid', v: '67,418', c: 'text-rose-400' },
          { l: 'Ask', v: '67,422', c: 'text-emerald-400' },
          { l: '24h Vol', v: '28.4B', c: 'text-slate-300' },
        ].map((b) => (
          <div key={b.l} className="rounded-lg bg-[#0b1124]/60 border border-slate-800/40 px-2 py-1.5 text-center">
            <div className="text-[8px] text-slate-500 uppercase">{b.l}</div>
            <div className={`text-[11px] font-mono font-semibold ${b.c}`}>{b.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold py-2">
          BUY
        </button>
        <button className="rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-semibold py-2">
          SELL
        </button>
      </div>
    </div>
  );
}

function PortfolioScreen() {
  const assets = [
    { name: 'Bitcoin', sym: 'BTC', pct: 42, val: '$53,949', color: '#f7931a' },
    { name: 'Ethereum', sym: 'ETH', pct: 28, val: '$35,966', color: '#627eea' },
    { name: 'Solana', sym: 'SOL', pct: 18, val: '$23,121', color: '#14f195' },
    { name: 'Cash', sym: 'USD', pct: 12, val: '$15,414', color: '#60a5fa' },
  ];
  return (
    <div className="px-4 pb-4 overflow-hidden">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Asset allocation</p>

      {/* Donut */}
      <div className="flex justify-center mb-5">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {(() => {
              let offset = 0;
              return assets.map((a) => {
                const dash = a.pct;
                const el = (
                  <circle
                    key={a.sym}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={a.color}
                    strokeWidth="3.5"
                    strokeDasharray={`${dash} ${100 - dash}`}
                    strokeDashoffset={-offset}
                  />
                );
                offset += dash;
                return el;
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-500">Total</span>
            <span className="font-display font-bold text-sm text-white">$128,450</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {assets.map((a) => (
          <div key={a.sym} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: a.color }} />
              <span className="text-[11px] text-slate-300">{a.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">{a.pct}%</span>
              <span className="text-[11px] font-mono text-white">{a.val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhoneMockup() {
  const { phoneOpen, closePhone } = useUI();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  // Mount-after-open for transition
  useEffect(() => {
    if (phoneOpen) {
      setScreen('dashboard');
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [phoneOpen]);

  // Parallax tilt
  const onMove = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    setTilt({ x: dy * -16, y: dx * 22 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  // Lock scroll while open
  useEffect(() => {
    if (phoneOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [phoneOpen]);

  if (!phoneOpen) return null;

  const tabs: { id: Screen; label: string }[] = [
    { id: 'dashboard', label: 'Home' },
    { id: 'chart', label: 'Trade' },
    { id: 'portfolio', label: 'Wallet' },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center"
      style={{
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#04070f]/85 backdrop-blur-md"
        onClick={closePhone}
      />

      {/* Ambient glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
      />

      {/* Close button */}
      <button
        onClick={closePhone}
        className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors z-10"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Phone stage */}
      <div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative"
        style={{ perspective: '1400px' }}
      >
        <div
          className="relative"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0) scale(${mounted ? 1 : 0.85}) translateY(${mounted ? 0 : 30}px)`,
            opacity: mounted ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Phone body */}
          <div
            className="relative w-[280px] h-[580px] rounded-[42px] p-[3px] shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #2a3a5c, #0b1124, #1b2750)',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7), 0 0 60px -10px rgba(16,185,129,0.3)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Inner bezel */}
            <div className="relative w-full h-full rounded-[39px] bg-[#04070f] overflow-hidden border border-slate-700/40">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#04070f] rounded-b-2xl z-20 flex items-center justify-end pr-3 gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <div className="w-8 h-1.5 rounded-full bg-slate-800" />
              </div>

              {/* Side buttons (3D depth) */}
              <div className="absolute -left-[3px] top-32 w-[3px] h-12 bg-slate-700 rounded-l" />
              <div className="absolute -left-[3px] top-48 w-[3px] h-8 bg-slate-700 rounded-l" />
              <div className="absolute -right-[3px] top-40 w-[3px] h-16 bg-slate-700 rounded-r" />

              {/* Screen content */}
              <div
                className="relative h-full overflow-hidden"
                style={{ transform: 'translateZ(1px)' }}
              >
                {/* Screen background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#070b18] to-[#04070f]" />
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-40"
                  style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
                />

                <div className="relative h-full flex flex-col">
                  <StatusBar />

                  {/* App header */}
                  <div className="px-4 pt-1 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                        <span className="font-display font-bold text-[#04070f] text-[10px]">M</span>
                      </div>
                      <span className="font-display font-semibold text-white text-xs">
                        Meridian
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>

                  {/* Screen body */}
                  <div className="flex-1 overflow-hidden">
                    <div
                      key={screen}
                      className="h-full"
                      style={{
                        animation: 'phoneFadeIn 0.4s cubic-bezier(0.22,1,0.36,1)',
                      }}
                    >
                      {screen === 'dashboard' && <DashboardScreen />}
                      {screen === 'chart' && <ChartScreen />}
                      {screen === 'portfolio' && <PortfolioScreen />}
                    </div>
                  </div>

                  {/* Tab bar */}
                  <div className="border-t border-slate-800/60 bg-[#070b18]/80 backdrop-blur-sm px-2 py-2">
                    <div className="flex items-center justify-around">
                      {tabs.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setScreen(t.id)}
                          className={`text-[10px] font-medium px-4 py-1.5 rounded-lg transition-colors ${
                            screen === t.id
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen glare */}
              <div
                className="absolute inset-0 rounded-[39px] pointer-events-none opacity-20"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
                }}
              />
            </div>
          </div>

          {/* Floating shadow */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-6 rounded-full blur-xl"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes phoneFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-slate-500">Move your cursor for 3D parallax · Tap tabs to switch screens</p>
      </div>
    </div>
  );
}
