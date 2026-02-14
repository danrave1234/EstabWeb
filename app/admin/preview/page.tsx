import SiteBlockRenderer from "@/components/shared/SiteBlockRenderer";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSiteConfig } from "@/lib/utils/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPreviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Admin check
  const data = await getSiteConfig("master");

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm sm:text-base">
          Configuration not found.
        </p>
      </div>
    );
  }

  return <SiteBlockRenderer data={data} isAdmin={true} />;
}
