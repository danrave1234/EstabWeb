import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

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
    return sessionRes
  }

  const url = request.nextUrl
  const hostHeader = request.headers.get('host')?.toLowerCase() || ''
  const hostname = hostHeader.split(':')[0] // strip port if present

  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
  const isDevHost = ['localhost', '127.0.0.1'].includes(hostname)
  const isStagingHost = hostname === `staging.${ROOT_DOMAIN}`
  const isRoot = hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || isDevHost || isStagingHost
  const isAdmin = hostname === `admin.${ROOT_DOMAIN}` || hostname.startsWith('admin.')

  // On production root domain: redirect /subdomain to subdomain.estabweb.com so project sites use subdomains
  const RESERVED_ROOT_PATHS = ['api', 'admin', 'login', 'dashboard', 'onboarding', 'auth', 'preview', 'pricing', 'terms', 'privacy', 'cookies', 'contact', 'success']
  if (!isDevHost && !isStagingHost && isRoot && url.pathname !== '/') {
    const segment = url.pathname.replace(/^\/|\/$/g, '').split('/')[0]?.toLowerCase()
    if (segment && !RESERVED_ROOT_PATHS.includes(segment) && !segment.includes('.')) {
      const protocol = request.headers.get('x-forwarded-proto') === 'https' ? 'https' : (request.url.startsWith('https') ? 'https' : 'http')
      const redirectUrl = `${protocol}://${segment}.${ROOT_DOMAIN}${url.pathname.slice(segment.length + 1) || '/'}${url.search}`
      const redirect = NextResponse.redirect(redirectUrl, 301)
      copyCookies(sessionRes, redirect)
      return redirect
    }
  }

  // Pass preview and projectId to layouts via headers since layouts don't get searchParams
  const requestHeaders = new Headers(request.headers)
  if (url.searchParams.has('preview')) {
    requestHeaders.set('x-preview-mode', url.searchParams.get('preview') || 'false')
  }
  if (url.searchParams.has('projectId')) {
    requestHeaders.set('x-project-id', url.searchParams.get('projectId') || '')
  }
  if (url.searchParams.has('requestId')) {
    requestHeaders.set('x-request-id', url.searchParams.get('requestId') || '')
  }

  // Route admin.* hosts to /(admin) route group
  if (isAdmin) {
    const dest = new URL(`/admin${url.pathname === '/' ? '' : url.pathname}${url.search}`, request.url)
    const res = NextResponse.rewrite(dest, {
      request: {
        headers: requestHeaders,
      },
    })
    copyCookies(sessionRes, res)
    return res
  }

  // For non-root hosts (subdomains or custom domains), route to /(sites)/[domain]
  // We exclude common paths that should be handled by the root app
  const isCommonPath = url.pathname.startsWith('/api') || 
                       url.pathname.startsWith('/admin') ||
                       url.pathname.startsWith('/login') ||
                       url.pathname.startsWith('/dashboard') ||
                       url.pathname.startsWith('/onboarding') ||
                       url.pathname.startsWith('/auth')

  // Set the path in headers for layout variant detection (only for root app)
  if (isRoot || isCommonPath) {
    requestHeaders.set('x-invoke-path', url.pathname)
  }

  const isPathBasedDomain = isDevHost && url.pathname !== '/' && !isCommonPath

  if ((!isRoot || isPathBasedDomain) && !isCommonPath) {
    let domainParam: string
    if (isPathBasedDomain) {
      domainParam = url.pathname.split('/')[1]
    } else if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
      domainParam = hostname.slice(0, -(ROOT_DOMAIN.length + 1)).toLowerCase() // Ensure lowercase for DB lookup
    } else {
      domainParam = hostname.toLowerCase() // custom domain lowercase
    }

    console.log(`[middleware] Routing domain: "${hostname}" -> "${domainParam}" (ROOT_DOMAIN: "${ROOT_DOMAIN}")`);

    // Preserve path for potential nested routes (e.g., /blog)
    const passthroughPath = isPathBasedDomain 
      ? (url.pathname.replace(`/${domainParam}`, '') || '')
      : (url.pathname === '/' ? '' : url.pathname)
    
    const dest = new URL(`/${domainParam}${passthroughPath}${url.search}`, request.url)
    
    const res = NextResponse.rewrite(dest, {
      request: {
        headers: requestHeaders,
      },
    })

    copyCookies(sessionRes, res)
    return res
  }

  // Default: proceed as normal for root domain and dev hosts
  // But still pass through the headers for previews on localhost
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  copyCookies(sessionRes, res)
  return res
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
