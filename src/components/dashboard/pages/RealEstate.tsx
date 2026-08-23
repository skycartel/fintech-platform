import { Building2, MapPin, TrendingUp } from 'lucide-react';
import { DashCard, PageHeader, Badge, StatCard } from '../ui';

const PROPERTIES = [
  { name: 'Manhattan Loft', location: 'New York, USA', value: 850000, yield: 6.2, img: 'modern apartment building' },
  { name: 'Mayfair Apartment', location: 'London, UK', value: 1200000, yield: 5.8, img: 'london townhouse' },
  { name: 'Dubai Marina Penthouse', location: 'Dubai, UAE', value: 2100000, yield: 7.5, img: 'luxury dubai skyscraper' },
  { name: 'Tokyo Shibuya Suite', location: 'Tokyo, Japan', value: 680000, yield: 5.4, img: 'tokyo modern building' },
];

export default function RealEstate() {
  return (
    <div>
      <PageHeader title="Real Estate" subtitle="Diversify with fractional ownership of premium properties." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Total Properties" value="48" sub="Available worldwide" icon={Building2} accent="emerald" />
        <StatCard label="Avg. Yield" value="6.4%" sub="Annual rental yield" icon={TrendingUp} accent="blue" />
        <StatCard label="Min. Investment" value="$5,000" sub="Fractional shares" icon={MapPin} accent="amber" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {PROPERTIES.map((p) => (
          <DashCard key={p.name} className="overflow-hidden card-lift">
            <div className="h-40 bg-gradient-to-br from-[#0b1124] to-[#121a36] flex items-center justify-center relative">
              <Building2 size={48} className="text-emerald-400/30" />
              <div className="absolute top-3 right-3"><Badge label={`${p.yield}% yield`} color="emerald" /></div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-white">{p.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {p.location}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/60">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Property value</div>
                  <div className="font-display font-bold text-white">${p.value.toLocaleString()}</div>
                </div>
                <button className="text-sm font-semibold text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-colors">
                  Invest
                </button>
              </div>
            </div>
          </DashCard>
        ))}
      </div>
    </div>
  );
}
