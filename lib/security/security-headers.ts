import type { NextRequest, NextResponse } from 'next/server'

function isHttpsRequest(request: NextRequest): boolean {
  const proto = request.headers.get('x-forwarded-proto')
  if (proto) return proto.split(',')[0]?.trim() === 'https'
  return request.nextUrl.protocol === 'https:'
}

/**
 * Baseline HTTP security headers for all responses (App Router middleware).
 * CSP frame-ancestors for tenant preview may also be set in vercel.json.
 */
export function applySecurityHeaders(
  response: NextResponse,
  request?: NextRequest,
): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  )

  if (request && isHttpsRequest(request)) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    )
  }

  return response
}
