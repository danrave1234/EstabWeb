# EstabWeb

> [!IMPORTANT]
> **To AI Coding Agents**: Always refer to the [AGENTS.md](file:///c:/Users/Danrave/Desktop/Project/template-nextjs-nestjs/boilerplate/AGENTS.md) file before starting any task. You are **REQUIRED** to update `AGENTS.md` and this `README.md` if your changes introduce new conventions, workflows, or significant code patterns.


EstabWeb is a multi-tenant SaaS platform for generating and managing industry-optimized websites. Clients redeem template codes, get an instant starter site, and edit content from a dashboard without writing code.

> Status: Active development, `v0.1.0`.

## End-to-End Flow

1. Admin updates the master template in `/admin/preview`.
2. Client signs up and redeems a code in `/dashboard/onboarding`.
3. Client edits content in the dashboard (saved to `draft_config`).
4. Client submits a change request.
5. Admin approves, publishing `draft_config` to `current_config`.
6. Public site is served on subdomain or custom domain through middleware routing.

## Tech Stack

- Framework: Next.js 16, React 19, App Router
- Styling: Tailwind CSS 4
- Auth and DB: Supabase (Auth, PostgreSQL, Storage)
- Payments: PayMongo
- AI: Gemini API
- Hosting: Vercel
- Cron: Vercel Cron Jobs
- Cache: Redis or Upstash (optional)

## Key Areas

- Admin Suite: `/admin`
- Client Dashboard: `/dashboard`
- Public Sites: `/(sites)/[domain]`
- Hub Pages: `/(hub)`
- API Routes: `/api/*`

## Local Setup

1. Create env vars from `.env.example` (or your existing `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
NEXT_PUBLIC_APP_URL=https://yourdomain.com
PAYMONGO_SECRET_KEY=
PAYMONGO_PUBLIC_KEY=
PAYMONGO_WEBHOOK_SECRET=
VERCEL_API_TOKEN=
VERCEL_PROJECT_ID=
GEMINI_API_KEY=
CRON_SECRET=
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
```

2. Run database schema/migrations:

```bash
# Base schema
docs/supabase_schema.sql

# Incremental migrations
migrations/001_initial_schema.sql
migrations/002_add_sub_admin_role.sql
migrations/003_fix_project_events_event_type_check.sql
migrations/004_add_support_requests_table.sql
migrations/005_payment_idempotency.sql
migrations/006_add_subscription_interval.sql
migrations/007_add_ai_usage_count.sql
```

3. Install and run:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: start Next.js app
- `npm run server:dev`: start server workspace in `server/`
- `npm run test`: run Jest tests
- `npm run check:boundaries`: enforce module import boundaries
- `npm run migrate`: run migration helper script
- `npm run migrate:status`: migration status

## Module Boundaries

See [docs/module-boundaries.md](docs/module-boundaries.md).

## Subscription Downgrade Lifecycle

When a paid client's subscription lapses (failed payment or expiry), features are revoked via two code paths that must stay in sync:

- **PayMongo webhook** (`subscription.unpaid`) → `app/api/paymongo/webhook/route.ts`: immediately resets `subscription_status`, `subscription_plan_id`, `custom_domain`, and publish limits to free-tier values, and removes the domain from Vercel.
- **Cron expiry sweep** → `app/api/cron/renew-subscriptions/route.ts`: handles projects with status `active`, `trial`, or `expired` whose end date has passed — applies the same full downgrade.
- **Feature gating** in `lib/subscription.ts` checks **both** `subscription_status` and `subscription_plan_id`. Never gate on `plan_id` alone.

See `AGENTS.md § 9` for the authoritative rules and free-tier reset values.

## Docs

- `docs/FEATURES.md`
- `docs/roadmap-multipage-sites.md`
- `docs/whitelabel-flow.md`
- `docs/PAYMONGO.md`
- `README_DEPLOY.md`
