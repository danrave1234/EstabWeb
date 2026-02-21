"use client";

import Script from "next/script";
import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Analytics Context — replaces window.PROJECT_ID global
// ---------------------------------------------------------------------------

const AnalyticsContext = createContext<string | undefined>(undefined);

export function AnalyticsProvider({
  projectId,
  children,
}: {
  projectId?: string;
  children: React.ReactNode;
}) {
  return (
    <AnalyticsContext.Provider value={projectId}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useProjectId() {
  return useContext(AnalyticsContext);
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
  extraMetadata?: Record<string, string>
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

  // Auto-capture UTM params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = urlParams.get(key);
    if (val) utmFields[key] = val;
  });

  // Server-side persistence via sendBeacon (survives tab close)
  if (resolvedProjectId) {
    const payload = JSON.stringify({
      type,
      project_id: resolvedProjectId,
      metadata: {
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        ua: navigator.userAgent,
        ...utmFields,
        ...extraMetadata,
      },
    });

    const sent =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon("/api/track-lead", new Blob([payload], { type: "application/json" }));

    if (!sent) {
      // Fallback for environments where sendBeacon is unavailable
      fetch("/api/track-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
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
  }
}
