import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { allFontVariables } from "@/lib/fonts";
import { mainSiteConfig } from "@/config/main-site-config";
import { Toaster } from "sonner";
import StructuredData from "@/components/shared/StructuredData";
import { createClient } from "@/lib/supabase/server";
import HubLayoutClient from "@/components/shared/HubLayoutClient";
import { AuthProvider } from "@/components/providers/AuthProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.estabweb.com";

export const metadata: Metadata = {
  title: {
    default: "EstabWeb - Affordable Business Websites in the Philippines",
    template: "%s | EstabWeb"
  },
  description: "Affordable website setup for local businesses in the Philippines. Start from a ready template, edit your content anytime, pay monthly, and request design updates when needed.",
  keywords: [
    "website design philippines",
    "website design philippines price",
    "small business website philippines",
    "affordable web design philippines",
    "website builder philippines",
    "monthly website subscription philippines",
    "website maintenance cost per month philippines",
    "custom domain website philippines",
    "gym website design philippines",
    "gym website creation philippines",
    "fitness website builder philippines"
  ],
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
    locale: "en_PH",
    url: siteUrl,
    siteName: "EstabWeb",
    title: "EstabWeb - Affordable Business Websites in the Philippines",
    description: "Start with a ready website template, edit anytime, and subscribe monthly. Built for local businesses in the Philippines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EstabWeb - Affordable Business Websites in the Philippines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EstabWeb - Affordable Business Websites in the Philippines",
    description: "Ready website templates, easy edits, monthly plans, and design requests for local businesses in the Philippines.",
    images: ["/og-image.png"],
    creator: "@estabweb",
  },
  verification: {
    other: {
      "msvalidate.01": "9F1BC3482AFCA6B6696F286ADCC062E0",
    },
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
    <html
      lang="en"
      data-theme={colorTheme}
      data-mode={mode}
      data-typography={typography}
      className={`${allFontVariables} app-shell-fonts`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "EstabWeb",
            "url": siteUrl,
            "description": "Affordable business websites in the Philippines with easy editing, monthly subscription, and design support.",
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider initialUser={sessionUser}>
          <HubLayoutClient initialUser={sessionUser}>
            {children}
          </HubLayoutClient>
          <Toaster position="top-right" richColors />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
