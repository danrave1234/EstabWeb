import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { logAudit } from "@/lib/audit";
import { sendSupportReplyNotification } from "@/lib/email/support-reply";
import { SUPPORT_TYPE_LABELS, type SupportRequestType } from "@/lib/support/support-meta";

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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Reply message is required" }, { status: 400 });
    }

    const service = createServiceClient();

    const { data: requestRow, error: requestError } = await service
      .from("support_requests")
      .select("id, user_id, project_id, type, subject, status, projects(id, subdomain, current_config)")
      .eq("id", id)
      .maybeSingle();

    if (requestError || !requestRow) {
      return NextResponse.json({ error: "Support request not found" }, { status: 404 });
    }

    const { error: messageError } = await service
      .from("support_request_messages")
      .insert({
        support_request_id: id,
        sender_id: auth.user.id,
        sender_role: "admin",
        message,
      });

    if (messageError) {
      return NextResponse.json({ error: messageError.message }, { status: 400 });
    }

    const nextStatus = requestRow.status === "resolved" || requestRow.status === "closed"
      ? "in_progress"
      : requestRow.status || "in_progress";

    const { error: updateError } = await service
      .from("support_requests")
      .update({
        status: nextStatus,
        assigned_to: auth.user.id,
        resolved_at: null,
        closed_at: null,
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    let userEmail: string | null = null;
    if (requestRow.user_id) {
      const { data: userProfile } = await service
        .from("profiles")
        .select("email")
        .eq("id", requestRow.user_id)
        .maybeSingle();
      userEmail = userProfile?.email ?? null;
    }

    if (requestRow.user_id) {
      const project = Array.isArray(requestRow.projects) ? requestRow.projects[0] : requestRow.projects;
      const brandName =
        (project as any)?.current_config?.brand?.name ||
        (project as any)?.subdomain ||
        "your website";

      const { error: notificationError } = await service
        .from("notifications")
        .insert({
          user_id: requestRow.user_id,
          project_id: requestRow.project_id,
          type: "support",
          title: "Support replied to your request",
          message: requestRow.subject
            ? `We replied to "${requestRow.subject}".`
            : "We replied to your support request.",
          action_url: "/dashboard",
        });

      if (notificationError) {
        console.error("[admin/support/reply] notification insert:", notificationError.message);
      }

      if (userEmail) {
        void sendSupportReplyNotification({
          to: userEmail,
          subject: requestRow.subject
            ? `Reply to your support request: ${requestRow.subject}`
            : "Reply to your EstabWeb support request",
          requestSubject: requestRow.subject,
          requestType: SUPPORT_TYPE_LABELS[(requestRow.type as SupportRequestType) ?? "other"],
          replyMessage: message,
          brandName,
        }).catch((error) => {
          console.error("[admin/support/reply] email notification:", error);
        });
      }
    }

    await logAudit(service, "support_request_reply", auth.user.id, requestRow.project_id, {
      requestId: id,
      status: nextStatus,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[admin/support/reply][POST]", error);
    return NextResponse.json({ error: error?.message || "Failed to send reply" }, { status: 500 });
  }
}
