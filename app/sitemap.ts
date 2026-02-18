import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getSiteConfigWithProject } from '@/lib/utils/site-config'
import { canUseMultiPage, getMaxPagesForProject, getPlanLimits, isLegalPageSlug, normalizePagesWithDefaults } from '@/lib/utils/site-pages'

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
  const { config, project } = await getSiteConfigWithProject(host, headersList)
  const pages = normalizePagesWithDefaults(config?.pages)
  const planLimits = await getPlanLimits()
  const maxPages = getMaxPagesForProject(project, planLimits)
  const paidPages = canUseMultiPage(project)
    ? pages.filter((page) => page.slug && !isLegalPageSlug(page.slug)).slice(0, maxPages)
    : []

  const routes = [
    '',
    '/privacy',
    '/terms',
    '/cookies',
    ...paidPages.map((page) => `/${page.slug}`),
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
