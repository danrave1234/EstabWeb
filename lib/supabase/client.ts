import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
  const cookieDomain = process.env.NODE_ENV === 'production' ? `.${ROOT_DOMAIN}` : undefined

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      }
    }
  )
}
