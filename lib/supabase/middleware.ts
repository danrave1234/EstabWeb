import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const c of from.cookies.getAll()) to.cookies.set(c)
}

function isSupabaseAuthCookieName(name: string) {
  return name === 'supabase-auth-token' || (name.startsWith('sb-') && name.includes('-auth-token'))
}

function clearSupabaseAuthCookies(request: NextRequest, response: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (!isSupabaseAuthCookieName(cookie.name)) continue
    response.cookies.set(cookie.name, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { ...options })
          )
        },
      },
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      }
    }
  )

  const path = request.nextUrl.pathname

  // Skip static files and API routes
  if (path.startsWith('/_next') || path.includes('.') || path.startsWith('/api')) {
    return response
  }

  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
  const hostHeader = request.headers.get('host')?.toLowerCase() || ''
  const hostname = hostHeader.split(':')[0]
  const isAdminHost = hostname === `admin.${ROOT_DOMAIN}` || hostname.startsWith('admin.')
  const isAdminRoute = path.startsWith('/admin') || isAdminHost

  // Protected routes - require auth
  const protectedRoutes = ['/dashboard', '/onboarding']
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  // Auth routes like login or callbacks
  const isAuthRoute = path === '/login' || path.startsWith('/auth')

  // Performance optimization: skip Supabase auth check on public client pages
  if (!isAdminRoute && !isProtectedRoute && !isAuthRoute) {
    return response
  }

  // IMPORTANT: We must call getUser() on protected/admin/auth routes to reliably trigger token refresh
  // before it hits Server Components, which cannot set cookies.
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.warn('[auth middleware] getUser failed; clearing auth cookies:', userError.message)

    // Keep the user on /login but force-reset stale cookies.
    if (path === '/login') {
      clearSupabaseAuthCookies(request, response)
      return response
    }

    const redirect = NextResponse.redirect(new URL('/login?recovered=1', request.url))
    copyCookies(response, redirect)
    clearSupabaseAuthCookies(request, redirect)
    return redirect
  }

  // Handle /admin routes
  if (isAdminRoute) {
    if (!user) {
      const redirect = NextResponse.redirect(new URL('/login', request.url))
      copyCookies(response, redirect)
      clearSupabaseAuthCookies(request, redirect)
      return redirect
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin' && profile?.role !== 'sub_admin') {
      const redirect = NextResponse.redirect(new URL('/dashboard', request.url))
      copyCookies(response, redirect)
      return redirect
    }

    return response
  }


  if (isProtectedRoute) {
    if (!user) {
      const redirect = NextResponse.redirect(new URL('/login', request.url))
      copyCookies(response, redirect)
      clearSupabaseAuthCookies(request, redirect)
      return redirect
    }
    // Block unverified email users from accessing protected features
    if (!user.email_confirmed_at) {
      const redirect = NextResponse.redirect(new URL('/auth/verify-email', request.url))
      copyCookies(response, redirect)
      return redirect
    }
    return response
  }

  // Public routes check (for login redirect only)
  if (path === '/login') {
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'admin' || profile?.role === 'sub_admin') {
        // Use isAdminHost to redirect appropriately
        if (isAdminHost) {
          const redirect = NextResponse.redirect(new URL('/', request.url))
          copyCookies(response, redirect)
          return redirect
        }
        const redirect = NextResponse.redirect(new URL('/admin', request.url))
        copyCookies(response, redirect)
        return redirect
      }
      const redirect = NextResponse.redirect(new URL('/dashboard', request.url))
      copyCookies(response, redirect)
      return redirect
    }
  }

  return response
}
