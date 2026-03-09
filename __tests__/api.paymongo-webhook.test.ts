import crypto from "crypto"

const mockCreateServiceClient = jest.fn()
const mockProcessedInsert = jest.fn()
const mockProjectSingle = jest.fn()
const mockProjectUpdateEq = jest.fn()
const mockPaymentsUpsert = jest.fn()

jest.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => mockCreateServiceClient(),
}))

function signPayload(raw: string, secret: string): string {
  const timestamp = "1700000000"
  const digest = crypto.createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex")
  return `t=${timestamp},v1=${digest}`
}

function makeRequest(body: unknown, signature: string): Request {
  return new Request("http://localhost/api/paymongo/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "paymongo-signature": signature,
    },
    body: JSON.stringify(body),
  })
}

describe("POST /api/paymongo/webhook", () => {
  let POST: (req: Request) => Promise<Response>
  const secret = "test-webhook-secret"

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.PAYMONGO_WEBHOOK_SECRET = secret
    POST = require("@/app/api/paymongo/webhook/route").POST
    mockCreateServiceClient.mockReturnValue({
      from: jest.fn((table: string) => {
        if (table === "processed_webhook_events") {
          return { insert: mockProcessedInsert }
        }
        if (table === "projects") {
          return {
            select: () => ({ eq: () => ({ single: mockProjectSingle }) }),
            update: () => ({ eq: () => mockProjectUpdateEq() }),
          }
        }
        if (table === "payments") {
          return { upsert: mockPaymentsUpsert }
        }
        return {}
      }),
    })

    mockProjectSingle.mockResolvedValue({ data: { id: "proj_1", client_id: "user_1" } })
    mockProjectUpdateEq.mockResolvedValue({ error: null })
    mockPaymentsUpsert.mockResolvedValue({ error: null })
  })

  it("returns 401 for invalid signatures", async () => {
    const body = { id: "evt_1", type: "payment.paid" }
    const req = makeRequest(body, "t=1700000000,v1=invalid")

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.error).toMatch(/invalid signature/i)
  })

  it("ignores unhandled events after signature verification", async () => {
    const body = { id: "evt_2", type: "customer.created" }
    const raw = JSON.stringify(body)
    const req = makeRequest(body, signPayload(raw, secret))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.received).toBe(true)
    expect(mockCreateServiceClient).not.toHaveBeenCalled()
  })

  it("skips duplicate handled events using idempotency table", async () => {
    const body = { id: "evt_3", type: "payment.paid", data: { attributes: { data: {} } } }
    const raw = JSON.stringify(body)
    mockProcessedInsert.mockResolvedValue({ error: { code: "23505" } })
    const req = makeRequest(body, signPayload(raw, secret))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.received).toBe(true)
    expect(mockCreateServiceClient).toHaveBeenCalled()
    expect(mockProcessedInsert).toHaveBeenCalledWith({
      event_id: "evt_3",
      event_type: "payment.paid",
    })
  })

  it("continues processing when idempotency insert fails with a non-duplicate error", async () => {
    const body = {
      id: "evt_4",
      type: "checkout_session.payment.paid",
      data: {
        attributes: {
          type: "checkout_session.payment.paid",
          data: {
            id: "cs_123",
            attributes: {
              metadata: { project_id: "proj_1", plan_id: "basic", interval: "monthly" },
              payments: [{ id: "pay_123", attributes: { amount: 10000, currency: "PHP" } }],
            },
          },
        },
      },
    }
    const raw = JSON.stringify(body)
    mockProcessedInsert.mockResolvedValue({ error: { code: "42P01", message: "relation does not exist" } })
    const req = makeRequest(body, signPayload(raw, secret))

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.received).toBe(true)
    expect(mockProjectUpdateEq).toHaveBeenCalled()
    expect(mockPaymentsUpsert).toHaveBeenCalled()
  })
})
