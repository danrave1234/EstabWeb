import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const path = request.nextUrl.pathname

  // Skip static files and API routes
  if (path.startsWith('/_next') || path.includes('.') || path.startsWith('/api')) {
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Handle /admin routes
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  // Public routes
  const publicRoutes = ['/', '/login', '/pricing', '/contact', '/terms', '/privacy', '/cookies']
  if (publicRoutes.includes(path)) {
    if (user && path === '/login') {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Protected routes - require auth
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}
