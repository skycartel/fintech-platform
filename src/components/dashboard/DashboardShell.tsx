import { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardOverview from './pages/DashboardOverview';
import AccountStatement from './pages/AccountStatement';
import InvestmentPlans from './pages/InvestmentPlans';
import StockMarket from './pages/StockMarket';
import CryptoSection from './pages/CryptoSection';
import RealEstate from './pages/RealEstate';
import MyPortfolio from './pages/MyPortfolio';
import PerformanceHistory from './pages/PerformanceHistory';
import LiveMarkets from './pages/LiveMarkets';
import CopyTrading from './pages/CopyTrading';
import AiTradingBots from './pages/AiTradingBots';
import PremiumSignals from './pages/PremiumSignals';
import DepositFunds from './pages/DepositFunds';
import WithdrawFunds from './pages/WithdrawFunds';
import InternalTransfer from './pages/InternalTransfer';
import ApplyCredit from './pages/ApplyCredit';
import CreditHistory from './pages/CreditHistory';
import ProfileSettings from './pages/ProfileSettings';
import IdentityVerification from './pages/IdentityVerification';
import ReferralProgram from './pages/ReferralProgram';
import SupportCenter from './pages/SupportCenter';

export default function DashboardShell() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const data = useDashboardData();

  // Scroll to top on page change
  useEffect(() => {
    const main = document.getElementById('dash-main');
    if (main) main.scrollTo(0, 0);
  }, [active]);

  const Page = useMemo(() => {
    switch (active) {
      case 'dashboard': return <DashboardOverview data={data} />;
      case 'account-statement': return <AccountStatement data={data} />;
      case 'investment-plans': return <InvestmentPlans data={data} />;
      case 'stock-market': return <StockMarket />;
      case 'cryptocurrency': return <CryptoSection />;
      case 'real-estate': return <RealEstate />;
      case 'my-portfolio': return <MyPortfolio data={data} />;
      case 'performance-history': return <PerformanceHistory data={data} />;
      case 'live-markets': return <LiveMarkets />;
      case 'copy-trading': return <CopyTrading data={data} />;
      case 'ai-trading-bots': return <AiTradingBots data={data} />;
      case 'premium-signals': return <PremiumSignals data={data} />;
      case 'deposit': return <DepositFunds data={data} />;
      case 'withdraw': return <WithdrawFunds data={data} />;
      case 'internal-transfer': return <InternalTransfer data={data} />;
      case 'apply-credit': return <ApplyCredit data={data} />;
      case 'credit-history': return <CreditHistory data={data} />;
      case 'profile-settings': return <ProfileSettings data={data} />;
      case 'identity-verification': return <IdentityVerification data={data} />;
      case 'referral-program': return <ReferralProgram data={data} />;
      case 'support-center': return <SupportCenter data={data} />;
      default: return <DashboardOverview data={data} />;
    }
  }, [active, data]);

  return (
    <div className="flex bg-[#04070f] min-h-screen text-slate-200">
      <Sidebar
        active={active}
        onNavigate={setActive}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={setActive}
          profile={data.profile}
        />
        <main
          id="dash-main"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full"
        >
          {Page}
        </main>
      </div>
    </div>
  );
}
