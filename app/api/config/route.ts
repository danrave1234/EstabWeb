import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: config, error } = await supabase
      .from("site_config")
      .select("payload")
      .eq("key", "template_master")
      .single();

    if (error || !config) {
      return NextResponse.json({});
    }

    return NextResponse.json(config.payload);
  } catch (err) {
    console.error("Failed to read config from DB:", err);
    return NextResponse.json(
      { error: "Failed to load config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = await createClient();

    // 1. Get current template master config
    const { data: config } = await supabase
      .from("site_config")
      .select("id, payload")
      .eq("key", "template_master")
      .single();

    // Snapshot-based: body is the full new config, replace entirely
    if (config) {
      // 2. Update existing template master config
      await supabase
        .from("site_config")
        .update({
          payload: body,
          updated_at: new Date().toISOString()
        })
        .eq("id", config.id);
    } else {
      // 3. Create template master config if it doesn't exist
      await supabase
        .from("site_config")
        .insert({
          key: "template_master",
          payload: body
        });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save config to DB:", err);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
