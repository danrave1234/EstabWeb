import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { headers } from "next/headers"
import { trackEventLimiter } from "@/lib/security/rate-limit"
import { buildEventInsert, buildSessionUpsert } from "@/lib/analytics/server-ingest"
import { isValidAnalyticsEventType, type AnalyticsEventType, type FunnelStep } from "@/lib/analytics/event-schema"

type BatchEventPayload = {
  event_type: AnalyticsEventType
  timestamp?: string
  page?: string
  page_slug?: string
  element_id?: string
  section_key?: string
  cta_id?: string
  metadata?: Record<string, unknown>
  funnel_step?: FunnelStep
}

type LegacyEventPayload = {
  type: AnalyticsEventType
  project_id: string
  timestamp?: string
  page_slug?: string
  section_key?: string
  cta_id?: string
  source?: string
  funnel_step?: FunnelStep
  visitor_id?: string
  session_id?: string
  event_id?: string
  metadata?: Record<string, unknown>
}

function normalizePageSlug(value?: string | null) {
  if (!value) return null
  return value.replace(/^\//, "")
}

export async function POST(request: Request) {
  try {
    const hdrs = await headers()
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown"

    const city = hdrs.get("x-vercel-ip-city")
    const region = hdrs.get("x-vercel-ip-country-region")
    const country = hdrs.get("x-vercel-ip-country")
    const userAgent = hdrs.get("user-agent")

    const rl = await trackEventLimiter.check(ip)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()
    const geoMeta = { geo_city: city, geo_region: region, geo_country: country }

    const isBatch = Array.isArray((body as { events?: unknown[] }).events)
    const {
      project_id,
      source,
      visitor_id,
      session_id,
      medium,
      campaign,
      started_at,
      ended_at,
    } = body as {
      project_id: string
      source?: string
      visitor_id?: string
      session_id?: string
      medium?: string
      campaign?: string
      started_at?: string
      ended_at?: string
    }

    if (!project_id || typeof project_id !== "string") {
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 })
    }

    const events = isBatch
      ? ((body as { events: BatchEventPayload[] }).events ?? []).map((event) => ({
          type: event.event_type,
          timestamp: event.timestamp,
          page_slug: normalizePageSlug(event.page_slug ?? event.page),
          section_key: event.section_key ?? event.element_id,
          cta_id: event.cta_id ?? event.element_id,
          metadata: event.metadata,
          funnel_step: event.funnel_step,
        }))
      : [body as LegacyEventPayload]

    if (events.length === 0) {
      return NextResponse.json({ error: "Missing events" }, { status: 400 })
    }

    if (events.some((event) => !event.type || !isValidAnalyticsEventType(event.type))) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
    }

    if (events.every((event) => event.page_slug && /^preview\//i.test(event.page_slug))) {
      return NextResponse.json({ success: true })
    }

    const supabase = createServiceClient()
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", project_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Invalid project_id" }, { status: 400 })
    }

    if (session_id) {
      const { error: sessionError } = await supabase.from("project_sessions").upsert(
        buildSessionUpsert({
          id: session_id,
          project_id,
          visitor_id,
          source,
          medium,
          campaign,
          country,
          userAgent,
          startedAt: started_at,
          endedAt: ended_at,
        }),
        { onConflict: "id" },
      )

      if (sessionError) {
        console.error("[track-event] session upsert error:", sessionError.message)
        return NextResponse.json({ error: "Failed to persist session" }, { status: 500 })
      }
    }

    const rows = events
      .filter((event) => !(event.page_slug && /^preview\//i.test(event.page_slug)))
      .map((event) =>
        buildEventInsert(
          {
            type: event.type,
            project_id,
            page_slug: event.page_slug,
            section_key: event.section_key,
            cta_id: event.cta_id,
            source: source ?? null,
            visitor_id: visitor_id ?? null,
            session_id: session_id ?? null,
            event_id: isBatch ? crypto.randomUUID() : (body as LegacyEventPayload).event_id ?? crypto.randomUUID(),
            funnel_step: event.funnel_step,
            timestamp: event.timestamp,
            metadata: event.metadata,
          },
          geoMeta,
        ),
      )

    if (rows.length === 0) {
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from("project_events").insert(rows)

    if (error) {
      console.error("[track-event] Supabase insert error:", error.message)
      return NextResponse.json({ error: "Failed to persist event" }, { status: 500 })
    }

    return NextResponse.json({ success: true, inserted: rows.length })
  } catch (err) {
    console.error("[track-event] Unexpected error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
