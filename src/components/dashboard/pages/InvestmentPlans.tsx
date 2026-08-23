import { FolderOpen, TrendingUp, Shield, Clock } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { DashCard, PageHeader, EmptyState, Badge } from '../ui';

export default function InvestmentPlans({ data }: { data: DashboardData }) {
  const { plans, investments, loading } = data;

  return (
    <div>
      <PageHeader title="All Investment Plans" subtitle="Choose a plan that matches your risk profile and goals." />

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading plans...</div>
      ) : plans.length === 0 ? (
        <EmptyState title="No plans available" message="Investment plans will appear here." icon={FolderOpen} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => {
            const invested = investments.some((inv) => inv.plan_name === plan.name && inv.status === 'active');
            return (
              <DashCard key={plan.id} className={`p-6 card-lift ${i === 1 ? 'border-emerald-400/40' : ''}`}>
                {i === 1 && <div className="mb-3"><Badge label="Popular" color="emerald" /></div>}
                <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                <div className="mt-3 mb-4">
                  <span className="font-display font-bold text-3xl gradient-text">{plan.expected_return}%</span>
                  <span className="text-xs text-slate-500 ml-1">expected return</span>
                </div>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">{plan.description}</p>
                <div className="space-y-2.5 mb-6 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><TrendingUp size={13} /> Min. investment</span>
                    <span className="text-white font-medium">${plan.min_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><Clock size={13} /> Duration</span>
                    <span className="text-white font-medium">{plan.duration_days} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5"><Shield size={13} /> Risk level</span>
                    <span className={`font-medium capitalize ${plan.risk_level === 'low' ? 'text-emerald-400' : plan.risk_level === 'medium' ? 'text-amber-400' : 'text-rose-400'}`}>{plan.risk_level}</span>
                  </div>
                </div>
                <button
                  disabled={invested}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    invested
                      ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#04070f] hover:shadow-lg hover:shadow-emerald-500/30'
                  }`}
                >
                  {invested ? 'Already invested' : 'Invest Now'}
                </button>
              </DashCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
