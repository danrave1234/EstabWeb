import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import { mainSiteConfig } from "@/config/main-site-config";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mode = mainSiteConfig.darkMode ? "dark" : "light";

  return (
    <html lang="en" data-theme={mainSiteConfig.colorTheme} data-mode={mode} data-typography={mainSiteConfig.typographyStyle} className={fontVariables}>
      <body className="antialiased bg-muted/30">
        <AdminLayoutClient user={user}>
          {children}
        </AdminLayoutClient>
      </body>
    </html>
  );
}
