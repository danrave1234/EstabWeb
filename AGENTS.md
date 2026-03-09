# Agent Instructions (AGENTS.md)

> [!IMPORTANT]
> **MANDATORY**: AI Agents must read this file in its entirety before starting any task. This document contains the definitive conventions and "tribal knowledge" required to maintain the integrity of the EstabWeb platform.

## Agent Responsibilities
- **Refer to this file** at the start of every session.
- **Update this file** and `README.md` whenever you introduce new architectural patterns, conventions, or significant feature workflows.
- **Follow Module Boundaries** strictly.


## Project Context
**EstabWeb** is a template-based whitelabel website builder tailored for local businesses in the Philippines. 
- **Business Model**: We create custom templates based on a potential client's business (logo, details), deploy them to a subdomain, and provide a redemption code.
- **Client Features**: Code redemption, custom domain mapping, AI section editor (auto-review & edit), AI SEO optimization, and lead/analytics tracking.
- **Subscriptions**: Basic, Pro, Ecommerce, Custom.

*Note: For standard setup, schema, and routing architecture, refer to `README.md` and `docs/FEATURES.md`.*

## Core Workflows & Conventions

### 1. Configuration Lifecycle (`draft` vs. `current`)
- Client edits in the Dashboard (`/dashboard`) always update `draft_config` first via optimistic UI updates and debounced API (`PATCH /api/project-config`).
- Publishing merges `draft_config` into `current_config` (for active subscriptions) or submits a change request for Admin approval (free plans). 
- Agents modifying the data model must update both the database schema and the TypeScript types for the `current_config`/`draft_config` JSON.

### 2. Live Preview Iframe Synchronization
- The dashboard uses a split-pane layout: Sidebar editor + iframe preview.
- The `LivePreviewProvider` synchronizes state using `postMessage` (`type: 'config-update'`). 
- **Rule**: When adding new configurable sections, ensure their config schema can be safely serialized and passed to the iframe without requiring a full page reload.

### 3. Template & Preset Management
- Global templates and genre presets are defined in `config/presets.ts` and managed via `/admin/templates`.
- **Rule**: When adding new sections or features, always provide corresponding placeholder data in the genre presets so new generated sites look complete.
- **Gym schema note**: Gym presets now include dedicated config keys for `gymPrograms`, `gymSchedule`, `gymMemberships`, `gymClassTypes`, `gymTrainers`, `gymResults`, `gymFacility`, and `gymFaq` mapped to `gym--*` section IDs. Keep `config/presets.ts`, `config/dashboard-config.ts`, section registry maps, and dashboard editor defaults in sync when changing these.

### 4. AI Integration (Section Editor & SEO)
- AI (Gemini API) is tightly integrated into the dashboard editing experience (via the "AI Tools" tab).
- It handles onboarding suggestions, SEO content generation (titles, descriptions, keywords), and automatic content generation/editing for site sections.
- **Rule**: AI operations must respect token limits and return cleanly formatted JSON that precisely matches the expected site config structure. Provide strict system prompts for the AI to prevent malformed config states.

### 5. Premium UI & Aesthetics (CRITICAL)
- **Design Standard**: The templates are the core offering. They must exude premium quality to WoW the client immediately.
- **Implementation**: Avoid generic colors. Use curated, harmonious color palettes, modern typography, glassmorphism where appropriate, and subtle micro-animations (especially hover states and scroll reveals).
- **Styling**: Tailwind CSS 4 is the primary tool. Global theme variables are housed in `app/themes.css`.

### 6. Component Boundaries & Performance
- **Server / Client Separation**: Use Server Components for data fetching. Use `"use client"` strictly for interactive islands.
- **Import Rules** (Enforced by `npm run check:boundaries`):
  - `app/api/**` must NOT import from `components/**`.
  - `components/**` must NOT import from `app/api/**`.
  - `lib/**` must NOT import from `app/**` or `components/**`.
- **Public Site Rendering**: The `SiteBlockRenderer` maps config sections to React components. All public-facing blocks must be dynamically imported (`next/dynamic` with a loading skeleton) to preserve performance.

### 7. Operational Tooling
- **Check Module Boundaries**: `npm run check:boundaries`.
- **Database Migrations**: `npm run migrate` or directly via `scripts/run-migrations.js`.
- **Symbols/Icons**: If icons appear broken, use `node scripts/fix_symbols.js`.
- **Draft Migration**: `npx tsx scripts/migrate-draft-snapshots.ts` for schema changes affecting JSON configs.

### 8. Key Configuration Files
- `config/presets.ts`: Industry-specific site starters (Genesis of all sites).
- `config/dashboard-config.ts`: Controls sidebar structure and field mappings.
- `config/plans.ts`: Subscription tier definitions and features.
- `app/themes.css`: Global design system variables.

### 9. Subscription Downgrade Lifecycle (CRITICAL)
When a paid subscription lapses (payment failure or expiry), **two code paths** run in tandem — both must stay consistent:

| Event | File | What it does |
|---|---|---|
| PayMongo `subscription.unpaid` webhook | `app/api/paymongo/webhook/route.ts` → `handleSubscriptionUnpaid()` | Immediately sets `subscription_status → free`, `subscription_plan_id → free`, `custom_domain → null`, `publish_limit → 5`, `publish_limit_daily → 1`, and removes the domain from Vercel. |
| Cron expiry sweep | `app/api/cron/renew-subscriptions/route.ts` | Catches any project with status `active`, `trial`, or `expired` whose end date has passed; applies the same full downgrade (including `subscription_plan_id → free` and publish limit reset). |

**Feature gating rules** — always gate by **both** `subscription_status` AND `subscription_plan_id`:
- `isAnalyticsAllowed()` in `lib/subscription.ts`: requires status `active` or `trial` (or `admin_granted`) **and** a paid plan ID.
- `hasAdvancedAnalytics()` in `lib/subscription.ts`: requires status `active`, `trial`, or `admin_granted` **and** plan `pro`/`ecommerce`/`custom`.
- **Rule**: Never gate features by `subscription_plan_id` alone — `plan_id` is not reset until a downgrade event fires. Always also check `subscription_status`.

**Free-tier values**: `publish_limit: 5`, `publish_limit_daily: 1`, `subscription_plan_id: 'free'`, `custom_domain: null`, `auto_renew: false`.

### 10. Documentation & Sync
- **Always update documentation**: Any change to the database schema, API contracts, or core configuration shapes **must** be reflected in `AGENTS.md`, `README.md`, and `docs/FEATURES.md` during the same task.

### 11. Auth Session Recovery (Login Resilience)
- `/login` must redirect authenticated users to the correct destination:
  - `admin` / `sub_admin` → `/admin`
  - all other authenticated users → `/dashboard`
- Middleware (`lib/supabase/middleware.ts`) is the source of truth for auth-cookie recovery:
  - if `supabase.auth.getUser()` fails on auth/admin/protected routes, clear Supabase auth cookies and recover to `/login?recovered=1`
  - if it fails while already on `/login`, clear cookies in-place and render login cleanly
- **Rule**: when adjusting auth flow, keep `middleware`, `app/(hub)/login/layout.tsx`, and `app/actions/auth.ts` redirect role checks aligned.
