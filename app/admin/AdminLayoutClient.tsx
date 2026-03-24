"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import MainHeader from "@/components/shared/MainHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { mainSiteConfig } from "@/config/main-site-config";
import { AuthProvider } from "@/components/providers/AuthProvider";
import NetworkOfflineBanner from "@/components/shared/NetworkOfflineBanner";

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
  const [collapsed, setCollapsed] = useState(false);

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
      <NetworkOfflineBanner />
      <div className="min-h-screen flex bg-muted/30">
        {!isPreview && (
          <AdminSidebar 
            user={user} 
            role={role} 
            collapsed={collapsed} 
            onToggleCollapse={() => setCollapsed(!collapsed)} 
          />
        )}
        <div className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300", 
          !isPreview && (collapsed ? "lg:pl-20" : "lg:pl-64")
        )}>
          {!isPreview && (
            <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between lg:hidden">
              <span className="font-bold">EstabWeb Admin</span>
            </header>
          )}
          <main className="flex-1">
            {children}
          </main>
          <ScrollReveal />
        </div>
        <Toaster position="top-right" richColors />
      </div>
    </AuthProvider>
  );
}
