# Roadmap: Multi-page sites for non-free projects

## Goal

Enable **multi-page** client sites (under `/(sites)/[domain]`) for **non-free** projects, while keeping **free projects** effectively single-page (plus legal pages).

## Current implementation (confirmed in code)

### Entitlements live on `projects`

- Supabase migration: `docs/migrations/001_subscription_fields.sql`
  - Adds `projects.subscription_status` with allowed values: `free` | `trial` | `active` | `admin_granted`
  - Adds payment/subscription-related fields like `has_paid_initial`, `subscription_ends_at`, etc.
- PayMongo webhook: `app/api/paymongo/webhook/route.ts`
  - Marks a project `subscription_status = 'active'` on successful payment.

### Client site routing

- Home page:
  - `app/(sites)/[domain]/page.tsx` → renders `SiteTemplate` (blocks driven by config).
- Legal pages already exist as separate routes (available for all plans):
  - `app/(sites)/[domain]/privacy/page.tsx`
  - `app/(sites)/[domain]/terms/page.tsx`
  - `app/(sites)/[domain]/cookies/page.tsx`
- There is **no** generic subpage route like `app/(sites)/[domain]/[slug]/page.tsx` yet.

### Config loading

- `lib/utils/site-config.ts` resolves project config via Supabase `projects.current_config`/`draft_config`, with fallbacks.

### SEO & sitemap (current)

- `app/(sites)/[domain]/layout.tsx` generates metadata from `config.seo` (site-level), canonical hard-coded to `/`.
- `app/sitemap.ts` for client sites returns only the homepage URL.

## Product decisions (from discussion)

- Free projects:
  - **Max pages = 1** (single-page)
  - **Legal pages do not count** toward the page limit.
- Non-free projects:
  - Multi-page enabled.
  - Page limit is **dynamic** (configurable via env and/or admin dashboard config), not hard-coded.
  - Enterprise handled manually (same mechanics as pro).
- Page composition:
  - Use the existing blocks system.
  - Standard: **one block per page**, but not strictly enforced.
- SEO:
  - Must support **per-page SEO** (title/description/keywords, etc.).
- Editor UI:
  - “Add page” should be disabled for free projects with an indicator that multi-page is paid-only.
- Rollout:
  - New projects only (no fallback/migration requirements for existing data at this time).

## Proposed architecture

### 1) Add `pages` to project config (JSON)

Store pages in `projects.current_config` / `projects.draft_config`.

Recommended shape: an array (easy order + count + sitemap):

```ts
pages: [
  {
    slug: "",            // home
    label: "Home",
    activeSections: ["hero", "features", "contact"],
    seo: { title, description, keywords }
  },
  {
    slug: "about",
    label: "About",
    activeSections: ["attorney-profile"],
    seo: { title, description, keywords }
  },
  {
    slug: "contact",
    label: "Contact",
    activeSections: ["contact"],
    seo: { title, description, keywords }
  }
]
```

Notes:

- Home page can remain driven by the existing `activeSections` at root, but long-term it’s cleaner if home is `pages[0]` with `slug: ""`.
- “One block per page” convention: set `activeSections` to a single section id.

### 2) Add dynamic routing for client subpages (paid-only)

Add route:

- `app/(sites)/[domain]/[slug]/page.tsx`

Routing behavior:

- Always allow `slug` in `{ privacy, terms, cookies }` (legal pages remain available to free).
- For all other slugs:
  - Resolve the project row by domain (or extend existing `getSiteConfig` path to also return the project row)
  - Determine if project is non-free (e.g. `subscription_status in { trial, active, admin_granted }`)
  - If free → `notFound()`
  - If non-free → find matching `page` in `config.pages` and render it.

Rendering approach (reuse current renderer):

- Build `dataForPage = { ...siteConfig, activeSections: page.activeSections, seo: page.seo ?? siteConfig.seo }`
- Render with `SiteTemplate` → `SiteBlockRenderer`.

### 3) Dynamic page limits (env/admin-configurable)

Requirements:

- Free: max pages = `1` (does **not** include legal pages).
- Pro: max pages is configurable dynamically.

Implementation options (recommended):

1. Store plan limits in `site_config` (already exists + has admin RLS):
   - key: `plan_limits`
   - payload example:
     ```json
     {
       "free": { "maxPages": 1 },
       "pro": { "maxPages": 5 }
     }
     ```
2. Allow per-project override for enterprise/manual:
   - either a `projects.page_limit_override` column, or
   - a config override inside `projects.current_config`.

Enforcement points:

1. **Editor UI**: disable “Add page” if free.
2. **Save/publish**: validate `pages.length <= maxPages` in the API that writes config (e.g. `app/api/publish/route.ts` and/or draft save endpoints).
3. **Runtime routing**: refuse to render pages beyond the max.

### 4) Per-page SEO

Add `generateMetadata` per page route:

- `app/(sites)/[domain]/[slug]/page.tsx` should generate metadata using `page.seo`.
- Canonical for subpages must be `/${slug}`.

Important current note:

- `app/(sites)/[domain]/layout.tsx` currently sets canonical to `/` globally. For multi-page SEO, canonical should be owned by the per-page metadata generator.

### 5) Sitemap for paid pages

Update `app/sitemap.ts` for client sites:

- Always include `/`.
- Always include `/privacy`, `/terms`, `/cookies`.
- If non-free, include all configured pages from `config.pages` (excluding `slug: ""`).

## Navigation decision (open)

Today, some navigation defaults include routes like `'/contact'` (see `components/shared/SiteBlockRenderer.tsx` `defaultNav`).

Because client sites currently do not have `/(sites)/[domain]/contact` implemented, this can produce broken links.

Two options:

1. Keep single-page behavior for free and use anchors (`#contact`, etc.) on the homepage.
2. For paid, use real routes (`/contact`, `/about`), backed by `pages`.

Recommendation:

- Treat nav as config-driven:
  - Free: nav should prefer anchors (single-page)
  - Paid: nav can use routes (multi-page)

This can be handled by deriving `navigation` from `pages` when multi-page is enabled, otherwise from sections.

## Implementation checklist (files likely involved)

### Routing

- Add: `app/(sites)/[domain]/[slug]/page.tsx`
- Optionally add per-page `generateMetadata` or a nested layout.

### Config + entitlement helpers

- Extend config fetching to return project row + config together (or add a new helper alongside `getSiteConfig`).
- Create a single entitlement helper (e.g. `canUseMultiPage(project)` + `getMaxPages(project, globalConfig)`) used by:
  - runtime route guard
  - editor UI gating
  - publish-time validation

### Editor UI

- Locate where pages/sections are managed (likely `components/shared/SiteEditorSidebar.tsx` and related editor components).
- Disable “Add page” for free with upgrade indicator.

### Publish/save validation

- Validate max pages when writing `draft_config`/`current_config`:
  - `app/api/publish/route.ts` (and any draft-save endpoints)

### SEO + sitemap

- Implement per-page SEO in dynamic subpage route.
- Update `app/sitemap.ts` to include paid pages.

## Testing / verification plan

- Free project:
  - `/` renders.
  - `/privacy`, `/terms`, `/cookies` render.
  - `/about` returns `notFound()`.
- Paid project:
  - `/about` renders when present in `config.pages`.
  - Per-page SEO title/description changes per page.
  - Sitemap includes configured pages.
- Editor:
  - free: “Add page” disabled with indicator.
  - paid: can add pages up to limit.
