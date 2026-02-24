# Deploying EstabWeb to Vercel

This guide covers deploying the EstabWeb platform to Vercel with full multi-tenant support (subdomains + custom domains), PayMongo webhooks, and Vercel Cron Jobs.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account
- A [Supabase](https://supabase.com) project (Auth + PostgreSQL + Storage)
- A [PayMongo](https://paymongo.com) account (for Philippine payments)
- A [Google AI Studio](https://aistudio.google.com) API key (for Gemini AI suggestions)
- Your project pushed to a GitHub/GitLab/Bitbucket repository
- A root domain (e.g., `estabweb.com`) with DNS managed via Vercel or a CNAME-capable registrar

---

## 2. Database Setup

Before deploying, initialize your Supabase database:

1. Open the **SQL Editor** in your Supabase dashboard.
2. Run `docs/supabase_schema.sql` — creates all core tables.
3. Run `docs/migrations/001_subscription_fields.sql` — adds subscription/payment fields to `projects`.

---

## 3. Environment Variables

Set all of the following in **Vercel Dashboard → Project → Settings → Environment Variables**:

### Supabase
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anonymous (public) key |
| `DATABASE_URL` | PostgreSQL connection string — use the **Transaction Pooler** (port `6543`) |
| `DB_HOST` | Supabase pooler host |
| `DB_PORT` | `6543` |
| `DB_NAME` | `postgres` |
| `DB_USER` | Your Supabase DB user |
| `DB_PASSWORD` | Your Supabase DB password |

### Platform
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Primary platform URL (e.g., `https://estabweb.com`) |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Base domain without protocol (e.g., `estabweb.com`) |

### PayMongo
| Variable | Description |
|---|---|
| `PAYMONGO_SECRET_KEY` | Live or test secret key (`sk_live_...` / `sk_test_...`) |
| `PAYMONGO_PUBLIC_KEY` | Live or test public key (`pk_live_...` / `pk_test_...`) |
| `PAYMONGO_WEBHOOK_SECRET` | Webhook secret from PayMongo dashboard (`whsk_...`) |

### Vercel API (for auto-registering client custom domains)
| Variable | Description |
|---|---|
| `VERCEL_API_TOKEN` | Personal access token from [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_PROJECT_ID` | Found in Vercel Dashboard → Project → Settings → General |
| `VERCEL_TEAM_ID` | *(Optional)* Only needed if the project is under a Vercel team |

### AI
| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key from [aistudio.google.com](https://aistudio.google.com) |

### Cron
| Variable | Description |
|---|---|
| `CRON_SECRET` | A secret string used to authenticate `/api/cron/*` routes — set the same value here and in `vercel.json` |

### Redis (optional)
| Variable | Description |
|---|---|
| `REDIS_HOST` | Redis server hostname (e.g. `redis-15704.crce272.asia-seast1-1.gcp.cloud.redislabs.com`) |
| `REDIS_PORT` | Redis server port (e.g. `15704`). Defaults to `6379` if unset |
| `REDIS_USERNAME` | Redis ACL username. Defaults to `default` if unset |
| `REDIS_PASSWORD` | Redis password. Leave all four vars unset to disable caching — app works without Redis |

---

## 4. Domain & Wildcard Setup

To support client subdomains (e.g., `client.estabweb.com`) and custom domains:

1. Add your root domain (`estabweb.com`) to your Vercel project.
2. Add a wildcard domain (`*.estabweb.com`) to the same project.
3. For client custom domains: clients CNAME their domain to `cname.vercel-dns.com`. The platform auto-registers the domain via `/api/vercel/add-domain` using the Vercel API.

---

## 5. Supabase Auth Configuration

In your Supabase Dashboard → **Authentication → URL Configuration**:

1. Set **Site URL** to `https://estabweb.com` (your `NEXT_PUBLIC_APP_URL`).
2. Add the following **Redirect URLs**:
   - `https://estabweb.com/api/auth/callback`
   - `https://admin.estabweb.com/api/auth/callback` *(if using admin subdomain)*
   - `http://localhost:3000/api/auth/callback` *(for local development)*

---

## 6. PayMongo Webhook Setup

1. In your PayMongo dashboard, create a webhook pointing to:
   ```
   https://estabweb.com/api/paymongo/webhook
   ```
2. Subscribe to at least: `payment.paid`, `payment.failed`, `source.chargeable`.
3. Copy the webhook secret (`whsk_...`) into `PAYMONGO_WEBHOOK_SECRET`.

---

## 7. Cron Jobs

Cron jobs are configured in `vercel.json`. They run automatically on Vercel:

| Route | Schedule | Purpose |
|---|---|---|
| `/api/cron/renew-subscriptions` | Daily | Checks and renews active subscriptions |
| `/api/cron/keep-alive` | Periodic | Prevents Supabase free-tier DB from sleeping |

All cron routes are protected by the `CRON_SECRET` header — ensure the value matches in both Vercel env vars and `vercel.json`.

---

## 8. Deployment

Once environment variables are set:

1. Push to your main branch — Vercel auto-builds and deploys.
2. Verify the deployment at your root domain.
3. Test the admin suite at `/admin` and client dashboard at `/dashboard`.

### How Routing Works

`middleware.ts` handles all multi-tenant routing:
- Requests to `*.estabweb.com` or registered custom domains → rewritten to `/(sites)/[domain]`
- Requests to the root domain → served from `/(hub)`
- Admin routes → served from `/admin`

No additional Vercel rewrites are needed in `vercel.json` beyond cron configuration.

---

## 9. Local Development with Subdomains

To test subdomain routing locally:

1. Add entries to your system `hosts` file:
   ```
   127.0.0.1 client.localhost
   ```
2. Set `NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000` in `.env.local`.
3. Visit `http://client.localhost:3000` to see the client site.

---

## Notes

- Use the **Transaction Pooler** connection string (port `6543`) for `DATABASE_URL` — required for serverless/edge compatibility.
- Supabase Storage is used for image uploads via `/api/upload`. Ensure your storage bucket policies allow authenticated uploads.
- The platform falls back to `config/site-data.json` for demo mode when no project exists for a visited domain.
- See [`docs/PAYMONGO.md`](docs/PAYMONGO.md) for detailed PayMongo integration notes.
