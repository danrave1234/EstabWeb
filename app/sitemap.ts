import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') || 'estabweb.com'
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'

  const isRoot = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host.includes('localhost')

  if (isRoot) {
    const baseUrl = `https://${ROOT_DOMAIN}`
    return [
      '',
      '/pricing',
      '/contact',
      '/privacy',
      '/terms',
      '/cookies',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1 : 0.8,
    }))
  }

  // For client sites
  const baseUrl = `https://${host}`
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
