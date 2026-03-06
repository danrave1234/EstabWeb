import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { getCachedSiteConfig } from "@/lib/utils/site-config";
import { getPageBySlug, normalizePages, normalizePagesWithDefaults } from "@/lib/utils/site-pages";
import { isProPlan } from "@/lib/subscription";
import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const heads = await headers();
  const host = heads.get("host") || domain;
  const { config } = await getCachedSiteConfig(domain, heads);

  const pages = normalizePagesWithDefaults(config?.pages);
  const homePage = getPageBySlug(pages, "");
  const resolvedSeo = buildAutoSeoDefaults({
    config,
    page: homePage as Record<string, any> | undefined,
    pageSlug: "",
    pageLabel: homePage?.label || "Home",
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

export default async function Home({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const heads = await headers();
  const preview = heads.get('x-preview-mode') === 'true';

  const { config: initialData, project } = await getCachedSiteConfig(domain, heads);

  // If accessed via custom domain but subscription is lapsed, redirect to subdomain
  if (!preview && project && project.custom_domain && !isProPlan(project)) {
    const host = heads.get("host")?.split(":")[0]?.toLowerCase() || ""
    if (host === project.custom_domain.toLowerCase()) {
      const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase()
      redirect(`https://${project.subdomain}.${ROOT_DOMAIN}/`)
    }
  }

  // Final fallback to error UI if nothing found
  if (!initialData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm sm:text-base">
          Configuration not found. Please check your domain.
        </p>
      </div>
    );
  }

  const pages = normalizePages(initialData?.pages);
  const homePage = getPageBySlug(pages, "");
  const dataForPage = homePage
    ? {
        ...initialData,
        projectId: project?.id,
        activeSections: homePage.activeSections ?? initialData.activeSections,
        seo: homePage.seo ?? initialData.seo,
      }
    : {
        ...initialData,
        projectId: project?.id
      };

  // If preview mode is ON, we wrap in a Client Component that listens for postMessage
  if (preview) {
    return (
      <LivePreviewProvider initialData={dataForPage}>
        <SiteTemplate data={dataForPage} />
      </LivePreviewProvider>
    );
  }

  // Standard static-ish rendering for SEO and production
  return <SiteTemplate data={dataForPage} />;
}
