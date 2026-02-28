import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { allFontVariables, getFontVariables } from "@/lib/fonts";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import StructuredData from "@/components/shared/StructuredData";
import { GoogleAnalytics, FacebookPixel, AnalyticsProvider } from "@/components/shared/Analytics";
import { generateSchema } from "@/lib/utils/schema";
import NetworkOfflineBanner from "@/components/shared/NetworkOfflineBanner";
import { getPageBySlug, normalizePagesWithDefaults } from "@/lib/utils/site-pages";
import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo";

/**
 * Layout-level metadata provides sensible defaults and shared fields.
 * Page-level generateMetadata() (in page.tsx / [slug]/page.tsx) overrides
 * title, description, keywords, openGraph, twitter, and robots per-page.
 */
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
  const resolvedSeo = buildAutoSeoDefaults({
    config,
    page: homePage as Record<string, any> | undefined,
    pageSlug: "",
    pageLabel: homePage?.label || "Home",
    domain,
  });

  const brand = config?.brand || {};
  const iconUrl = brand.favicon || brand.logoUrl || "/Logo.png";

  return {
    // Fallback title - page.tsx and [slug]/page.tsx override this per-route.
    title: resolvedSeo.title || brand.name || domain,
    description: resolvedSeo.description || `Welcome to ${brand.name || domain}`,
    metadataBase: new URL(`https://${host}`),
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    alternates: {
      canonical: resolvedSeo.canonical || "/",
    },
  };
}

const VALID_COLOR_THEMES = [
  "partner", "justice", "modern", "frost-fire", "reliable", "eco-clean",
  "surgeon", "wellness", "holistic", "clinical-gold", "red-crimson", "cyan-ocean", "orange-amber",
  // New requested themes
  "dark-pink-white", "blue-mint", "red-black", "dark-green-ivory-yellow", "bright-green-hot-pink",
  "dark-grey-yellowgreen", "blue-shades-white", "white-lime", "beige-dark-grey", "pastel-purple-neutral",
  "navy-electric-blue", "gradient-white-dark-blue", "white-blue-grey", "bright-red-white",
  "classic-blue-turquoise-gold", "dark-royal-blue-gold", "white-purple", "blue-shades-white-red-violet",
  "light-reddish-orange", "white-purple-orange", "deep-purple-orange-red-pink", "brown-beige", "navy-electric",
  "dark-green-ivory", "fiesta-red-yellow", "barangay-blue", "tropical-teal", "luxury-black-gold", "facebook-blue",
  // Existing tech themes
  "nebula", "flow", "mono",
] as const;

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  let colorTheme = "partner";
  let mode = "light";
  let typography = "elegant";
  let dbConf: any = null;
  let domain = "";
  let host = "";
  let projectId: string | undefined = undefined;
  let homeSeoDefaults: ReturnType<typeof buildAutoSeoDefaults> | null = null;
  let homeSeoSettings: Record<string, any> = {};

  try {
    const resolvedParams = await params;
    domain = resolvedParams.domain;
    const heads = await headers();
    host = heads.get("host") || domain;
    const siteData = await getSiteConfigWithProject(domain, heads);
    dbConf = siteData.config;
    const project = siteData.project;
    projectId = project?.id;

    if (dbConf) {
      const dbPages = normalizePagesWithDefaults(dbConf?.pages);
      const dbHomePage = getPageBySlug(dbPages, "");
      homeSeoSettings = dbHomePage?.seo && typeof dbHomePage.seo === "object"
        ? dbHomePage.seo
        : dbConf.seo && typeof dbConf.seo === "object"
          ? dbConf.seo
          : {};
      homeSeoDefaults = buildAutoSeoDefaults({
        config: dbConf,
        page: dbHomePage as Record<string, any> | undefined,
        pageSlug: "",
        pageLabel: dbHomePage?.label || "Home",
        domain,
      });
    }

    if (dbConf) {
      if (dbConf.colorTheme && VALID_COLOR_THEMES.includes(dbConf.colorTheme)) {
        colorTheme = dbConf.colorTheme;
      }
      if (dbConf.darkMode) {
        mode = "dark";
      }
      if (dbConf.typographyStyle) {
        typography = dbConf.typographyStyle;
      }
    }
  } catch {
    // use defaults
  }

  return (
    <html
      lang="en"
      data-theme={colorTheme}
      data-mode={mode}
      data-typography={typography}
      className={`client-site ${allFontVariables} ${getFontVariables(colorTheme, typography)}`}
    >
      <head>
        <meta charSet="utf-8" />
        {dbConf && (
          <>
            {/* Site-wide WebSite schema - always present */}
            <StructuredData
              data={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": dbConf.brand?.name || domain,
                "url": `https://${host}`,
                "description": homeSeoDefaults?.description || `Welcome to ${dbConf.brand?.name || domain}`,
              }}
            />
            {(() => {
              const homeSeo = homeSeoSettings;
              const customType = homeSeo.structuredData?.enabled ? homeSeo.structuredData?.type : null;
              // Only inject default LocalBusiness if client hasn't enabled a custom localbusiness schema
              // (prevents duplicate LocalBusiness JSON-LD blocks)
              if (customType !== "localbusiness") {
                const schemaType = dbConf.theme === "lawyer" ? "LegalService" :
                  dbConf.theme === "dentist" ? "Dentist" :
                    dbConf.theme === "chiropractor" ? "HealthAndBeautyBusiness" :
                      dbConf.theme === "clinic" ? "MedicalBusiness" :
                        ["cleaning", "pool", "pest-control"].includes(dbConf.theme) ? "HomeAndConstructionBusiness" :
                          "LocalBusiness";
                const defaultSchema: Record<string, unknown> = {
                  "@context": "https://schema.org",
                  "@type": schemaType,
                  "name": dbConf.brand?.name || domain,
                  "url": `https://${host}`,
                };
                if (dbConf.brand?.logoUrl) defaultSchema["image"] = dbConf.brand.logoUrl;
                if (dbConf.contact?.email) defaultSchema["email"] = dbConf.contact.email;
                if (dbConf.contact?.phone) defaultSchema["telephone"] = dbConf.contact.phone;
                if (dbConf.contact?.address) defaultSchema["address"] = { "@type": "PostalAddress", "streetAddress": dbConf.contact.address };
                return <StructuredData data={defaultSchema} />;
              }
              return null;
            })()}
            {(() => {
              const homeSeo = homeSeoSettings;
              if (homeSeo.structuredData?.enabled) {
                const schema = generateSchema(homeSeo.structuredData.type, dbConf);
                if (schema) return <StructuredData data={schema} />;
              }
              return null;
            })()}
          </>
        )}
      </head>
      <body className="antialiased">
        <AnalyticsProvider projectId={projectId || dbConf?.projectId}>
          {dbConf?.analytics?.ga4Id && <GoogleAnalytics id={dbConf.analytics.ga4Id} />}
          {dbConf?.analytics?.pixelId && <FacebookPixel id={dbConf.analytics.pixelId} />}
          <NetworkOfflineBanner />
          <ScrollReveal />
          {children}
          <Toaster position="top-right" richColors />
        </AnalyticsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
