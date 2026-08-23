import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Star } from 'lucide-react';
import { CryptoCoin, fetchCryptoPrices } from '@/lib/cryptoApi';
import { DashCard, PageHeader, LoadingState, ErrorState, Badge } from '../ui';

export default function CryptoSection() {
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
        title="Cryptocurrency"
        subtitle="Live crypto prices from CoinGecko. Updates every 30 seconds."
        action={
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-400' : ''} />
            <span>Auto-refreshing</span>
          </div>
        }
      />

      {loading && <LoadingState message="Fetching live prices..." />}
      {error && <ErrorState message="Could not reach the crypto data feed. Please try again." onRetry={() => window.location.reload()} />}

      {!loading && !error && coins && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coins.map((c) => {
            const up = c.price_change_percentage_24h >= 0;
            return (
              <DashCard key={c.id} className="p-5 card-lift">
                <div className="flex items-center gap-3 mb-4">
                  <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full" loading="lazy" />
                  <div>
                    <div className="font-display font-semibold text-white text-sm">{c.name}</div>
                    <div className="text-xs text-slate-500 uppercase">{c.symbol}</div>
                  </div>
                  <button className="ml-auto text-slate-600 hover:text-amber-400 transition-colors">
                    <Star size={16} />
                  </button>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display font-bold text-2xl text-white tabular-nums">
                      ${c.current_price >= 1 ? c.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : c.current_price.toFixed(4)}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {up ? '+' : ''}{c.price_change_percentage_24h.toFixed(2)}% <span className="text-slate-600 font-normal">24h</span>
                    </div>
                  </div>
                  <Badge label="Trade" color="emerald" />
                </div>
              </DashCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
