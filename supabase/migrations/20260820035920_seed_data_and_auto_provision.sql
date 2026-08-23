/*
# Seed default data + auto-provision new user accounts

## What this does
1. Seeds investment_plans with 4 default tiers (Starter, Professional, Gold, Premier).
2. Seeds trading_signals with sample premium signals.
3. Creates a trigger function that auto-creates a profile + account row
   when a new auth.users record is inserted (on sign-up).
4. Attaches the trigger to auth.users.

## Notes
- The trigger ensures every new user gets a profile and a zero-balance account
  automatically, so the dashboard never shows empty/broken state on first login.
- Demo balance of $50,000 is credited to the account so the dashboard has
  meaningful data to display for demonstration.
*/

-- Seed investment plans
INSERT INTO investment_plans (name, min_amount, expected_return, duration_days, risk_level, description) VALUES
  ('Starter', 500, 8.5, 30, 'low', 'Conservative plan with steady returns. Ideal for first-time investors.'),
  ('Professional', 2000, 14.2, 60, 'medium', 'Balanced risk-reward with diversified asset allocation.'),
  ('Gold', 5000, 21.8, 90, 'medium', 'Enhanced returns through active portfolio management.'),
  ('Premier', 20000, 32.5, 180, 'high', 'Institutional-grade strategy with maximum yield potential.')
ON CONFLICT DO NOTHING;

-- Seed trading signals
INSERT INTO trading_signals (symbol, action, entry_price, target_price, stop_loss, confidence, analysis, status) VALUES
  ('BTC/USD', 'BUY', 64200, 68500, 61800, 78, 'Bullish momentum building above key support. RSI divergence confirms upward pressure.', 'active'),
  ('XAU/USD', 'BUY', 2360, 2420, 2330, 72, 'Gold breaking out of consolidation zone amid geopolitical uncertainty.', 'active'),
  ('EUR/USD', 'SELL', 1.0890, 1.0780, 1.0940, 65, 'Euro weakening against dollar as ECB signals dovish pivot.', 'active'),
  ('ETH/USD', 'BUY', 3380, 3700, 3200, 81, 'Ethereum accumulation phase nearing completion. Staking inflows accelerating.', 'active')
ON CONFLICT DO NOTHING;

-- Auto-provision function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  INSERT INTO accounts (user_id, balance, equity)
  VALUES (NEW.id, 50000, 50000);
  RETURN NEW;
END;
$$;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
