import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
  const cookieDomain = process.env.NODE_ENV === 'production' ? `.${ROOT_DOMAIN}` : undefined

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
            response.cookies.set(name, value, { ...options, domain: cookieDomain })
          )
        },
      },
      cookieOptions: {
        domain: cookieDomain,
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

  // Handle /admin routes
  if (path.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  // Protected routes - require auth
  const protectedRoutes = ['/dashboard', '/onboarding']
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (isProtectedRoute) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  // Public routes check (for login redirect only)
  if (path === '/login') {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}
