/**
 * Server-side reCAPTCHA v3 verification utility.
 * Uses RECAPTCHA_SECRET_KEY env var.
 * Returns { success, score, action } or throws on network error.
 */

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const MIN_SCORE = 0.5

export interface RecaptchaResult {
  success: boolean
  score: number
  action?: string
  errorCodes?: string[]
}

export async function verifyRecaptchaToken(
  token: string,
  expectedAction?: string,
): Promise<RecaptchaResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  // If no secret key configured, skip verification (dev/unconfigured env)
  if (!secretKey) {
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — skipping verification.')
    return { success: true, score: 1 }
  }

  const params = new URLSearchParams({ secret: secretKey, response: token })
  const res = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    throw new Error(`reCAPTCHA verify request failed: ${res.status}`)
  }

  const data = await res.json()

  const result: RecaptchaResult = {
    success: data.success === true && (data.score ?? 0) >= MIN_SCORE,
    score: data.score ?? 0,
    action: data.action,
    errorCodes: data['error-codes'],
  }

  if (expectedAction && data.action && data.action !== expectedAction) {
    result.success = false
  }

  return result
}
