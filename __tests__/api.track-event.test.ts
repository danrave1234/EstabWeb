// Tests for POST /api/track-event
// Verifies event-type validation, project lookup, DB insert, and rate limiting.

const mockProjectSingle = jest.fn()
const mockEventsInsert = jest.fn()

jest.mock("@/lib/supabase/service", () => ({
  createServiceClient: jest.fn(() => ({
    from: jest.fn((table: string) => {
      if (table === "projects") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({ single: mockProjectSingle })),
          })),
        }
      }
      if (table === "project_events") {
        return { insert: mockEventsInsert }
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
    "x-forwarded-for": "1.2.3.4",
    "x-real-ip": null,
    "x-vercel-ip-city": null,
    "x-vercel-ip-country-region": null,
    "x-vercel-ip-country": null,
    ...overrides,
  }
  return { get: (k: string) => map[k] ?? null }
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/track-event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/track-event", () => {
  let POST: (req: Request) => Promise<Response>

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    mockHeaders.mockReturnValue(makeHeaderMap())
    // Re-require after resetModules so the in-memory rate-limit map is fresh
    POST = require("@/app/api/track-event/route").POST
  })

  it("returns 400 for an invalid event type", async () => {
    const res = await POST(makeRequest({ type: "bad_event", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/invalid event type/i)
  })

  it("returns 400 when project_id is missing", async () => {
    const res = await POST(makeRequest({ type: "page_view" }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/missing project_id/i)
  })

  it("returns 400 when project does not exist", async () => {
    mockProjectSingle.mockResolvedValue({ data: null, error: null })

    const res = await POST(makeRequest({ type: "page_view", project_id: "unknown" }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toMatch(/invalid project_id/i)
  })

  it("returns 200 and inserts event for a valid page_view", async () => {
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ type: "page_view", project_id: "proj-1", page_slug: "home" }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({ project_id: "proj-1", event_type: "page_view", page_slug: "home" }),
    )
  })

  it("accepts lead_submit as a valid event type", async () => {
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ type: "lead_submit", project_id: "proj-1" }))
    expect(res.status).toBe(200)
  })

  it("accepts all declared valid event types", async () => {
    const VALID = ["page_view", "section_view", "cta_click", "lead_submit", "lead_form", "lead_call", "lead_messenger", "lead_viber", "map_interact", "scroll_depth", "click_map", "form_start", "session_start", "session_end"]
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    for (const type of VALID) {
      jest.resetModules()
      mockHeaders.mockReturnValue(makeHeaderMap())
      POST = require("@/app/api/track-event/route").POST
      const res = await POST(makeRequest({ type, project_id: "proj-1" }))
      expect(res.status).toBe(200)
    }
  })

  it("stores visitor_id, session_id, event_id, and funnel_step in the insert", async () => {
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    await POST(makeRequest({
      type: "page_view",
      project_id: "proj-1",
      visitor_id: "vis-abc",
      session_id: "ses-xyz",
      event_id: "evt-111",
      funnel_step: "landing",
    }))
    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        visitor_id:  "vis-abc",
        session_id:  "ses-xyz",
        event_id:    "evt-111",
        funnel_step: "landing",
      }),
    )
  })

  it("returns 500 when the DB insert fails", async () => {
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: { message: "db error" } })

    const res = await POST(makeRequest({ type: "cta_click", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(500)
    expect(json.error).toMatch(/failed to persist event/i)
  })

  it("includes geo metadata from Vercel headers in the insert", async () => {
    mockHeaders.mockReturnValue(
      makeHeaderMap({
        "x-vercel-ip-city": "Manila",
        "x-vercel-ip-country-region": "NCR",
        "x-vercel-ip-country": "PH",
      }),
    )
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    await POST(makeRequest({ type: "section_view", project_id: "proj-1" }))
    expect(mockEventsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ geo_city: "Manila", geo_country: "PH" }),
      }),
    )
  })

  it("returns 429 after exceeding the rate limit", async () => {
    mockProjectSingle.mockResolvedValue({ data: { id: "proj-1" }, error: null })
    mockEventsInsert.mockResolvedValue({ error: null })

    // The route allows 100 req/hr per IP. Send 101 requests from the same IP.
    for (let i = 0; i < 100; i++) {
      await POST(makeRequest({ type: "page_view", project_id: "proj-1" }))
    }
    const res = await POST(makeRequest({ type: "page_view", project_id: "proj-1" }))
    const json = await res.json()
    expect(res.status).toBe(429)
    expect(json.error).toMatch(/rate limit/i)
  })
})
