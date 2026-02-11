import type { Metadata } from "next";
import path from "path";
import fs from "fs/promises";
import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  return {
    title: `${domain} | Site Preview`,
    description: `Dynamic website preview for ${domain} rendered from EstabWeb configuration.`,
  };
}

const SITE_DATA_PATH = path.join(process.cwd(), "config", "site-data.json");
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

  try {
    const { domain } = await params;

    // Attempt to load per-project config by subdomain first
    try {
      const supabase = await createClient();
      const { data: rows } = await supabase
        .from("projects")
        .select("subdomain,custom_domain,current_config,draft_config")
        .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
        .limit(1);

      const dbRow = rows?.[0] as any | undefined;
      const dbConf = (dbRow?.draft_config ?? dbRow?.current_config) as any | undefined;
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
      } else {
        // Fallback to shared file when no project found
        const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
        const fileConf = JSON.parse(raw);
        if (fileConf.colorTheme && VALID_COLOR_THEMES.includes(fileConf.colorTheme)) {
          colorTheme = fileConf.colorTheme;
        }
        if (fileConf.darkMode) {
          mode = "dark";
        }
        if (fileConf.typographyStyle) {
          typography = fileConf.typographyStyle;
        }
      }
    } catch {
      // If Supabase query fails for any reason, fallback to file
      const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
      const data = JSON.parse(raw);
      if (data.colorTheme && VALID_COLOR_THEMES.includes(data.colorTheme)) {
        colorTheme = data.colorTheme;
      }
      if (data.darkMode) {
        mode = "dark";
      }
      if (data.typographyStyle) {
        typography = data.typographyStyle;
      }
    }
  } catch {
    // use defaults
  }

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
