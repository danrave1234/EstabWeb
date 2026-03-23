import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { resolveTenantRoute } from '@/lib/routing/resolve-tenant-route'
import { applySecurityHeaders } from '@/lib/security/security-headers'
import { shouldBlockCrossSiteMutation } from '@/lib/security/request-origin'

// Helper to copy cookies from one NextResponse to another (for Supabase session refresh)
function copyCookies(from: NextResponse, to: NextResponse) {
  try {
    for (const c of from.cookies.getAll()) {
      to.cookies.set(c)
    }
  } catch {}
}

export async function middleware(request: NextRequest) {
  // Always refresh Supabase session cookies first
  const sessionRes = await updateSession(request)

  // If updateSession returned a redirect (e.g., unauthorized access), return it immediately
  if (sessionRes.status >= 300 && sessionRes.status < 400) {
    return applySecurityHeaders(sessionRes, request)
  }

  const path = request.nextUrl.pathname
  if (path.startsWith('/api') && shouldBlockCrossSiteMutation(request)) {
    return applySecurityHeaders(
      NextResponse.json({ error: 'Invalid origin' }, { status: 403 }),
      request,
    )
  }

  const requestHeaders = new Headers(request.headers)

  const decision = resolveTenantRoute({
    requestUrl: request.url,
    hostHeader: request.headers.get('host'),
    rootDomain: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com',
    forwardedProto: request.headers.get('x-forwarded-proto'),
  })

  for (const [key, value] of Object.entries(decision.headers)) {
    requestHeaders.set(key, value)
  }

  if (decision.kind === 'redirect') {
    const redirect = NextResponse.redirect(decision.destination, 301)
    copyCookies(sessionRes, redirect)
    return applySecurityHeaders(redirect, request)
  }

  if (decision.kind === 'rewrite-admin' || decision.kind === 'rewrite-site') {
    const res = NextResponse.rewrite(new URL(decision.destination, request.url), {
      request: { headers: requestHeaders },
    })
    copyCookies(sessionRes, res)
    return applySecurityHeaders(res, request)
  }

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  copyCookies(sessionRes, res)
  return applySecurityHeaders(res, request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
