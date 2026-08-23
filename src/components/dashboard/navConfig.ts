import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, ReceiptText, FolderOpen, TrendingUp, Bitcoin, Building2, PieChart, LineChart,
  Radio, Users, Bot, Zap, CreditCard, Wallet, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight,
  UserCircle, BadgeCheck, Gift, LifeBuoy, MessageSquare,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'account-statement', label: 'Account Statement', icon: ReceiptText },
    ],
  },
  {
    title: 'Portfolio & Investments',
    items: [
      { id: 'investment-plans', label: 'All Investment Plans', icon: FolderOpen },
      { id: 'stock-market', label: 'Stock Market', icon: TrendingUp },
      { id: 'cryptocurrency', label: 'Cryptocurrency', icon: Bitcoin },
      { id: 'real-estate', label: 'Real Estate', icon: Building2 },
      { id: 'my-portfolio', label: 'My Portfolio', icon: PieChart },
      { id: 'performance-history', label: 'Performance History', icon: LineChart },
    ],
  },
  {
    title: 'Trading & Markets',
    items: [
      { id: 'live-markets', label: 'Live Markets', icon: Radio, badge: 'Live' },
      { id: 'copy-trading', label: 'Copy Trading', icon: Users, badge: 'Pro' },
      { id: 'ai-trading-bots', label: 'AI Trading Bots', icon: Bot, badge: 'AI' },
    ],
  },
  {
    title: 'Market Intelligence',
    items: [
      { id: 'premium-signals', label: 'Premium Signals', icon: Zap, badge: 'Premium' },
    ],
  },
  {
    title: 'Wallet & Funds',
    items: [
      { id: 'deposit', label: 'Deposit Funds', icon: ArrowDownToLine },
      { id: 'withdraw', label: 'Withdraw Funds', icon: ArrowUpFromLine },
      { id: 'internal-transfer', label: 'Internal Transfer', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Credit & Financing',
    items: [
      { id: 'apply-credit', label: 'Apply for Credit', icon: CreditCard, badge: 'Fast' },
      { id: 'credit-history', label: 'Credit History', icon: Wallet },
    ],
  },
  {
    title: 'Account Management',
    items: [
      { id: 'profile-settings', label: 'Profile Settings', icon: UserCircle },
      { id: 'identity-verification', label: 'Identity Verification', icon: BadgeCheck },
    ],
  },
  {
    title: 'Growth & Rewards',
    items: [
      { id: 'referral-program', label: 'Referral Program', icon: Gift, badge: '5%' },
    ],
  },
  {
    title: 'Support & Help',
    items: [
      { id: 'support-center', label: 'Support Center', icon: LifeBuu },
    ],
  },
];

export const ALL_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
