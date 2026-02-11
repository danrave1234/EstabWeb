import path from "path";
import fs from "fs/promises";
import { createClient } from "@/lib/supabase/server";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_DATA_PATH = path.join(process.cwd(), "config", "site-data.json");

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { domain } = await params;
  const sp = await searchParams;
  const preview = sp?.preview === 'true';
  const projectId = typeof sp?.projectId === 'string' ? sp.projectId : undefined;

  let initialData: any | null = null;

  // In preview mode: prefer local template (site-data.json) so clients see immediate local edits
  if (preview) {
    try {
      const raw = await fs.readFile(SITE_DATA_PATH, 'utf-8');
      initialData = JSON.parse(raw);
    } catch {
      // If local file isn't available, fall back to DB like normal
    }
  }

  // When not in preview OR local file not available, load from DB
  if (!initialData) {
    try {
      const supabase = await createClient();

      let proj: any | undefined;
      if (projectId) {
        const { data } = await supabase
          .from('projects')
          .select('id,subdomain,custom_domain,current_config,draft_config')
          .eq('id', projectId)
          .limit(1);
        proj = data?.[0] as any | undefined;
      } else {
        const { data } = await supabase
          .from('projects')
          .select('id,subdomain,custom_domain,current_config,draft_config')
          .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
          .limit(1);
        proj = data?.[0] as any | undefined;
      }

      if (proj) {
        initialData = preview ? (proj?.draft_config ?? proj?.current_config) : (proj?.current_config ?? proj?.draft_config);
      }
    } catch {}
  }

  // Final fallback to template file (non-preview or DB missing)
  if (!initialData) {
    try {
      const raw = await fs.readFile(SITE_DATA_PATH, 'utf-8');
      initialData = JSON.parse(raw);
    } catch {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <p className="text-muted-foreground text-sm sm:text-base">
            config/site-data.json not found. Create it or run from the
            boilerplate directory.
          </p>
        </div>
      );
    }
  }

  // If preview mode is ON, we wrap in a Client Component that listens for postMessage
  if (preview) {
    return (
      <LivePreviewProvider initialData={initialData}>
        <SiteTemplate data={initialData} />
      </LivePreviewProvider>
    );
  }

  // Standard static-ish rendering for SEO and production
  return <SiteTemplate data={initialData} />;
}
