# Meridian Capital — Full-Stack Investment Platform

A complete full-stack investment platform with a marketing landing page, user dashboard, admin panel, authentication, and database.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| 3D Graphics | Three.js + React Three Fiber |
| Backend / Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Icons | Lucide React |

## Features

### Landing Page
- Animated hero with 3D scene
- Live crypto ticker, stats, features, pricing, testimonials

### Authentication
- Sign up / Sign in / Password reset
- Role-based access (user vs admin)
- Secure sessions via Supabase Auth

### User Dashboard (21 pages)
- **Overview**: Dashboard, Account Statement
- **Portfolio & Investments**: Investment Plans, Stock Market, Cryptocurrency, Real Estate, My Portfolio, Performance History
- **Trading & Markets**: Live Markets (real CoinGecko API), Copy Trading, AI Trading Bots
- **Market Intelligence**: Premium Signals
- **Wallet & Funds**: Deposit, Withdraw, Internal Transfer (with server-side balance validation)
- **Credit & Financing**: Apply for Credit, Credit History
- **Account Management**: Profile Settings, Identity Verification (KYC)
- **Growth & Rewards**: Referral Program
- **Support**: Support Center (tickets + messaging)

### Admin Dashboard (10 pages)
- Platform overview with real-time stats
- User management (promote/demote admins)
- KYC document review (approve/reject)
- Transaction monitoring
- Investment plan CRUD
- Credit application review
- Premium signal publishing
- Support ticket management
- Platform settings (referral %, min deposit, etc.)
- Audit logs

## Environment Variables

Copy `.env` and configure these values:

```env
# Supabase (required — pre-provisioned in Bolt, set your own outside Bolt)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For server-side operations (edge functions, migrations)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DB_URL=your_supabase_database_url

# Optional external integrations (set when ready to connect)
MARKET_DATA_API_KEY=     # e.g. CoinGecko Pro, Alpha Vantage
PAYMENT_API_KEY=         # e.g. Stripe
EMAIL_API_KEY=           # e.g. SendGrid, Resend
```

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env   # then fill in your Supabase credentials

# 3. Run the database migrations
#    Go to your Supabase dashboard → SQL Editor
#    Run the SQL files in supabase/migrations/ in order:
#    - 20260820035904_create_dashboard_tables.sql
#    - 20260820035920_seed_data_and_auto_provision.sql
#    - 20260822201718_extend_schema_admin_notifications_kyc.sql

# 4. Start the dev server
npm run dev

# 5. Build for production
npm run build
```

## Setting Up an Admin Account

1. Create an account via the sign-up page
2. Go to your Supabase dashboard → Table Editor → `profiles`
3. Find your user row and change `role` from `user` to `admin`
4. Sign out and sign back in — you'll be redirected to the admin dashboard

Alternatively, update the user's `app_metadata` in Supabase Auth:
```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}', '"admin"'
)
WHERE email = 'your-email@example.com';
```

## Exporting the Project

1. Download all project files from Bolt
2. The project is a standard Vite + React app — no Bolt-specific runtime dependencies
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/meridian-capital.git
   git push -u origin main
   ```

## Deployment

### Frontend (Vercel, Netlify, or any static host)

```bash
npm run build
# Deploy the dist/ folder
```

For Vercel:
```bash
npm i -g vercel
vercel
```

For Netlify: set build command to `npm run build` and publish directory to `dist`.

### Database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the migration SQL files (from `supabase/migrations/`) in the SQL Editor
3. Update your `.env` with the new project's URL and keys
4. RLS policies are already configured in the migrations

### Environment Variables on Your Host

Set these in your hosting provider's dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Project Structure

```
src/
├── App.tsx                    # Main router (landing / auth / dashboard / admin)
├── components/
│   ├── AuthPage.tsx           # Sign in / Sign up / Password reset
│   ├── Navbar.tsx             # Landing page navigation
│   ├── Hero.tsx               # Landing hero (preserved)
│   ├── ...                    # Other landing page sections
│   ├── dashboard/
│   │   ├── DashboardShell.tsx # User dashboard layout
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Topbar.tsx         # Top bar with notifications
│   │   ├── ui.tsx             # Shared UI components
│   │   └── pages/             # 21 user dashboard pages
│   └── admin/
│       ├── AdminShell.tsx     # Admin dashboard layout
│       └── pages/             # 10 admin management pages
├── context/
│   ├── AuthContext.tsx        # Auth state + role detection
│   └── UIContext.tsx          # UI state (phone mockup)
├── hooks/
│   ├── useDashboardData.ts    # Fetches all user dashboard data
│   └── useReveal.ts           # Scroll reveal animation
└── lib/
    ├── supabase.ts            # Supabase client
    └── cryptoApi.ts           # CoinGecko API integration

supabase/
└── migrations/                # Database schema + seed data
```

## Security

- Password hashing via Supabase Auth (bcrypt)
- Row Level Security (RLS) on every table
- Role-based authorization with `is_admin()` database function
- Server-side balance validation prevents overdrafts
- All sensitive operations scoped to `auth.uid()`
- No secret keys exposed in frontend code
- Audit logging for all admin actions

## Important Notes

- **Market data**: Crypto prices are fetched live from CoinGecko's free API. Forex and index data shown as clearly-labeled demo data. Connect a market data API key when ready for full coverage.
- **Trading**: Copy trading and AI bots use demo/paper trading only. No real trades are executed.
- **Signals**: Trading signals are informational only and do not constitute financial advice.
- **Payments**: Deposits/withdrawals are simulated. Connect a payment processor (Stripe, etc.) for real transactions.
