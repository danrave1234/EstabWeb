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
- **Subscriptions**: Starter (`basic`), Business (`pro`), Ecommerce, Custom.

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
- **Pricing comparison schema note**: The interactive pricing comparison variant uses section ID `pricing--comparison` with config key `pricingComparisonTable` (legacy alias: `pricing-comparison-table`). Keep `config/presets.ts`, `config/dashboard-config.ts`, block registry/render maps, and dashboard editor defaults synchronized when updating this section.
- **Animated testimonials schema note**: The animated testimonial variant uses section ID `testimonials--animated` with config key `animatedTestimonials`. Keep `config/presets.ts`, `config/dashboard-config.ts`, section registry maps, block render mappings, and dashboard editor defaults in sync when updating this section.
- **Pricing section comparison schema note**: The static plan+feature table variant uses section ID `pricing--feature-comparison` with config key `pricingSectionComparison` (legacy alias: `pricing-section-with-comparison`). Keep `config/presets.ts`, `config/dashboard-config.ts`, section registry maps, block render mappings, and dashboard editor defaults in sync when updating this section.
- **Hero showcase schema note**: The trust-focused hero variant uses section ID `hero--showcase` with config key `heroShowcase` (legacy alias: `hero-showcase`). Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, and admin request-review mappings synchronized when updating this section.
- **Hero v6 schema note**: The modern hero variant with email signup uses section ID `hero--v6` with config key `heroV6`. It features a badge, title, description, email form, and integrated background illustration. Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, and `lib/ai/section-field-schema.ts` in sync when updating this section.
- **Services bento schema note**: The bento-style services variant uses section ID `services--bento` with config key `featuresBento` (legacy alias: `services-bento`). Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, preview prefetch, and admin request-review mappings synchronized when updating this section.
- **Testimonials community schema note**: The community-style slide-in card testimonials variant uses section ID `testimonials--community` with config key `testimonialsCommunity`. It supports star ratings, avatar images, and an optional logo cloud (trustedCompanies). Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `hooks/dashboard/useEditorState.ts`, and `lib/ai/section-field-schema.ts` in sync when updating this section.
- **CTA beams schema note**: The animated background-beams CTA variant uses section ID `cta--beams` with config key `ctaBeams`. The primitive `BackgroundBeams` lives in `components/ui/background-beams.tsx`. Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, and `hooks/dashboard/useEditorState.ts` synchronized when updating this section.
- **Gallery carousel schema note**: The horizontal case-study carousel variant uses section ID `gallery--carousel` with config key `gallery4`. Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, `lib/ai/section-field-schema.ts`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx` synchronized when updating this section.
- **Gallery grid schema note**: The filterable grid with category tabs and lightbox variant uses section ID `gallery--grid` with config key `galleryGrid`. Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, `lib/ai/section-field-schema.ts`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx` synchronized when updating this section.
- **Feature steps schema note**: The animated step-by-step walkthrough variant uses section ID `features--steps` with config key `featureSteps`. The primitive `FeatureSteps` lives in `components/ui/feature-section.tsx`. Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, `SectionLivePreview.tsx`, and `hooks/dashboard/useEditorState.ts` synchronized when updating this section.
- **Scrolling testimonials schema note**: The vertical scrolling wall variant uses section ID `testimonials--v2` with config key `testimonialsV2`. Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, `SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, and `lib/ai/section-field-schema.ts` in sync when updating this section.
- **Feature spotlight schema note**: The single-feature highlight variant uses section ID `features--spotlight` with config key `featureSpotlight`. It supports interactive text transforms and an image with corner accents. Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, `SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, and `lib/ai/section-field-schema.ts` in sync when updating this section.
- **Modern hero schema note**: The centered hero with reviews variant uses section ID `hero--modern` with config key `heroModern`. It supports star ratings and a customer avatar cloud. Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, `SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, and `lib/ai/section-field-schema.ts` in sync when updating this section.
- **Hero group images schema note**: The split hero with image grid variant uses section ID `hero--group-images` with config key `heroGroupImages`. It features a badge, two call-to-action buttons, and three configurable image slots. Keep `config/presets.ts`, `config/dashboard-config.ts`, registry/render maps, `SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, and `lib/ai/section-field-schema.ts` in sync when updating this section.
- **Team showcase schema note**: The staggered photo grid with hover-to-highlight team variant uses section ID `team--showcase` with config key `teamShowcase`. Members use `id`, `name`, `role`, `image`, and optional `social` (twitter, linkedin, instagram, behance). Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, `lib/ai/section-field-schema.ts`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx` synchronized when updating this section.
- **Elegant carousel hero schema note**: The full-screen carousel hero variant uses section ID `hero--elegant-carousel` with config key `heroElegantCarousel`. Slides use `title`, `subtitle`, `description`, `accent` (hex color), and `imageUrl`. Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, `lib/ai/section-field-schema.ts`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx` synchronized when updating this section.
- **Minimalist hero schema note**: The clean, geometric minimalist hero variant uses section ID `hero--minimalism` with config key `heroMinimalism`. It supports custom branding, kicking text, title (with \n support), subtitle, and a three-part footer summary. Keep `config/presets.ts`, `config/dashboard-config.ts`, `lib/utils/block-registry.ts`, `lib/utils/block-props.tsx`, `components/shared/BlockRegistry.tsx`, `components/dashboard/SectionLivePreview.tsx`, `hooks/dashboard/useEditorState.ts`, `lib/ai/section-field-schema.ts`, and `app/admin/dashboard/requests/[id]/RequestReviewClient.tsx` synchronized when updating this section.
- **Header style sync note**: Client-selectable header styles include `sticky`, `static`, `floating`, `tubelight`, and `megamenu` (legacy alias: `solid` → sticky behavior). Keep `components/dashboard/editor/tabs/EditorSidebarDesign.tsx`, `components/shared/Header.tsx`, `components/shared/SiteBlockRenderer.tsx`, and `components/shared/LegalPageTemplate.tsx` synchronized when changing header style behavior.
- **Home hero visibility note**: The home page has at most one hero block in `activeSections`. Hide/show and “restore last variant” are centralized in `lib/dashboard/hero-editor.ts` and `hooks/dashboard/useEditorState.ts` (`heroEditor`, `storedHeroSectionId`). Use `heroEditor` in `components/dashboard/editor/tabs/EditorSidebarContent.tsx` and `toggleHeroVisibility` in `components/dashboard/editor/EditorFormPanel.tsx`—avoid ad hoc `updateActivePageSections` for hero toggles.

