/**
 * Optional CORS for Route Handlers.
 *
 * **White-label / tenants (usual case)**  
 * Public sites use relative URLs (`fetch("/api/...")`) on the **same hostname** as the page
 * (`tenant.estabweb.com` or a mapped custom domain). That is **same-origin** — the browser
 * does not apply CORS, and you do **not** need to list every tenant domain anywhere.
 *
 * **When you *do* need CORS**  
 * Only if JavaScript on **one origin** calls your API on **another** (e.g. dashboard on
 * `app.example.com` → API on `api.example.com`, or a third-party widget embedding your API).
 * Then set `CORS_ALLOWED_ORIGINS` to those fixed caller origins, or handle OPTIONS in a route
 * with a custom allowlist (including DB-backed lists if you must allow many partners — rare).
 *
 * **Automatic “tenant domains” in CORS**  
 * You generally should **not** auto-add every project `custom_domain` to CORS: same-origin
 * tenant traffic never needs it. Auto-listing domains is only useful for **cross-origin**
 * integrations; if you add that later, validate `Origin` against stored domains in the route
 * or edge middleware and echo `Access-Control-Allow-Origin` only for matches.
 */

function parseAllowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS || ''
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * If request Origin matches an allowed entry, returns Access-Control-* headers for the response.
 * Otherwise returns null (no CORS headers — browser blocks cross-origin reads).
 */
export function corsHeadersForRequest(request: Request): Record<string, string> | null {
  const allowed = parseAllowedOrigins()
  if (allowed.length === 0) return null

  const origin = request.headers.get('origin')
  if (!origin || !allowed.includes(origin)) return null

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function isCorsPreflightRequest(request: Request): boolean {
  return request.method === 'OPTIONS' && request.headers.get('access-control-request-method') !== null
}

/**
 * True when the browser sent an `Origin` that differs from this request URL’s origin
 * (cross-origin). Same-origin tenant pages return false — no CORS response headers needed.
 */
export function isBrowserCrossOriginRequest(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).origin !== new URL(request.url).origin
  } catch {
    return false
  }
}
