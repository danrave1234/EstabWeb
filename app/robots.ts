import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = (headersList.get('host') || 'estabweb.com').toLowerCase()
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'
  const isLocalhost = host.includes('localhost')
  const isVercelPreview = host.endsWith('.vercel.app')
  const isStaging = host === `staging.${ROOT_DOMAIN}`

  const isRoot = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || isLocalhost

  if (isLocalhost || isVercelPreview || isStaging) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  if (isRoot) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/dashboard/', '/subscribe/', '/onboarding', '/login', '/success'],
      },
      sitemap: `https://${ROOT_DOMAIN}/sitemap.xml`,
    }
  }

  // For client sites
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `https://${host}/sitemap.xml`,
  }
}
