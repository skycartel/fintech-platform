import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const categories = [
  {
    name: 'Forex',
    desc: '60+ currency pairs with deep liquidity',
    items: [
      { sym: 'EUR/USD', price: '1.0842', chg: +0.12 },
      { sym: 'GBP/JPY', price: '198.34', chg: +0.34 },
      { sym: 'AUD/USD', price: '0.6612', chg: -0.15 },
    ],
  },
  {
    name: 'Commodities',
    desc: 'Gold, silver, oil, and natural gas',
    items: [
      { sym: 'XAU/USD', price: '2,384.50', chg: +0.45 },
      { sym: 'XAG/USD', price: '28.42', chg: +1.12 },
      { sym: 'WTI Oil', price: '78.34', chg: -0.62 },
    ],
  },
  {
    name: 'Indices',
    desc: 'Global benchmark indices 24/5',
    items: [
      { sym: 'S&P 500', price: '5,298', chg: +0.31 },
      { sym: 'NAS 100', price: '18,942', chg: +0.54 },
      { sym: 'DAX 40', price: '18,512', chg: -0.22 },
    ],
  },
  {
    name: 'Crypto',
    desc: '24/7 trading on top digital assets',
    items: [
      { sym: 'BTC/USD', price: '67,420', chg: +2.34 },
      { sym: 'ETH/USD', price: '3,512', chg: +1.87 },
      { sym: 'SOL/USD', price: '172.40', chg: +3.45 },
    ],
  },
];

export default function Markets() {
  return (
    <section id="markets" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
              Global access
            </p>
            <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              One account.
              <br />
              <span className="gradient-text">Every market.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 text-slate-400 max-w-sm">
            Diversify across asset classes from a single workspace. Trade the world's most liquid
            markets with institutional pricing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`reveal reveal-delay-${(i % 4) + 1} glass card-lift rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
              </div>

              <div className="space-y-3">
                {cat.items.map((it) => (
                  <div
                    key={it.sym}
                    className="flex items-center justify-between py-2.5 border-t border-slate-800/60"
                  >
                    <span className="text-sm font-medium text-slate-200">{it.sym}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-display text-white tabular-nums">
                        {it.price}
                      </span>
                      <span
                        className={`flex items-center text-xs font-semibold w-16 justify-end ${
                          it.chg >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {it.chg >= 0 ? (
                          <ArrowUpRight size={13} />
                        ) : (
                          <ArrowDownRight size={13} />
                        )}
                        {Math.abs(it.chg).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
