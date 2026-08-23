import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    min: 500,
    badge: null,
    features: ['Demo + live account', 'Spreads from 1.2 pips', 'Standard leverage up to 1:30', 'Email support', 'Basic charting tools'],
  },
  {
    name: 'Professional',
    min: 2000,
    badge: 'Most popular',
    features: ['Everything in Starter', 'Spreads from 0.4 pips', 'Advanced charting suite', 'Priority live chat support', 'Daily market signals'],
  },
  {
    name: 'Gold',
    min: 5000,
    badge: null,
    features: ['Everything in Professional', 'Spreads from 0.1 pips', 'Dedicated account manager', 'VIP webinar access', 'Custom indicators'],
  },
  {
    name: 'Premier',
    min: 20000,
    badge: 'Institutional',
    features: ['Everything in Gold', 'Raw ECN pricing · 0.0 pips', 'API & algo trading access', '24/7 phone hotline', 'Private banking integration'],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div
        className="aurora w-[700px] h-[700px] top-1/3 left-1/2 -translate-x-1/2"
        style={{ background: 'radial-gradient(circle, #1b2750, transparent 70%)', opacity: 0.6 }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
            Account tiers
          </p>
          <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Choose your edge
          </h2>
          <p className="reveal reveal-delay-2 mt-5 text-slate-400">
            Transparent pricing that scales with your capital. Upgrade or downgrade anytime — no
            lock-in, no hidden fees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`reveal reveal-delay-${(i % 4) + 1} relative glass card-lift rounded-2xl p-7 ${
                p.badge === 'Most popular' ? 'border-emerald-400/50 glow-emerald' : ''
              }`}
            >
              {p.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    p.badge === 'Most popular'
                      ? 'bg-emerald-400 text-[#04070f]'
                      : 'bg-gold-400 text-[#04070f] bg-amber-400'
                  }`}
                >
                  {p.badge}
                </div>
              )}
              <h3 className="font-display font-semibold text-lg text-white">{p.name}</h3>
              <div className="mt-3 mb-1">
                <span className="font-display font-bold text-3xl text-white">
                  ${p.min.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500">+ min deposit</span>
              </div>

              <ul className="mt-6 space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#signup"
                className={`btn-shimmer flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all ${
                  p.badge === 'Most popular'
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#04070f] hover:shadow-lg hover:shadow-emerald-500/40'
                    : 'border border-slate-700 text-white hover:border-emerald-400/50 hover:bg-white/5'
                }`}
              >
                Choose {p.name}
                <ArrowRight size={15} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
