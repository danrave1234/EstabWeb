import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import SiteTemplate from "@/components/shared/SiteTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { getSiteConfig } from "@/lib/utils/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const heads = await headers();
  const preview = heads.get('x-preview-mode') === 'true';

  const initialData = await getSiteConfig(domain, heads);

  // Final fallback to error UI if nothing found
  if (!initialData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm sm:text-base">
          Configuration not found. Please check your domain.
        </p>
      </div>
    );
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
