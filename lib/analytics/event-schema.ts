export const VALID_EVENT_TYPES = [
  "page_view",
  "section_view",
  "section_attention",
  "view_section",
  "cta_click",
  "click_cta",
  "lead_submit",
  "lead_form",
  "lead_call",
  "lead_messenger",
  "lead_viber",
  "map_interact",
  "scroll_depth",
  "scroll",
  "click_map",
  "form_start",
  "form_submit",
  "session_start",
  "session_end",
] as const

export type AnalyticsEventType = (typeof VALID_EVENT_TYPES)[number]

export type CanonicalAnalyticsEventType =
  | "page_view"
  | "section_view"
  | "section_attention"
  | "cta_click"
  | "lead_submit"
  | "lead_form"
  | "lead_call"
  | "lead_messenger"
  | "lead_viber"
  | "map_interact"
  | "scroll_depth"
  | "click_map"
  | "form_start"
  | "form_submit"
  | "session_start"
  | "session_end"

export type FunnelStep = "landing" | "engaged" | "cta" | "lead"

export type AnalyticsEventInput = {
  type: AnalyticsEventType
  project_id?: string
  page_slug?: string
  section_key?: string
  cta_id?: string
  source?: string
  funnel_step?: FunnelStep
  metadata?: Record<string, unknown>
}

export function isValidAnalyticsEventType(type: string): type is AnalyticsEventType {
  return VALID_EVENT_TYPES.includes(type as AnalyticsEventType)
}

export function canonicalizeAnalyticsEventType(type: AnalyticsEventType): CanonicalAnalyticsEventType {
  if (type === "view_section") return "section_view"
  if (type === "click_cta") return "cta_click"
  if (type === "scroll") return "scroll_depth"
  return type
}

export function defaultFunnelStepForEvent(type: CanonicalAnalyticsEventType): FunnelStep | undefined {
  switch (type) {
    case "page_view":
      return "landing"
    case "section_view":
    case "section_attention":
    case "scroll_depth":
    case "form_start":
    case "click_map":
    case "map_interact":
      return "engaged"
    case "cta_click":
      return "cta"
    case "form_submit":
    case "lead_submit":
    case "lead_form":
    case "lead_call":
    case "lead_messenger":
    case "lead_viber":
      return "lead"
    default:
      return undefined
  }
}

export function detectDeviceType(userAgent: string | null | undefined): string {
  if (!userAgent) return "unknown"
  const value = userAgent.toLowerCase()
  if (/tablet|ipad/.test(value)) return "tablet"
  if (/mobile|android|iphone/.test(value)) return "mobile"
  return "desktop"
}
