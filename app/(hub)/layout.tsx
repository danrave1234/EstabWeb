import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { mainSiteConfig } from "@/config/main-site-config";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EstabWeb - Professional Websites in Minutes",
  description: "High-performance, industry-specific sites that are fully managed and optimized for growth.",
};

export default function HubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorTheme = mainSiteConfig.colorTheme;
  const mode = mainSiteConfig.darkMode ? "dark" : "light";
  const typography = mainSiteConfig.typographyStyle;

  return (
    <html lang="en" data-theme={colorTheme} data-mode={mode} data-typography={typography} className={fontVariables}>
      <body className="antialiased">
        <ScrollReveal />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