### 4. AI Integration (Section Editor & SEO)
- AI (Gemini API) is tightly integrated into the dashboard editing experience (via the "AI Tools" tab).
- It handles onboarding suggestions, SEO content generation (titles, descriptions, keywords), and automatic content generation/editing for site sections.
- **Rule**: AI operations must respect token limits and return cleanly formatted JSON that precisely matches the expected site config structure. Provide strict system prompts for the AI to prevent malformed config states.
- **Schema rule**: keep AI-editable section fields centralized in `lib/ai/section-field-schema.ts` and reuse that map in both prompt generation (`app/api/ai/editor-command/route.ts`) and operation sanitization (`lib/utils/validateOperations.ts`) so accepted fields always match AI instructions.
- **Draft sync rule**: AI editor requests should include the current client-side config snapshot (`currentConfig`) so generated operation positions reflect unsaved local edits. Before applying AI operations, sync the snapshot to `draft_config` first to avoid stale-position mismatches.

### 4.1 Analytics Normalization (Client Value Layer)
- Public analytics must work across different hero/section variants, so track both the raw block ID (`section_key`) and normalized metadata (`section_family`, `section_variant`, `section_label`, `section_goal`, `section_position`, `is_hero_section`).
- **Interactivity rule**: not every hero/section is meant to have the same interaction behavior. Keep section interactivity metadata (`section_is_interactive`, `section_interaction_type`, `section_interaction_label`) centralized in `lib/analytics/section-insights.ts` and emitted through `components/shared/SiteBlockRenderer.tsx` so passive sections are judged by visibility/assists while interactive sections can also be judged by clicks and CTA behavior.
- Shared normalization now lives in `lib/analytics/section-insights.ts` and is sourced from `lib/utils/block-registry.ts` metadata.
- **Session rule**: client-facing analytics is now built on `session -> events -> attribution -> metrics`. Keep `project_sessions`, `project_events.session_id`, and `project_leads.session_id` aligned whenever analytics schema or ingestion changes.
- **Ingestion rule**: public events are buffered client-side in `components/shared/Analytics.tsx` and sent in batches to `/api/track-event`; that route must keep session upserts and bulk event inserts in sync with `lib/analytics/server-ingest.ts` and `lib/analytics/event-schema.ts`.
- **Versioning rule**: published analytics must be version-aware. Use the project `config_version` as the public `page_version_id`, and include `section_slot`, `section_variant`, `section_instance_id`, and `page_version_id` in public section events/leads so dashboard insights do not silently mix pre-publish and post-publish layouts.
- **Rule**: when adding or renaming public-facing sections, keep `lib/analytics/section-insights.ts`, `components/shared/SiteBlockRenderer.tsx`, `hooks/useSectionTracking.ts`, `hooks/useClickMapTracking.ts`, `components/shared/Analytics.tsx`, and `app/(hub)/dashboard/analytics/page.tsx` aligned so analytics stays comparable across templates.
- **Attention rule**: the simple heatmap-style feature is section attention, not replay. `hooks/useSectionTracking.ts` should summarize visible time only while the section is in view and the tab/window is active, then send `section_attention` with `visible_time_ms`, `visible_time_seconds`, and `max_visibility_ratio` so the dashboard can explain where visitors actually spent time.
- **Dashboard rule**: client-facing analytics should prioritize business questions in plain language (`Which section leads to inquiries?`, `Where do people drop off?`, `Which page turns visits into leads?`) rather than raw `section_key` values or technical jargon.
- **Replay rule**: session replay/rrweb recording is no longer part of the product. Keep analytics focused on event-based, business-facing reporting only; do not reintroduce replay capture, replay tables, or replay UI without updating docs and analytics architecture guidance together.

