import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Users, FolderOpen, ArrowDownToLine, ArrowUpFromLine,
  ArrowLeftRight, BadgeCheck, CreditCard, Zap, Gift, LifeBuoy,
  Settings, ScrollText, LogOut, ExternalLink, X, Menu, Bell,
  TrendingUp, DollarSign, Activity, ChevronDown,
} from 'lucide-react';
import AdminOverview from './pages/AdminOverview';
import AdminUsers from './pages/AdminUsers';
import AdminPlans from './pages/AdminPlans';
import AdminTransactions from './pages/AdminTransactions';
import AdminKyc from './pages/AdminKyc';
import AdminCredit from './pages/AdminCredit';
import AdminSignals from './pages/AdminSignals';
import AdminSupport from './pages/AdminSupport';
import AdminSettings from './pages/AdminSettings';
import AdminLogs from './pages/AdminLogs';

const ADMIN_NAV = [
  { title: 'Overview', items: [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  ]},
  { title: 'User Management', items: [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'kyc', label: 'Identity Verification', icon: BadgeCheck },
  ]},
  { title: 'Financial', items: [
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'plans', label: 'Investment Plans', icon: FolderOpen },
    { id: 'credit', label: 'Credit Applications', icon: CreditCard },
  ]},
  { title: 'Content & Support', items: [
    { id: 'signals', label: 'Premium Signals', icon: Zap },
    { id: 'support', label: 'Support Tickets', icon: LifeBuoy },
  ]},
  { title: 'System', items: [
    { id: 'settings', label: 'Platform Settings', icon: Settings },
    { id: 'logs', label: 'Audit Logs', icon: ScrollText },
  ]},
];

export default function AdminShell() {
  const { user, signOut } = useAuth();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const main = document.getElementById('admin-main');
    if (main) main.scrollTo(0, 0);
  }, [active]);

  const Page = useMemo(() => {
    switch (active) {
      case 'overview': return <AdminOverview />;
      case 'users': return <AdminUsers />;
      case 'kyc': return <AdminKyc />;
      case 'transactions': return <AdminTransactions />;
      case 'plans': return <AdminPlans />;
      case 'credit': return <AdminCredit />;
      case 'signals': return <AdminSignals />;
      case 'support': return <AdminSupport />;
      case 'settings': return <AdminSettings />;
      case 'logs': return <AdminLogs />;
      default: return <AdminOverview />;
    }
  }, [active]);

  return (
    <div className="flex bg-[#04070f] min-h-screen text-slate-200">
      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 h-screen w-[260px] flex-shrink-0 bg-[#070b18] border-r border-slate-800/60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800/60">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <span className="font-display font-bold text-[#04070f] text-lg">M</span>
            </div>
            <div>
              <span className="font-display font-semibold text-sm text-white tracking-tight block">Meridian Capital</span>
              <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Admin Panel</span>
            </div>
          </a>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 sidebar-scroll">
          {ADMIN_NAV.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-[0.15em] px-3 mb-2">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${
                          isActive ? 'bg-emerald-500/10 text-emerald-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-r-full" />}
                        <item.icon size={17} className="flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800/60 space-y-1">
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <ExternalLink size={17} /> View Website
          </a>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#04070f]/80 backdrop-blur-xl border-b border-slate-800/60">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1"><Menu size={22} /></button>
              <h2 className="font-display font-semibold text-white text-sm hidden sm:block">Admin Dashboard</h2>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="relative w-10 h-10 rounded-xl bg-[#0b1124] border border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400" />
              </button>
              <div className="flex items-center gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl bg-[#0b1124] border border-slate-800/60">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center font-display font-bold text-[#04070f] text-sm">
                  {(user?.email ?? 'A').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-white leading-tight max-w-[120px] truncate">{user?.email}</div>
                  <div className="text-[10px] text-emerald-400 leading-tight">Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main id="admin-main" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {Page}
        </main>
      </div>
    </div>
  );
}
