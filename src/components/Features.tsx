import { Zap, BarChart3, Percent, ShieldCheck, Headphones, LineChart } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Execution',
    desc: 'Orders fill in under 12 milliseconds on our co-located infrastructure. No requotes, no slippage on major pairs.',
  },
  {
    icon: BarChart3,
    title: 'Pro Charting Suite',
    desc: 'Advanced candlestick charting with 80+ technical indicators, drawing tools, and multi-timeframe analysis.',
  },
  {
    icon: Percent,
    title: 'Tightest Spreads',
    desc: 'Trade from 0.0 pips on EUR/USD and major indices. Transparent, raw-pricing ECN accounts available.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    desc: 'Funds held in segregated accounts at tier-one banks. SSL encryption and two-factor authentication standard.',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    desc: 'Multilingual trading specialists available around the clock via live chat, phone, and email.',
  },
  {
    icon: LineChart,
    title: 'Real-Time Analytics',
    desc: 'Economic calendar, sentiment indicators, and live market signals integrated directly into your workspace.',
  },
];

export default function Features() {
  return (
    <section id="platform" className="relative py-28">
      <div
        className="aurora w-[700px] h-[700px] top-0 left-1/2 -translate-x-1/2"
        style={{ background: 'radial-gradient(circle, #1b2750, transparent 70%)', opacity: 0.5 }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
            Why Meridian
          </p>
          <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Everything you need to
            <br />
            <span className="gradient-text">trade with conviction</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-5 text-slate-400">
            A platform engineered for performance, built by traders who understand what matters at
            the moment of execution.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`reveal reveal-delay-${(i % 3) + 1} glass card-lift rounded-2xl p-8 group`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                <f.icon className="text-emerald-400" size={22} />
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-2.5">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
