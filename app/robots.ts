import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') || 'estabweb.com'
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'

  const isRoot = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host.includes('localhost')

  if (isRoot) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/'],
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
