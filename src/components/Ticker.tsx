import { TrendingUp, TrendingDown } from 'lucide-react';

const tickers = [
  { sym: 'EUR/USD', price: '1.0842', chg: +0.12 },
  { sym: 'GBP/USD', price: '1.2715', chg: -0.08 },
  { sym: 'BTC/USD', price: '67,420', chg: +2.34 },
  { sym: 'ETH/USD', price: '3,512', chg: +1.87 },
  { sym: 'XAU/USD', price: '2,384.50', chg: +0.45 },
  { sym: 'WTI/USD', price: '78.34', chg: -0.62 },
  { sym: 'SPX500', price: '5,298.10', chg: +0.31 },
  { sym: 'NAS100', price: '18,942', chg: +0.54 },
  { sym: 'AAPL', price: '192.45', chg: +0.78 },
  { sym: 'TSLA', price: '178.92', chg: -1.23 },
];

export default function Ticker() {
  const row = [...tickers, ...tickers];
  return (
    <div className="relative border-y border-slate-800/50 bg-[#070b18]/60 backdrop-blur-md overflow-hidden py-3">
      <div className="ticker-track flex gap-10 whitespace-nowrap w-max">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-400">{t.sym}</span>
            <span className="font-display font-semibold text-white tabular-nums">{t.price}</span>
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                t.chg >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {t.chg >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(t.chg).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
