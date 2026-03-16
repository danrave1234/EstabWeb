# EstabWeb — Comprehensive Feature Documentation

This document describes every major feature of the EstabWeb platform: what it does, how it is implemented, and how it is displayed to the user. It is intended for developers, contributors, and technical stakeholders who need to understand the full system end-to-end.

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Multi-Tenant Routing (Middleware)](#2-multi-tenant-routing-middleware)
3. [Authentication & Session Management](#3-authentication--session-management)
4. [Admin Suite](#4-admin-suite)
   - 4.1 [Admin Dashboard](#41-admin-dashboard)
   - 4.2 [Template Editor](#42-template-editor)
   - 4.3 [Code Generation & Management](#43-code-generation--management)
   - 4.4 [Client Management](#44-client-management)
   - 4.5 [Change Request Approvals](#45-change-request-approvals)
   - 4.6 [Transactions](#46-transactions)
   - 4.7 [Settings](#47-settings)
5. [Client Dashboard](#5-client-dashboard)
   - 5.1 [Live Site Editor](#51-live-site-editor)
   - 5.2 [Section Management](#52-section-management)
   - 5.3 [Publish & Change Request Flow](#53-publish--change-request-flow)
   - 5.4 [Version History & Rollback](#54-version-history--rollback)
   - 5.5 [Domain Settings](#55-domain-settings)
   - 5.6 [Subscription Management](#56-subscription-management)
   - 5.7 [Profile Settings](#57-profile-settings)
   - 5.8 [Analytics Dashboard](#58-analytics-dashboard)
   - 5.9 [Genre Presets & Section Selection](#59-genre-presets--section-selection)
6. [Public Client Sites](#6-public-client-sites)
   - 6.1 [Site Config Resolution](#61-site-config-resolution)
   - 6.2 [Block Rendering Pipeline](#62-block-rendering-pipeline)
   - 6.3 [Live Preview Mode](#63-live-preview-mode)
   - 6.4 [Multi-Page Support](#64-multi-page-support)
   - 6.5 [SEO & Metadata](#65-seo--metadata)
   - 6.6 [Sitemap & Robots](#66-sitemap--robots)
   - 6.7 [GEO SEO & llms.txt](#67-geo-seo--llmstxt)
7. [Platform Hub](#7-platform-hub)
   - 7.1 [Landing Page](#71-landing-page)
   - 7.2 [Pricing Page](#72-pricing-page)
   - 7.3 [Onboarding Flow](#73-onboarding-flow)
   - 7.4 [Subscribe & Payment Flow](#74-subscribe--payment-flow)
8. [API Routes](#8-api-routes)
   - 8.1 [Change Requests API](#81-change-requests-api)
   - 8.2 [Publish API](#82-publish-api)
   - 8.3 [Rollback API](#83-rollback-api)
   - 8.4 [Versions API](#84-versions-api)
   - 8.5 [Codes API](#85-codes-api)
   - 8.6 [Domain API](#86-domain-api)
   - 8.7 [PayMongo API](#87-paymongo-api)
   - 8.8 [AI Suggest API](#88-ai-suggest-api)
   - 8.9 [Upload API](#89-upload-api)
   - 8.10 [Config API](#810-config-api)
   - 8.11 [Cron Jobs](#811-cron-jobs)
   - 8.12 [Track Lead API](#812-track-lead-api)
9. [UI Block Library](#9-ui-block-library)
10. [Subscription & Plan Gating](#10-subscription--plan-gating)
11. [Database Schema Summary](#11-database-schema-summary)

---

## 1. System Architecture Overview

EstabWeb is a **multi-tenant SaaS platform** where a single Next.js application serves three distinct audiences from one codebase:

| Audience | Entry Point | Route Group |
|---|---|---|
| Platform Admin | `estabweb.com/admin` or `admin.estabweb.com` | `app/admin/` |
| Client (business owner) | `estabweb.com/dashboard` | `app/(hub)/dashboard/` |
| Public visitor | `client.estabweb.com` or `customdomain.com` | `app/(sites)/[domain]/` |

**Data flow summary:**
1. Admin creates a master template (the "DNA") and generates a redeemable code.
2. Client signs up, redeems the code → a `projects` row is created in Supabase, seeded with the template config as `current_config`.
3. Client edits their site via the dashboard editor → changes are saved to `draft_config`.
4. Client publishes (if on trial/subscription) or submits a change request (if on free plan).
5. On approval or direct publish, `draft_config` is deep-merged into `current_config`, a version snapshot is saved, and Next.js cache is revalidated.
6. Public visitors hit the client's subdomain or custom domain → middleware routes to `(sites)/[domain]` → config is fetched from DB → blocks are rendered.

---

## 2. Multi-Tenant Routing (Middleware)

**File:** `middleware.ts`

### What it does
Every incoming request passes through the middleware before hitting any route handler. It handles:
- Supabase session refresh (keeps auth cookies valid)
- Domain-based routing to the correct route group
- Preview mode header injection
- Path-based domain routing for local development

### Logic Flow

```
Request arrives
  │
  ├─ updateSession() → refresh Supabase auth cookies
  │    └─ If redirect (unauthorized) → return immediately
  │
  ├─ Parse hostname (strip port)
  │
  ├─ isRoot? (root domain, www, localhost, staging)
  │    └─ On production: if path segment is not a reserved path → 301 redirect to subdomain
  │
  ├─ isAdmin? (admin.estabweb.com or admin.*)
  │    └─ Rewrite to /admin[path]
  │
  ├─ isPathBasedDomain? (localhost dev: /clientname/... → domain = "clientname")
  │    └─ Rewrite to /(sites)/[domain]
  │
  └─ Non-root host (subdomain or custom domain)
       └─ Extract domain param → Rewrite to /[domain][path]
```

### Preview Header Injection
When `?preview=true&projectId=xxx` is present in the URL, the middleware injects:
- `x-preview-mode: true`
- `x-project-id: <id>`
- `x-request-id: <id>` (for approval review previews)

These headers are read by layouts and page components since `searchParams` is not available in layouts.

### Reserved Root Paths
The following paths are never redirected to subdomains on the root domain:
`api, admin, login, dashboard, onboarding, auth, preview, pricing, faq, terms, privacy, cookies, contact, success, sitemap.xml, robots.txt, llms.txt, llms-full.txt`

---

## 3. Authentication & Session Management

**Files:** `app/actions/auth.ts`, `app/auth/`, `lib/supabase/`

### Implementation
- Uses **Supabase Auth** (email/password + magic link).
- Session is managed via HTTP-only cookies, refreshed on every request by `updateSession()` in middleware.
- Server components use `createClient()` from `lib/supabase/server.ts` (reads cookies).
- Client components use `createBrowserClient()` from `lib/supabase/client.ts`.
- Service-role operations (webhook handlers, cron jobs) use `createServiceClient()` which bypasses RLS.

### Auth Flow
1. User visits `/login` → submits email/password.
2. Supabase returns a session → cookies are set.
3. On email sign-up, Supabase sends a verification email → user clicks link → `/auth/verify-email` confirms.
4. `/auth/signout` clears the session and redirects to `/login`.
5. OAuth callback is handled at `/api/auth/callback`.

### Role-Based Access
- Admin routes check for a specific admin user ID or role stored in Supabase.
- Client dashboard routes check that the authenticated user owns the project (enforced by both RLS policies and server-side `client_id` checks).

---

## 4. Admin Suite

**Route group:** `app/admin/`

### 4.1 Admin Dashboard

**File:** `app/admin/dashboard/page.tsx`

**What it shows:** Overview of pending change requests, recent client activity, and platform-level stats.

**Implementation:** Fetches `change_requests` rows with `status = 'pending'` from Supabase. Displays count badges and a list of pending items with links to the review page.

---

### 4.2 Template Editor

**Files:** `app/admin/template/page.tsx`, `app/admin/preview/page.tsx`

**What it does:** Allows the admin to edit the master site template — the "DNA" that all new client projects are seeded from.

**Implementation:**
- The template config is stored as a JSON object in a dedicated `templates` table (or a special admin project row).
- The editor uses the same sidebar editor component as the client dashboard, but targets the template record instead of a client project.
- Live preview is rendered in an iframe pointing to `/api/config?projectId=...&preview=true`.
- Changes are saved to `draft_config` of the template record.
- When the admin is satisfied, they can "lock" the template — this becomes the seed config for all future code redemptions.

---

### 4.3 Code Generation & Management

**File:** `app/admin/codes/page.tsx`, `app/api/codes/`

**What it does:** Admin generates redeemable one-time codes that clients use during onboarding to create their project.

**Implementation:**
- Admin specifies: template to use, redemption limit (how many times the code can be used), and optional expiry.
- A code record is inserted into the `codes` table with a randomly generated alphanumeric string.
- **Redemption** (`/api/codes/redeem`): Client submits the code → server validates it (not expired, not over limit) → creates a new `projects` row seeded with the template's config → increments the code's `redeemed_count`.
- **Validation** (`/api/codes/validate`): Checks if a code is valid before the client commits to redeeming it (used in the onboarding UI for instant feedback).

**Display:** Admin sees a table of all codes with columns: code string, template name, redeemed/limit count, status (active/expired/exhausted), created date.

---

### 4.4 Client Management

**File:** `app/admin/clients/page.tsx`

**What it does:** Lists all client projects with their status, subscription plan, subdomain, and last activity.

**Implementation:** Fetches all rows from `projects` joined with user profile data. Admin can click into a project to view its config or impersonate the preview.

---

### 4.5 Change Request Approvals

**Files:** `app/admin/approvals/page.tsx`, `app/admin/dashboard/requests/[id]/page.tsx`, `app/api/change-requests/[id]/approve/route.ts`

**What it does:** Admin reviews pending change requests submitted by clients on free plans, then approves or rejects them.

**Implementation:**
1. Admin sees a list of all `change_requests` with `status = 'pending'`.
2. Clicking a request opens the review page (`/admin/dashboard/requests/[id]`).
3. The review page renders a **side-by-side or iframe preview** of the proposed changes using the `requested_changes` snapshot.
4. Admin clicks **Approve** → `POST /api/change-requests/[id]/approve`:
   - Loads the change request's `requested_changes` snapshot.
   - Deep-merges it into the project's `current_config`.
   - Clears `draft_config`.
   - Increments `config_version`.
   - Saves a version snapshot to `project_versions`.
   - Calls `revalidatePath()` to bust the Next.js cache for the client's domain.
   - Updates the change request status to `approved`.
5. Admin clicks **Reject** → status set to `rejected`, client is notified.

---

### 4.6 Transactions

**File:** `app/admin/transactions/page.tsx`

**What it does:** Displays all payment transactions across all clients.

**Implementation:** Fetches from `transactions` or `paymongo_links` table, showing payment ID, amount, status, client, and date.

---

### 4.7 Settings

**File:** `app/admin/settings/page.tsx`

**What it does:** Platform-level configuration — default publish limits, plan definitions, feature flags.

**Implementation:** Reads/writes a `platform_settings` table or config record in Supabase.

---

## 5. Client Dashboard

**Route group:** `app/(hub)/dashboard/`

### 5.1 Live Site Editor

**Files:** `app/(hub)/dashboard/page.tsx`, `components/dashboard/`

**What it does:** The primary editing interface. Client sees their live site in an iframe on the right, and a sidebar editor on the left. Changes in the sidebar update the iframe in real time.

**Implementation:**
1. Dashboard page loads the client's project (`projects` row) including `draft_config` and `current_config`.
2. The effective config shown is `deepMerge(current_config, draft_config)` — draft changes overlay the published state.
3. The sidebar editor is a form with sections for: Brand, Hero, Features, Testimonials, Contact, etc.
4. On any field change:
   - The new value is written to a local React state (optimistic update).
   - A `postMessage` is sent to the iframe with the updated config object.
   - A debounced `PATCH /api/project-config` saves the delta to `draft_config` in the database.
5. The iframe loads `/api/config?projectId=xxx&preview=true` which returns the merged config as JSON, consumed by `LivePreviewProvider` inside the iframe.

**Display:** Split-pane layout — sidebar (left, ~380px) + iframe (right, fills remaining width). On mobile, tabs switch between editor and preview.

---

### 5.2 Section Management

**Files:** `components/dashboard/`, `config/dashboard-config.ts`

**What it does:** Client can add, remove, reorder, and toggle visibility of site sections.

**Implementation:**
- `activeSections` is an ordered array of section keys (e.g., `["hero", "features", "reviews", "contact"]`) stored in the config.
- The sidebar shows a drag-and-drop list of active sections and a palette of available sections to add.
- Adding a section appends its key to `activeSections` and seeds default data for that section.
- Removing a section removes its key from `activeSections` (data is preserved in config but not rendered).
- Reordering updates the array order -> `SiteBlockRenderer` renders sections in that exact order.

- Custom AI section support uses section ID custom-html mapped to config key customHtml.
- custom-html is gated to Pro+ (pro, ecommerce, custom) and admin_granted, with guards applied in dashboard UI and AI APIs.
- Interactive pricing comparison variant uses section ID `pricing--comparison` mapped to config key `pricingComparisonTable` (legacy alias: `pricing-comparison-table`).
- Animated testimonials variant uses section ID `testimonials--animated` mapped to config key `animatedTestimonials`.
- Pricing section comparison variant uses section ID `pricing--feature-comparison` mapped to config key `pricingSectionComparison` (legacy alias: `pricing-section-with-comparison`).
- Hero showcase variant uses section ID `hero--showcase` mapped to config key `heroShowcase` (legacy alias: `hero-showcase`).
- Services bento variant uses section ID `services--bento` mapped to config key `featuresBento` (legacy alias: `services-bento`).
- Community testimonials variant uses section ID `testimonials--community` mapped to config key `testimonialsCommunity`. Supports star ratings, avatar images, dot navigation, slide animation, and optional logo cloud (trustedCompanies).
- Background beams CTA variant uses section ID `cta--beams` mapped to config key `ctaBeams`. The animated SVG beam primitive lives in `components/ui/background-beams.tsx`.
- Gallery carousel variant uses section ID gallery--carousel mapped to config key gallery4. It renders horizontally scrolling project cards with title, description, CTA link, and image items.
- Feature steps variant uses section ID `features--steps` mapped to config key `featureSteps`. The animated step-by-step walkthrough primitive lives in `components/ui/feature-section.tsx`. Supports an image panel that transitions between steps with progress-based auto-rotation.

---

### 5.3 Publish & Change Request Flow

**Files:** `app/api/publish/route.ts`, `app/api/change-requests/route.ts`

**What it does:** Two paths to get draft changes live, depending on the client's plan.

#### Direct Publish (Trial / Subscription)
- Client clicks **Publish** → `POST /api/publish`.
- Server checks `canPublishDirectly(project)` — requires active trial or subscription.
- Server checks `canPublishNow(project)` — enforces period limit (default: 10/30 days) and daily limit (default: 3/day).
- If allowed: `deepMerge(current_config, draft_config)` → saved as new `current_config`, `draft_config` cleared, version snapshot created, Next.js cache revalidated.
- Response includes remaining publish quota for the period and day.

#### Change Request (Free Plan)
- Client clicks **Submit for Approval** → `POST /api/change-requests`.
- Server snapshots the current `draft_config` and inserts a `change_requests` row with `status = 'pending'`.
- Only one pending request is allowed per project at a time.
- Admin reviews and approves (see §4.5).

---

### 5.4 Version History & Rollback

**Files:** `app/api/versions/route.ts`, `app/api/rollback/route.ts`

**What it does:** Every publish creates a version snapshot. Client can view history and roll back to any previous version.

**Implementation:**
- On every publish, a row is inserted into `project_versions` with `{ project_id, version, snapshot }`.
- `GET /api/versions?projectId=xxx` returns all version rows ordered by version number descending.
- `POST /api/rollback` with `{ projectId, version }`: loads the snapshot for that version, sets it as the new `current_config`, clears `draft_config`, increments `config_version`, saves a new version snapshot, and revalidates the cache.

**Display:** A timeline/list in the dashboard showing version number, publish date, and a "Restore" button per entry.

---

### 5.5 Domain Settings

**Files:** `app/api/domain/`, `app/api/vercel/add-domain/route.ts`

**What it does:** Client can request a custom domain (e.g., `www.mybusiness.com`) to replace their subdomain.

**Implementation:**
1. Client submits their domain via `POST /api/domain/request`.
2. Server stores the requested domain in `projects.custom_domain` with `domain_status = 'pending'`.
3. Admin or automated process calls `POST /api/vercel/add-domain` which hits the Vercel API to register the domain on the project.
4. Client is instructed to add a CNAME record pointing to `cname.vercel-dns.com`.
5. `GET /api/domain/status` checks Vercel's API for DNS verification status and returns it to the dashboard.
6. Once verified, `domain_status` is set to `active` and the middleware begins routing that hostname to the client's site.

**Subscription gate:** Custom domains require an active paid subscription. If the subscription lapses, the site redirects from the custom domain back to the subdomain.

---

### 5.6 Subscription Management

**Files:** `app/(hub)/subscribe/[projectId]/page.tsx`, `app/api/paymongo/`, `app/actions/subscription.ts`

**What it does:** Client can upgrade from free to a paid plan via PayMongo.

**Implementation:** See §8.7 (PayMongo API) for full payment flow. The dashboard shows current plan, subscription end date, publish quota usage, and an **Upgrade** button that navigates to `/subscribe/[projectId]`.

---

### 5.7 Profile Settings

**File:** `app/(hub)/dashboard/profile/page.tsx`, `app/actions/profile.ts`

**What it does:** Client updates their display name, email, and password.

**Implementation:** Uses Supabase Auth `updateUser()` for email/password changes. Profile metadata (name, avatar) is stored in a `profiles` table linked to `auth.users.id`.

---

### 5.8 Analytics Dashboard

**File:** `app/(hub)/dashboard/analytics/page.tsx`
**API:** `app/api/track-lead/route.ts`
**Table:** `project_leads`

#### What it does
Provides the client with a real-time view of all lead interactions captured from their public site — calls, form submissions, Messenger clicks, and Viber clicks — displayed as summary cards, a proportional breakdown bar, and a chronological activity feed.

#### How leads are captured
Every interactive CTA block on the public site (e.g., `FloatingCTA`, `MessengerStickyCTA`, `ContactForm`, `FreeConsultationForm`) fires a `POST /api/track-lead` request when a visitor interacts with it.

**API body:**
```json
{
  "type": "call" | "messenger" | "form" | "viber",
  "project_id": "<uuid>",
  "metadata": {
    "name": "...",
    "email": "...",
    "phone": "...",
    "referrer": "https://...",
    "utm_source": "google"
  }
}
```

**API logic (`/api/track-lead`):**
1. Validates `type` is one of the four allowed values.
2. Validates `project_id` is present.
3. Inserts a row into `project_leads` with `{ project_id, type, metadata }`.
4. No auth required — public endpoint (visitors are not logged in).

#### Analytics page logic
1. Authenticates the client via Supabase session — redirects to `/login` if unauthenticated.
2. Requires `?projectId=<uuid>` query param — redirects to `/dashboard` if missing.
3. Verifies the project belongs to the authenticated user (`client_id = user.id`).
4. Fetches all rows from `project_leads` for the project, ordered by `created_at DESC`.
5. Computes counts per type client-side from the fetched array.

#### Display

| UI Element | Description |
|---|---|
| **Summary Cards (4)** | Total Leads, Calls, Form Submissions, Messages — each with icon, count, and color-coded background |
| **Lead Breakdown Bar** | Horizontal progress bars showing each type's share of total leads (only types with >0 shown) |
| **Recent Activity Table** | Last 50 leads — icon, contact name/email/phone, traffic source (UTM or referrer hostname), type badge, date |
| **Empty State** | Shown when no leads exist yet, with instructional copy |

#### Traffic source resolution
For each lead row, the source label is resolved as:
1. `metadata.utm_source` if present
2. Otherwise, hostname extracted from `metadata.referrer` via `new URL(referrer).hostname`
3. Falls back to raw referrer string if URL parsing fails
4. Omitted entirely if neither is available

---

### 5.9 Genre Presets & Section Selection

**Files:** `config/presets.ts`, `components/dashboard/OnboardingPage.tsx`, `components/shared/SiteEditorSidebar.tsx`, `app/api/project-config/apply-preset/route.ts`

#### What it does
EstabWeb ships with a library of **20+ industry-specific genre presets** — pre-configured site templates tailored to specific business types (law firms, dental clinics, pest control, real estate, e-commerce, etc.). Each preset defines the hero style, color theme, recommended page sections, and full placeholder content so a client's site looks professional and industry-appropriate from the very first load.

Clients choose (or are AI-suggested) a preset during onboarding, and can re-apply or switch presets at any time from the dashboard editor sidebar.

---

#### Genre Presets (`GENRE_PRESETS`)

**File:** `config/presets.ts`

Each entry in `GENRE_PRESETS` is a `GenrePreset` object with:

| Field | Type | Description |
|---|---|---|
| `theme` | `ThemeKey` | Hero component variant to use (e.g. `"dentist"`, `"chiropractor"`, `"lawyer"`) |
| `colorTheme` | `ColorThemeKey` | Color palette applied site-wide (e.g. `"surgeon"`, `"justice"`, `"eco-clean"`) |
| `activeSections` | `string[]` | Ordered list of section IDs to show on the site by default |
| `content` | `PresetContent` | Full placeholder content for every block (hero text, features, testimonials, contact info, etc.) |

**Available genres (20+):**

| Genre Key | Display Name |
|---|---|
| `lawyer` | Law Firm |
| `pest_control` | Pest Control |
| `hvac` | HVAC / Aircon |
| `dentist` | Dental Clinic |
| `chiropractor` | Chiropractic |
| `clinic` | Medical Clinic |
| `cleaning` | Cleaning Services |
| `pool` | Pool Services |
| `startup` | SaaS / Startup |
| `real_estate` | Real Estate (PH) |
| `car_detailing` | Car Detailing |
| `construction` | Construction (PH) |
| `water_refilling` | Water Refilling (PH) |
| `salon_aesthetic` | Salon / Aesthetic |
| `private_school` | Private School (PH) |
| `ecommerce` | E-commerce Shop |
| `personal_portfolio` | Personal Portfolio |
| `photobooth` | Photobooth |
| `gym_boutique` | Gym Boutique |
| `gym_hardcore` | Gym Hardcore |
| `gym_functional` | Gym Functional |

**Color themes (40+):** `partner`, `justice`, `modern`, `frost-fire`, `reliable`, `eco-clean`, `surgeon`, `wellness`, `holistic`, `clinical-gold`, `red-crimson`, `cyan-ocean`, `luxury-black-gold`, `nebula`, `flow`, `mono`, and many more — each a full Tailwind-compatible palette applied globally.

---

#### Available Page Sections (`ALL_SECTIONS`)

**File:** `components/dashboard/OnboardingPage.tsx`

Clients can include any combination of **40+ named sections** on their site. Sections are grouped by category:

| Category | Sections |
|---|---|
| **Services** | Hero (locked), Services, Services Grid, Services Modern, Practice Areas, Product Types, Common Issues |
| **Gym** | Gym Programs (`gym--programs`), Gym Schedule (`gym--schedule`), Membership Tiers (`gym--memberships`), Class Types (`gym--class-types`), Gym Trainers (`gym--trainers`), Results Stories (`gym--results`), Facility Highlights (`gym--facility`), Gym FAQ (`gym--faq`) |
| **Trust** | Testimonials, Review Bar, Reviews Grid, Facebook Reviews, Trust & Certs, Certifications, Trust Badges, Warranty/Guarantee, Safety |
| **Contact** | Contact, Contact with Map |
| **Pricing** | Pricing, Packages & Pricing, Price Preview, Financing |
| **Info** | FAQ, FAQ Accordion, FAQ Two Column, Stats/Numbers, Comparison |
| **Team** | Team Carousel, Team Grid, Why Choose Us |
| **Content** | Blog/News, Case Studies, Featured Listings |
| **Media** | Gallery, Before & After, Before/After Slider |
| **Coverage** | Coverage Map |
| **Process** | How It Works, Treatment Process |
| **CTA** | Emergency CTA, Sticky CTA, Promo CTA, Booking, Free Consultation, Announcement Bar |

The **Hero** section is always locked as the first section and cannot be removed.

---

#### Onboarding Flow (3 Steps)

**File:** `components/dashboard/OnboardingPage.tsx`

```
Step 1 — AI Business Analysis
  │
  ├─ Client types a description of their business
  ├─ POST /api/ai/suggest-industry → Gemini analyzes the description
  ├─ Returns: { industry, presetKey, sections[] }
  └─ UI auto-selects the suggested genre and highlights recommended sections

Step 2 — Genre Preset Selection
  │
  ├─ Grid of all genre cards (icon + label) from GENRE_PRESETS
  ├─ AI-suggested genre is highlighted with a "Recommended" badge
  ├─ Client clicks a genre card to select it
  └─ Preview of the preset's activeSections is shown below

Step 3 — Section Customization
  │
  ├─ Full list of ALL_SECTIONS rendered as toggle cards
  ├─ Preset's default activeSections are pre-checked
  ├─ AI-suggested sections are highlighted
  ├─ Hero is locked (always on, always first)
  ├─ Client toggles sections on/off and reorders as desired
  └─ "Launch My Site" → POST /api/project-config/apply-preset
```

---

#### Apply Preset API

**File:** `app/api/project-config/apply-preset/route.ts`

**Method:** `POST`

**Body:**
```json
{
  "presetKey": "dentist",
  "projectId": "<uuid>",
  "customSections": ["hero", "features", "testimonials", "contact-with-map"]
}
```

**Logic:**
1. Authenticates the user via Supabase session.
2. Looks up `GENRE_PRESETS[presetKey]` — returns 400 if not found.
3. Verifies the project belongs to the authenticated user.
4. Builds a new config by deep-merging the preset's `content` and `colorTheme` into the base config.
5. Sets `activeSections` to `customSections` (if provided) or the preset's default `activeSections`.
6. Sets `theme` to the preset's `theme` value.
7. Writes the merged config to both `current_config` and `draft_config` on the project row.
8. Auto-generates and assigns a subdomain if the project doesn't have one yet.
9. Registers the subdomain with Vercel via `addSubdomainToVercel()`.
10. Returns `{ success: true, subdomain }`.

---

#### Re-applying Presets from the Editor Sidebar

**File:** `components/shared/SiteEditorSidebar.tsx`

After onboarding, clients can switch to a different genre preset at any time from the **Style** tab of the editor sidebar:
- A dropdown/grid of all `GENRE_PRESETS` entries is shown.
- Selecting a new preset calls `POST /api/project-config/apply-preset` with the new key.
- The live preview iframe updates immediately to reflect the new theme, color palette, and section layout.
- Existing custom content (text, images) is preserved where field keys match; only theme/color/sections are overwritten by the preset defaults.

---

## 6. Public Client Sites

**Route group:** `app/(sites)/[domain]/`

### 6.1 Site Config Resolution

**File:** `lib/utils/site-config.ts`

**Logic:**
```
getSiteConfigWithProject(domain, headers)
  │
  ├─ Is preview mode? (x-preview-mode header)
  │    └─ Fetch project by projectId header → return draft_config merged over current_config
  │
  ├─ Does domain contain a dot? (custom domain)
  │    └─ Query projects WHERE custom_domain = domain AND domain_status = 'active'
  │
  ├─ Otherwise treat as subdomain
  │    └─ Query projects WHERE subdomain = domain
  │
  ├─ Project found?
  │    └─ Return project.current_config + project metadata
  │
  └─ No project found?
       └─ Fallback: load config/site-data.json (demo mode)
```

---

### 6.2 Block Rendering Pipeline

**Files:** `components/shared/SiteTemplate.tsx`, `components/shared/SiteBlockRenderer.tsx`

**Flow:**
```
SiteTemplate
  └─ useLivePreview() → if preview postMessage data exists, use it; else use server data
  └─ SiteBlockRenderer(data)
       │
       ├─ Destructure all config fields (theme, activeSections, brand, hero, features, ...)
       ├─ Build props objects for each block type
       ├─ HERO_BY_THEME map: theme string → specific Hero component
       │    e.g. "chiropractor" → <HeroChiropractor>, "dentist" → <HeroDentist>
       │    fallback → <HeroBlock> (generic)
       │
       └─ Iterate activeSections array in order:
            for each section key:
              render the matching block component with its props
              (all blocks are lazy-loaded via dynamicWithSkeleton for performance)
```

**All block components** are dynamically imported with `next/dynamic` + a skeleton placeholder matching the block's approximate height. This ensures fast initial page load (no blocking JS) and smooth loading states.

---

### 6.3 Live Preview Mode

**Files:** `components/shared/LivePreviewProvider.tsx`, `app/(hub)/dashboard/`

**What it does:** When the client dashboard iframe loads the site with `?preview=true`, the site listens for `postMessage` events from the parent dashboard window. Any config change in the sidebar is instantly reflected in the iframe without a page reload.

**Implementation:**
1. `LivePreviewProvider` is a React context provider that wraps `SiteTemplate` in preview mode.
2. It registers a `window.addEventListener('message', ...)` listener.
3. When a message with `type: 'config-update'` arrives, it updates the context state with the new config.
4. `SiteTemplate` reads from `useLivePreview()` — if context has data, it overrides the server-fetched data.
5. The dashboard sends `postMessage` on every debounced config change.

---

### 6.4 Multi-Page Support

**Files:** `app/(sites)/[domain]/[slug]/page.tsx`, `lib/utils/site-pages.ts`

**What it does:** Paid/trial/admin-granted projects can have multiple pages (e.g., `/about`, `/services`, `/blog`). Free projects are limited to the home page plus legal pages.

**Implementation:**
- Pages are stored as an array in `config.pages`: `[{ slug: "", label: "Home", activeSections: [...], seo: {...} }, { slug: "about", ... }]`
- `normalizePages()` ensures the home page (slug `""`) always exists.
- `getMaxPagesForProject(project, planLimits)` returns the page limit based on subscription status.
- The `[slug]` route loads the matching page's `activeSections` and `seo` from the pages array.
- Legal pages (`privacy`, `terms`, `cookies`) are always available regardless of plan.

---
### 6.5 SEO & Metadata

**Files:** `app/(sites)/[domain]/page.tsx`, `app/(sites)/[domain]/[slug]/page.tsx`, `app/(sites)/[domain]/layout.tsx`

**What it does:** Each public site page gets fully dynamic Open Graph, Twitter Card, and standard meta tags derived from the site config.

**Logic:**
- Title: `seo.title` -> page label -> `hero.title` -> `features.title` -> `brand.name + " | Professional Website"`
- Description: `seo.description` -> `hero.subtitle` -> `contact.tagline` -> fallback string
- Keywords: `seo.keywords` array, or auto-built from brand name, theme, hero text (deduped, max 12)
- OG image: `brand.logoUrl`
- Favicon: `brand.favicon` -> `brand.logoUrl` -> `/Logo.png`
- `metadataBase` is set to `https://{host}` so relative URLs resolve correctly per domain.
- The site layout injects linked `WebSite` + `Organization` JSON-LD for stronger entity clarity in AI and search systems.

---

### 6.6 Sitemap & Robots

**Files:** `app/sitemap.ts`, `app/robots.ts`, `app/(sites)/[domain]/sitemap.xml/route.ts`, `app/(sites)/[domain]/robots.txt/route.ts`

**What it does:** Both the hub domain and client domains expose crawl directives and sitemap entries with host-aware URLs.

**Implementation:**
- `sitemap.xml`: Uses project config, plan limits, and page-level noindex flags to emit canonical URLs.
- `robots.txt`: Uses centralized crawler policy from `lib/seo/ai-crawlers.ts`, including explicit AI crawler directives and sitemap links.
- Crawler policy mode is controlled by env `GEO_CRAWLER_POLICY_MODE`:
  - `max-visibility` (default): broad AI crawler allowance
  - `training-restricted`: blocks training/discovery-focused crawlers while keeping core search-answer crawlers
- Tenant routes are served under the `[domain]` segment; root-domain routes are served from app-level metadata routes.

---

### 6.7 GEO SEO & llms.txt

**Files:** `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `app/(sites)/[domain]/llms.txt/route.ts`, `app/(sites)/[domain]/llms-full.txt/route.ts`, `lib/seo/llms.ts`, `lib/seo/hub-llms.ts`, `lib/seo/tenant-llms.ts`

**What it does:** Publishes `llms.txt` and `llms-full.txt` for hub and tenant domains so AI systems can parse page inventories, business facts, and contact details from a stable machine-readable text file.

**Implementation:**
- Hub llms files are built from marketing-site public pages and product facts.
- Tenant llms files are built from page config (`pages`), legal routes, plan-aware page limits, and available contact/service signals.
- `llms.txt` is concise; `llms-full.txt` includes richer per-page descriptions.
- Outputs are served as text and cached with short TTLs.

---

## 7. Platform Hub

**Route group:** `app/(hub)/`

### 7.1 Landing Page

**File:** `app/(hub)/page.tsx`, `components/landing/`

The public-facing marketing page for EstabWeb itself. Uses the same block components as client sites but with hardcoded EstabWeb content.

---

### 7.2 Pricing Page

**File:** `app/(hub)/pricing/page.tsx`

Displays location-aware plan tiers with feature comparison. CTA buttons link to `/subscribe/[projectId]` for authenticated clients or `/login` for visitors. The copy also makes it explicit that if a client needs a fully custom design and end-to-end build (beyond the standard managed plans and templates), they can reach out via the `/contact` page to scope a bespoke project.

---

### 7.3 Onboarding Flow

**File:** `app/(hub)/onboarding/page.tsx`

**What it does:** New clients go through a guided flow after signing up:
1. Enter their redemption code.
2. Code is validated via `GET /api/codes/validate`.
3. On confirmation, `POST /api/codes/redeem` creates the project.
4. Client is redirected to `/dashboard` with their new project ready.

---

### 7.4 Subscribe & Payment Flow

**Files:** `app/(hub)/subscribe/[projectId]/page.tsx`, `app/(hub)/success/page.tsx`

**Flow:**
1. Client visits `/subscribe/[projectId]`.
2. Page calls `POST /api/paymongo/create-link` → creates a PayMongo payment link with `metadata.project_id`.
3. Client is redirected to the PayMongo-hosted payment page.
4. On payment success, PayMongo sends a webhook to `POST /api/paymongo/webhook`.
5. Webhook verifies the signature, extracts `project_id` from metadata, updates `projects.subscription_status = 'active'`, sets `subscription_ends_at`, and grants publish limits.
6. Client is redirected to `/success` which shows a confirmation and link back to dashboard.

---

## 8. API Routes

All API routes are under `app/api/` and use Next.js Route Handlers.

### 8.1 Change Requests API

**`POST /api/change-requests`**
- Auth: required (client)
- Body: `{ projectId }`
- Logic: Snapshots `draft_config`, inserts `change_requests` row with `status = 'pending'`. Rejects if a pending request already exists.

**`POST /api/change-requests/[id]/approve`**
- Auth: required (admin)
- Logic: Deep-merges snapshot into `current_config`, clears draft, increments version, saves to `project_versions`, revalidates Next.js cache.

---

### 8.2 Publish API

**`POST /api/publish`**
- Auth: required (client, must own project)
- Body: `{ projectId }`
- Guards: `canPublishDirectly()` (requires trial/subscription), `canPublishNow()` (period + daily limits)
- Logic: Deep-merges draft into current, clears draft, increments version, saves snapshot, revalidates all pages for the domain.
- Response: `{ success, version, publishCount, remaining, remainingToday }`

---

### 8.3 Rollback API

**`POST /api/rollback`**
- Auth: required (client)
- Body: `{ projectId, version }`
- Logic: Loads snapshot from `project_versions`, sets as new `current_config`, clears draft, increments version, revalidates cache.

---

### 8.4 Versions API

**`GET /api/versions?projectId=xxx`**
- Auth: required (client)
- Returns: Array of `{ version, created_at, snapshot }` ordered newest first.

---

### 8.5 Codes API

**`POST /api/codes/redeem`** — Redeems a code, creates a project seeded with template config.

**`GET /api/codes/validate?code=xxx`** — Checks if a code is valid (not expired, not exhausted) without consuming it.

**`GET/POST /api/codes`** — Admin: list all codes / create a new code.

---

### 8.6 Domain API

**`POST /api/domain/request`** — Client requests a custom domain. Stores in `projects.custom_domain`.

**`GET /api/domain/status`** — Checks Vercel API for DNS verification status of the client's custom domain.

**`POST /api/vercel/add-domain`** — Registers a domain on the Vercel project via Vercel REST API using `VERCEL_API_TOKEN`.

---

### 8.7 PayMongo API

**`POST /api/paymongo/create-link`**
- Creates a PayMongo payment link with `metadata.project_id` embedded.
- Returns the checkout URL for redirect.

**`POST /api/paymongo/setup-subscription`**
- Sets up a recurring subscription payment method via PayMongo's subscription API.

**`POST /api/paymongo/attach-payment-method`**
- Attaches a payment method to a payment intent for subscription setup.

**`POST /api/paymongo/webhook`**
- Verifies HMAC signature using `PAYMONGO_WEBHOOK_SECRET`.
- Handles events: `payment.paid`, `link.payment.paid`, `payment_intent.succeeded`.
- Extracts `project_id` from metadata (with multiple fallback strategies: metadata → link DB lookup → payment API fetch).
- On success: sets `subscription_status = 'active'`, `subscription_ends_at`, `publish_limit`, `publish_limit_daily`.

---

### 8.8 AI Suggest API

**`POST /api/ai/suggest`**
- Auth: required
- Body: `{ section, currentContent, businessType }`
- Logic: Sends a structured prompt to Google Gemini API asking for improved copy for the specified section.
- Returns: `{ suggestion: string }`

---

### 8.9 Upload API

**`POST /api/upload`**
- Auth: required
- Body: `FormData` with `file` field
- Logic: Uploads the file to Supabase Storage under the client's project folder. Returns the public URL.
- Used by: image fields in the sidebar editor (logo, hero background, team photos, etc.)

---

### 8.10 Config API

**`GET /api/config?projectId=xxx&preview=true`**
- Returns the merged config (current + draft) for a project as JSON.
- Used by the dashboard iframe to load the live preview.
- Auth: required (must own project).

**`PATCH /api/project-config`**
- Saves a partial config delta to `draft_config` (deep-merged).
- Called on every debounced editor change.

**`POST /api/project-config/apply-preset`**
- Applies a full preset config (from `config/presets/`) to the project's draft.

**`POST /api/ai/editor-command`**
- Generates structured AI edit operations from dashboard prompts.
- Enforces plan-gated section availability and blocks custom-html operations for non-Pro+ projects.

**`POST /api/project-config/apply-operations`**
- Applies validated AI operations to project draft_config.
- Re-validates on server and rejects custom-html operations for non-Pro+ projects.

---

### 8.11 Cron Jobs

**`GET /api/cron/renew-subscriptions`**
- Protected by `Authorization: Bearer {CRON_SECRET}` header.
- Runs daily (configured in `vercel.json`).
- Logic: Finds all projects where `subscription_ends_at < now` and `subscription_status = 'active'` → attempts renewal via PayMongo → updates status accordingly.

**`GET /api/cron/keep-alive`**
- Runs periodically.
- Executes a lightweight query against Supabase to prevent the free-tier database from sleeping.

---

### 8.12 Site Status API

**`PATCH /api/project/[id]/site-status`** *(Client-owned projects)*
- Auth: required (must own project)
- Body: `{ status: 'active' | 'disabled' | 'archived', reason?: string }`
- Allowed client transitions: `active ↔ disabled`, `active → archived`
- Restriction: clients cannot restore from `archived` (admin-only)
- Side effect: archiving removes custom domain from Vercel and clears `custom_domain`
- Writes audit log entry (`site_disabled` / `site_enabled` / `site_archived`)

**`PATCH /api/admin/projects/[id]/site-status`** *(Admin only)*
- Auth: requires `admin` or `sub_admin` role
- Body: `{ status: 'active' | 'disabled' | 'archived', reason?: string }`
- Allows all status transitions including restoring archived sites
- Uses service client to bypass RLS for cross-user project access
- Writes audit log entry (restore from archive logs as `site_restored`)

**`DELETE /api/admin/projects/[id]/site-status`** *(Admin only — irreversible)*
- Auth: requires `admin` or `sub_admin` role
- Permanently hard-deletes the project row
- Removes custom domain from Vercel first
- Writes `site_deleted` audit log entry before deletion

**Public rendering:**
- `app/(sites)/[domain]/page.tsx` checks `project.site_status` and renders `components/shared/SiteOffline.tsx` for `disabled` or `archived` sites
- Preview mode (`x-preview-mode: true`) always bypasses the status gate

**Database columns (migration `010_add_site_status.sql`):**
- `site_status text NOT NULL DEFAULT 'active' CHECK (site_status IN ('active','disabled','archived'))`
- `site_status_updated_at timestamptz`
- `site_status_reason text`

---

### 8.13 Track Lead API

**`POST /api/track-lead`**
- No auth required (public endpoint).
- Body: `{ projectId, name, email, phone, source }`
- Logic: Inserts a row into `leads` table linked to the project.
- Used by: `ContactForm`, `FreeConsultationForm`, and `LeadMagnetFooter` blocks on public sites.

---

## 9. UI Block Library

All blocks live in `components/blocks/`. They are pure presentational React components that receive typed props. They are registered in `SiteBlockRenderer` and lazy-loaded via `dynamicWithSkeleton`.

### Hero Blocks
| Block | Theme | Description |
|---|---|---|
| `HeroBlock` | generic | Universal hero with background image, title, subtitle, dual CTA |
| `HeroAuthority` | authority/personal brand | Large portrait + credentials + CTA |
| `HeroSaas` | saas | Product screenshot mockup + headline + CTA |
| `HeroChiropractor` | chiropractor | Video/image background + pain-relief messaging |
| `HeroDentist` | dentist | Split layout with patient image + appointment CTA |
| `HeroClinic` | clinic | Medical center hero with "Find a Doctor" CTA |
| `HeroCleaning` | cleaning | Bright lifestyle image + free estimate CTA |
| `HeroPool` | pool | Water imagery + inspection scheduling CTA |
| `HeroPestControl` | pest-control | Urgency-focused + emergency CTA |
| `HeroGym` | gym | Multi-style gym hero (`hero.layout`: boutique, hardcore, functional) |
| `HeroEmergency` | emergency | High-contrast, phone number prominent |
| `HeroShowcase` | showcase | Trust-first hero with proof points + metrics (`hero--showcase`) |

### Content Blocks
| Block | Description |
|---|---|
| `FeaturesGrid` | Icon + title + description grid (3–4 columns) |
| `FeaturesBento` | Bento-style service cards for modern landing sections (`services--bento`) |
| `FeaturesModern` | Alternating image/text feature rows |
| `FeatureHighlightZigzag` | Zigzag layout for feature highlights |
| `HowItWorksSteps` | Numbered step-by-step process |
| `StatsSection` | Large number stats with labels |
| `FAQAccordion` | Expandable FAQ list |
| `FAQTwoColumn` | Two-column FAQ layout |
| `BlogGrid` | Card grid of blog post previews |
| `PricingTable` | Plan comparison table with CTA |
| `PricingComparisonTable` | Interactive feature matrix with monthly/yearly toggle |
| `PricingSectionWithComparisonBlock` | Static pricing cards plus feature comparison grid (`pricing--feature-comparison`) |
| `PricePreviewStrip` | Compact horizontal pricing strip |
| `MaintenancePlans` | Service plan cards (pool/cleaning) |
| `CustomHtmlSection` | AI-generated custom HTML/CSS block (`custom-html`, Pro+) |
| `GymPrograms` | Program cards for gym tracks/coaches (`gym--programs`) |
| `GymClassSchedule` | Weekly class matrix by day/time (`gym--schedule`) |
| `GymMembershipTiers` | Membership pricing cards with perks/CTA (`gym--memberships`) |
| `GymClassTypes` | Class format cards with duration and level (`gym--class-types`) |
| `GymTrainers` | Coach profile cards with specialization (`gym--trainers`) |
| `GymResultsStories` | Transformation stories with before/after (`gym--results`) |
| `GymFacilityHighlights` | Facility/equipment highlights and amenities (`gym--facility`) |
| `GymFaq` | Gym-specific accordion FAQ (`gym--faq`) |

### Social Proof Blocks
| Block | Description |
|---|---|
| `ReviewsGrid` | Star-rated review cards grid |
| `ReviewTrustBar` | Compact horizontal trust/review bar |
| `AnimatedTestimonialsBlock` | Stacked-photo animated testimonial carousel (`testimonials--animated`) |
| `TrustBar` | Logo + text trust indicators |
| `TrustBadgesGrid` | Certification/badge grid |
| `TeamGrid` | Staff photo + name + role grid |
| `TeamCarousel` | Scrollable team member carousel |
| `AwardsStrip` | Horizontal awards/recognition strip |
| `LogoCloud` | Partner/client logo grid |
| `FacebookReviewEmbed` | Embedded Facebook review widget |

### Contact & CTA Blocks
| Block | Description |
|---|---|
| `ContactForm` | Standard contact form (name, email, phone, message) |
| `ContactColumns` | Multi-column contact info layout |
| `ContactSplit` | Split layout: form left, info right |
| `ContactVisual` | Full-bleed image background contact section |
| `ContactWithMap` | Contact form + embedded map |
| `FreeConsultationForm` | Consultation booking form |
| `EmergencyCTAStrip` | High-urgency phone CTA banner |
| `PromoCTASection` | Promotional offer + CTA |
| `LeadMagnetFooter` | Footer with email capture form |
| `MessengerStickyCTA` | Sticky Facebook Messenger button |
| `FloatingCTA` | Floating action button (phone/chat) |

### Industry-Specific Blocks
| Block | Industry |
|---|---|
| `ACTypesGrid` | HVAC / Air Conditioning |
| `AttorneyProfile` | Legal |
| `BeforeAfterGalleryGrid` | Cleaning / Pest Control |
| `BeforeAfterSlider` | Cleaning / Renovation |
| `CommonPestsGrid` | Pest Control |
| `CoverageRadiusBlock` | Service area businesses |
| `DeveloperPartnersLogos` | Real Estate |
| `FeaturedListingsGrid` | Real Estate |
| `FinancingSection` | Real Estate |
| `PatientFaq` | Medical / Dental |
| `PaymentOptionsStrip` | Philippines-specific payment methods |
| `PhotoGalleryGrid` | Any visual service |
| `PracticeAreasGrid` | Legal |
| `ProductGrid` | E-commerce / retail |
| `SafetySection` | Pest Control |
| `ServiceAreaMap` | Local service businesses |
| `TreatmentProcessTimeline` | Pest Control / Medical |
| `WarrantyGuaranteeBlock` | Pest Control / Home Services |
| `WhyChooseMe` | Personal brand / freelancer |

### Layout Blocks
| Block | Description |
|---|---|
| `SimpleFooter` | Standard footer with links and copyright |
| `MinimalFooter` | Single-line minimal footer |
| `PromoBannerStrip` | Top-of-page promotional banner |
| `Header` | Site navigation header (shared, not in activeSections). Supports `headerStyle` variants: `"solid"`, `"floating"`, `"tubelight"` (Tubelight navbar layout), and `"megamenu"` (dropdown megamenu with icons). |

---

## 10. Subscription & Plan Gating

**Files:** `lib/subscription.ts`, `lib/utils/site-pages.ts`

### Plan States
| State | `subscription_status` | Capabilities |
|---|---|---|
| Free | `null` / `free` | Single page, change requests only (no direct publish), no custom domain |
| Trial | `trial` (within `trial_ends_at`) | Multi-page, direct publish (with limits), no custom domain |
| Active | `active` (within `subscription_ends_at`) | Multi-page, direct publish (with limits), custom domain |
| Lapsed | `active` but past `subscription_ends_at` | Reverts to free capabilities; custom domain redirects to subdomain |

### Publish Limits
- `publish_limit` — max publishes per 30-day period (default: 10)
- `publish_limit_daily` — max publishes per day (default: 3)
- `publish_count` — current period count (resets when period rolls over)
- `publish_count_today` — today's count (resets on new day)

### Page Limits
- `getMaxPagesForProject()` returns the allowed number of non-legal pages based on plan.
- Free: 1 page. Trial/Active: determined by `plan_limits` table (admin-configurable).
- Legal pages (`privacy`, `terms`, `cookies`) are always unlimited.


### Pro+ Custom HTML Gate
- Gate helper: hasProOrHigher() in lib/subscription.ts.
- Requires status active/trial plus plan ID pro/ecommerce/custom (or admin_granted).
- Enforced in AddSectionModal, AiEditorModal, POST /api/ai/editor-command, and POST /api/project-config/apply-operations.
- Raw HTML/CSS is allowed only for custom-html fields (html, css) and sanitized before apply/render.

---

## 11. Database Schema Summary

**File:** `docs/supabase_schema.sql`

| Table | Purpose |
|---|---|
| `profiles` | User display names, avatars, linked to `auth.users` |
| `projects` | One per client site — holds `current_config`, `draft_config`, subdomain, custom domain, subscription fields, publish counters |
| `project_versions` | Immutable version snapshots — one row per publish |
| `change_requests` | Pending/approved/rejected change requests from free-plan clients |
| `codes` | Redeemable template codes with limits and expiry |
| `templates` | Master template configs managed by admin |
| `paymongo_links` | PayMongo payment link records with `project_id` for webhook resolution |
| `transactions` | Payment transaction log |
| `leads` | Lead captures from public site contact forms |
| `platform_settings` | Admin-configurable platform defaults (publish limits, plan definitions) |

**Row-Level Security (RLS):** All client-facing tables have RLS policies ensuring clients can only read/write their own rows. Admin operations use the service-role client which bypasses RLS.

---

*Last updated: 2026-03-12*


