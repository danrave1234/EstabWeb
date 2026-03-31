import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { headers } from "next/headers";
import { sendLeadFormNotification } from "@/lib/email/lead-notification";
import { trackLeadLimiter } from "@/lib/security/rate-limit";
import { buildEventInsert, buildSessionUpsert } from "@/lib/analytics/server-ingest";
import type { AnalyticsEventType } from "@/lib/analytics/event-schema";

const VALID_TYPES = ["messenger", "call", "form", "viber"] as const;
type LeadType = (typeof VALID_TYPES)[number];

const EVENT_TYPE_MAP: Record<LeadType, AnalyticsEventType> = {
  form:      "lead_form",
  call:      "lead_call",
  messenger: "lead_messenger",
  viber:     "lead_viber",
};

// ---------------------------------------------------------------------------
// reCAPTCHA v3 verification
// ---------------------------------------------------------------------------
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // skip if not configured

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json() as { success: boolean; score?: number; action?: string };
    // Require score >= 0.5 (0 = bot, 1 = human)
    return data.success && (data.score ?? 1) >= 0.5;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";

    // Capture geolocation from Vercel headers
    const city    = hdrs.get("x-vercel-ip-city");
    const region  = hdrs.get("x-vercel-ip-country-region");
    const country = hdrs.get("x-vercel-ip-country");

    // Rate limit check
    const rl = await trackLeadLimiter.check(ip);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const {
      type,
      project_id,
      page_slug,
      section_key,
      source,
      visitor_id,
      session_id,
      first_touch_source,
      first_touch_utm,
      metadata,
      recaptchaToken,
      honeypot,
    } = body as {
      type: LeadType;
      project_id: string;
      page_slug?: string;
      section_key?: string;
      source?: string;
      visitor_id?: string;
      session_id?: string;
      first_touch_source?: string;
      first_touch_utm?: Record<string, string>;
      metadata?: Record<string, string>;
      recaptchaToken?: string;
      honeypot?: string;
    };

    // Honeypot: bots fill hidden fields, humans don't
    if (honeypot) {
      // Silently accept to not reveal detection to bots
      return NextResponse.json({ success: true });
    }

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid lead type" }, { status: 400 });
    }

    if (!project_id || typeof project_id !== "string") {
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
    }

    // reCAPTCHA v3 verification is optional for public tenant forms because
    // client sites can run on custom domains/subdomains that are not allowed by
    // the hub reCAPTCHA site key. When a token is present, still verify it.
    if (type === "form" && process.env.RECAPTCHA_SECRET_KEY && recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return NextResponse.json({ error: "Bot detected" }, { status: 403 });
      }
    }

    // Use service client — bypasses RLS for server-side inserts
    const supabase = createServiceClient();

    const geoMeta = { geo_city: city, geo_region: region, geo_country: country };
    const userAgent = hdrs.get("user-agent");

    if (session_id) {
      const { error: sessionError } = await supabase.from("project_sessions").upsert(
        buildSessionUpsert({
          id: session_id,
          project_id,
          visitor_id,
          source,
          country,
          userAgent,
        }),
        { onConflict: "id" },
      );

      if (sessionError) {
        console.error("[track-lead] project_sessions upsert error:", sessionError.message);
        return NextResponse.json({ error: "Failed to persist lead session" }, { status: 500 });
      }
    }

    // Insert into project_leads (CRM record)
    const { error: leadError } = await supabase.from("project_leads").insert({
      project_id,
      type,
      page_slug:          page_slug          ?? null,
      section_key:        section_key        ?? null,
      source:             source             ?? null,
      visitor_id:         visitor_id         ?? null,
      session_id:         session_id         ?? null,
      first_touch_source: first_touch_source ?? null,
      first_touch_utm:    first_touch_utm    ?? null,
      metadata: { ...(metadata ?? {}), ...geoMeta },
    });

    if (leadError) {
      console.error("[track-lead] project_leads insert error:", leadError.message);
      return NextResponse.json({ error: "Failed to persist lead" }, { status: 500 });
    }

    // Also insert into project_events for funnel tracking
    const event_type = EVENT_TYPE_MAP[type];
    const { error: eventError } = await supabase.from("project_events").insert(
      buildEventInsert(
        {
          type: event_type,
          project_id,
          page_slug: page_slug ?? null,
          section_key: section_key ?? null,
          source: source ?? null,
          visitor_id: visitor_id ?? null,
          session_id: session_id ?? null,
          funnel_step: "lead",
          metadata: metadata ?? {},
        },
        geoMeta,
      ),
    );

    if (eventError) {
      // Non-fatal: lead was already saved, just log
      console.error("[track-lead] project_events insert error:", eventError.message);
    }

    const { data: projectRow } = await supabase
      .from("projects")
      .select("user_id, current_config, subdomain, custom_domain")
      .eq("id", project_id)
      .maybeSingle();

    if (projectRow?.user_id) {
      const config = projectRow.current_config as any;
      const brandName = config?.brand?.name || config?.siteName || "Your Website";
      
      const { error: notifError } = await supabase.from("notifications").insert({
        user_id: projectRow.user_id,
        project_id,
        type: "lead",
        title: `New Lead: ${brandName}`,
        message: `You received a new ${type} lead${source ? ` from ${source}` : ""}.`,
        action_url: `/dashboard/analytics?project=${project_id}`,
      });
      if (notifError) {
        console.error("[track-lead] Failed to insert notification:", notifError.message);
      }
    }

    if (type === "form") {
      const config = projectRow?.current_config as any;
      const brandName = config?.brand?.name || config?.siteName || null;
      const domain = projectRow?.custom_domain || (projectRow?.subdomain ? `${projectRow.subdomain}.estabweb.com` : null);

      void sendLeadFormNotification({
        currentConfig: projectRow?.current_config,
        projectId: project_id,
        brandName,
        domain,
        metadata: { ...(metadata ?? {}), ...geoMeta },
        pageSlug: page_slug ?? null,
      }).catch((err) => console.error("[track-lead] lead notification email:", err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[track-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