### 5. Premium UI & Aesthetics - Anti-AI Patterns (CRITICAL)
- **Design Standard**: DO NOT follow generic AI design patterns. The UI and any new sections must look intentionally **human-made** and professional.
- **Implementation Rules**: 
  - Do NOT make designs look overly "modern" with typical AI tropes (e.g., heavy glassmorphism, completely unstructured glowing gradients, excessive border-radiuses everywhere, or generic floating abstract blobs).
  - Do NOT use typical AI-generated font scaling, generic font pairings, or typical AI color palettes (like generic deep purple/teal tech gradients).
  - stick to natural, grounded, well-spaced, standard web patterns that look like they were built by a professional human agency, not an AI bot. Use straightforward, accessible, and functional styling.
- **Styling**: Tailwind CSS 4 is the primary tool. Global theme variables are housed in `app/themes.css`. Keep layouts structured and clean without unnecessary visual fluff.

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

### 12. GEO SEO & AI Search Discoverability
- AI crawler policy is centralized in `lib/seo/ai-crawlers.ts` and used by both:
  - root robots metadata route: `app/robots.ts`
  - tenant robots route: `app/(sites)/[domain]/robots.txt/route.ts`
- Crawler behavior supports policy modes via `GEO_CRAWLER_POLICY_MODE`:
  - `max-visibility` (default): allows major AI discovery/search crawlers, blocks only low-value aggressive bots
  - `training-restricted`: keeps core answer/search crawlers, blocks discovery/training-focused crawlers
- `llms.txt` support exists for both hub and tenant domains:
  - hub: `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`
  - tenant: `app/(sites)/[domain]/llms.txt/route.ts`, `app/(sites)/[domain]/llms-full.txt/route.ts`
