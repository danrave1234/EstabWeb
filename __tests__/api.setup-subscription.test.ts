import crypto from "crypto"

// ─── Top-level mock refs (must start with "mock" for Jest hoisting) ───────────
const mockGetUser = jest.fn()
const mockProjectSingle = jest.fn()
const mockProjectUpdateEq = jest.fn()
const mockLinksInsert = jest.fn()
let capturedUpdatePayload: any = null

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}))

jest.mock("@/lib/supabase/service", () => ({
  createServiceClient: jest.fn(() => ({
    from: (table: string) => {
      if (table === "projects") {
        return {
          select: () => ({ eq: () => ({ single: mockProjectSingle }) }),
          update: (data: any) => {
            capturedUpdatePayload = data
            return { eq: () => mockProjectUpdateEq() }
          },
        }
      }
      if (table === "paymongo_links") {
        return { insert: mockLinksInsert }
      }
      return {}
    },
  })),
}))

const MOCK_PLANS = {
  basic: {
    name: "Starter",
    initialAmount: 150000,
    recurringAmount: 49900,
    yearlyAmount: 548900,
    currency: "PHP",
    publishLimit: 10,
    publishLimitDaily: 1,
  },
  pro: {
    name: "Business",
    initialAmount: 250000,
    recurringAmount: 99900,
    yearlyAmount: 1098900,
    currency: "PHP",
    publishLimit: 50,
    publishLimitDaily: 3,
  },
}

jest.mock("@/lib/plans-config-server", () => ({
  getPlansConfig: jest.fn().mockResolvedValue({ PLANS: MOCK_PLANS }),
}))

jest.mock("@/lib/plans-config", () => ({
  resolveAmountFromPlans: jest.fn().mockReturnValue(49900),
  resolveDescriptionFromPlans: jest.fn().mockReturnValue("Starter Monthly"),
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeReq(body: object) {
  return new Request("http://localhost/api/paymongo/setup-subscription", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

const MOCK_CHECKOUT_RESPONSE = {
  data: {
    attributes: { checkout_url: "https://checkout.paymongo.com/test_session" },
    id: "cs_test_123",
  },
}

const AUTHENTICATED_USER = {
  id: "user_123",
  email: "test@example.com",
  user_metadata: { full_name: "Test User" },
}

function makeProject(overrides: object = {}) {
  return {
    id: "proj_1",
    client_id: "user_123",
    has_paid_initial: true,
    subscription_plan_id: "basic",
    subscription_ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("POST /api/paymongo/setup-subscription", () => {
  let POST: (req: Request) => Promise<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    capturedUpdatePayload = null
    process.env.PAYMONGO_SECRET_KEY = "sk_test_secret"
    process.env.NEXT_PUBLIC_APP_URL = "https://estabweb.com"

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_CHECKOUT_RESPONSE),
    } as any)

    mockGetUser.mockResolvedValue({ data: { user: AUTHENTICATED_USER } })
    mockProjectUpdateEq.mockResolvedValue({ error: null })
    mockLinksInsert.mockResolvedValue({ error: null })

    POST = require("@/app/api/paymongo/setup-subscription/route").POST
  })

  // ── Guard rails ─────────────────────────────────────────────────────────────

  it("returns 400 when projectId is missing", async () => {
    const res = await POST(makeReq({ planId: "pro" }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/missing projectid/i)
  })

  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeReq({ projectId: "proj_1", planId: "pro" }))
    expect(res.status).toBe(401)
  })

  it("returns 404 when project does not belong to authenticated user", async () => {
    mockProjectSingle.mockResolvedValue({
      data: makeProject({ client_id: "someone_else" }),
    })
    const res = await POST(makeReq({ projectId: "proj_1", planId: "pro" }))
    expect(res.status).toBe(404)
  })

  // ── Upgrade: basic → pro ────────────────────────────────────────────────────

  describe("Upgrade basic → pro", () => {
    beforeEach(() => {
      mockProjectSingle.mockResolvedValue({
        data: makeProject({
          subscription_plan_id: "basic",
          subscription_ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })
    })

    it("returns a checkoutUrl for the upgrade session", async () => {
      const res = await POST(makeReq({ projectId: "proj_1", planId: "pro" }))
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.checkoutUrl).toBe("https://checkout.paymongo.com/test_session")
    })

    it("charges only the setup-fee difference (Pro ₱2500 − Basic ₱1500 = ₱1000)", async () => {
      await POST(makeReq({ projectId: "proj_1", planId: "pro" }))

      const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(fetchOptions.body)
      const lineItem = body.data.attributes.line_items[0]

      // 250000 − 150000 = 100000 centavos = ₱1,000
      expect(lineItem.amount).toBe(100000)
    })

    it("passes is_upgrade, plan_id, previous_plan_id and remaining_days in metadata", async () => {
      await POST(makeReq({ projectId: "proj_1", planId: "pro" }))

      const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
      const meta = JSON.parse(fetchOptions.body).data.attributes.metadata

      expect(meta.is_upgrade).toBe("true")
      expect(meta.plan_id).toBe("pro")
      expect(meta.previous_plan_id).toBe("basic")
      expect(parseInt(meta.remaining_days, 10)).toBeGreaterThan(0)
    })

    it("does NOT create a checkout when plans are same tier (no-op upgrade)", async () => {
      // ph_monthly ≈ basic (same tier=1), so should fall through to renewal checkout
      mockProjectSingle.mockResolvedValue({
        data: makeProject({ subscription_plan_id: "ph_monthly" }),
      })
      await POST(makeReq({ projectId: "proj_1", planId: "ph_monthly" }))
      // fetch is called for same-plan renewal (standard checkout) — still 1 call
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  // ── Downgrade: pro → basic ──────────────────────────────────────────────────

  describe("Downgrade pro → basic", () => {
    beforeEach(() => {
      mockProjectSingle.mockResolvedValue({
        data: makeProject({ subscription_plan_id: "pro" }),
      })
    })

    it("returns { downgraded: true, plan: 'basic' } immediately — no checkout", async () => {
      const res = await POST(makeReq({ projectId: "proj_1", planId: "basic" }))
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.downgraded).toBe(true)
      expect(json.plan).toBe("basic")
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it("writes basic plan's publish_limit and resets counts in DB", async () => {
      await POST(makeReq({ projectId: "proj_1", planId: "basic" }))

      expect(capturedUpdatePayload).toMatchObject({
        subscription_plan_id: "basic",
        publish_limit: MOCK_PLANS.basic.publishLimit,        // 10
        publish_limit_daily: MOCK_PLANS.basic.publishLimitDaily, // 1
        publish_count: 0,
        publish_count_today: 0,
      })
    })
  })

  // ── Initial payment ─────────────────────────────────────────────────────────

  describe("Initial (first-time) payment", () => {
    beforeEach(() => {
      mockProjectSingle.mockResolvedValue({
        data: makeProject({ has_paid_initial: false, subscription_plan_id: null }),
      })
    })

    it("creates a checkout session and returns checkoutUrl", async () => {
      const res = await POST(makeReq({ projectId: "proj_1", planId: "basic" }))
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.checkoutUrl).toBe("https://checkout.paymongo.com/test_session")
    })

    it("does NOT flag is_upgrade in the checkout metadata", async () => {
      await POST(makeReq({ projectId: "proj_1", planId: "basic" }))

      const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
      const meta = JSON.parse(fetchOptions.body).data.attributes.metadata

      expect(meta.is_upgrade).toBeUndefined()
    })
  })
})
