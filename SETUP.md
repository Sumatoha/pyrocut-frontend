# Pyrocut — Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase CLI (`pnpm supabase`)
- Accounts: [Supabase](https://supabase.com), [Polar.sh](https://polar.sh), [Resend](https://resend.com)

## 1. Clone and install

```bash
git clone <repo-url>
cd pyrocut-frontend
pnpm install
cp .env.example .env.local
```

## 2. Supabase setup

1. Create a new project at [supabase.com](https://supabase.com/dashboard)
2. Copy the project URL and anon key into `.env.local`
3. Copy the service role key (Settings > API) into `.env.local`
4. Run migrations:
   ```bash
   pnpm supabase db push
   ```
5. Enable Google and Apple OAuth providers in Authentication > Providers

## 3. Polar.sh setup

1. Create an organization at [polar.sh](https://polar.sh)
2. Create three products:
   - **Pyrocut Pro** — Subscription type
     - Add two prices: $19/month and $149/year
     - Attach a **License Key** benefit (activation limit: 3)
   - **Pyrocut Lifetime** — One-time purchase, $199
     - Attach a **License Key** benefit (activation limit: 5, no expiration)
3. Copy product IDs into `.env.local`:
   - `POLAR_PRODUCT_PRO` = Pro product ID
   - `POLAR_PRODUCT_LIFETIME` = Lifetime product ID
4. Generate an access token (Settings > Developers > Personal Access Tokens)
   - Copy into `POLAR_ACCESS_TOKEN`
5. Copy your organization ID into `POLAR_ORGANIZATION_ID`
6. Set up the webhook:
   - URL: `https://pyrocut.app/api/webhook/polar`
   - Events: `subscription.*`, `order.created`, `customer.*`, `benefit_grant.created`
   - Copy the webhook secret into `POLAR_WEBHOOK_SECRET`
7. Test with Polar's "Send test event" button

## 4. Resend setup

1. Create an account at [resend.com](https://resend.com)
2. Verify your domain (`pyrocut.app`)
3. Create an API key and copy into `RESEND_API_KEY`

## 5. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## 6. Deploy to Vercel

```bash
vercel
```

Set all environment variables from `.env.local` in Vercel's dashboard.
