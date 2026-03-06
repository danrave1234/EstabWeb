import crypto from "crypto"

// ─── Top-level mock refs ───────────────────────────────────────────────────────
const mockProcessedInsert = jest.fn()
const mockProjectsUpdateEq = jest.fn()
const mockPaymentLogsInsert = jest.fn()
let capturedProjectsUpdate: any = null

const mockCreateServiceClient = jest.fn()

jest.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => mockCreateServiceClient(),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEBHOOK_SECRET = "test-webhook-secret"

function signPayload(raw: string, secret: string): string {
  const timestamp = "1700000000"
  const digest = crypto.createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex")
  return `t=${timestamp},v1=${digest}`
}

function makeRequest(body: unknown): Request {
  const raw = JSON.stringify(body)
  return new Request("http://localhost/api/paymongo/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "paymongo-signature": signPayload(raw, WEBHOOK_SECRET),
    },
    body: raw,
  })
}

/** Build a checkout_session.payment.paid event body */
function makeCheckoutPaidEvent(meta: Record<string, string>) {
  return {
    id: `evt_${Math.random().toString(36).slice(2)}`,
    type: "checkout_session.payment.paid",
    data: {
      attributes: {
        type: "checkout_session.payment.paid",
        data: {
          id: "cs_test_session",
          attributes: {
            metadata: meta,
            payments: [],
          },
        },
      },
    },
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Webhook: checkout_session.payment.paid — upgrade carry-over", () => {
  let POST: (req: Request) => Promise<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    capturedProjectsUpdate = null
    process.env.PAYMONGO_WEBHOOK_SECRET = WEBHOOK_SECRET

    mockProcessedInsert.mockResolvedValue({ error: null }) // not a duplicate
    mockProjectsUpdateEq.mockResolvedValue({ error: null })
    mockPaymentLogsInsert.mockResolvedValue({ error: null })

    mockCreateServiceClient.mockReturnValue({
      from: (table: string) => {
        if (table === "processed_webhook_events") {
          return { insert: mockProcessedInsert }
        }
        if (table === "projects") {
          return {
            update: (data: any) => {
              capturedProjectsUpdate = data
              return { eq: () => mockProjectsUpdateEq() }
            },
          }
        }
        if (table === "payments") {
          return { upsert: mockPaymentLogsInsert }
        }
        // paymongo_links fallback (project_id lookup)
        return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }) }) }
      },
    })

    POST = require("@/app/api/paymongo/webhook/route").POST
  })

  it("extends subscription_ends_at by remaining_days on upgrade", async () => {
    const remainingDays = 10
    const body = makeCheckoutPaidEvent({
      project_id: "proj_1",
      plan_id: "pro",
      is_upgrade: "true",
      remaining_days: String(remainingDays),
      interval: "monthly",
    })

    const beforeCall = Date.now()
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(200)

    expect(capturedProjectsUpdate).not.toBeNull()
    const storedEnd = new Date(capturedProjectsUpdate.subscription_ends_at).getTime()

    // Must be at least now + (28 + remainingDays) days to account for 1-month base + carry-over
    const minExpected = beforeCall + (28 + remainingDays) * 24 * 60 * 60 * 1000
    expect(storedEnd).toBeGreaterThanOrEqual(minExpected)
  })

  it("sets pro plan publish limits (50/day=3) on upgrade checkout payment", async () => {
    const body = makeCheckoutPaidEvent({
      project_id: "proj_1",
      plan_id: "pro",
      is_upgrade: "true",
      remaining_days: "5",
      interval: "monthly",
    })

    await POST(makeRequest(body))

    expect(capturedProjectsUpdate).toMatchObject({
      subscription_plan_id: "pro",
      publish_limit: 50,
      publish_limit_daily: 3,
      publish_count: 0,
      publish_count_today: 0,
    })
  })

  it("does NOT extend the period for a normal (non-upgrade) checkout payment", async () => {
    const body = makeCheckoutPaidEvent({
      project_id: "proj_1",
      plan_id: "basic",
      // no is_upgrade flag
      interval: "monthly",
    })

    const beforeCall = Date.now()
    await POST(makeRequest(body))

    expect(capturedProjectsUpdate).not.toBeNull()
    const storedEnd = new Date(capturedProjectsUpdate.subscription_ends_at).getTime()

    // Should be ~1 month from now — NOT more than 60 days out
    const maxExpected = beforeCall + 60 * 24 * 60 * 60 * 1000
    expect(storedEnd).toBeLessThan(maxExpected)
  })

  it("resets publish_count and publish_count_today to 0 on every checkout payment", async () => {
    const body = makeCheckoutPaidEvent({
      project_id: "proj_1",
      plan_id: "basic",
      interval: "monthly",
    })

    await POST(makeRequest(body))

    expect(capturedProjectsUpdate).toMatchObject({
      publish_count: 0,
      publish_count_today: 0,
    })
  })
})
