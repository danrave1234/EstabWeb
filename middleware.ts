import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Helper to copy cookies from one NextResponse to another (for Supabase session refresh)
function copyCookies(from: NextResponse, to: NextResponse) {
  try {
    for (const c of from.cookies.getAll()) {
      to.cookies.set({ name: c.name, value: c.value, ...c })
    }
  } catch {}
}

export async function middleware(request: NextRequest) {
  // Always refresh Supabase session cookies first
  const sessionRes = await updateSession(request)

  const url = request.nextUrl
  const hostHeader = request.headers.get('host')?.toLowerCase() || ''
  const hostname = hostHeader.split(':')[0] // strip port if present

  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
  const isDevHost = ['localhost', '127.0.0.1'].includes(hostname)
  const isRoot = hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || isDevHost
  const isAdmin = hostname === `admin.${ROOT_DOMAIN}` || hostname.startsWith('admin.')

  // Route admin.* hosts to /(admin) route group
  if (isAdmin) {
    const dest = new URL(`/admin${url.pathname === '/' ? '' : url.pathname}${url.search}`, request.url)
    const res = NextResponse.rewrite(dest)
    copyCookies(sessionRes, res)
    return res
  }

  // For non-root hosts (subdomains or custom domains), route to /(sites)/[domain]
  if (!isRoot) {
    let domainParam: string
    if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
      domainParam = hostname.slice(0, -(ROOT_DOMAIN.length + 1)) // subdomain part
    } else {
      domainParam = hostname // custom domain
    }

    // Preserve path for potential nested routes (e.g., /blog)
    const passthroughPath = url.pathname === '/' ? '' : url.pathname
    const dest = new URL(`/${domainParam}${passthroughPath}${url.search}`, request.url)
    const res = NextResponse.rewrite(dest)
    copyCookies(sessionRes, res)
    return res
  }

  // Default: proceed as normal for root domain and dev hosts
  return sessionRes
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
