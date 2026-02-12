import type { Metadata } from "next";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import { getSiteConfig } from "@/lib/utils/site-config";
import StructuredData from "@/components/shared/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const heads = await headers();
  const host = heads.get("host") || domain;
  const config = await getSiteConfig(domain, heads);

  const seo = config?.seo || {};
  const brand = config?.brand || {};

  const title = seo.title || `${brand.name || domain} | Professional Website`;
  const description = seo.description || `Welcome to ${brand.name || domain}. Built with EstabWeb.`;
  const keywords = seo.keywords || [];

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
      icon: brand.favicon || "/favicon.ico",
    },
    metadataBase: new URL(`https://${host}`),
    alternates: {
      canonical: "/",
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
  "light-reddish-orange", "white-purple-orange", "deep-purple-orange-red-pink", "brown-beige",
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

  try {
    const resolvedParams = await params;
    domain = resolvedParams.domain;
    const heads = await headers();
    host = heads.get("host") || domain;
    dbConf = await getSiteConfig(domain, heads);
    
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
    <html lang="en" data-theme={colorTheme} data-mode={mode} data-typography={typography} className={fontVariables}>
      <head>
        {dbConf && (
          <>
            <StructuredData 
              data={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": dbConf.brand?.name || domain,
                "url": `https://${host}`,
                "description": dbConf.seo?.description || `Welcome to ${dbConf.brand?.name || domain}`,
              }}
            />
            <StructuredData 
              data={{
                "@context": "https://schema.org",
                "@type": dbConf.theme === 'lawyer' ? 'LegalService' : 
                        dbConf.theme === 'dentist' ? 'Dentist' : 
                        dbConf.theme === 'chiropractor' ? 'HealthAndBeautyBusiness' :
                        dbConf.theme === 'clinic' ? 'MedicalBusiness' :
                        ['cleaning', 'pool', 'pest-control'].includes(dbConf.theme) ? 'HomeAndConstructionBusiness' :
                        'LocalBusiness',
                "name": dbConf.brand?.name || domain,
                "url": `https://${host}`,
                "image": dbConf.brand?.logoUrl || "",
                "email": dbConf.contact?.email || "",
                "telephone": dbConf.contact?.phone || "",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": dbConf.contact?.address || "",
                }
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <ScrollReveal />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
