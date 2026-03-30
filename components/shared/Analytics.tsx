"use client";

import Script from "next/script";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getSectionAnalyticsMeta,
  getSectionAnalyticsMetaFromDataset,
  sectionMetaToEventMetadata,
} from "@/lib/analytics/section-insights";
import {
  type AnalyticsEventInput,
  type AnalyticsEventType,
  type FunnelStep,
  canonicalizeAnalyticsEventType,
  defaultFunnelStepForEvent,
} from "@/lib/analytics/event-schema";

// ---------------------------------------------------------------------------
// Analytics Context — replaces window.PROJECT_ID global
// ---------------------------------------------------------------------------

type AnalyticsContextValue = {
  projectId?: string;
  pageVersionId?: string;
};

const AnalyticsContext = createContext<AnalyticsContextValue>({});

function PageViewTrackerInner({ projectId, pageVersionId }: { projectId?: string; pageVersionId?: string }) {
  usePageViewTracker(projectId, pageVersionId);
  return null;
}
function SectionTrackerInner({ projectId, pageVersionId }: { projectId?: string; pageVersionId?: string }) {
  useSectionTracker(projectId, pageVersionId);
  return null;
}
function SessionTrackerInner({ projectId }: { projectId?: string }) {
  useSessionTracking(projectId);
  return null;
}

export function AnalyticsProvider({
  projectId,
  pageVersionId,
  children,
}: {
  projectId?: string;
  pageVersionId?: string;
  children: React.ReactNode;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const inPreview = typeof window !== "undefined" && window.self !== window.top;

  // Expose projectId on window so plain (non-hook) trackLead() calls can read it
  useEffect(() => {
    if (typeof window === "undefined" || isPreviewContext()) return;
    if (projectId) {
      window.PROJECT_ID = projectId;
    }
    if (pageVersionId) {
      window.PAGE_VERSION_ID = pageVersionId;
    }
  }, [projectId, pageVersionId]);

  const contextValue = useMemo(
    () => ({ projectId, pageVersionId }),
    [projectId, pageVersionId]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {!inPreview && <PageViewTrackerInner projectId={projectId} pageVersionId={pageVersionId} />}
      {!inPreview && <SectionTrackerInner projectId={projectId} pageVersionId={pageVersionId} />}
      {!inPreview && <SessionTrackerInner projectId={projectId} />}
      {siteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      )}
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useProjectId() {
  return useContext(AnalyticsContext).projectId;
}

function resolvePageVersionId(explicitPageVersionId?: string) {
  if (explicitPageVersionId) return explicitPageVersionId;
  if (typeof window === "undefined") return undefined;
  return window.PAGE_VERSION_ID;
}

function stringifyPageVersionId(value?: string) {
  return value ?? undefined;
}

function buildSectionTrackingMetadata(
  sectionMeta: ReturnType<typeof getSectionAnalyticsMetaFromDataset>,
  dataset?: DOMStringMap,
  extraMetadata?: Record<string, unknown>
) {
  return sectionMetaToEventMetadata(sectionMeta, {
    ...extraMetadata,
    section_slot:
      dataset?.sectionSlot || sectionMeta?.sectionFamily || dataset?.sectionFamily || undefined,
    section_instance_id: dataset?.sectionInstanceId || undefined,
    page_version_id: dataset?.pageVersionId || resolvePageVersionId(),
  });
}

// ---------------------------------------------------------------------------
// Visitor identity — persists across sessions (localStorage)
// ---------------------------------------------------------------------------
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const key = "_vid";
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Session identity — new per tab/session (sessionStorage)
// ---------------------------------------------------------------------------
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const key = "_sid";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "";
  }
}

const EVENT_BUFFER_KEY = "__analytics_batch_queue"
const MAX_BUFFER_SIZE = 10
const FLUSH_INTERVAL_MS = 5000
let flushTimer: number | null = null

function getSessionAttribution() {
  if (typeof window === "undefined") {
    return {
      source: "direct",
      medium: null as string | null,
      campaign: null as string | null,
    }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get("utm_source") ?? resolveTrafficSource(),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
  }
}

function readBufferedEvents() {
  if (typeof window === "undefined") return [] as Record<string, unknown>[]
  try {
    const raw = sessionStorage.getItem(EVENT_BUFFER_KEY)
    return raw ? (JSON.parse(raw) as Record<string, unknown>[]) : []
  } catch {
    return []
  }
}

function writeBufferedEvents(events: Record<string, unknown>[]) {
  if (typeof window === "undefined") return
  try {
    if (events.length === 0) {
      sessionStorage.removeItem(EVENT_BUFFER_KEY)
      return
    }
    sessionStorage.setItem(EVENT_BUFFER_KEY, JSON.stringify(events))
  } catch {
    // ignore storage failures
  }
}

