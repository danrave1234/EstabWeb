import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import { canUseMultiPage, getMaxPagesForProject, getPlanLimits, getPageBySlug, isLegalPageSlug, normalizePages } from "@/lib/utils/site-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function pickFirstText(...values: Array<unknown>): string {
  const found = values.find((value) => typeof value === "string" && value.trim().length > 0);
  return typeof found === "string" ? found.trim() : "";
}

function buildKeywords(values: Array<unknown>): string[] {
  const list = values
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
  return Array.from(new Set(list)).slice(0, 12);
}

async function resolvePageData(domain: string, slug: string, heads: Headers) {
  const { config, project } = await getSiteConfigWithProject(domain, heads);
  if (!config) return { config: null, page: null, project: null };

  if (isLegalPageSlug(slug)) return { config, page: null, project };

  const pages = normalizePages(config?.pages);
  if (!canUseMultiPage(project)) return { config, page: null, project };

  const planLimits = await getPlanLimits();
  const maxPages = getMaxPagesForProject(project, planLimits);
  const paidPages = pages.filter((page) => page.slug && !isLegalPageSlug(page.slug)).slice(0, maxPages);
  const page = getPageBySlug(paidPages, slug);
  return { config, page, project };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}): Promise<Metadata> {
  const { domain, slug } = await params;
  const heads = await headers();
  const host = heads.get("host") || domain;

  const { config, page } = await resolvePageData(domain, slug, heads);
  if (!config || !page) {
    notFound();
  }

  const seo = page.seo || config?.seo || {};
  const brand = config?.brand || {};
  const hero = config?.hero || {};
  const features = config?.features || {};
  const practiceAreas = config?.practiceAreas || {};
  const contact = config?.contact || {};
  const theme = config?.theme || "";

  const pageLabel = page?.label || (page?.slug ? page.slug.replace(/-/g, " ") : "");
  const baseTitle = pickFirstText(seo.title, pageLabel, hero.title, features.title, practiceAreas.title);
  const brandName = brand.name || domain;
  const title = baseTitle
    ? baseTitle.includes(brandName) ? baseTitle : `${baseTitle} | ${brandName}`
    : `${brandName} | Professional Website`;
  const description = pickFirstText(
    seo.description,
    hero.subtitle,
    features.subtitle,
    practiceAreas.subtitle,
    contact.tagline,
    contact.subtitle,
    contact.formHeading
  ) || `Welcome to ${brandName}. Built with EstabWeb.`;
  const keywords = Array.isArray(seo.keywords) && seo.keywords.length > 0
    ? seo.keywords
    : buildKeywords([brand.name, pageLabel, theme, hero.benefitText, hero.badgeText, features.title, practiceAreas.title]);
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
      canonical: `/${page.slug}`,
    },
  };
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain, slug } = await params;
  const heads = await headers();
  const preview = heads.get("x-preview-mode") === "true";

  const { config, page } = await resolvePageData(domain, slug, heads);
  if (!config || !page) {
    notFound();
  }

  const dataForPage = {
    ...config,
    activeSections: page.activeSections ?? config.activeSections,
    seo: page.seo ?? config.seo,
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