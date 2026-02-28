# Analytics System — Manual Testing Guide

> **Tests status:** 25/25 passing (`npx jest __tests__/api.track-event.test.ts __tests__/api.track-lead.test.ts`)

---

## Step 1 — Build Your Test Project (Recommended Sections)

In your dashboard, create a project and add these **7 sections** in order. They cover every tracked event type.

| # | Block Type | Section Key (`data-section`) | Why Include It |
|---|---|---|---|
| 1 | Hero / Banner | `hero` | Fires `section_view`, `scroll_depth` 25%, CTA click |
| 2 | About / Info | `about` | Tests scroll depth 50%, section engagement |
| 3 | Services / Features | `services` | Section view mid-page, click map targets |
| 4 | Pricing / Packages | `pricing` | High-intent section; tests section heatmap score |
| 5 | Map / Location | `location` | Fires `map_interact` when user touches the map |
| 6 | Contact Form | `contact` | Fires `form_start`, `lead_form` (submit), reCAPTCHA |
| 7 | Footer with Call/Messenger/Viber buttons | `footer` | Fires `lead_call`, `lead_messenger`, `lead_viber` |

> Make sure each section has a **CTA button** (for `cta_click`) and the contact section has a **working form**.

---

## Step 2 — Set Up Tracking (Checklist)

Before visiting the public site, confirm:

- [ ] Project is **published** (not draft)
- [ ] You're visiting via the **subdomain or custom domain** (not `/dashboard/preview`) — tracking is blocked in admin/preview mode
- [ ] Open the site in a **private/incognito window** so you start with a fresh visitor ID
- [ ] Open browser **DevTools → Network tab**, filter by `track-event` and `track-lead` to watch requests fire in real time

---

## Step 3 — What To Do On The Public Site

Do each of these actions one by one. Each fires a specific tracked event.

### Page Load
- Simply load the page → fires `session_start`, `page_view` (with `funnel_step: "landing"`)

### Scrolling
- Slowly scroll down the page:
  - At **~25% scroll** → fires `scroll_depth` milestone `25`
  - At **~50% scroll** → fires `scroll_depth` milestone `50`
  - At **~75% scroll** → fires `scroll_depth` milestone `75`
  - At **~100% (footer)** → fires `scroll_depth` milestone `100`
- Each section entering the viewport → fires `section_view` for that section key

### Clicking
- Click any **CTA button** → fires `cta_click`
- Click any random element → fires `click_map` with `element_id`, `element_type`, `element_text`
- Touch/click the **map embed** → fires `map_interact`

### Submitting a Lead (Contact Form)
- Click inside the form input → fires `form_start`
- Fill in name, phone, message → click **Submit**
  - Fires `lead_form` event
  - Creates a record in `project_leads` table
  - Also mirrors as `lead_form` in `project_events`

### Clicking Action Buttons (Footer)
- Click **Call button** → fires `lead_call`
- Click **Messenger button** → fires `lead_messenger`
- Click **Viber button** → fires `lead_viber`

### Leave the Page / Switch Tabs
- Switch to another tab or close the page
  - Fires `session_end` with `duration_seconds` and `page_count`

### Second Visit (Return Visitor Test)
- Open a **new tab** (same browser, not incognito) → same `visitor_id`, new `session_id`
  - This visitor should appear as a **return visit** in the dashboard

---

## Step 4 — What To Expect In The Dashboard (`/dashboard/analytics`)

After doing all the above, go to **Dashboard → Analytics**.

### Leads Tab (visible on all plans)

| What You See | Expected Value |
|---|---|
| Total Leads | 3+ (form + call + messenger/viber clicks) |
| Calls count | 1 |
| Forms count | 1 |
| Messages count | 1+ (Messenger or Viber) |
| Lead list rows | Each lead with source, page slug, section key, timestamp |
| Lead source column | `"direct"` (or `utm_source` if you added `?utm_source=test` to URL) |

