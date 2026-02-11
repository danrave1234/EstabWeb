# EstabWeb White‑Label Flow (Multi‑Tenant)

This document summarizes the current multi‑tenant website flow, routing, data sources, and review/publish workflow implemented in this project.

## Overview
- One Next.js project serves all client sites (subdomains and custom domains).
- Per‑client website data lives in Supabase `projects.current_config` (live) and `projects.draft_config` (in‑progress).
- Admin can create activation codes (snapshots of the main template) that seed new client projects.
- Clients edit drafts in the dashboard and submit for approval; Admin approves to publish.

## Domain Routing (middleware)
- File: `middleware.ts`
- Behavior:
  - `admin.*` → rewrites to `/(admin)` route group (admin center).
  - All non‑root hosts (subdomains like `lawyer.estabweb.com` or custom domains like `client.com`) → rewrites to `/(sites)/[domain]` with `domain` resolved from the host.
  - Root/dev hosts (e.g., `estabweb.com`, `www.estabweb.com`, `localhost`) are served normally.
- Supabase session cookies are refreshed and preserved across rewrites.
- Configure `NEXT_PUBLIC_ROOT_DOMAIN` (e.g., `estabweb.com`). In Vercel, set a wildcard domain `*.estabweb.com` and attach custom domains per client.

## Site Rendering (public)
- File: `app/(sites)/[domain]/page.tsx`
- Logic:
  1) Resolve the project by `subdomain === domain` OR `custom_domain === domain` in Supabase.
  2) If `?preview=true` → render `draft_config`, else render `current_config` (fallbacks between the two if one is missing).
  3) If no project is found → fallback to `config/site-data.json` (Main Template demo).
- File: `app/(sites)/[domain]/layout.tsx` reads theme/mode/typography from the project config (same domain lookup) with fallback to `site-data.json`.

## Main Template (Admin DNA)
- File/Editor: `app/admin/preview/page.tsx` + `components/shared/SiteEditorSidebar.tsx`.
- Edits write to `config/site-data.json` via `GET/POST /api/config` (this is the global template DNA, not per‑project).
- Admin can click “Create Code” to generate a one‑time code whose JSON payload is the current `site-data.json` snapshot.

## Activation Codes
- `POST /api/codes` (admin): creates `template_codes` row with JSON `payload` (snapshot of `site-data.json`).
- `POST /api/codes/redeem` (client): validates code and either creates a project or updates an existing one, injecting the payload into BOTH `projects.current_config` and `projects.draft_config`.
- Audit: `code_redemptions` + RPC `increment_usage` (or fallback update) track usage.

## Client Dashboard (Editing + Preview)
- File: `app/(hub)/dashboard/page.tsx`, UI: `components/dashboard/ClientDashboardPreview.tsx`.
- Client can:
  - Edit sections → autosaved LOCALLY to browser storage (no DB writes until saved).
  - Save Draft → persists local changes to `projects.draft_config` via `POST /api/project-config`.
  - Preview draft with an iframe that loads `/{subdomain}?preview=true` (shows last saved draft from DB).
  - Submit for Approval → `POST /api/change-requests` which snapshots the current `draft_config` from DB into `change_requests.requested_changes` with status `pending`.
  - Discard Local → clears local (unsaved) changes and reverts the editor back to the last saved draft.

## Admin Approval Center
- Route: `/admin/approvals`
- Endpoints:
  - `POST /api/change-requests` (client) — creates a `pending` change request from a `draft_config` snapshot.
  - `POST /api/change-requests/[id]/approve` (admin) — requires `profiles.role === 'admin'`.
    - Sets `projects.current_config = requested_changes` and also updates `draft_config` to keep them in sync.
    - Marks the request as `approved` (with `decided_at`).
    - Calls `revalidatePath('/{domain}')` to clear cache for that client’s site.

## Data Model (Supabase)
- `projects`: `{ id, owner_id, subdomain, custom_domain, current_config jsonb, draft_config jsonb, ... }`
- `template_codes`: `{ code, payload jsonb, max_uses, usage_count, expires_at, status, ... }`
- `code_redemptions`: redemption audit.
- `change_requests`: `{ project_id, user_id, requested_changes jsonb, status, created_at, decided_at }`
- `project_versions`: table scaffolded for versioning, currently not wired in the UI.

## Operational Notes
- Vercel: add wildcard domain `*.estabweb.com` and per‑client custom domains to the same project.
- Env: set `NEXT_PUBLIC_ROOT_DOMAIN` to your apex domain (e.g., `estabweb.com`).
- DB pooling: If you add Prisma/Drizzle elsewhere for serverless routes, use the pooled connection string (port 6543) with `?pgbouncer=true`.

## End‑to‑End Flow (Today)
1) Admin refines the Main Template in `/admin/preview` and clicks “Create Code”.
2) Client logs into `/dashboard`, redeems the code; a project is created/updated and seeded (both `current_config` + `draft_config`).
3) Client edits content in the dashboard; autosaves go to `draft_config`. The dashboard preview iframe shows `?preview=true` (draft).
4) Client clicks “Submit for Approval” (`POST /api/change-requests`) which snapshots `draft_config` into a pending request.
5) Admin opens `/admin/approvals` and clicks “Approve” — publishing the `requested_changes` to `current_config` (and syncing `draft_config`), then revalidates the site path.
6) Public site at the client’s subdomain or custom domain serves `current_config` automatically via middleware‑routed `/(sites)/[domain]`.

## Fallback Demo Mode
- If no project exists for a visited domain, the public site falls back to `config/site-data.json` so you can demo the template to prospects before onboarding them.
