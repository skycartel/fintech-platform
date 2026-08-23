import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  country: string | null;
  avatar_url: string | null;
  kyc_status: string;
}

export interface Account {
  id: string;
  balance: number;
  equity: number;
  margin_used: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: string;
  reference: string | null;
  created_at: string;
}

export interface Investment {
  id: string;
  plan_name: string;
  amount: number;
  expected_return: number;
  status: string;
  start_date: string;
  end_date: string | null;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  asset_class: string;
  quantity: number;
  avg_price: number;
  current_price: number;
}

export interface Signal {
  id: string;
  symbol: string;
  action: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  analysis: string;
  status: string;
  created_at: string;
}

export interface CopyPosition {
  id: string;
  trader_name: string;
  symbol: string;
  direction: string;
  amount: number;
  pnl: number;
  status: string;
  created_at: string;
}

export interface AiBot {
  id: string;
  name: string;
  strategy: string;
  risk_level: string;
  status: string;
  allocated: number;
  pnl: number;
  win_rate: number;
}

export interface CreditApp {
  id: string;
  amount: number;
  term_months: number;
  purpose: string;
  status: string;
  interest_rate: number;
  created_at: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  min_amount: number;
  expected_return: number;
  duration_days: number;
  risk_level: string;
  description: string;
}

export interface Referral {
  id: string;
  referral_code: string;
  referred_email: string | null;
  reward: number;
  status: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
}

interface DashboardData {
  profile: Profile | null;
  account: Account | null;
  transactions: Transaction[];
  investments: Investment[];
  holdings: Holding[];
  signals: Signal[];
  copyPositions: CopyPosition[];
  aiBots: AiBot[];
  creditApps: CreditApp[];
  plans: InvestmentPlan[];
  referrals: Referral[];
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [copyPositions, setCopyPositions] = useState<CopyPosition[]>([]);
  const [aiBots, setAiBots] = useState<AiBot[]>([]);
  const [creditApps, setCreditApps] = useState<CreditApp[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const [
          profileRes, accountRes, txRes, invRes, holdRes, sigRes,
          copyRes, botRes, creditRes, planRes, refRes, ticketRes,
        ] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
          supabase.from('accounts').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
          supabase.from('investments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('holdings').select('*').eq('user_id', user.id),
          supabase.from('trading_signals').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('copy_positions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('ai_bots').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('credit_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('investment_plans').select('*').eq('active', true).order('min_amount', { ascending: true }),
          supabase.from('referrals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('support_tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        ]);

        if (!active) return;

        if (profileRes.error) throw profileRes.error;

        setProfile(profileRes.data as Profile | null);
        setAccount(accountRes.data as Account | null);
        setTransactions((txRes.data as Transaction[]) ?? []);
        setInvestments((invRes.data as Investment[]) ?? []);
        setHoldings((holdRes.data as Holding[]) ?? []);
        setSignals((sigRes.data as Signal[]) ?? []);
        setCopyPositions((copyRes.data as CopyPosition[]) ?? []);
        setAiBots((botRes.data as AiBot[]) ?? []);
        setCreditApps((creditRes.data as CreditApp[]) ?? []);
        setPlans((planRes.data as InvestmentPlan[]) ?? []);
        setReferrals((refRes.data as Referral[]) ?? []);
        setTickets((ticketRes.data as SupportTicket[]) ?? []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, [user, tick]);

  return {
    profile, account, transactions, investments, holdings, signals,
    copyPositions, aiBots, creditApps, plans, referrals, tickets,
    loading, error, refresh,
  };
}
