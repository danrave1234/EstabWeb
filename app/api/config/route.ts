import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const a = out[key];
    const b = source[key];
    if (a != null && b != null && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      out[key] = deepMerge(a as Record<string, unknown>, b as Record<string, unknown>);
    } else if (source[key] !== undefined) {
      out[key] = source[key];
    }
  }
  return out;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: config, error } = await supabase
      .from("site_config")
      .select("payload")
      .eq("key", "global")
      .single();

    if (error || !config) {
      // If global config doesn't exist in DB, it might not have been migrated yet.
      // The getSiteConfig auto-migration will handle this on the first load of the site.
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

    // 1. Get current global config
    const { data: config } = await supabase
      .from("site_config")
      .select("id, payload")
      .eq("key", "global")
      .single();

    let existing: Record<string, unknown> = (config?.payload as Record<string, unknown>) || {};
    const merged = deepMerge(existing, body);

    if (config) {
      // 2. Update existing global config
      await supabase
        .from("site_config")
        .update({ 
          payload: merged,
          updated_at: new Date().toISOString()
        })
        .eq("id", config.id);
    } else {
      // 3. Create global config if it doesn't exist
      await supabase
        .from("site_config")
        .insert({
          key: "global",
          payload: merged
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
