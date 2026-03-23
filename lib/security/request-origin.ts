import type { NextRequest } from 'next/server'

/**
 * Paths where Origin/Referer cannot be trusted to match the hub (external callers).
 * Same-origin requests (e.g. custom-domain tenant sites) are handled separately below.
 */
export const MUTATION_ORIGIN_SKIP_PREFIXES: readonly string[] = [
  '/api/paymongo/webhook',
  '/api/cron/',
]

function sameOriginAsRequestUrl(request: NextRequest, originOrReferer: string): boolean {
  try {
    const reqOrigin = new URL(request.url).origin
    return new URL(originOrReferer).origin === reqOrigin
  } catch {
    return false
  }
}

function getRootDomain(): string {
  return (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
}

function extraAllowedHosts(): Set<string> {
  const raw = process.env.ALLOWED_ORIGIN_HOSTS || ''
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  )
}

/**
 * Returns true if the URL string (Origin or Referer) is allowed for this app.
 * Allows localhost, *.rootDomain, rootDomain, optional extra hosts, and *.vercel.app (previews).
 */
export function isAllowedRequestOrigin(originOrReferer: string): boolean {
  const root = getRootDomain()
  const extras = extraAllowedHosts()
  try {
    const { hostname } = new URL(originOrReferer)
    const h = hostname.toLowerCase()
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true
    if (extras.has(h)) return true
    if (h === root || h.endsWith(`.${root}`)) return true
    if (h.endsWith('.vercel.app')) return true
    return false
  } catch {
    return false
  }
}

function shouldSkipMutationOriginCheck(pathname: string): boolean {
  return MUTATION_ORIGIN_SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

/**
 * Defense-in-depth for cookie-authenticated browser requests: reject mutating API calls
 * when Origin/Referer clearly belong to another site.
 *
 * - Same-origin first: a visitor on a mapped custom domain posting to `https://that-domain/api/...`
 *   sends an Origin that matches the request URL — always allowed (not blocked).
 * - Hub-only hosts (*.rootDomain, previews, etc.) stay allowed via isAllowedRequestOrigin.
 * - No Origin/Referer: allow (non-browser clients, some beacons).
 */
export function shouldBlockCrossSiteMutation(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  if (shouldSkipMutationOriginCheck(pathname)) return false

  const method = request.method.toUpperCase()
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return false

  const origin = request.headers.get('origin')
  if (origin) {
    if (sameOriginAsRequestUrl(request, origin)) return false
    return !isAllowedRequestOrigin(origin)
  }

  const referer = request.headers.get('referer')
  if (referer) {
    if (sameOriginAsRequestUrl(request, referer)) return false
    return !isAllowedRequestOrigin(referer)
  }

  return false
}
