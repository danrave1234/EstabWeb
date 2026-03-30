import {
  canonicalizeAnalyticsEventType,
  defaultFunnelStepForEvent,
  detectDeviceType,
  type AnalyticsEventType,
  type FunnelStep,
} from "@/lib/analytics/event-schema"

type SessionUpsertInput = {
  id: string
  project_id: string
  visitor_id?: string | null
  source?: string | null
  medium?: string | null
  campaign?: string | null
  country?: string | null
  userAgent?: string | null
  startedAt?: string | null
  endedAt?: string | null
}

type EventInsertInput = {
  type: AnalyticsEventType
  project_id: string
  page_slug?: string | null
  section_key?: string | null
  cta_id?: string | null
  source?: string | null
  visitor_id?: string | null
  session_id?: string | null
  event_id?: string | null
  funnel_step?: FunnelStep | null
  timestamp?: string | null
  metadata?: Record<string, unknown> | null
}

export function buildSessionUpsert(input: SessionUpsertInput) {
  return {
    id: input.id,
    project_id: input.project_id,
    visitor_id: input.visitor_id ?? null,
    source: input.source ?? null,
    medium: input.medium ?? null,
    campaign: input.campaign ?? null,
    device: detectDeviceType(input.userAgent),
    country: input.country ?? null,
    started_at: input.startedAt ?? new Date().toISOString(),
    ended_at: input.endedAt ?? null,
  }
}

export function buildEventInsert(input: EventInsertInput, geoMeta: Record<string, unknown>) {
  const eventType = canonicalizeAnalyticsEventType(input.type)
  return {
    project_id: input.project_id,
    event_type: eventType,
    page_slug: input.page_slug ?? null,
    section_key: input.section_key ?? null,
    cta_id: input.cta_id ?? null,
    source: input.source ?? null,
    visitor_id: input.visitor_id ?? null,
    session_id: input.session_id ?? null,
    event_id: input.event_id ?? null,
    funnel_step: input.funnel_step ?? defaultFunnelStepForEvent(eventType) ?? null,
    created_at: input.timestamp ?? new Date().toISOString(),
    metadata: {
      ...(input.metadata ?? {}),
      ...geoMeta,
    },
  }
}
