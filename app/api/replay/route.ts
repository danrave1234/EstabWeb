import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";

const replayLimiter = createRateLimiter({ windowMs: 60_000, limit: 60, namespace: "replay" });

export async function POST(request: Request) {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";

    const rl = await replayLimiter.check(ip);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const { project_id, session_id, visitor_id, page_slug, events, duration_ms, metadata } = body as {
      project_id: string;
      session_id: string;
      visitor_id?: string;
      page_slug?: string;
      events: unknown[];
      duration_ms?: number;
      metadata?: Record<string, unknown>;
    };

    if (!project_id || !session_id || !Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Drop preview replays
    if (page_slug && /^\/preview\//i.test(page_slug)) {
      return NextResponse.json({ success: true });
    }

    const supabase = createServiceClient();

    // Validate project
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", project_id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Invalid project_id" }, { status: 400 });
    }

    // Upsert replay — append events to existing session record if it exists
    const { data: existing } = await supabase
      .from("session_replays")
      .select("id, events")
      .eq("project_id", project_id)
      .eq("session_id", session_id)
      .single();

    if (existing) {
      const merged = [...(existing.events as unknown[]), ...events];
      await supabase
        .from("session_replays")
        .update({
          events: merged,
          duration_ms: duration_ms ?? null,
          ended_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("session_replays").insert({
        project_id,
        session_id,
        visitor_id: visitor_id ?? null,
        page_slug: page_slug ?? null,
        events,
        duration_ms: duration_ms ?? null,
        ended_at: new Date().toISOString(),
        metadata: metadata ?? null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[replay] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
