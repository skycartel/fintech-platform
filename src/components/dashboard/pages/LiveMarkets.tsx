import { Radio, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashCard, PageHeader, Badge, LoadingState, ErrorState } from '../ui';
import { CryptoCoin, fetchCryptoPrices } from '@/lib/cryptoApi';

const FOREX = [
  { sym: 'EUR/USD', price: 1.0892, chg: +0.12 },
  { sym: 'GBP/USD', price: 1.2734, chg: -0.08 },
  { sym: 'USD/JPY', price: 149.82, chg: +0.34 },
  { sym: 'AUD/USD', price: 0.6589, chg: +0.22 },
];

const INDICES = [
  { sym: 'S&P 500', price: 5298.4, chg: +0.31 },
  { sym: 'NASDAQ', price: 18342.9, chg: +0.45 },
  { sym: 'DOW', price: 38924.3, chg: -0.12 },
  { sym: 'FTSE 100', price: 8127.8, chg: +0.18 },
];

export default function LiveMarkets() {
  const [coins, setCoins] = useState<CryptoCoin[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchCryptoPrices();
      if (!data) { setError(true); setLoading(false); return; }
      setCoins(data); setError(false); setLoading(false);
    })();
    const t = setInterval(async () => {
      const data = await fetchCryptoPrices();
      if (data) setCoins(data);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader
        title="Live Markets"
        subtitle="Real-time prices across crypto, forex, and global indices."
        action={<div className="flex items-center gap-2 text-xs text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400 pulse-dot relative" /> Live</div>}
      />

      {loading && <LoadingState message="Connecting to live markets..." />}
      {error && (
        <div className="mb-6">
          <ErrorState message="Could not connect to the crypto data feed. Forex and index data below is demo data." onRetry={() => window.location.reload()} />
        </div>
      )}

      {!loading && !error && coins && (
        <DashCard className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio size={18} className="text-emerald-400" />
            <h3 className="font-display font-semibold text-white">Cryptocurrency (Live via CoinGecko)</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coins.map((c) => {
              const up = c.price_change_percentage_24h >= 0;
              return (
                <div key={c.id} className="p-4 rounded-xl bg-[#0b1124] border border-slate-800/40">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={c.image} alt={c.name} className="w-6 h-6 rounded-full" loading="lazy" />
                    <span className="text-sm font-medium text-white uppercase">{c.symbol}</span>
                  </div>
                  <div className="font-display font-bold text-lg text-white tabular-nums">
                    ${c.current_price >= 1 ? c.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : c.current_price.toFixed(4)}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {up ? '+' : ''}{c.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        </DashCard>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Forex Pairs <span className="text-xs text-slate-600 ml-2">(Demo Data)</span></h3>
          <div className="space-y-3">
            {FOREX.map((f) => (
              <div key={f.sym} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
                <span className="text-sm text-slate-300">{f.sym}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-display text-white tabular-nums">{f.price.toFixed(4)}</span>
                  <Badge label={`${f.chg >= 0 ? '+' : ''}${f.chg}%`} color={f.chg >= 0 ? 'emerald' : 'rose'} />
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard className="p-6">
          <h3 className="font-display font-semibold text-white mb-4">Global Indices <span className="text-xs text-slate-600 ml-2">(Demo Data)</span></h3>
          <div className="space-y-3">
            {INDICES.map((idx) => (
              <div key={idx.sym} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
                <span className="text-sm text-slate-300">{idx.sym}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-display text-white tabular-nums">{idx.price.toLocaleString('en-US', { minimumFractionDigits: 1 })}</span>
                  <Badge label={`${idx.chg >= 0 ? '+' : ''}${idx.chg}%`} color={idx.chg >= 0 ? 'emerald' : 'rose'} />
                </div>
              </div>
            ))}
          </div>
        </DashCard>
      </div>
    </div>
  );
}
