import type { Metadata } from "next";
import { headers } from "next/headers";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import { getPageBySlug, normalizePages, normalizePagesWithDefaults } from "@/lib/utils/site-pages";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const heads = await headers();
  const host = heads.get("host") || domain;
  const { config } = await getSiteConfigWithProject(domain, heads);

  const pages = normalizePagesWithDefaults(config?.pages);
  const homePage = getPageBySlug(pages, "");
  const seo = homePage?.seo || config?.seo || {};
  const brand = config?.brand || {};
  const hero = config?.hero || {};
  const features = config?.features || {};
  const practiceAreas = config?.practiceAreas || {};
  const contact = config?.contact || {};
  const theme = config?.theme || "";

  const pageLabel = homePage?.label || (homePage?.slug ? homePage.slug.replace(/-/g, " ") : "");
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
      canonical: "/",
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

  const { config: initialData, project } = await getSiteConfigWithProject(domain, heads);

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
