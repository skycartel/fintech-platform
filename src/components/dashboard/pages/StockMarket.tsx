import { TrendingUp, TrendingDown, Star, Search } from 'lucide-react';
import { DashCard, PageHeader, Badge } from '../ui';

const STOCKS = [
  { sym: 'AAPL', name: 'Apple Inc.', price: 192.45, chg: +0.78 },
  { sym: 'TSLA', name: 'Tesla Inc.', price: 178.92, chg: -1.23 },
  { sym: 'NVDA', name: 'NVIDIA Corp.', price: 488.12, chg: +2.45 },
  { sym: 'MSFT', name: 'Microsoft Corp.', price: 412.30, chg: +0.54 },
  { sym: 'GOOGL', name: 'Alphabet Inc.', price: 168.74, chg: +1.12 },
  { sym: 'AMZN', name: 'Amazon.com Inc.', price: 182.40, chg: -0.34 },
  { sym: 'META', name: 'Meta Platforms', price: 498.20, chg: +1.87 },
  { sym: 'JPM', name: 'JPMorgan Chase', price: 198.50, chg: +0.22 },
];

export default function StockMarket() {
  return (
    <div>
      <PageHeader
        title="Stock Market"
        subtitle="Trade shares of the world's leading companies."
        action={
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input placeholder="Search stocks..." className="bg-[#0b1124] border border-slate-800/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/40 focus:outline-none w-48" />
          </div>
        }
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STOCKS.map((s) => (
          <DashCard key={s.sym} className="p-5 card-lift">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-display font-bold text-white">{s.sym}</div>
                <div className="text-xs text-slate-500">{s.name}</div>
              </div>
              <button className="text-slate-600 hover:text-amber-400 transition-colors"><Star size={16} /></button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-display font-bold text-xl text-white tabular-nums">${s.price.toFixed(2)}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${s.chg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {s.chg >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {s.chg >= 0 ? '+' : ''}{s.chg.toFixed(2)}%
                </div>
              </div>
              <Badge label="Trade" color="emerald" />
            </div>
          </DashCard>
        ))}
      </div>
    </div>
  );
}
