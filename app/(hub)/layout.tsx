import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { mainSiteConfig } from "@/config/main-site-config";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import StructuredData from "@/components/shared/StructuredData";
import { createClient } from "@/lib/supabase/server";
import HubLayoutClient from "@/components/shared/HubLayoutClient";
import { AuthProvider } from "@/components/providers/AuthProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://estabweb.com";

export const metadata: Metadata = {
  title: {
    default: "EstabWeb - Professional Websites in Minutes",
    template: "%s | EstabWeb"
  },
  description: "High-performance, industry-specific sites that are fully managed and optimized for growth. Stop fighting with complex builders.",
  keywords: ["website builder", "local business", "managed hosting", "professional websites", "industry-specific"],
  authors: [{ name: "EstabWeb Team" }],
  creator: "EstabWeb",
  publisher: "EstabWeb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "EstabWeb",
    title: "EstabWeb - Professional Websites in Minutes",
    description: "High-performance, industry-specific sites that are fully managed and optimized for growth.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EstabWeb - Professional Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EstabWeb - Professional Websites in Minutes",
    description: "High-performance, industry-specific sites that are fully managed and optimized for growth.",
    images: ["/og-image.png"],
    creator: "@estabweb",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
};

export default async function HubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sessionUser = user || null;

  const colorTheme = mainSiteConfig.colorTheme;
  const mode = mainSiteConfig.darkMode ? "dark" : "light";
  const typography = mainSiteConfig.typographyStyle;

  return (
    <html lang="en" data-theme={colorTheme} data-mode={mode} data-typography={typography} className={fontVariables}>
      <head>
        <meta charSet="utf-8" />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "EstabWeb",
            "url": siteUrl,
            "description": "High-performance, industry-specific sites that are fully managed and optimized for growth.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider initialUser={sessionUser}>
          <HubLayoutClient initialUser={sessionUser}>
            <div className="flex-1">
              <ScrollReveal />
              {children}
            </div>
          </HubLayoutClient>
          <Toaster position="top-right" richColors />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
