import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getSiteConfigWithProject } from '@/lib/utils/site-config'
import { canUseMultiPage, getMaxPagesForProject, getPlanLimits, isLegalPageSlug, normalizePagesWithDefaults } from '@/lib/utils/site-pages'
import { isProPlan } from '@/lib/subscription'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') || 'estabweb.com'
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'
  const lastmod = new Date().toISOString().split('T')[0]

  const isRoot = host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host.includes('localhost')

  if (isRoot) {
    // Use www to match what Vercel actually serves (non-www redirects to www)
    const baseUrl = `https://www.${ROOT_DOMAIN}`
    return [
      '',
      '/pricing',
      '/contact',
      '/privacy',
      '/terms',
      '/cookies',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: lastmod,
      priority: route === '' ? 1 : 0.8,
    }))
  }

  // For client sites
  const ROOT_DOMAIN_LOWER = ROOT_DOMAIN.toLowerCase()
  const { config, project } = await getSiteConfigWithProject(host, headersList)
  const preferredHost =
    project?.custom_domain && isProPlan(project)
      ? project.custom_domain.toLowerCase()
      : project?.subdomain
        ? `${project.subdomain}.${ROOT_DOMAIN_LOWER}`.toLowerCase()
        : host.toLowerCase()
  const baseUrl = `https://${preferredHost}`
  const pages = normalizePagesWithDefaults(config?.pages)
  const planLimits = await getPlanLimits()
  const maxPages = getMaxPagesForProject(project, planLimits)
  const paidPages = canUseMultiPage(project)
    ? pages
      .filter((page) => page.slug && !isLegalPageSlug(page.slug) && !page?.seo?.robots?.noindex)
      .slice(0, maxPages)
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
    lastModified: lastmod,
    priority: route === '' ? 1 : 0.7,
  }))
}
