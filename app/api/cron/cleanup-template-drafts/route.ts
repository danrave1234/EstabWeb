import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { cleanupExpiredTemplateDrafts } from "@/lib/template-drafts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const result = await cleanupExpiredTemplateDrafts(supabase, 1000);

  if (result.errors.length > 0) {
    console.error("[cron/cleanup-template-drafts] Cleanup warnings:", result.errors);
  }

  return NextResponse.json({
    ok: true,
    expiredCount: result.expiredCount,
    deletedDraftCount: result.deletedDraftCount,
    deletedAssetCount: result.deletedAssetCount,
    errors: result.errors,
  });
}
