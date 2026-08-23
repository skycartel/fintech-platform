/*
# Extend schema: admin roles, notifications, audit logs, support messages,
# KYC documents, traders, platform settings

## New Tables
1. admin_logs — audit log of admin actions
2. notifications — user-facing notifications
3. support_messages — messages within support tickets
4. kyc_documents — identity verification document submissions
5. traders — copy-trading trader profiles (admin-managed)
6. platform_settings — key-value platform configuration (admin-managed)
7. admin_users — mapping of auth users to admin role

## Modified Tables
- profiles: add role column (user/admin), add referral_code, add identity_status

## Security
- admin_users, admin_logs, platform_settings: admin-only access via a helper function is_admin()
- notifications, support_messages, kyc_documents: owner-scoped
- traders: readable by all authenticated users, writable by admins only
- is_admin() checks raw_app_meta_data->>'role' = 'admin'
*/

-- Helper function: is the current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt()->'app_metadata'->>'role') = 'admin', false);
$$;

-- Add role + referral_code + identity_status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS identity_status text NOT NULL DEFAULT 'not_started';

-- Auto-generate referral code on profile insert
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
BEGIN
  code := UPPER(SUBSTRING(MD5(RANDOM()::text || NEW.id::text) FROM 1 FOR 8));
  NEW.referral_code := code;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_create_referral ON profiles;
CREATE TRIGGER on_profile_create_referral
  BEFORE INSERT ON profiles
  FOR EACH ROW WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- admin_logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_select_logs" ON admin_logs;
CREATE POLICY "admin_select_logs" ON admin_logs FOR SELECT TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "admin_insert_logs" ON admin_logs;
CREATE POLICY "admin_insert_logs" ON admin_logs FOR INSERT TO authenticated WITH CHECK (is_admin());

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- support_messages
CREATE TABLE IF NOT EXISTS support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_role text NOT NULL DEFAULT 'user',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_ticket_messages" ON support_messages;
CREATE POLICY "select_ticket_messages" ON support_messages FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR (
      EXISTS (
        SELECT 1 FROM support_tickets st
        WHERE st.id = support_messages.ticket_id AND st.user_id = auth.uid()
      )
    )
    OR is_admin()
  );
DROP POLICY IF EXISTS "insert_ticket_messages" ON support_messages;
CREATE POLICY "insert_ticket_messages" ON support_messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    OR is_admin()
  );

-- kyc_documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_number text,
  file_url text,
  status text NOT NULL DEFAULT 'pending',
  review_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_kyc" ON kyc_documents;
CREATE POLICY "select_own_kyc" ON kyc_documents FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "insert_own_kyc" ON kyc_documents;
CREATE POLICY "insert_own_kyc" ON kyc_documents FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_kyc_admin" ON kyc_documents;
CREATE POLICY "update_kyc_admin" ON kyc_documents FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Update profiles identity_status via kyc
-- Allow admins to update identity_status on profiles
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR is_admin())
  WITH CHECK (auth.uid() = id OR is_admin());

-- Allow admins to read all profiles
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR is_admin());

-- traders (copy-trading trader profiles)
CREATE TABLE IF NOT EXISTS traders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL DEFAULT '',
  strategy text NOT NULL DEFAULT '',
  risk_level text NOT NULL DEFAULT 'medium',
  followers int NOT NULL DEFAULT 0,
  roi numeric NOT NULL DEFAULT 0,
  win_rate numeric NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE traders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_all_traders" ON traders;
CREATE POLICY "select_all_traders" ON traders FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_traders" ON traders;
CREATE POLICY "admin_insert_traders" ON traders FOR INSERT TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_traders" ON traders;
CREATE POLICY "admin_update_traders" ON traders FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_traders" ON traders;
CREATE POLICY "admin_delete_traders" ON traders FOR DELETE TO authenticated USING (is_admin());

