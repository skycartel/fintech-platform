import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, Settings, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Profile } from '@/hooks/useDashboardData';

interface Props {
  onMenuClick: () => void;
  onNavigate: (id: string) => void;
  profile: Profile | null;
}

export default function Topbar({ onMenuClick, onNavigate, profile }: Props) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (profile?.full_name ?? user?.email ?? 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#04070f]/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 gap-4">
        {/* Left: menu + search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <Menu size={22} />
          </button>

          <div className="relative max-w-md w-full hidden sm:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search markets, assets..."
              className="w-full bg-[#0b1124] border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative w-10 h-10 rounded-xl bg-[#0b1124] border border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 glass rounded-xl border border-slate-800/60 shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-800/60">
                  <span className="text-sm font-display font-semibold text-white">Notifications</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {[
                    { t: 'Deposit confirmed', d: '$5,000 has been credited to your account.', time: '2m ago' },
                    { t: 'BTC signal alert', d: 'New BUY signal for BTC/USD at $64,200.', time: '1h ago' },
                    { t: 'AI Bot performance', d: 'Grid Bot #1 is up 3.2% this week.', time: '3h ago' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 border-b border-slate-800/40 hover:bg-white/5 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-white">{n.t}</span>
                        <span className="text-[10px] text-slate-600 flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.d}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300">View all</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl bg-[#0b1124] border border-slate-800/60 hover:border-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center font-display font-bold text-[#04070f] text-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-white leading-tight max-w-[120px] truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">Verified Account</div>
              </div>
              <ChevronDown size={15} className="text-slate-500 hidden sm:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 glass rounded-xl border border-slate-800/60 shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-800/60">
                  <div className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</div>
                  <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                </div>
                <button
                  onClick={() => { onNavigate('profile-settings'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <UserCircle size={16} /> Profile Settings
                </button>
                <button
                  onClick={() => { onNavigate('identity-verification'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings size={16} /> Identity Verification
                </button>
                <div className="border-t border-slate-800/60">
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-rose-400 hover:bg-rose-500/5 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
