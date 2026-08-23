import { ReactNode } from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function DashCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl border border-slate-800/60 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({
  label, value, sub, icon: Icon, accent = 'emerald',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: 'emerald' | 'blue' | 'amber' | 'rose';
}) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };
  return (
    <DashCard className="p-6 card-lift">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="font-display font-bold text-2xl text-white tabular-nums">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </DashCard>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={28} className="animate-spin text-emerald-400" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertCircle className="text-rose-400" size={26} />
      </div>
      <p className="text-sm text-slate-400 max-w-sm text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, icon: Icon }: { title: string; message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-center">
        {Icon ? <Icon className="text-slate-500" size={24} /> : <Inbox className="text-slate-500" size={24} />}
      </div>
      <p className="font-display font-semibold text-white text-sm">{title}</p>
      <p className="text-xs text-slate-500 max-w-xs text-center">{message}</p>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display font-bold text-2xl text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ label, color = 'emerald' }: { label: string; color?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' }) {
  const map = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    slate: 'bg-slate-700/30 text-slate-400 border-slate-600/30',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${map[color]}`}>
      {label}
    </span>
  );
}
