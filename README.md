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

## Preset Config Notes

- Gym templates (`gym_boutique`, `gym_hardcore`, `gym_functional`) use dedicated section keys in project config:
  - `gymPrograms`, `gymSchedule`, `gymMemberships`, `gymClassTypes`, `gymTrainers`, `gymResults`, `gymFacility`, `gymFaq`
- These map to section IDs:
  - `gym--programs`, `gym--schedule`, `gym--memberships`, `gym--class-types`, `gym--trainers`, `gym--results`, `gym--facility`, `gym--faq`
- If you add or rename a gym section, update all of: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, and dashboard section/editor mappings.

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

## GEO SEO (AI Searchability)

The platform now ships GEO-focused discoverability defaults for both the hub domain and tenant domains:

- AI crawler-aware `robots.txt` policy:
  - Root: `app/robots.ts`
  - Tenant: `app/(sites)/[domain]/robots.txt/route.ts`
- `llms.txt` discovery files:
  - Root: `/llms.txt`, `/llms-full.txt`
  - Tenant: `/{domain}/llms.txt`, `/{domain}/llms-full.txt` (via host-based rewrite in production)
- Shared generators:
  - `lib/seo/ai-crawlers.ts`
  - `lib/seo/llms.ts`
  - `lib/seo/hub-llms.ts`
  - `lib/seo/tenant-llms.ts`
- Crawler policy mode (optional env):
  - `GEO_CRAWLER_POLICY_MODE=max-visibility` (default)
  - `GEO_CRAWLER_POLICY_MODE=training-restricted`

When updating public routes or page labels, keep `sitemap.xml` and llms outputs in sync.

## Module Boundaries

See [docs/module-boundaries.md](docs/module-boundaries.md).

## Subscription Downgrade Lifecycle

When a paid client's subscription lapses (failed payment or expiry), features are revoked via two code paths that must stay in sync:

- **PayMongo webhook** (`subscription.unpaid`) → `app/api/paymongo/webhook/route.ts`: immediately resets `subscription_status`, `subscription_plan_id`, `custom_domain`, and publish limits to free-tier values, and removes the domain from Vercel.
- **Cron expiry sweep** → `app/api/cron/renew-subscriptions/route.ts`: handles projects with status `active`, `trial`, or `expired` whose end date has passed — applies the same full downgrade.
- **Feature gating** in `lib/subscription.ts` checks **both** `subscription_status` and `subscription_plan_id`. Never gate on `plan_id` alone.

See `AGENTS.md § 9` for the authoritative rules and free-tier reset values.

## Auth Session Recovery

- Visiting `/login` while authenticated redirects by role:
  - `admin` / `sub_admin` → `/admin`
  - other authenticated users → `/dashboard`
- Middleware automatically recovers broken auth states:
  - if session decoding/refresh fails, Supabase auth cookies are cleared
  - user is redirected to `/login?recovered=1` (or kept on `/login` with cleared cookies)

## Docs

- `docs/FEATURES.md`
- `docs/roadmap-multipage-sites.md`
- `docs/whitelabel-flow.md`
- `docs/PAYMONGO.md`
- `README_DEPLOY.md`
