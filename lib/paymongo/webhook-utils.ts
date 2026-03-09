import crypto from "crypto"

export const HANDLED_PAYMONGO_EVENTS = [
  "link.payment.paid",
  "payment.paid",
  "payment_intent.succeeded",
  "checkout_session.payment.paid",
  "subscription.invoice.paid",
  "subscription.unpaid",
] as const

export function isHandledPaymongoEvent(eventType: string): boolean {
  return HANDLED_PAYMONGO_EVENTS.includes(eventType as (typeof HANDLED_PAYMONGO_EVENTS)[number])
}

export function verifyPaymongoSignature(
  raw: string,
  signatureHeader: string | null,
  secret: string,
): string | null {
  if (!signatureHeader) return "Missing paymongo-signature header"
  const parts = signatureHeader.split(",").map((part) => part.trim())
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2)
  const v1 = parts.find((part) => part.startsWith("v1="))?.slice(3)
  if (!timestamp || !v1) return "Malformed signature header"
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex")
  return v1 === expected ? null : "Signature mismatch"
}

/** Compute period end - prefer payload dates, fall back to +1 month/year from now. */
export function computePeriodEnd(attributes?: any): Date {
  const periodEnd = attributes?.current_period_end
  if (periodEnd) return new Date(periodEnd * 1000)

  const metadata = attributes?.metadata
  const interval = metadata?.interval || "monthly"

  const d = new Date()
  if (interval === "yearly") {
    d.setFullYear(d.getFullYear() + 1)
  } else {
    d.setMonth(d.getMonth() + 1)
  }
  return d
}

export function extractPaymongoEventType(body: any): string {
  return body?.data?.attributes?.type || body?.data?.type || body?.type || ""
}

export function extractPaymongoEventId(body: any): string {
  return body?.data?.id || body?.id || ""
}
