import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_TYPES = ["messenger", "call", "form", "viber"] as const;
type LeadType = (typeof VALID_TYPES)[number];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, project_id, metadata } = body as {
      type: LeadType;
      project_id: string;
      metadata?: Record<string, string>;
    };

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid lead type" }, { status: 400 });
    }

    if (!project_id || typeof project_id !== "string") {
      return NextResponse.json({ error: "Missing project_id" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("project_leads").insert({
      project_id,
      type,
      metadata: metadata ?? {},
    });

    if (error) {
      console.error("[track-lead] Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to persist lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[track-lead] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
