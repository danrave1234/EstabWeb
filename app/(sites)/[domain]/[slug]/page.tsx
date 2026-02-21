import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import {
  canUseMultiPage,
  getMaxPagesForProject,
  getPageBySlug,
  getPlanLimits,
  isLegalPageSlug,
  normalizePagesWithDefaults,
} from "@/lib/utils/site-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function pickFirstText(...values: Array<unknown>): string {
  const found = values.find((v) => typeof v === "string" && v.trim().length > 0);
  return typeof found === "string" ? found.trim() : "";
}

function buildKeywords(values: Array<unknown>): string[] {
  const list = values
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
  return Array.from(new Set(list)).slice(0, 12);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}): Promise<Metadata> {
  const { domain, slug } = await params;
  const heads = await headers();
  const host = heads.get("host") || domain;
  const { config } = await getSiteConfigWithProject(domain, heads);

  const pages = normalizePagesWithDefaults(config?.pages);
  const page = getPageBySlug(pages, slug);
  const seo = page?.seo || config?.seo || {};
  const brand = config?.brand || {};
  const hero = config?.hero || {};
  const features = config?.features || {};

  const pageLabel = page?.label || slug.replace(/-/g, " ");
  const brandName = brand.name || domain;
  const customSeoTitle = pickFirstText(seo.title);
  const isGenericSeoTitle = !customSeoTitle || /^page\s+\d+$/i.test(customSeoTitle.trim());
  const baseTitle = isGenericSeoTitle ? pageLabel : customSeoTitle;
  const title = baseTitle.includes(brandName)
    ? baseTitle
    : `${baseTitle} | ${brandName}`;
  const description =
    pickFirstText(seo.description, hero.subtitle, features.subtitle) ||
    `${pageLabel} — ${brandName}. Built with EstabWeb.`;
  const keywords =
    Array.isArray(seo.keywords) && seo.keywords.length > 0
      ? seo.keywords
      : buildKeywords([brand.name, pageLabel, config?.theme, hero.benefitText, features.title]);
  const iconUrl = brand.favicon || brand.logoUrl || "/Logo.png";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: brand.name,
      images: brand.logoUrl ? [{ url: brand.logoUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: brand.logoUrl ? [brand.logoUrl] : [],
    },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    metadataBase: new URL(`https://${host}`),
    alternates: {
      canonical: `/${slug}`,
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

  // Legal pages have their own dedicated routes — never handle them here
  if (isLegalPageSlug(slug)) {
    notFound();
  }

  const { config: initialData, project } = await getSiteConfigWithProject(domain, heads);

  if (!initialData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm sm:text-base">
          Configuration not found. Please check your domain.
        </p>
      </div>
    );
  }

  // Entitlement check — free projects cannot access subpages
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
