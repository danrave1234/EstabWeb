# EstabWeb

**EstabWeb** is a production-ready, multi-tenant SaaS platform for generating and managing industry-optimized websites. Clients redeem template codes to instantly get a fully structured site, then customize it through a live dashboard editor — all without touching code.

> **Status:** Active development · v0.1.0 · Core platform is functional end-to-end.

---

## What It Does (End-to-End Flow)

1. **Admin** builds and refines the master template in `/admin/preview`, then generates a redeemable code.
2. **Client** signs up, redeems the code in `/dashboard/onboarding` — a project is created and seeded with the template config.
3. **Client** edits content (text, images, colors, sections) via the live sidebar editor. Changes auto-save to `draft_config`.
4. **Client** submits a change request for approval.
5. **Admin** reviews and approves in `/admin/approvals` — publishing `draft_config` → `current_config` and revalidating the live site.
6. **Public site** is served at the client's subdomain (`client.estabweb.com`) or custom domain, automatically routed by middleware.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19, App Router |
| Styling | Tailwind CSS 4 |
| Auth & Database | Supabase (Auth, PostgreSQL, Storage) |
| Payments | PayMongo (Philippines — subscription & one-time) |
| AI | Google Gemini API (content suggestions) |
| Hosting | Vercel (with wildcard subdomain + custom domain support) |
| Cron | Vercel Cron Jobs (subscription renewal, keep-alive) |
| Cache | Redis / Upstash (ioredis — optional, graceful no-op when unset) |

---

## Current Features

### Admin Suite (`/admin`)
- **Dashboard** — overview of pending change requests and platform activity
- **Clients** — view and manage all client projects
- **Template Editor** — edit the master site template (DNA) with live preview
- **Codes** — generate, manage, and set redemption limits on template codes
- **Approvals** — review and approve/reject client change requests
- **Transactions** — view payment history
- **Settings** — platform-level configuration and plan limits

### Client Dashboard (`/dashboard`)
- **Genre Presets** — 20+ industry-specific presets (law firm, dental, pest control, real estate, e-commerce, etc.) each bundling a hero style, color theme, recommended sections, and full placeholder content — applied in one click during onboarding or switched anytime from the editor sidebar
- **AI-Assisted Onboarding** — client describes their business in plain text; Gemini AI auto-suggests the best genre preset and page sections to include
- **Section Library** — 40+ named page sections (services, testimonials, pricing, FAQ, gallery, coverage map, CTAs, etc.) grouped by category; client toggles and reorders them freely; Hero is always locked first
- **Live Editor** — sidebar editor with real-time iframe preview of the site
- **Section Management** — add, remove, reorder, and toggle site sections
- **Version History** — view and roll back to previous published configs
- **Domain Settings** — request a custom domain
- **Subscription Management** — upgrade plan, manage billing via PayMongo
- **Analytics Dashboard** — view all lead interactions (calls, form submissions, Messenger/Viber clicks) captured from the public site, with summary cards, breakdown bars, and a recent activity feed
- **Profile Settings** — update account details

### Public Sites (`/(sites)/[domain]`)
- Served at client subdomains or custom domains via middleware routing
- DNA-driven rendering via `SiteBlockRenderer.tsx` — JSON config → UI
- Multi-page support for paid/trial/admin-granted projects (free = single page + legal)
- Auto-generated `sitemap.xml`, `robots.txt`, structured data, and Open Graph tags
- Fallback demo mode using `config/site-data.json` when no project exists for a domain

### Platform Hub (`/(hub)`)
- Landing page, pricing, contact, legal pages (terms, privacy, cookies)
- Auth flows (login, email verification, sign out)
- Onboarding flow for new clients
- Subscribe page with PayMongo payment integration
- Success page post-payment

### API Routes
- `/api/paymongo/*` — payment links, subscriptions, webhook handler
- `/api/change-requests/*` — submit and approve content change requests
- `/api/codes/*` — redeem and validate template codes
- `/api/domain/*` — request and check custom domain status
- `/api/vercel/add-domain` — auto-register domains via Vercel API
- `/api/publish` & `/api/rollback` — publish drafts and roll back versions
- `/api/versions` — version history management
- `/api/ai/suggest` — AI-powered content suggestions via Gemini
- `/api/upload` — image upload to Supabase Storage
- `/api/cron/*` — subscription renewal and keep-alive jobs
- `/api/config` — serve site config for iframe preview
- `/api/track-lead` — lead tracking for public sites

