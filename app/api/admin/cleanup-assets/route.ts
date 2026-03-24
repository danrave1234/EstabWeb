import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { deleteSiteAssetsFromPayload } from "@/lib/template-drafts";

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json();
    if (!payload) {
      return NextResponse.json({ success: true, message: "No payload provided" });
    }

    const service = createServiceClient();
    
    // Attempt to parse out and delete any site-assets URLs safely
    const result = await deleteSiteAssetsFromPayload(service, payload);
    
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("Error in cleanup-assets:", err);
    return NextResponse.json({ error: err.message || "Failed to cleanup assets" }, { status: 500 });
  }
}