- Tenant llms generation logic is in `lib/seo/tenant-llms.ts` and `lib/seo/llms.ts`.
- Tenant metadata defaults are normalized by `lib/seo/autoSeo.ts`; keep placeholder seeds like `Your Business Name`, `Your City`, and demo contact values out of emitted titles, descriptions, keywords, and schema.
- Tenant favicon delivery is same-origin via `app/(sites)/[domain]/favicon.ico/route.ts`; when updating public branding metadata, keep `app/(sites)/[domain]/layout.tsx`, `app/(sites)/[domain]/page.tsx`, and `app/(sites)/[domain]/[slug]/page.tsx` aligned so crawlers always see `/favicon.ico` on the tenant host.
- **Rule**: when adding, renaming, or removing public pages, keep sitemap and llms outputs aligned so crawlers and AI systems receive consistent URL inventories.

### 13. Site Status Lifecycle (Disable / Archive / Restore)
Projects have a `site_status` column (`active` | `disabled` | `archived`, default `active`), plus `site_status_updated_at` and `site_status_reason` columns added by migration `010_add_site_status.sql`.

**Status semantics:**
- `active` — site is publicly visible (default for all projects).
- `disabled` — site is temporarily offline; shows `SiteOffline` page to visitors; client can re-enable.
- `archived` — soft-deleted; custom domain removed; only admin can restore.

**Code touchpoints — keep in sync when modifying:**
| Layer | File | Role |
|---|---|---|
| DB migration | `migrations/010_add_site_status.sql` | Adds columns to `projects` |
| Client API | `app/api/project/[id]/site-status/route.ts` | Client transitions: active↔disabled, active→archived |
| Admin API | `app/api/admin/projects/[id]/site-status/route.ts` | All transitions + hard DELETE |
| Public rendering | `app/(sites)/[domain]/page.tsx` | Returns `<SiteOffline>` when status ≠ `active` (preview bypasses) |
| Offline page | `components/shared/SiteOffline.tsx` | Public-facing offline/archived notice |
| Client dashboard | `components/dashboard/editor/EditorSidebar.tsx` (active shell). Legacy Danger Zone UI: `components/dashboard/EditorSidebar.tsx` (not imported by `ClientDashboardPreview`—verify before relying on it) | Disable / archive / re-enable |
| Admin panel | `components/admin/SiteStatusManage.tsx` | All transitions + delete, wired into `ClientsTable` |
| Data selects | `lib/utils/site-config.ts` | All 7 SELECT queries include `site_status,site_status_reason` |
| Audit log | `lib/audit.ts` | Action types: `site_disabled`, `site_enabled`, `site_archived`, `site_restored`, `site_deleted` |

**Rules:**
- When archiving, always call `removeDomainFromVercel` and clear `custom_domain` in the same transaction.
- Preview mode always bypasses the status gate so admins can still inspect archived sites.
- Clients cannot restore from `archived` — only admin PATCH to `active` allowed.
- All status changes must write an audit log entry.

### 14. Admin Template Draft Workflow (Marketing Flow)
- The admin template builder (`/admin/template`) has two persistence layers:
  - `site_config` key `template_master` for the currently loaded live builder state (`GET/POST /api/config`)
  - `template_drafts` table for temporary business-specific snapshots (`GET/POST/PATCH/DELETE /api/admin/template-drafts`)
- **Rule**: Use `template_drafts` for in-progress prospect work (brand names, logos, photos, localized copy) and only generate `template_codes` when the prospect is ready to redeem.
- **Expiry rule**: `template_drafts` are temporary and expire after 30 days (`expires_at`). Expired drafts must be removed along with referenced `site-assets` bucket images.
- Cleanup is run by cron route `GET /api/cron/cleanup-template-drafts` (CRON_SECRET-protected) and can also run during admin draft reads.
- AI template auto-population endpoint (`/api/ai/populate-template`) supports optional Gemini Google Search grounding (`useSearch`) and configurable model env vars:
  - `GEMINI_TEMPLATE_MODEL` (default `gemini-1.5-flash`)
  - `GEMINI_TEMPLATE_USE_SEARCH` (default `true`)
