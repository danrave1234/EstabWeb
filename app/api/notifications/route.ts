import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[GET /api/notifications] Supabase error:", error.message);
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }

    return NextResponse.json({ notifications: notifications || [] });
  } catch (err) {
    console.error("[GET /api/notifications] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, is_read, mark_all_read } = body as { id?: string; is_read?: boolean; mark_all_read?: boolean };

    if (mark_all_read) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        console.error("[PATCH /api/notifications] Supabase error marking all read:", error.message);
        return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (!id || is_read === undefined) {
      return NextResponse.json({ error: "Missing required fields: id and is_read" }, { status: 400 });
    }

    const { data: notification, error: updateError } = await supabase
      .from("notifications")
      .update({ is_read })
      .eq("user_id", user.id)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[PATCH /api/notifications] Supabase error updating single:", updateError.message);
      return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification });
  } catch (err) {
    console.error("[PATCH /api/notifications] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
