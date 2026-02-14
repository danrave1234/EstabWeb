"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import MainHeader from "@/components/shared/MainHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { mainSiteConfig } from "@/config/main-site-config";

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) {
  const pathname = usePathname();
  const isPreview = pathname === "/admin/preview" || pathname === "/admin/template";

  useEffect(() => {
    const root = document.documentElement;
    if (isPreview) {
      (async () => {
        try {
          const res = await fetch('/api/config');
          const data = await res.json();
          const theme = data.colorTheme || 'partner';
          const mode = data.darkMode ? 'dark' : 'light';
          const typo = data.typographyStyle || 'elegant';
          root.setAttribute('data-theme', theme);
          root.setAttribute('data-mode', mode);
          root.setAttribute('data-typography', typo);
        } catch {
          // ignore
        }
      })();
    } else {
      // Reset to main site defaults when not in preview
      root.setAttribute('data-theme', mainSiteConfig.colorTheme);
      root.setAttribute('data-mode', mainSiteConfig.darkMode ? 'dark' : 'light');
      root.setAttribute('data-typography', mainSiteConfig.typographyStyle);
    }

    return () => {
      // Always reset on unmount to prevent bleeding into other layout groups
      root.setAttribute('data-theme', mainSiteConfig.colorTheme);
      root.setAttribute('data-mode', mainSiteConfig.darkMode ? 'dark' : 'light');
      root.setAttribute('data-typography', mainSiteConfig.typographyStyle);
    };
  }, [isPreview]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isPreview && <MainHeader variant="admin" initialUser={user} />}
      <main className={`flex-1 ${!isPreview ? 'pt-16' : ''}`}>
        {children}
      </main>
      <ScrollReveal />
      <Toaster position="top-right" richColors />
    </div>
  );
}
