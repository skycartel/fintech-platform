import { useCallback, useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { CryptoCoin, fetchCryptoPrices } from '@/lib/cryptoApi';

const REFRESH_MS = 30_000;

function formatPrice(p: number): string {
  if (p >= 1000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p >= 1) return p.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return p.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const color = up ? '#34d399' : '#f43f5e';
  const path = `M${pts.join(' L')}`;
  const fill = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${up ? 'up' : 'dn'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#spark-${up ? 'up' : 'dn'})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CryptoMarkets() {
  const [coins, setCoins] = useState<CryptoCoin[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down'>>({});
  const prevPrices = useRef<Record<string, number>>({});
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const data = await fetchCryptoPrices();
    if (!data) {
      setError(true);
      setLoading(false);
      return;
    }
    setError(false);

    // Detect price changes for flash animation
    const flashes: Record<string, 'up' | 'down'> = {};
    data.forEach((c) => {
      const prev = prevPrices.current[c.id];
      if (prev !== undefined && prev !== c.current_price) {
        flashes[c.id] = c.current_price > prev ? 'up' : 'down';
      }
      prevPrices.current[c.id] = c.current_price;
    });

    setCoins(data);
    setLastUpdate(new Date());
    setLoading(false);
    setFlashMap(flashes);
    // Clear flash after 800ms
    setTimeout(() => setFlashMap({}), 800);
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(load, REFRESH_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  return (
    <section id="crypto" className="relative py-28">
      <div
        className="aurora w-[700px] h-[700px] top-0 right-0"
        style={{ background: 'radial-gradient(circle, #1b2750, transparent 70%)', opacity: 0.4 }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
              <Activity size={14} /> Live crypto markets
            </p>
            <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
              Real-time prices,
              <br />
              <span className="gradient-text">streaming live</span>
            </h2>
          </div>
          <div className="reveal reveal-delay-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-400' : ''} />
              Updates every 30s
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>Source: CoinGecko</span>
            {lastUpdate && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Updated {timeAgo(lastUpdate.toISOString())}</span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="reveal glass rounded-2xl p-8 flex items-center gap-4 border border-amber-500/30">
            <AlertCircle className="text-amber-400 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm font-medium text-white">
                Live data temporarily unavailable
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                We couldn't reach the market-data feed. Prices will refresh automatically when the
                connection is restored.
              </p>
            </div>
            <button
              onClick={load}
              className="ml-auto text-xs font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(coins ?? []).map((c, i) => {
              const up = c.price_change_percentage_24h >= 0;
              const flash = flashMap[c.id];
              return (
                <div
                  key={c.id}
                  className={`reveal reveal-delay-${(i % 4) + 1} glass card-lift rounded-2xl p-5`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-9 h-9 rounded-full"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-white text-sm truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">{c.symbol}</div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <div
                        className={`font-display font-bold text-2xl tabular-nums transition-colors duration-500 ${
                          flash === 'up'
                            ? 'text-emerald-300'
                            : flash === 'down'
                            ? 'text-rose-300'
                            : 'text-white'
                        }`}
                      >
                        ${formatPrice(c.current_price)}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold mt-1 ${
                          up ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {up ? '+' : ''}
                        {c.price_change_percentage_24h.toFixed(2)}%
                        <span className="text-slate-600 font-normal ml-1">24h</span>
                      </div>
                    </div>
                    <Sparkline data={c.sparkline_in_7d?.price ?? []} up={up} />
                  </div>

                  <div className="text-[10px] text-slate-600 pt-3 border-t border-slate-800/60">
                    Last updated {timeAgo(c.last_updated)}
                  </div>
                </div>
              );
            })}

            {loading && !coins &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-slate-800" />
                    <div className="space-y-2">
                      <div className="w-20 h-3 bg-slate-800 rounded" />
                      <div className="w-10 h-2 bg-slate-800/60 rounded" />
                    </div>
                  </div>
                  <div className="w-24 h-7 bg-slate-800 rounded mb-2" />
                  <div className="w-16 h-3 bg-slate-800/60 rounded" />
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
