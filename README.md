# EstabWeb

> [!IMPORTANT]
> **To AI Coding Agents**: Always refer to the [AGENTS.md](file:///c:/Users/Danrave/Desktop/Project/template-nextjs-nestjs/boilerplate/AGENTS.md) file before starting any task. You are **REQUIRED** to update `AGENTS.md` and this `README.md` if your changes introduce new conventions, workflows, or significant code patterns.


EstabWeb is a multi-tenant SaaS platform for generating and managing industry-optimized websites. Clients redeem template codes, get an instant starter site, and edit content from a dashboard without writing code.

> Status: Active development, `v0.1.0`.

## End-to-End Flow

1. Admin prepares a business-specific draft in `/admin/template` (`template_master` editor + temporary draft snapshots).
2. Admin generates a template redemption code only when the prospect is ready.
3. Client signs up and redeems a code in `/dashboard/onboarding`.
4. Client edits content in the dashboard (saved to `draft_config`).
5. Client submits a change request.
6. Admin approves, publishing `draft_config` to `current_config`.
7. Public site is served on subdomain or custom domain through middleware routing.

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

## Subscription Labels

- Stored plan IDs remain `free`, `basic`, `pro`, `ecommerce`, and `custom` for backend logic, webhooks, and database records.
- User-facing labels are: `Free`, `Starter` (`basic`), `Business` (`pro`), `E-commerce`, and `Custom`.
- When adjusting pricing or plan copy, keep frontend, admin surfaces, payment descriptions, tests, and docs aligned without renaming the underlying stored plan IDs.

## Analytics Value Layer

- Analytics is session-based: public tracking now follows `session -> events -> attribution -> metrics` instead of relying on raw counters alone.
- Public events are buffered and sent in batches through `components/shared/Analytics.tsx` to `/api/track-event`, which upserts `project_sessions` and bulk-inserts `project_events` with session, visitor, source, and funnel context.
- Shared section analytics normalization still lives in `lib/analytics/section-insights.ts` and is emitted by `components/shared/SiteBlockRenderer.tsx` through `data-*` attributes consumed by `hooks/useSectionTracking.ts`, `hooks/useClickMapTracking.ts`, and `components/shared/Analytics.tsx`.
- The simple heatmap-style insight is implemented as section attention: `hooks/useSectionTracking.ts` times how long a section stays visibly on screen while the tab/window is active, then sends summarized `section_attention` events instead of noisy per-tick updates.
- Section analytics also carries interactivity metadata (`section_is_interactive`, `section_interaction_type`, `section_interaction_label`) so the dashboard can treat passive sections differently from CTA/form-heavy sections.
- Published analytics is version-aware: the public site exposes `config_version` as `page_version_id`, and section events/leads carry `section_slot`, `section_variant`, `section_instance_id`, and `page_version_id` so dashboard insights do not mix old and new page layouts after a publish.
- Leads are now attributable back to sessions through `project_leads.session_id`, allowing the dashboard in `app/(hub)/dashboard/analytics/page.tsx` to report which pages, traffic sources, and sections turned visits into inquiries using business-friendly wording.

## Admin Template AI + Drafts

- `POST /api/ai/populate-template` now supports Gemini Search-grounded generation for up-to-date business context.
- It returns full template recommendations: brand copy, `theme`, `colorTheme`, `typographyStyle`, `headerStyle`, `footerStyle`, `darkMode`, and `activeSections`.
- It now injects structured design-system context into the AI prompt (preset blueprints, section labels/config keys, hero/theme labels, color swatches, typography metadata, and dark/light mode hints) so selections follow real preset patterns instead of random combinations.
- It accepts optional `businessPageUrl` (e.g., Facebook page URL) and extracts public page signals (logo/cover/contact hints) to reduce manual asset setup.
- It also accepts optional `businessImageDataUrl` (uploaded screenshot/logo) so AI can extract business details when page scraping is blocked.
- `/admin/template` now shows a compact live activity log during full-template generation so admins can see when the builder is researching public context, generating sections/copy, and preparing assets.
- Model/env controls:
  - `GEMINI_TEMPLATE_MODEL` (default: `gemini-2.5-flash`)
  - `GEMINI_TEMPLATE_USE_SEARCH` (default: `true`)
- `/admin/template` supports temporary draft snapshots via `template_drafts`:
  - Save WIP business versions (brand name, logo, photos, content)
  - Load drafts back into the editor
  - Delete obsolete drafts
  - Drafts auto-expire after 30 days (`expires_at`) and are cleaned by cron
- Template codes remain the final share step for prospects:
  - Draft first (`template_drafts`)
  - Convert to shareable code (`template_codes`) only when needed

## Preset Config Notes

- Header style options available in dashboard design are:
  - `sticky`, `static`, `floating`, `tubelight`, `megamenu`
  - Legacy alias: `solid` is treated as sticky behavior
- Gym templates (`gym_boutique`, `gym_hardcore`, `gym_functional`) use dedicated section keys in project config:
  - `gymPrograms`, `gymSchedule`, `gymMemberships`, `gymClassTypes`, `gymTrainers`, `gymResults`, `gymFacility`, `gymFaq`
- These map to section IDs:
  - `gym--programs`, `gym--schedule`, `gym--memberships`, `gym--class-types`, `gym--trainers`, `gym--results`, `gym--facility`, `gym--faq`
- If you add or rename a gym section, update all of: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, and dashboard section/editor mappings.
- Pricing comparison variant uses:
  - section ID: `pricing--comparison` (legacy alias: `pricing-comparison-table`)
  - config key: `pricingComparisonTable`
- If you add or rename this pricing variant, update: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, and dashboard section/editor mappings.
- Animated testimonials variant uses:
  - section ID: `testimonials--animated`
  - config key: `animatedTestimonials`
- If you add or rename this variant, update: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, and dashboard section/editor mappings.
- Pricing section comparison variant uses:
  - section ID: `pricing--feature-comparison` (legacy alias: `pricing-section-with-comparison`)
  - config key: `pricingSectionComparison`
- If you add or rename this variant, update: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, and dashboard section/editor mappings.
- Hero showcase variant uses:
  - section ID: `hero--showcase` (legacy alias: `hero-showcase`)
  - config key: `heroShowcase`
- Services bento variant uses:
  - section ID: `services--bento` (legacy alias: `services-bento`)
  - config key: `featuresBento`
- If you add or rename either variant, update: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/dashboard/SectionLivePreview.tsx`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx`.
- Gallery carousel variant uses:
  - section ID: `gallery--carousel`
  - config key: `gallery4`
- If you add or rename this variant, update: `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, `lib/ai/section-field-schema.ts`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx`.

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
GEMINI_TEMPLATE_MODEL=gemini-2.5-flash
GEMINI_TEMPLATE_USE_SEARCH=true
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
migrations/008_analytics_identity_and_attribution.sql
migrations/009_fix_project_events_add_missing_event_types.sql
migrations/010_add_site_status.sql
migrations/011_add_missing_lead_columns.sql
migrations/012_add_promo_codes.sql
migrations/013_add_template_drafts.sql
migrations/014_add_template_draft_expiry.sql
migrations/018_session_based_analytics.sql
migrations/019_add_section_attention_event_type.sql
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

Cron jobs (see `vercel.json`):
- `/api/cron/renew-subscriptions`
- `/api/cron/keep-alive`
- `/api/cron/cleanup-template-drafts` (removes expired 30-day drafts and draft-owned uploaded assets)

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
- Tenant metadata normalization lives in `lib/seo/autoSeo.ts`; placeholder onboarding/demo values (for example `Your Business Name`, `Your City`, and demo contact details) are stripped before public SEO metadata and schema are emitted.
- Tenant favicons are served from the tenant host itself through `app/(sites)/[domain]/favicon.ico/route.ts`, and tenant metadata points icons to `https://{host}/favicon.ico` for stronger crawler compatibility.
- Crawler policy mode (optional env):
  - `GEO_CRAWLER_POLICY_MODE=max-visibility` (default)
  - `GEO_CRAWLER_POLICY_MODE=training-restricted`

When updating public routes or page labels, keep `sitemap.xml` and llms outputs in sync.

## Public Lead Tracking & reCAPTCHA

- Hub auth flows such as `/login` may still use the shared `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
- Public tenant sites (`app/(sites)/[domain]`) must not auto-load the shared reCAPTCHA script, because client subdomains and custom domains can fail with `Invalid domain for site key` unless every tenant host is registered with Google.
- `components/shared/Analytics.tsx` and `app/api/track-lead/route.ts` therefore treat tenant lead protection as `rate limiting + honeypot` by default, and only verify reCAPTCHA when a valid token is actually supplied by a tenant-safe key.

## AI Custom HTML Section (Prototype)

The dashboard now includes an AI-driven custom section prototype:

- Section ID: `custom-html`
- Config key: `customHtml`
- Public renderer block: `components/blocks/CustomHtmlSection.tsx`
- Sanitization: `lib/security/custom-section-sanitizer.ts`
- Dashboard editor mode: raw code fields are hidden for `custom-html`; users edit only content-level controls (title/subtitle, parsed text, links, images), and section labels are derived from content/title.

Plan gating:
- Available only to `pro`, `ecommerce`, and `custom` plans with valid premium status (`active`/`trial`), plus `admin_granted`.
- Gate helper: `hasProOrHigher()` in `lib/subscription.ts`.
- Enforced in both:
  - Add Section UI (`components/dashboard/AddSectionModal.tsx`)
  - AI operation APIs (`app/api/ai/editor-command/route.ts`, `app/api/project-config/apply-operations/route.ts`)

AI operation rules:
- Raw HTML/CSS is allowed only for `update_section` on `sectionKey: "custom-html"` with fields `html` and `css`.
- All other string fields remain sanitized as plain text.
- AI-editable field allowlists are centralized in `lib/ai/section-field-schema.ts` and enforced in `lib/utils/validateOperations.ts`.
- AI prompt generation now accepts the live editor snapshot (`currentConfig`) so section positions and counts match unsaved local edits.
- Applying AI operations first syncs the snapshot to `draft_config`, then applies operations to prevent stale ordering/position issues.

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




