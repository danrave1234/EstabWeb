import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { getCachedSiteConfig } from "@/lib/utils/site-config";
import {
  canUseMultiPage,
  getMaxPagesForProject,
  getPageBySlug,
  getPlanLimits,
  isLegalPageSlug,
  normalizePagesWithDefaults,
} from "@/lib/utils/site-pages";
import { isProPlan } from "@/lib/subscription";
import { buildAutoSeoDefaults, formatDomainAsBrand } from "@/lib/seo/autoSeo";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}): Promise<Metadata> {
  const { domain, slug } = await params;
  const heads = await headers();
  const host = (heads.get("host") || domain).toLowerCase();
  const { config, project } = await getCachedSiteConfig(domain, heads);
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
  const preferredHost =
    project?.custom_domain && isProPlan(project)
      ? project.custom_domain.toLowerCase()
      : project?.subdomain
        ? `${project.subdomain}.${ROOT_DOMAIN}`.toLowerCase()
        : host;

  const pages = normalizePagesWithDefaults(config?.pages);
  const page = getPageBySlug(pages, slug);
  const resolvedSeo = buildAutoSeoDefaults({
    config,
    page: page as Record<string, any> | undefined,
    pageSlug: slug,
    pageLabel: page?.label || slug.replace(/-/g, " "),
    domain,
  });

  const brand = config?.brand || {};
  const brandName = brand.name || formatDomainAsBrand(domain);
  const iconUrl = brand.favicon || brand.logoUrl || "/Logo.png";
  const canonical = `https://${preferredHost}${resolvedSeo.canonical}`;

  return {
    title: resolvedSeo.title,
    description: resolvedSeo.description,
    keywords: resolvedSeo.keywords,
    openGraph: {
      title: resolvedSeo.og.title,
      description: resolvedSeo.og.description,
      type: "website",
      siteName: brandName,
      images: resolvedSeo.og.image ? [{ url: resolvedSeo.og.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedSeo.og.title,
      description: resolvedSeo.og.description,
      images: resolvedSeo.og.image ? [resolvedSeo.og.image] : [],
    },
    robots: {
      index: !resolvedSeo.robots.noindex,
      follow: !resolvedSeo.robots.nofollow,
    },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    metadataBase: new URL(`https://${preferredHost}`),
    alternates: {
      canonical,
    },
  };
}

export default async function SubPage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;
  const heads = await headers();
  const preview = heads.get("x-preview-mode") === "true";
  const host = heads.get("host")?.split(":")[0]?.toLowerCase() || "";

  // Legal pages have their own dedicated routes - never handle them here
  if (isLegalPageSlug(slug)) {
    notFound();
  }

  const { config: initialData, project } = await getCachedSiteConfig(domain, heads);

  // Prefer custom domain as canonical host when subscription is active.
  if (!preview && project?.custom_domain && isProPlan(project) && host !== project.custom_domain.toLowerCase()) {
    permanentRedirect(`https://${project.custom_domain.toLowerCase()}/${slug}`);
  }

  if (!initialData) {
    notFound();
  }

  // If accessed via custom domain but subscription is lapsed, redirect to subdomain
  if (!preview && project && project.custom_domain && !isProPlan(project)) {
    const host = heads.get("host")?.split(":")[0]?.toLowerCase() || "";
    if (host === project.custom_domain.toLowerCase()) {
      const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
      redirect(`https://${project.subdomain}.${ROOT_DOMAIN}/${slug}`);
    }
  }

  // Entitlement check - free projects cannot access subpages
  if (!canUseMultiPage(project)) {
    notFound();
  }

  const planLimits = await getPlanLimits();
  const maxPages = getMaxPagesForProject(project, planLimits);
  const pages = normalizePagesWithDefaults(initialData?.pages);

  // Only expose pages within the plan limit (exclude home slug "")
  const allowedPages = pages
    .filter((p) => p.slug && !isLegalPageSlug(p.slug))
    .slice(0, maxPages);

  const page = allowedPages.find((p) => p.slug === slug.toLowerCase());

  if (!page) {
    notFound();
  }

  const dataForPage = {
    ...initialData,
    projectId: project?.id,
    activeSections: page.activeSections ?? initialData.activeSections,
    seo: page.seo ?? initialData.seo,
  };

  if (preview) {
    return (
      <LivePreviewProvider initialData={dataForPage}>
        <SiteTemplate data={dataForPage} />
      </LivePreviewProvider>
    );
  }

  return <SiteTemplate data={dataForPage} />;
}