### UI Blocks (60+)
A library of industry-specific, composable blocks including:
- **Heroes:** HeroBlock, HeroClinic, HeroDentist, HeroChiropractor, HeroCleaning, HeroPestControl, HeroPool, HeroEmergency, HeroSaas, HeroAuthority
- **Content:** FeaturesGrid, FeaturesModern, FeatureHighlightZigzag, HowItWorksSteps, StatsSection, FAQAccordion, FAQTwoColumn, BlogGrid
- **Social Proof:** ReviewsGrid, ReviewTrustBar, TrustBar, TrustBadgesGrid, TeamGrid, TeamCarousel, AwardsStrip, LogoCloud
- **Contact & CTA:** ContactForm, ContactColumns, ContactSplit, ContactVisual, ContactWithMap, FreeConsultationForm, EmergencyCTAStrip, PromoCTASection, LeadMagnetFooter, MessengerStickyCTA, FloatingCTA
- **Industry-Specific:** ACTypesGrid, AttorneyProfile, BeforeAfterGalleryGrid, BeforeAfterSlider, CommonPestsGrid, CoverageRadiusBlock, DeveloperPartnersLogos, FeaturedListingsGrid, FinancingSection, MaintenancePlans, PatientFaq, PaymentOptionsStrip, PhotoGalleryGrid, PracticeAreasGrid, PricePreviewStrip, PricingTable, ProductGrid, SafetySection, ServiceAreaMap, TreatmentProcessTimeline, WarrantyGuaranteeBlock, WhyChooseMe
- **Layout:** SimpleFooter, MinimalFooter, PromoBannerStrip, FacebookReviewEmbed

---

## Getting Started

### 1. Environment Setup
Copy `.env.local` and fill in your credentials:
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
# Optional — leave all unset to disable Redis cache
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
```

### 2. Database
Initialize your Supabase instance using the provided schema:
```bash
# Run in Supabase SQL Editor or psql
docs/supabase_schema.sql
docs/migrations/001_subscription_fields.sql
```

### 3. Run Locally
```bash
npm install
npm run dev
```

### 4. Access the Platform
| URL | Purpose |
|---|---|
| `localhost:3000` | Hub / landing page |
| `localhost:3000/admin` | Admin suite |
| `localhost:3000/dashboard` | Client dashboard |
| `localhost:3000/login` | Auth |

> For local subdomain testing, add entries to your `/etc/hosts` file (e.g., `127.0.0.1 client.localhost`).

---

## Project Structure

```
app/
  (hub)/          # Landing, pricing, auth, client dashboard
  (sites)/        # Public client sites (subdomain/custom domain routed)
  admin/          # Admin suite
  api/            # All API routes
components/
  blocks/         # 60+ composable UI blocks
  dashboard/      # Client dashboard components
  admin/          # Admin-specific components
  shared/         # Shared layout, renderer, skeleton, SEO
  landing/        # Hub landing page
  ui/             # Base UI primitives
config/           # Site config, presets, dashboard config
docs/             # Schema, migrations, roadmap docs
lib/
  cache/          # Redis cache layer (client, keys, helpers, invalidation)
  supabase/       # Supabase clients (browser, server, service-role)
  utils/          # Shared utility functions
server/           # Server-side helpers
middleware.ts     # Multi-tenant routing (subdomains + custom domains)
```

---

## Docs
- [`docs/FEATURES.md`](docs/FEATURES.md) — **Comprehensive feature documentation** — every feature, its implementation logic, and display flow (includes §5.9 Genre Presets & Section Selection)
- [`docs/roadmap-multipage-sites.md`](docs/roadmap-multipage-sites.md) — Multi-page site architecture and subscription gating
- [`docs/whitelabel-flow.md`](docs/whitelabel-flow.md) — Full white-label onboarding flow
- [`docs/PAYMONGO.md`](docs/PAYMONGO.md) — PayMongo integration details
- [`README_DEPLOY.md`](README_DEPLOY.md) — Vercel deployment guide

---

*Built for scale, performance, and architectural integrity.*