- Endpoint output now supports full template recommendations (copy + `theme` + `colorTheme` + `typographyStyle` + `headerStyle` + `footerStyle` + `darkMode` + `activeSections`) and must be normalized against allowed option lists before applying.
- Template AI requests should include structured option context (hero/theme labels, color swatches, typography metadata, section labels, and preset blueprints) so model selection is guided by real design-system constraints instead of random combinations.
- Endpoint also supports optional `businessPageUrl`; server extracts public page signals (og:title/description/image, contact hints) to prefill logo/hero/contact fields when available.
- Endpoint also supports optional `businessImageDataUrl` (uploaded screenshot/logo) for vision-based extraction fallback when social pages block direct scraping.
- **Rule**: Keep template AI output strict JSON and normalize fields server-side before applying to editor state.
- **Grounding rule**: Template AI must prioritize real-world data from `businessPageUrl` (via search/scraping) over generic defaults. It must NOT invent fake contact details (phone, email) or brand names. If scraping social profiles (Facebook, etc.) is blocked, the server provides a hint for the AI to trigger a web search for the official identity, brand colors, and logo.
- **Branding rule**: AI must analyze brand signals (logo colors, search descriptions) to select the most accurate `colorTheme`. Known brands must match their iconic colors (e.g., Anytime Fitness must use Purple-based themes).
- **Sequence rule**: Generated `activeSections` must follow a professional conversion sequence: Hero -> Value Prop -> Features/Services -> Social Proof -> Trust/FAQ -> Pricing -> Contact.

### 15. Admin Dashboard Design System
The admin panel uses a modern, sidebar-based layout with shadcn-inspired components (Cards, Tables, Badges).
- **Layout**: Centralized in `AdminLayoutClient.tsx` using `AdminSidebar.tsx`. The sidebar is collapsible on desktop and uses a mobile trigger on small screens.
- **Components**: Prefer using established UI primitives from `components/ui/` (Card, Badge, Button, Input, Table, Tabs) for all admin-facing pages to maintain design consistency.
- **Design Tokens**: Use `bg-muted/30` for main page backgrounds and `bg-card` for content containers. Secondary badges and highlights should use `10%` opacity variants of their primary color (e.g., `bg-emerald-500/10 text-emerald-500`).
- **Rule**: When adding new admin pages or components, follow the existing pattern of using Cards for information grouping and well-spaced Tables for data lists. Keep the typography clean using font-weights (bold/medium) and muted-foreground colors for secondary information.

### 16. AI Custom HTML Section (Pro+ Gate)
- Section ID: `custom-html`
- Config key: `customHtml` (stored in project `draft_config` / `current_config`)
- Rendering pipeline updates must stay in sync across:
  - `lib/utils/block-registry.ts`
  - `config/dashboard-config.ts` (`sectionIdToKey`, labels, defaults)
  - `hooks/dashboard/useEditorState.ts` default section seed map
  - `lib/utils/block-props.tsx` + `components/shared/BlockRegistry.tsx`
- **Plan gate rule**: custom HTML section is available only for plan IDs `pro`, `ecommerce`, `custom` with status `active`/`trial` (or `admin_granted`). Use `hasProOrHigher()` from `lib/subscription.ts` rather than ad hoc checks.
- **Security rule**: only `custom-html` may carry raw HTML/CSS fields (`html`, `css`), and those must pass sanitization via `lib/security/custom-section-sanitizer.ts` and `validateOperations()`.
- **AI rule**: `app/api/ai/editor-command/route.ts` must keep strict prompt constraints so HTML is allowed only for `custom-html.html/css`; all other fields remain plain text.
- **Dashboard editor rule**: when editing `custom-html` in the section modal, hide raw code fields (`html`, `css`, `js`) and expose only content controls (title/subtitle, parsed text, links, images). Section display labels should resolve from section content/title instead of a fixed generic label.
