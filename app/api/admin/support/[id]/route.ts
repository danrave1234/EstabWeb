import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { SupportRequestStatus } from "@/lib/support/support-meta";
import { logAudit } from "@/lib/audit";

const VALID_STATUSES: SupportRequestStatus[] = ["open", "in_progress", "resolved", "closed"];

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "sub_admin"].includes(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user, role: profile.role };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await req.json();
    const status = typeof body?.status === "string" ? body.status : null;

    if (!status || !VALID_STATUSES.includes(status as SupportRequestStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const service = createServiceClient();

    const { data: existing, error: fetchError } = await service
      .from("support_requests")
      .select("id, project_id, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Support request not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updatePayload: Record<string, unknown> = {
      status,
      assigned_to: auth.user.id,
      resolved_at: status === "resolved" ? now : null,
      closed_at: status === "closed" ? now : null,
    };

    if (status === "open" || status === "in_progress") {
      updatePayload.resolved_at = null;
      updatePayload.closed_at = null;
    }

    const { error: updateError } = await service
      .from("support_requests")
      .update(updatePayload)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    await logAudit(service, "support_request_status_update", auth.user.id, existing.project_id, {
      requestId: id,
      previousStatus: existing.status,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[admin/support][PATCH]", error);
    return NextResponse.json({ error: error?.message || "Failed to update support request" }, { status: 500 });
  }
}
