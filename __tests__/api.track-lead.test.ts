// Tests for POST /api/track-lead
// Verifies honeypot, lead-type validation, rate limiting, DB inserts, and reCAPTCHA bypass.

const mockLeadsInsert = jest.fn()
const mockEventsInsert = jest.fn()

jest.mock("@/lib/email/lead-notification", () => ({
  sendLeadFormNotification: jest.fn(() => Promise.resolve()),
}))

const mockProjectsMaybeSingle = jest.fn(() =>
  Promise.resolve({
    data: { current_config: { contact: { email: "owner@example.com" } } },
    error: null,
  }),
)

jest.mock("@/lib/supabase/service", () => ({
  createServiceClient: jest.fn(() => ({
    from: jest.fn((table: string) => {
      if (table === "project_leads") return { insert: mockLeadsInsert }
      if (table === "project_events") return { insert: mockEventsInsert }
      if (table === "projects")
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({ maybeSingle: mockProjectsMaybeSingle })),
          })),
        }
      return {}
    }),
  })),
}))

const mockHeaders = jest.fn()
jest.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}))

function makeHeaderMap(overrides: Record<string, string> = {}) {
  const map: Record<string, string | null> = {
    "x-forwarded-for": "5.6.7.8",
    "x-real-ip": null,
    "x-vercel-ip-city": null,
    "x-vercel-ip-country-region": null,
    "x-vercel-ip-country": null,
    ...overrides,
  }
  return { get: (k: string) => map[k] ?? null }
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/track-lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/track-lead", () => {
  let POST: (req: Request) => Promise<Response>

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    delete process.env.RECAPTCHA_SECRET_KEY
    mockHeaders.mockReturnValue(makeHeaderMap())
    POST = require("@/app/api/track-lead/route").POST
  })

  // --- Honeypot ---
  it("returns 200 silently when honeypot field is filled (bot detected)", async () => {
    const res = await POST(makeRequest({ type: "form", project_id: "proj-1", honeypot: "i-am-a-bot" }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockLeadsInsert).not.toHaveBeenCalled()
  })

  // --- Validation ---
  it("returns 400 for an invalid lead type", async () => {
    const res = await POST(makeRequest({ type: "email", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/invalid lead type/i)
  })

  it("returns 400 when project_id is missing", async () => {
    const res = await POST(makeRequest({ type: "form" }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/missing project_id/i)
  })

  // --- Successful leads for every type ---
  const LEAD_TYPES = ["form", "call", "messenger", "viber"] as const
  const EVENT_MAP: Record<string, string> = {
    form: "lead_form",
    call: "lead_call",
    messenger: "lead_messenger",
    viber: "lead_viber",
  }

  for (const type of LEAD_TYPES) {
    it(`returns 200 and inserts project_leads + project_events for type="${type}"`, async () => {
      jest.resetModules()
      mockHeaders.mockReturnValue(makeHeaderMap())
      POST = require("@/app/api/track-lead/route").POST
      mockLeadsInsert.mockResolvedValue({ error: null })
      mockEventsInsert.mockResolvedValue({ error: null })

      const res = await POST(makeRequest({ type, project_id: "proj-1", page_slug: "home", source: "organic" }))
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(mockLeadsInsert).toHaveBeenCalledWith(
        expect.objectContaining({ project_id: "proj-1", type }),
      )
      expect(mockEventsInsert).toHaveBeenCalledWith(
        expect.objectContaining({ project_id: "proj-1", event_type: EVENT_MAP[type], page_slug: "home", source: "organic" }),
      )
    })
  }

  // --- Identity + attribution fields ---
  it("stores visitor_id, session_id, first_touch_source, first_touch_utm in project_leads", async () => {
    jest.resetModules()
    mockHeaders.mockReturnValue(makeHeaderMap())
    POST = require("@/app/api/track-lead/route").POST
    mockLeadsInsert.mockResolvedValue({ error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    await POST(makeRequest({
      type: "call",
      project_id: "proj-1",
      visitor_id: "vis-abc",
      session_id: "ses-xyz",
      first_touch_source: "google",
      first_touch_utm: { utm_source: "google", utm_campaign: "summer" },
    }))
    expect(mockLeadsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        visitor_id:         "vis-abc",
        session_id:         "ses-xyz",
        first_touch_source: "google",
        first_touch_utm:    { utm_source: "google", utm_campaign: "summer" },
      }),
    )
  })

  it("sets funnel_step=lead on the project_events insert", async () => {
    jest.resetModules()
    mockHeaders.mockReturnValue(makeHeaderMap())
    POST = require("@/app/api/track-lead/route").POST
    mockLeadsInsert.mockResolvedValue({ error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    await POST(makeRequest({ type: "form", project_id: "proj-1", visitor_id: "vis-1", session_id: "ses-1" }))
    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({ funnel_step: "lead", visitor_id: "vis-1", session_id: "ses-1" }),
    )
  })

  // --- DB errors ---
  it("returns 500 when project_leads insert fails", async () => {
    mockLeadsInsert.mockResolvedValue({ error: { message: "db error" } })

    const res = await POST(makeRequest({ type: "call", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(500)
    expect(json.error).toMatch(/failed to persist lead/i)
  })

  it("still returns 200 when project_events insert fails (non-fatal)", async () => {
    mockLeadsInsert.mockResolvedValue({ error: null })
    mockEventsInsert.mockResolvedValue({ error: { message: "event error" } })

    const res = await POST(makeRequest({ type: "messenger", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  // --- Geo metadata ---
  it("passes Vercel geo headers into metadata", async () => {
    mockHeaders.mockReturnValue(
      makeHeaderMap({
        "x-vercel-ip-city": "Cebu",
        "x-vercel-ip-country-region": "07",
        "x-vercel-ip-country": "PH",
      }),
    )
    jest.resetModules()
    POST = require("@/app/api/track-lead/route").POST
    mockLeadsInsert.mockResolvedValue({ error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    await POST(makeRequest({ type: "viber", project_id: "proj-1" }))
    expect(mockLeadsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ geo_city: "Cebu", geo_country: "PH" }),
      }),
    )
  })

  // --- reCAPTCHA ---
  it("returns 400 for form lead when reCAPTCHA key is set but token is missing", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret"
    jest.resetModules()
    mockHeaders.mockReturnValue(makeHeaderMap())
    POST = require("@/app/api/track-lead/route").POST

    const res = await POST(makeRequest({ type: "form", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/missing verification token/i)
  })

  it("skips reCAPTCHA check for non-form lead types even when key is set", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret"
    jest.resetModules()
    mockHeaders.mockReturnValue(makeHeaderMap())
    POST = require("@/app/api/track-lead/route").POST
    mockLeadsInsert.mockResolvedValue({ error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ type: "call", project_id: "proj-1" }))
    expect(res.status).toBe(200)
  })

  // --- Rate limiting ---
  it("returns 429 after exceeding 10 requests per hour from the same IP", async () => {
    mockLeadsInsert.mockResolvedValue({ error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    for (let i = 0; i < 10; i++) {
      await POST(makeRequest({ type: "call", project_id: "proj-1" }))
    }
    const res = await POST(makeRequest({ type: "call", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(429)
    expect(json.error).toMatch(/rate limit/i)
  })
})
