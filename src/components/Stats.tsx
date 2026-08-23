import CountUp from './CountUp';

const stats = [
  { value: 180, suffix: 'K+', label: 'Active traders', sub: 'in 120 countries' },
  { value: 500, suffix: '+', label: 'Instruments', sub: 'across 6 asset classes' },
  { value: 4.2, suffix: 'B', prefix: '$', label: 'Monthly volume', decimals: 1 },
  { value: 99.98, suffix: '%', label: 'Uptime', decimals: 2 },
];

export default function Stats() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
            By the numbers
          </p>
          <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Scale you can trust
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal reveal-delay-${i + 1} glass card-lift rounded-2xl p-8 text-center`}
            >
              <div className="font-display font-bold text-4xl sm:text-5xl gradient-text mb-2">
                <CountUp
                  to={s.value}
                  suffix={s.suffix}
                  prefix={s.prefix}
                  decimals={s.decimals}
                />
              </div>
              <div className="text-sm font-medium text-slate-200">{s.label}</div>
              <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