### Analytics Tab (Pro plan)

#### Identity & Session Cards

| Card | Expected |
|---|---|
| Unique Visitors | 1 (your incognito visit) |
| Return Rate | >0% after your second non-incognito visit |
| Avg Session Duration | ~X seconds (how long you browsed) |
| Bounce Rate | 0% if you visited multiple sections; 100% if single page |

#### Funnel Panel

| Funnel Step | Expected |
|---|---|
| Landing (`page_view`) | 1 |
| Engaged (`section_view`) | multiple |
| CTA | 1+ |
| Lead | 3+ |
| Drop-off % | calculated between each step |

#### Section Heatmap Table

| Column | What It Means |
|---|---|
| Section | `hero`, `about`, `services`, etc. |
| Views | How many times it scrolled into view |
| Clicks | `click_map` events in that section |
| Leads | Leads that came from that section |
| Score | `clicks×0.4 + convRate×0.5 + viewRate×0.1` |

> Expected: `contact` section should have the **highest score** (it has a lead form).

#### Scroll Reach Bars
- `hero` → ~100% reach (everyone sees it)
- `footer` → lower % (only users who scrolled all the way)
- Bars are **green ≥40%**, **orange ≥20%**, **grey below**

#### Traffic Source Table
- If you visited plain URL → `direct`
- If you visited `?utm_source=facebook` → `facebook`
- If you visited from Google → referrer-resolved source

#### Peak Hour Heatmap
- The hour you did the test should be highlighted

#### Visitor Locations
- Shows city from Vercel geo headers
- **Note:** Only works on deployed Vercel — blank on localhost

---

## Step 5 — Verifying In Supabase (Raw Data Check)

Go to **Supabase Dashboard → Table Editor**.

### `project_events` table — expect these rows:

```
session_start      visitor_id=<uuid>  session_id=<uuid>
page_view          funnel_step=landing
section_view × 7   one per section as you scrolled
scroll_depth × 4   milestone: 25, 50, 75, 100
cta_click          section_key=hero (or wherever you clicked)
click_map × N      element_type, element_text filled
form_start         section_key=contact
lead_form          funnel_step=lead
lead_call          section_key=footer
lead_messenger     section_key=footer
session_end        duration_seconds=<N>, page_count=1
```

### `project_leads` table — expect these rows:

```
type=form      visitor_id=<uuid>  first_touch_source=direct
type=call      visitor_id=<uuid>  first_touch_source=direct
type=messenger visitor_id=<uuid>  first_touch_source=direct
```

---

## Quick Test URL Tricks

Add query params to test attribution:

| URL | Expected `source` in dashboard |
|---|---|
| `/` | `direct` |
| `/?utm_source=facebook&utm_campaign=summer` | `facebook` |
| `/?utm_source=google&utm_medium=cpc` | `google` |
| Visit from a real Google search | `google.com` |

> The **first-touch source is stored in localStorage and never overwritten**, so if you visit via `utm_source=facebook` first, then revisit directly, all leads still show `facebook` as first touch.

---

## What To Check If Something Doesn't Fire

| Symptom | Likely Cause |
|---|---|
| No events at all | You're on preview/admin mode — use the public URL |
| Events fire but 400 error | `project_id` not matching — check project is published |
| `section_view` missing | Section block missing `data-section` attribute |
| `visitor_id` changes each visit | localStorage blocked (private/incognito mode) |
| City is blank | Running on localhost (Vercel geo headers don't exist locally) |
| Lead not in CRM | Check browser console for `track-lead` 4xx/5xx response |

---

## Running Automated Tests

```bash
npx jest __tests__/api.track-event.test.ts __tests__/api.track-lead.test.ts --no-coverage
```

Expected output:
```
Tests: 25 passed, 25 total
```

The `console.error` lines in output are **intentional** — they are triggered by DB-failure test cases that verify the error handling paths work correctly.
