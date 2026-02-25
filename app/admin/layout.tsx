import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import { mainSiteConfig } from "@/config/main-site-config";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Dashboard | EstabWeb",
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null };

  const mode = mainSiteConfig.darkMode ? "dark" : "light";

  return (
    <html lang="en" data-theme={mainSiteConfig.colorTheme} data-mode={mode} data-typography={mainSiteConfig.typographyStyle} className={fontVariables}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="antialiased bg-muted/30">
        <AdminLayoutClient user={user} role={profile?.role ?? 'admin'}>
          {children}
        </AdminLayoutClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
