"use client";

import type { Metadata } from "next";
import { Poppins, Manrope } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
import { mainSiteConfig } from "@/config/main-site-config";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainHeader from "@/components/shared/MainHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const poppins = Poppins({ variable: "--font-poppins", weight: ["400", "500", "600", "700"], subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export default function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) {
  const pathname = usePathname();
  const isPreview = pathname === "/admin/preview" || pathname === "/admin/template";
  const isDashboard = pathname === "/admin/dashboard";

  useEffect(() => {
    if (!isPreview) return;
    (async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        const theme = data.colorTheme || 'partner';
        const mode = data.darkMode ? 'dark' : 'light';
        const typo = data.typographyStyle || 'elegant';
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-mode', mode);
        root.setAttribute('data-typography', typo);
      } catch {
        // ignore
      }
    })();
  }, [isPreview]);
  
  const mode = mainSiteConfig.darkMode ? "dark" : "light";
  
  return (
    <html lang="en" data-theme={isPreview ? undefined : mainSiteConfig.colorTheme} data-mode={isPreview ? undefined : mode} data-typography={isPreview ? undefined : mainSiteConfig.typographyStyle}>
      <body className={`${poppins.variable} ${manrope.variable} antialiased ${!isPreview ? 'bg-muted/30' : ''}`}>
        <div className="min-h-screen flex flex-col">
          {!isPreview && <MainHeader variant="admin" initialUser={user} />}
          <main className={`flex-1 ${!isPreview ? 'pt-16' : ''}`}>
            {children}
          </main>
        </div>
        <ScrollReveal />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
