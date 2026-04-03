import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import SupportRequestDetailClient from "./SupportRequestDetailClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "sub_admin"].includes(profile.role)) {
    return redirect("/dashboard");
  }

  const service = createServiceClient();
  const { data: request, error: requestError } = await service
    .from("support_requests")
    .select(`
      id,
      user_id,
      project_id,
      type,
      subject,
      message,
      metadata,
      status,
      created_at,
      updated_at,
      assigned_to,
      resolved_at,
      closed_at,
      last_replied_at,
      last_replied_by,
      projects (
        id,
        subdomain,
        custom_domain,
        current_config
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (requestError || !request) {
    console.error("[admin/support/:id] fetch request:", requestError);
    return notFound();
  }

  const { data: messages, error: messagesError } = await service
    .from("support_request_messages")
    .select("id, sender_id, sender_role, message, created_at")
    .eq("support_request_id", id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("[admin/support/:id] fetch messages:", messagesError);
  }

  const profileIds = Array.from(
    new Set(
      [request.user_id, request.assigned_to, request.last_replied_by]
        .concat((messages ?? []).map((message: any) => message.sender_id))
        .filter(Boolean),
    ),
  ) as string[];

  let profileMap: Record<string, { email?: string | null }> = {};
  if (profileIds.length > 0) {
    const { data: profileRows } = await service
      .from("profiles")
      .select("id, email")
      .in("id", profileIds);

    profileMap = Object.fromEntries((profileRows ?? []).map((item: any) => [item.id, item]));
  }

  return (
    <SupportRequestDetailClient
      request={request}
      messages={messages ?? []}
      profileMap={profileMap}
    />
  );
}