function flushBufferedEvents() {
  if (typeof window === "undefined") return
  const projectId = window.PROJECT_ID
  const events = readBufferedEvents()
  if (!projectId || events.length === 0) return

  writeBufferedEvents([])
  if (flushTimer !== null) {
    window.clearTimeout(flushTimer)
    flushTimer = null
  }

  const attribution = getSessionAttribution()
  const payload = JSON.stringify({
    project_id: projectId,
    session_id: getOrCreateSessionId(),
    visitor_id: getOrCreateVisitorId(),
    source: attribution.source,
    medium: attribution.medium,
    campaign: attribution.campaign,
    events,
  })

  fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    writeBufferedEvents(events.concat(readBufferedEvents()))
  })
}

function enqueueEvent(event: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const buffered = readBufferedEvents()
  buffered.push(event)
  writeBufferedEvents(buffered)

  if (buffered.length >= MAX_BUFFER_SIZE) {
    flushBufferedEvents()
    return
  }

  if (flushTimer !== null) return
  flushTimer = window.setTimeout(() => {
    flushBufferedEvents()
  }, FLUSH_INTERVAL_MS)
}

// ---------------------------------------------------------------------------
// First-touch attribution — stored once in localStorage, never overwritten
// ---------------------------------------------------------------------------
export type FirstTouch = {
  source: string;
  utm: Record<string, string>;
  ts: number;
};

export function getOrCreateFirstTouch(): FirstTouch {
  const empty: FirstTouch = { source: "direct", utm: {}, ts: Date.now() };
  if (typeof window === "undefined") return empty;
  try {
    const key = "_ft";
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as FirstTouch;

    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const utm: Record<string, string> = {};
    utmKeys.forEach((k) => { const v = params.get(k); if (v) utm[k] = v; });

    let source = "direct";
    if (utm.utm_source) source = utm.utm_source;
    else if (document.referrer) {
      try { source = new URL(document.referrer).hostname; } catch { source = document.referrer; }
    }

    const ft: FirstTouch = { source, utm, ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(ft));
    return ft;
  } catch {
    return empty;
  }
}

// ---------------------------------------------------------------------------
// Traffic source resolver (last-touch)
// ---------------------------------------------------------------------------
export function resolveTrafficSource(): string {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  if (utm) return utm;
  if (document.referrer) {
    try {
      return new URL(document.referrer).hostname;
    } catch {
      return document.referrer;
    }
  }
  return "direct";
}

// ---------------------------------------------------------------------------
// trackEvent – fire-and-forget event to /api/track-event
// ---------------------------------------------------------------------------
export type EventType = AnalyticsEventType;

export function isPreviewContext(): boolean {
  if (typeof window === "undefined") return false;
  // Inside an iframe (dashboard editor preview)
  if (window.self !== window.top) return true;
  // Opened directly with ?preview=true (admin review preview)
  const params = new URLSearchParams(window.location.search);
  return params.get("preview") === "true";
}

export function trackEvent(payload: AnalyticsEventInput) {
  if (typeof window === "undefined") return;
  if (isPreviewContext()) return;
  const resolvedProjectId = payload.project_id ?? window.PROJECT_ID;
  if (!resolvedProjectId) return;

  window.PROJECT_ID = resolvedProjectId;

  const canonicalType = canonicalizeAnalyticsEventType(payload.type);
  const pageVersionId =
    typeof payload.metadata?.page_version_id === "string"
      ? payload.metadata.page_version_id
      : resolvePageVersionId();

  enqueueEvent({
    event_type: canonicalType,
    timestamp: new Date().toISOString(),
    page: payload.page_slug ? `/${payload.page_slug}` : window.location.pathname,
    page_slug: payload.page_slug,
    element_id: payload.cta_id ?? payload.section_key,
    section_key: payload.section_key,
    cta_id: payload.cta_id,
    funnel_step: payload.funnel_step ?? defaultFunnelStepForEvent(canonicalType),
    metadata: {
      ...(payload.metadata ?? {}),
      page_version_id: stringifyPageVersionId(pageVersionId),
    },
  });
}

export function initializeAnalyticsSession(projectId?: string) {
  if (typeof window === "undefined") return;
  if (isPreviewContext()) return;
  const resolvedProjectId = projectId ?? window.PROJECT_ID;
  if (!resolvedProjectId) return;

  window.PROJECT_ID = resolvedProjectId;
  const sessionId = getOrCreateSessionId();
  const visitorId = getOrCreateVisitorId();
  const attribution = getSessionAttribution();

  fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_id: resolvedProjectId,
      session_id: sessionId,
      visitor_id: visitorId,
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      started_at: new Date().toISOString(),
      events: [],
    }),
    keepalive: true,
  }).catch(() => {});
}