-- platform_settings (key-value config)
CREATE TABLE IF NOT EXISTS platform_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  description text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_settings" ON platform_settings;
CREATE POLICY "select_settings" ON platform_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_settings" ON platform_settings;
CREATE POLICY "admin_update_settings" ON platform_settings FOR INSERT TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_upsert_settings" ON platform_settings;
CREATE POLICY "admin_upsert_settings" ON platform_settings FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Seed platform settings
INSERT INTO platform_settings (key, value, description) VALUES
  ('referral_reward_pct', '5', 'Percentage reward for referrals'),
  ('demo_balance', '50000', 'Initial demo balance for new accounts'),
  ('min_deposit', '100', 'Minimum deposit amount in USD'),
  ('min_withdrawal', '50', 'Minimum withdrawal amount in USD'),
  ('credit_interest_rate', '8.5', 'Default interest rate for credit applications')
ON CONFLICT (key) DO NOTHING;

-- Seed demo traders
INSERT INTO traders (name, bio, strategy, risk_level, followers, roi, win_rate) VALUES
  ('Marcus Chen', 'Quant trader specializing in momentum strategies across crypto and equities.', 'Momentum Breakout', 'medium', 1247, 28.4, 67),
  ('Sarah Williams', 'Risk-averse swing trader focused on forex and commodities.', 'Swing Mean Reversion', 'low', 892, 18.7, 72),
  ('Dmitri Volkov', 'High-frequency crypto arbitrage specialist.', 'Statistical Arbitrage', 'high', 2103, 41.2, 64),
  ('Aisha Patel', 'Long-term value investor with AI-assisted screening.', 'AI Value Screening', 'low', 678, 15.3, 78)
ON CONFLICT DO NOTHING;

-- Allow admins to manage investment_plans (currently read-only for all)
DROP POLICY IF EXISTS "admin_insert_plans" ON investment_plans;
CREATE POLICY "admin_insert_plans" ON investment_plans FOR INSERT TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_plans" ON investment_plans;
CREATE POLICY "admin_update_plans" ON investment_plans FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_plans" ON investment_plans;
CREATE POLICY "admin_delete_plans" ON investment_plans FOR DELETE TO authenticated USING (is_admin());

-- Allow admins to manage trading_signals
DROP POLICY IF EXISTS "admin_insert_signals" ON trading_signals;
CREATE POLICY "admin_insert_signals" ON trading_signals FOR INSERT TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_update_signals" ON trading_signals;
CREATE POLICY "admin_update_signals" ON trading_signals FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin_delete_signals" ON trading_signals;
CREATE POLICY "admin_delete_signals" ON trading_signals FOR DELETE TO authenticated USING (is_admin());

-- Allow admins to read all support_tickets and update them
DROP POLICY IF EXISTS "select_own_tickets" ON support_tickets;
CREATE POLICY "select_own_tickets" ON support_tickets FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "update_own_tickets" ON support_tickets;
CREATE POLICY "update_own_tickets" ON support_tickets FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

-- Allow admins to read all credit_applications and update them
DROP POLICY IF EXISTS "select_own_credit" ON credit_applications;
CREATE POLICY "select_own_credit" ON credit_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "update_credit_admin" ON credit_applications;
CREATE POLICY "update_credit_admin" ON credit_applications FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Allow admins to read all transactions
DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- Allow admins to read all accounts and update them
DROP POLICY IF EXISTS "select_own_accounts" ON accounts;
CREATE POLICY "select_own_accounts" ON accounts FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "update_own_accounts" ON accounts;
CREATE POLICY "update_own_accounts" ON accounts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

-- Allow admins to read all investments and update them
DROP POLICY IF EXISTS "select_own_investments" ON investments;
CREATE POLICY "select_own_investments" ON investments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "update_own_investments" ON investments;
CREATE POLICY "update_own_investments" ON investments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

-- Allow admins to read all referrals
DROP POLICY IF EXISTS "select_own_referrals" ON referrals;
CREATE POLICY "select_own_referrals" ON referrals FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_admin());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
