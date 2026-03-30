import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "@/app/globals.css";
import { allFontVariables, getFontVariables } from "@/lib/fonts";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import { getCachedSiteConfig } from "@/lib/utils/site-config";
import { COLOR_THEME_SWATCHES } from "@/config/dashboard-config";
import StructuredData from "@/components/shared/StructuredData";
import { GoogleAnalytics, FacebookPixel, AnalyticsProvider } from "@/components/shared/Analytics";
import { generateSchema } from "@/lib/utils/schema";
import NetworkOfflineBanner from "@/components/shared/NetworkOfflineBanner";
import { getPageBySlug, normalizePagesWithDefaults } from "@/lib/utils/site-pages";
import { buildAutoSeoDefaults, formatDomainAsBrand, sanitizeBrandName, sanitizePublicContactValue } from "@/lib/seo/autoSeo";
import { isProPlan } from "@/lib/subscription";

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
  const homePage = getPageBySlug(pages, "");
  const resolvedSeo = buildAutoSeoDefaults({
    config,
    page: homePage as Record<string, any> | undefined,
    pageSlug: "",
    pageLabel: homePage?.label || "Home",
    domain,
  });

  const brand = config?.brand || {};
  const fallbackBrandName = sanitizeBrandName(brand.name, formatDomainAsBrand(domain)) || formatDomainAsBrand(domain);
  const iconUrl = `https://${preferredHost}/favicon.ico`;

  return {
    // Fallback title - page.tsx and [slug]/page.tsx override this per-route.
    title: resolvedSeo.title || fallbackBrandName,
    description: resolvedSeo.description || `Welcome to ${fallbackBrandName}`,
    metadataBase: new URL(`https://${preferredHost}`),
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
    alternates: {
      canonical: `https://${preferredHost}${resolvedSeo.canonical || "/"}`,
    },
  };
}

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
  let preferredHost = "";
  let projectId: string | undefined = undefined;
  let pageVersionId: string | undefined = undefined;
  let homeSeoDefaults: ReturnType<typeof buildAutoSeoDefaults> | null = null;
  let homeSeoSettings: Record<string, any> = {};

  try {
    const resolvedParams = await params;
    domain = resolvedParams.domain;
    const heads = await headers();
    host = heads.get("host") || domain;
    const siteData = await getCachedSiteConfig(domain, heads);
    dbConf = siteData.config;
    const project = siteData.project;
    projectId = project?.id;
    pageVersionId = project?.config_version != null ? String(project.config_version) : undefined;
    const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
    const hostWithoutPort = (host.split(":")[0] || domain).toLowerCase();
    preferredHost =
      project?.custom_domain && isProPlan(project)
        ? project.custom_domain.toLowerCase()
        : project?.subdomain
          ? `${project.subdomain}.${ROOT_DOMAIN}`.toLowerCase()
          : hostWithoutPort;

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
      const requestedTheme = typeof dbConf.colorTheme === "string" ? dbConf.colorTheme : "";
      if (requestedTheme && Object.prototype.hasOwnProperty.call(COLOR_THEME_SWATCHES, requestedTheme)) {
        colorTheme = requestedTheme;
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

  const fallbackBrandName = sanitizeBrandName(dbConf?.brand?.name, formatDomainAsBrand(domain)) || formatDomainAsBrand(domain);
  const hostWithoutPort = (host.split(":")[0] || domain).toLowerCase();
  const schemaHost = preferredHost || hostWithoutPort;
  const origin = `https://${schemaHost}`;
  const websiteSchemaId = `${origin}/#website`;
  const organizationSchemaId = `${origin}/#organization`;
  const footerSocial = dbConf?.footer?.social || {};
  const sameAs = [
    footerSocial.facebookEnabled !== false ? footerSocial.facebook : undefined,
    footerSocial.instagramEnabled !== false ? footerSocial.instagram : undefined,
    footerSocial.linkedinEnabled !== false ? footerSocial.linkedin : undefined,
    footerSocial.twitterEnabled !== false ? footerSocial.twitter : undefined,
  ].filter((url: unknown): url is string => typeof url === "string" && url.trim().length > 0);

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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {dbConf && (
          <>
            {/* Site-wide WebSite schema - always present */}
            <StructuredData
              data={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": websiteSchemaId,
                "name": fallbackBrandName,
                "url": origin,
                "description": homeSeoDefaults?.description || `Welcome to ${fallbackBrandName}`,
                "inLanguage": "en-PH",
                "publisher": {
                  "@id": organizationSchemaId,
                },
              }}
            />
            <StructuredData
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": organizationSchemaId,
                "name": fallbackBrandName,
                "url": origin,
                "logo": sanitizePublicContactValue(dbConf.brand?.logoUrl) || undefined,
                "email": sanitizePublicContactValue(dbConf.contact?.email) || undefined,
                "telephone": sanitizePublicContactValue(dbConf.contact?.phone) || undefined,
                "sameAs": sameAs.length > 0 ? sameAs : undefined,
                "address": sanitizePublicContactValue(dbConf.contact?.address)
                  ? {
                    "@type": "PostalAddress",
                    "streetAddress": sanitizePublicContactValue(dbConf.contact.address),
                  }
                  : undefined,
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
                  "name": fallbackBrandName,
                  "url": origin,
                };
                const brandLogo = sanitizePublicContactValue(dbConf.brand?.logoUrl);
                const email = sanitizePublicContactValue(dbConf.contact?.email);
                const phone = sanitizePublicContactValue(dbConf.contact?.phone);
                const address = sanitizePublicContactValue(dbConf.contact?.address);
                if (brandLogo) defaultSchema["image"] = brandLogo;
                if (email) defaultSchema["email"] = email;
                if (phone) defaultSchema["telephone"] = phone;
                if (address) defaultSchema["address"] = { "@type": "PostalAddress", "streetAddress": address };
                return <StructuredData data={defaultSchema} />;
              }
              return null;
            })()}
            {(() => {
              const homeSeo = homeSeoSettings;
              if (homeSeo.structuredData?.enabled) {
                const schema = generateSchema(homeSeo.structuredData.type, { ...dbConf, siteUrl: origin });
                if (schema) return <StructuredData data={schema} />;
              }
              return null;
            })()}
          </>
        )}
      </head>
      <body className="antialiased">
        <AnalyticsProvider projectId={projectId || dbConf?.projectId} pageVersionId={pageVersionId}>
          {dbConf?.analytics?.ga4Id && <GoogleAnalytics id={dbConf.analytics.ga4Id} />}
          {dbConf?.analytics?.pixelId && <FacebookPixel id={dbConf.analytics.pixelId} />}
          <NetworkOfflineBanner />
          <ScrollReveal />
          {children}
          <Toaster position="top-right" richColors />
        </AnalyticsProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
