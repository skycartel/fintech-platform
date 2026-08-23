import { Suspense } from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Smartphone } from 'lucide-react';
import HeroScene from './HeroScene';
import { useUI } from '@/context/UIContext';

export default function Hero() {
  const { openPhone } = useUI();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Base dark base */}
      <div className="absolute inset-0 bg-[#04070f]" />

      {/* 3D canvas — cinematic looping animation */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Readability overlays — gradient + vignette so text stays crisp */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#04070f] via-[#04070f]/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#04070f]/60 via-transparent to-[#04070f] pointer-events-none" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(4,7,15,0.6) 100%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
            <span className="relative w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs font-medium text-emerald-300 tracking-wide">
              LIVE MARKETS · 500+ INSTRUMENTS
            </span>
          </div>

          <h1 className="reveal reveal-delay-1 font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
            Trade the world's
            <br />
            markets with
            <br />
            <span className="gradient-text">precision.</span>
          </h1>

          <p className="reveal reveal-delay-2 mt-7 text-lg text-slate-400 max-w-xl leading-relaxed">
            Access global equities, forex, commodities, and crypto through a platform engineered
            for institutional-grade execution and built for every level of trader.
          </p>

          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-4">
            <a
              href="#signup"
              className="btn-shimmer group inline-flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-7 py-3.5 rounded-xl hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
            >
              Start Trading Free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={openPhone}
              className="btn-shimmer group inline-flex items-center gap-2 text-sm font-semibold text-white border border-slate-700 px-7 py-3.5 rounded-xl hover:border-emerald-400/50 hover:bg-white/5 transition-all"
            >
              <Smartphone size={16} />
              View Mobile App
            </button>
          </div>

          {/* Mini feature badges */}
          <div className="reveal reveal-delay-4 mt-14 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { icon: Zap, label: '0.01s', sub: 'Execution' },
              { icon: TrendingUp, label: '0.0 pips', sub: 'From spread' },
              { icon: ShieldCheck, label: 'Segregated', sub: 'Funds' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <f.icon className="text-emerald-400 mb-1" size={18} />
                <span className="font-display font-semibold text-white text-lg">{f.label}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{f.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-600 tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-emerald-400/60 to-transparent" />
      </div>
    </section>
  );
}
