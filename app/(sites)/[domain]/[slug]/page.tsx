import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
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
import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}): Promise<Metadata> {
  const { domain, slug } = await params;
  const heads = await headers();
  const host = heads.get("host") || domain;
  const { config } = await getCachedSiteConfig(domain, heads);

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
  const brandName = brand.name || domain;
  const iconUrl = brand.favicon || brand.logoUrl || "/Logo.png";
  const canonical = `https://${host}${resolvedSeo.canonical}`;

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
    metadataBase: new URL(`https://${host}`),
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

  // Legal pages have their own dedicated routes - never handle them here
  if (isLegalPageSlug(slug)) {
    notFound();
  }

  const { config: initialData, project } = await getCachedSiteConfig(domain, heads);

  if (!initialData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm sm:text-base">
          Configuration not found. Please check your domain.
        </p>
      </div>
    );
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
