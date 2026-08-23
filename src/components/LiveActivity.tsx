import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

interface Activity {
  id: number;
  trader: string;
  action: 'BUY' | 'SELL';
  asset: string;
  amount: string;
  result: 'profit' | 'loss';
  value: string;
  ago: string;
}

const FIRST_NAMES = [
  'James', 'Sofia', 'Liam', 'Aisha', 'Mateo', 'Yuki', 'Olivia', 'Lucas',
  'Maya', 'Ethan', 'Zara', 'Noah', 'Lena', 'Ravi', 'Emma', 'Kai',
];
const COUNTRY_FLAGS: Record<string, string> = {
  UK: '🇬🇧', US: '🇺🇸', JP: '🇯🇵', DE: '🇩🇪', AE: '🇦🇪', SG: '🇸🇬',
  AU: '🇦🇺', CA: '🇨🇦', BR: '🇧🇷', IN: '🇮🇳', KR: '🇰🇷', CH: '🇨🇭',
};
const ASSETS = [
  { sym: 'BTC/USD', icon: '₿' },
  { sym: 'ETH/USD', icon: 'Ξ' },
  { sym: 'EUR/USD', icon: '€' },
  { sym: 'XAU/USD', icon: 'Au' },
  { sym: 'SOL/USD', icon: '◎' },
  { sym: 'NAS100', icon: 'N' },
  { sym: 'GBP/JPY', icon: '£' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateActivity(id: number): Activity {
  const name = `${randomItem(FIRST_NAMES)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`;
  const flag = COUNTRY_FLAGS[randomItem(Object.keys(COUNTRY_FLAGS))];
  const asset = randomItem(ASSETS);
  const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
  const isProfit = Math.random() > 0.35;
  const valueNum = (Math.random() * 8000 + 200).toFixed(0);
  const profitNum = (Math.random() * 1200 + 30).toFixed(2);
  const minutesAgo = Math.floor(Math.random() * 4) + 1;

  return {
    id,
    trader: `${flag} ${name}`,
    action,
    asset: asset.sym,
    amount: `${asset.icon} ${(Math.random() * 2 + 0.1).toFixed(2)} lots`,
    result: isProfit ? 'profit' : 'loss',
    value: `$${valueNum}`,
    ago: `${minutesAgo}m ago`,
  };
}

export default function LiveActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [paused, setPaused] = useState(false);
  const idRef = useRef(0);
  const visibleRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pause when tab not visible
  useEffect(() => {
    const onVis = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Spawn loop
  useEffect(() => {
    const schedule = () => {
      const delay = 6000 + Math.random() * 6000;
      timerRef.current = setTimeout(() => {
        if (visibleRef.current && !paused) {
          idRef.current += 1;
          const act = generateActivity(idRef.current);
          setActivities((prev) => [...prev.slice(-3), act]);
        }
        schedule();
      }, delay);
    };
    // First one appears sooner
    timerRef.current = setTimeout(() => {
      if (visibleRef.current) {
        idRef.current += 1;
        setActivities((prev) => [...prev.slice(-3), generateActivity(idRef.current)]);
      }
      schedule();
    }, 4000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused]);

  const dismiss = (id: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed bottom-6 left-6 z-[55] flex-col gap-3 max-w-[330px] pointer-events-none hidden sm:flex">
      {/* DEMO banner */}
      <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot relative" />
        <span className="text-[10px] font-semibold text-amber-300 tracking-wider uppercase">
          Demo · Simulated activity
        </span>
        <button
          onClick={() => setPaused((p) => !p)}
          className="ml-auto text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {activities.map((a) => (
        <div
          key={a.id}
          className="pointer-events-auto glass rounded-xl p-3.5 border border-slate-700/40 shadow-xl"
          style={{
            animation: 'activitySlideIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                a.action === 'BUY'
                  ? 'bg-emerald-500/15 border border-emerald-500/25'
                  : 'bg-rose-500/15 border border-rose-500/25'
              }`}
            >
              {a.action === 'BUY' ? (
                <TrendingUp size={16} className="text-emerald-400" />
              ) : (
                <TrendingDown size={16} className="text-rose-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-white truncate">{a.trader}</span>
                <button
                  onClick={() => dismiss(a.id)}
                  className="text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                {a.action === 'BUY' ? 'Bought' : 'Sold'}{' '}
                <span className="text-slate-200 font-medium">{a.asset}</span> · {a.amount}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span
                  className={`text-[11px] font-semibold ${
                    a.result === 'profit' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {a.result === 'profit' ? '+' : '-'}${a.value.replace('$', '')}
                </span>
                <span className="text-[9px] text-slate-600">{a.ago}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes activitySlideIn {
          from {
            opacity: 0;
            transform: translateX(-120%) translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