export function useSessionTracking(projectId?: string) {
  useEffect(() => {
    if (!projectId) return;
    initializeAnalyticsSession(projectId);

    const flushBeforeUnload = () => {
      trackEvent({
        type: "session_end",
        project_id: projectId,
        metadata: { ended_at: new Date().toISOString() },
      });
      flushBufferedEvents();
    };

    window.addEventListener("beforeunload", flushBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", flushBeforeUnload);
      flushBufferedEvents();
    };
  }, [projectId]);
}

// ---------------------------------------------------------------------------
// usePageViewTracker – call inside a client component to track page views
// ---------------------------------------------------------------------------
export function usePageViewTracker(projectId?: string, pageVersionId?: string) {
  const pathname = usePathname();
  const tracked = useRef<string | null>(null);
  useEffect(() => {
    const key = `${projectId}:${pathname}`;
    if (tracked.current === key) return;
    // Deduplicate within the same session
    const ssKey = `pv-${pathname}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(ssKey)) return;
    tracked.current = key;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(ssKey, '1');
    const slug = pathname === "/" ? "" : pathname.replace(/^\//, "");
    trackEvent({
      type: "page_view",
      project_id: projectId,
      page_slug: slug,
      funnel_step: "landing",
      metadata: {
        page_version_id: stringifyPageVersionId(resolvePageVersionId(pageVersionId)),
      },
    });
  }, [pathname, projectId, pageVersionId]);
}

// ---------------------------------------------------------------------------
// useSectionTracker — IntersectionObserver for section_view + click delegation
// for cta_click. Call once inside the public site layout client component.
// ---------------------------------------------------------------------------
export function useSectionTracker(projectId?: string, pageVersionId?: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isPreviewContext()) return;
    const resolvedProjectId = projectId ?? window.PROJECT_ID;
    if (!resolvedProjectId) return;

    const viewedSections = new Set<string>();

    // IntersectionObserver — fires section_view once per section per session
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const sectionKey = el.dataset.section || el.dataset.sectionId;
          const sectionInstanceId = el.dataset.sectionInstanceId || sectionKey;
          if (!sectionKey || viewedSections.has(sectionInstanceId)) return;
          const sectionMeta = getSectionAnalyticsMetaFromDataset(el.dataset);
          viewedSections.add(sectionInstanceId);
          trackEvent({
            type: 'section_view',
            project_id: resolvedProjectId,
            section_key: sectionKey,
            metadata: buildSectionTrackingMetadata(sectionMeta, el.dataset, {
              page_version_id: stringifyPageVersionId(resolvePageVersionId(pageVersionId)),
            }),
          });
        });
      },
      { threshold: 0.2 }
    );

    const observe = () => {
      document.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => {
        observer.observe(el);
      });
    };

    observe();
    // Re-observe after a short delay in case sections mount late
    const t = setTimeout(observe, 1500);

    // Click delegation — fires cta_click when a button/link inside a section is clicked
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"]') as HTMLElement | null;
      if (!clickable) return;
      const section = clickable.closest<HTMLElement>('[data-section]');
      if (!section) return;
      const sectionKey = section.dataset.section || section.dataset.sectionId;
      if (!sectionKey) return;
      const sectionMeta = getSectionAnalyticsMetaFromDataset(section.dataset);
      const label =
        clickable.getAttribute('aria-label') ||
        (clickable as HTMLAnchorElement).innerText?.trim().slice(0, 60) ||
        undefined;
      const ctaRole = sectionMeta?.isHero
        ? clickable.tagName.toLowerCase() === 'button' || clickable.getAttribute('role') === 'button'
          ? 'hero_primary'
          : 'hero_secondary'
        : 'section';
      trackEvent({
        type: 'cta_click',
        project_id: resolvedProjectId,
        section_key: sectionKey,
        cta_id: label,
        metadata: buildSectionTrackingMetadata(sectionMeta, section.dataset, {
          cta_role: ctaRole,
          page_version_id: stringifyPageVersionId(resolvePageVersionId(pageVersionId)),
        }),
      });
    };

    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      observer.disconnect();
      clearTimeout(t);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [projectId, pageVersionId]);
}

// ---------------------------------------------------------------------------
// Google Analytics (GA4)
// ---------------------------------------------------------------------------
export function GoogleAnalytics({ id }: { id: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!id || !window.gtag) return;
    const url = pathname + searchParams.toString();
    window.gtag("config", id, { page_path: url });
  }, [pathname, searchParams, id]);

  if (!id) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Facebook Pixel
// ---------------------------------------------------------------------------

export function FacebookPixel({ id }: { id: string }) {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!id || typeof window.fbq !== "function") return;
    if (!initialized.current) {
      initialized.current = true;
      return; // skip first run — pixel init script already fires PageView
    }
    window.fbq("track", "PageView");
  }, [pathname, id]);

  if (!id) return null;

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${id}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Lead tracking — shared payload + pixels
// ---------------------------------------------------------------------------

type LeadType = "messenger" | "call" | "form" | "viber";

function fireLeadPixels(type: LeadType) {
  const eventLabel = type.charAt(0).toUpperCase() + type.slice(1);
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      event_category: "Engagement",
      event_label: eventLabel,
      method: type,
    });
  }
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: eventLabel,
      content_category: "Lead",
    });
  }
}

function buildLeadTrackPayload(
  type: LeadType,
  resolvedProjectId: string,
  extraMetadata?: Record<string, string>,
  sectionKey?: string,
  pageSlug?: string
) {
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = urlParams.get(key);
    if (val) utmFields[key] = val;
  });

  const firstTouch = getOrCreateFirstTouch();

  const sectionMeta = sectionKey ? getSectionAnalyticsMeta(sectionKey) : null;
  const pageVersionId = resolvePageVersionId();

  return {
    type,
    project_id: resolvedProjectId,
    page_slug: pageSlug ?? window.location.pathname.replace(/^\//, "") ?? undefined,
    section_key: sectionKey ?? undefined,
    source: resolveTrafficSource(),
    visitor_id: getOrCreateVisitorId(),
    session_id: getOrCreateSessionId(),
    first_touch_source: firstTouch.source,
    first_touch_utm: firstTouch.utm,
    honeypot: "",
    metadata: {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      ua: navigator.userAgent,
      page_version_id: stringifyPageVersionId(pageVersionId),
      ...utmFields,
      ...extraMetadata,
      ...sectionMetaToEventMetadata(sectionMeta),
    },
  };
}

/**
 * Awaitable form submission — persists lead, triggers optional email to site owner, returns success/error.
 * Use for contact sections so visitors see errors instead of a silent failure.
 */
export async function submitFormLead(
  projectId?: string,
  extraMetadata?: Record<string, string>,
  sectionKey?: string,
  pageSlug?: string
): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined") return { ok: false, error: "unavailable" };
  if (isPreviewContext()) return { ok: true };

  const resolvedProjectId = projectId ?? window.PROJECT_ID;
  fireLeadPixels("form");
  if (!resolvedProjectId) return { ok: false, error: "Missing project" };

  const basePayload = buildLeadTrackPayload("form", resolvedProjectId, extraMetadata, sectionKey, pageSlug);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  try {
    if (siteKey && typeof window.grecaptcha !== "undefined") {
      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action: "lead_form" }).then(resolve).catch(reject);
        });
      });
      const r = await fetch("/api/track-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basePayload, recaptchaToken: token }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      return r.ok ? { ok: true } : { ok: false, error: j.error || "Request failed" };
    }

    const r = await fetch("/api/track-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(basePayload),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    return r.ok ? { ok: true } : { ok: false, error: j.error || "Request failed" };
  } catch {
    return { ok: false, error: "network" };
  }
}

// ---------------------------------------------------------------------------
// trackLead — uses sendBeacon for fire-and-forget reliability
// Falls back to fetch if sendBeacon is unavailable
// ---------------------------------------------------------------------------

export function trackLead(
  type: LeadType,
  projectId?: string,
  extraMetadata?: Record<string, string>,
  sectionKey?: string,
  pageSlug?: string
) {
  if (typeof window === "undefined") return;
  if (isPreviewContext()) return;

  const resolvedProjectId = projectId ?? window.PROJECT_ID;
  fireLeadPixels(type);

  if (!resolvedProjectId) return;

  const basePayload = buildLeadTrackPayload(type, resolvedProjectId, extraMetadata, sectionKey, pageSlug);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (type === "form" && siteKey && typeof window.grecaptcha !== "undefined") {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action: "lead_form" }).then((token) => {
        fetch("/api/track-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...basePayload, recaptchaToken: token }),
          keepalive: true,
        }).catch(() => {});
      }).catch(() => {});
    });
    return;
  }

  const payload = JSON.stringify(basePayload);
  const sent =
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon("/api/track-lead", new Blob([payload], { type: "application/json" }));

  if (!sent) {
    fetch("/api/track-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Type augmentation
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
    PROJECT_ID?: string; // kept for backward-compat; prefer AnalyticsContext
    PAGE_VERSION_ID?: string;
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
