import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { headers } from "next/headers";

const VALID_EVENT_TYPES = [
  "page_view",
  "section_view",
  "cta_click",
  "lead_submit",
  "lead_form",
  "lead_call",
  "lead_messenger",
  "lead_viber",
  "map_interact",
  "scroll_depth",
  "click_map",
  "form_start",
  "session_start",
  "session_end",
] as const;
type EventType = (typeof VALID_EVENT_TYPES)[number];

// Simple in-memory rate limiter: IP -> { count, resetAt }
const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";

    // Capture geolocation from Vercel headers
    const city    = hdrs.get("x-vercel-ip-city");
    const region  = hdrs.get("x-vercel-ip-country-region");
    const country = hdrs.get("x-vercel-ip-country");

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const {
      type,
      project_id,
      page_slug,
      section_key,
      cta_id,
      source,
      funnel_step,
      visitor_id,
      session_id,
      event_id,
      metadata,
    } = body as {
      type: EventType;
      project_id: string;
      page_slug?: string;
      section_key?: string;
      cta_id?: string;
      source?: string;
      funnel_step?: string;
      visitor_id?: string;
      session_id?: string;
      event_id?: string;
      metadata?: Record<string, unknown>;
    };

    if (!type || !VALID_EVENT_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    if (!project_id || typeof project_id !== "string") {
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Validate project exists
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", project_id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Invalid project_id" }, { status: 400 });
    }

    const { error } = await supabase.from("project_events").insert({
      project_id,
      event_type:  type,
      page_slug:   page_slug   ?? null,
      section_key: section_key ?? null,
      cta_id:      cta_id      ?? null,
      source:      source      ?? null,
      funnel_step: funnel_step ?? null,
      visitor_id:  visitor_id  ?? null,
      session_id:  session_id  ?? null,
      event_id:    event_id    ?? null,
      metadata: {
        ...(metadata ?? {}),
        geo_city:    city,
        geo_region:  region,
        geo_country: country,
      },
    });

    if (error) {
      console.error("[track-event] Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to persist event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[track-event] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
