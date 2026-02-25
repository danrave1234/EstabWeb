"use client";

import Script from "next/script";
import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Analytics Context — replaces window.PROJECT_ID global
// ---------------------------------------------------------------------------

const AnalyticsContext = createContext<string | undefined>(undefined);

function PageViewTrackerInner({ projectId }: { projectId?: string }) {
  usePageViewTracker(projectId);
  return null;
}

export function AnalyticsProvider({
  projectId,
  children,
}: {
  projectId?: string;
  children: React.ReactNode;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <AnalyticsContext.Provider value={projectId}>
      <PageViewTrackerInner projectId={projectId} />
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
  return useContext(AnalyticsContext);
}

// ---------------------------------------------------------------------------
// Traffic source resolver
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
export type EventType =
  | 'page_view'
  | 'section_view'
  | 'cta_click'
  | 'lead_submit'
  | 'lead_form'
  | 'lead_call'
  | 'lead_messenger'
  | 'lead_viber';

export function trackEvent(payload: {
  type: EventType;
  project_id?: string;
  page_slug?: string;
  section_key?: string;
  cta_id?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}) {
  if (typeof window === "undefined") return;
  const resolvedProjectId = payload.project_id ?? window.PROJECT_ID;
  if (!resolvedProjectId) return;
  const body = JSON.stringify({
    ...payload,
    project_id: resolvedProjectId,
    source: payload.source ?? resolveTrafficSource(),
  });
  const sent =
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(
      "/api/track-event",
      new Blob([body], { type: "application/json" })
    );
  if (!sent) {
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// usePageViewTracker – call inside a client component to track page views
// ---------------------------------------------------------------------------
export function usePageViewTracker(projectId?: string) {
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
    });
  }, [pathname, projectId]);
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
// trackLead — uses sendBeacon for fire-and-forget reliability
// Falls back to fetch if sendBeacon is unavailable
// ---------------------------------------------------------------------------

export function trackLead(
  type: "messenger" | "call" | "form" | "viber",
  projectId?: string,
  extraMetadata?: Record<string, string>,
  sectionKey?: string,
  pageSlug?: string
) {
  if (typeof window === "undefined") return;

  const resolvedProjectId = projectId ?? window.PROJECT_ID;
  const eventLabel = type.charAt(0).toUpperCase() + type.slice(1);

  // GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      event_category: "Engagement",
      event_label: eventLabel,
      method: type,
    });
  }

  // Facebook Pixel
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: eventLabel,
      content_category: "Lead",
    });
  }

  if (!resolvedProjectId) return;

  // Auto-capture UTM params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = urlParams.get(key);
    if (val) utmFields[key] = val;
  });

  const basePayload = {
    type,
    project_id: resolvedProjectId,
    page_slug: pageSlug ?? window.location.pathname.replace(/^\//, '') ?? undefined,
    section_key: sectionKey ?? undefined,
    honeypot: "", // always empty for real users; bots may fill this
    metadata: {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      ua: navigator.userAgent,
      ...utmFields,
      ...extraMetadata,
    },
  };

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // For form leads: get reCAPTCHA v3 token first, then POST via fetch
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

  // For non-form leads (call, messenger, viber): fire-and-forget via sendBeacon
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
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
