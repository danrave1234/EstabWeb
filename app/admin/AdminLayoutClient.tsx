"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import MainHeader from "@/components/shared/MainHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { mainSiteConfig } from "@/config/main-site-config";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function AdminLayoutClient({
  children,
  user,
  role,
}: {
  children: React.ReactNode;
  user?: any;
  role?: string;
}) {
  const pathname = usePathname();
  const isPreview = pathname === "/admin/preview" || pathname === "/admin/template";

  const { data: configData } = useSWR(
    isPreview ? "/api/config" : null,
    (url: string) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isPreview && configData) {
      const theme = configData.colorTheme || 'partner';
      const mode = configData.darkMode ? 'dark' : 'light';
      const typo = configData.typographyStyle || 'elegant';
      root.setAttribute('data-theme', theme);
      root.setAttribute('data-mode', mode);
      root.setAttribute('data-typography', typo);
    } else if (!isPreview) {
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
  }, [isPreview, configData]);

  return (
    <AuthProvider initialUser={user ?? null}>
    <div className="min-h-screen flex flex-col">
      {!isPreview && <MainHeader variant="admin" initialUser={user} role={role} />}
      <main className={`flex-1 ${!isPreview ? 'pt-16' : ''}`}>
        {children}
      </main>
      <ScrollReveal />
      <Toaster position="top-right" richColors />
    </div>
    </AuthProvider>
  );
}
