import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

const VALID_TYPES = ["messenger", "call", "form", "viber"] as const;
type LeadType = (typeof VALID_TYPES)[number];

const EVENT_TYPE_MAP: Record<LeadType, string> = {
  form: "lead_form",
  call: "lead_call",
  messenger: "lead_messenger",
  viber: "lead_viber",
};

// ---------------------------------------------------------------------------
// Rate limiter: 10 requests per IP per hour (in-memory, resets on cold start)
// ---------------------------------------------------------------------------
const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
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

    // Rate limit check
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const {
      type,
      project_id,
      page_slug,
      section_key,
      source,
      metadata,
      recaptchaToken,
      honeypot,
    } = body as {
      type: LeadType;
      project_id: string;
      page_slug?: string;
      section_key?: string;
      source?: string;
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

    // reCAPTCHA v3 verification (only for form leads)
    if (type === "form") {
      if (!recaptchaToken) {
        return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
      }
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return NextResponse.json({ error: "Bot detected" }, { status: 403 });
      }
    }

    const supabase = await createClient();

    // Insert into project_leads (existing behaviour)
    const { error: leadError } = await supabase.from("project_leads").insert({
      project_id,
      type,
      metadata: metadata ?? {},
    });

    if (leadError) {
      console.error("[track-lead] project_leads insert error:", leadError.message);
      return NextResponse.json({ error: "Failed to persist lead" }, { status: 500 });
    }

    // Also insert into project_events for funnel tracking
    const event_type = EVENT_TYPE_MAP[type];
    const { error: eventError } = await supabase.from("project_events").insert({
      project_id,
      event_type,
      page_slug: page_slug ?? null,
      section_key: section_key ?? null,
      cta_id: null,
      source: source ?? null,
      metadata: metadata ?? {},
    });

    if (eventError) {
      // Non-fatal: lead was already saved, just log
      console.error("[track-lead] project_events insert error:", eventError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[track-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
