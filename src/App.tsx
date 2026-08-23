import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Stats from './components/Stats';
import Features from './components/Features';
import Markets from './components/Markets';
import CryptoMarkets from './components/CryptoMarkets';
import Platform from './components/Platform';
import Steps from './components/Steps';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import PhoneMockup from './components/PhoneMockup';
import LiveActivity from './components/LiveActivity';
import { UIProvider } from './context/UIContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useReveal } from './hooks/useReveal';
import AuthPage from './components/AuthPage';
import DashboardShell from './components/dashboard/DashboardShell';
import AdminShell from './components/admin/AdminShell';

function LandingPage() {
  const ref = useReveal<HTMLDivElement>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(scrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        className="fixed top-0 left-0 z-[60] h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transition-[width] duration-75"
        style={{ width: `${progress * 100}%` }}
      />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Stats />
        <Features />
        <Markets />
        <CryptoMarkets />
        <Platform />
        <Steps />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <PhoneMockup />
      <LiveActivity />
    </div>
  );
}

function AdminAccessDenied() {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen bg-[#04070f] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert size={30} className="text-rose-400" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-2">Access Denied</h1>
        <p className="text-sm text-slate-400 mb-6">
          You need an administrator account to access this area. If you believe this is an error, please contact the platform owner.
        </p>
        <div className="flex gap-3 justify-center">
          <a href="#dashboard" className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 border border-slate-700 hover:text-white transition-colors">
            Go to Dashboard
          </a>
          <button onClick={() => signOut()} className="px-5 py-2.5 rounded-lg text-sm font-medium text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function AppRouter() {
  const { user, loading, isAdmin } = useAuth();
  const [hash, setHash] = useState(window.location.hash.toLowerCase());

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash.toLowerCase());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const wantsAdmin = hash === '#admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04070f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (wantsAdmin) {
    if (!user) return <AuthPage adminMode />;
    if (!isAdmin) return <AdminAccessDenied />;
    return <AdminShell />;
  }

  if (!user) {
    if (hash === '#login' || hash === '#signup' || hash === '#reset') {
      return <AuthPage />;
    }
    return <LandingPage />;
  }

  if (isAdmin) {
    return <AdminShell />;
  }

  return <DashboardShell />;
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <AppRouter />
      </UIProvider>
    </AuthProvider>
  );
}
