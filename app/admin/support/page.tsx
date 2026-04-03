import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ArrowRight, Clock3, LifeBuoy, MessageSquare, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  SUPPORT_STATUS_LABELS,
  SUPPORT_STATUS_ORDER,
  SUPPORT_STATUS_STYLES,
  SUPPORT_TYPE_LABELS,
  type SupportRequestStatus,
  type SupportRequestType,
} from "@/lib/support/support-meta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
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
  const { data: rawRequests, error } = await service
    .from("support_requests")
    .select(`
      id,
      user_id,
      project_id,
      type,
      subject,
      message,
      status,
      created_at,
      updated_at,
      assigned_to,
      projects (
        id,
        subdomain,
        current_config
      )
    `)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[admin/support] fetch:", error);
  }

  const requests = rawRequests ?? [];
  const profileIds = Array.from(
    new Set(
      requests
        .flatMap((request: any) => [request.user_id, request.assigned_to])
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

  const sortedRequests = [...requests].sort((a: any, b: any) => {
    const statusDiff =
      SUPPORT_STATUS_ORDER.indexOf(a.status as SupportRequestStatus) -
      SUPPORT_STATUS_ORDER.indexOf(b.status as SupportRequestStatus);
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const stats = {
    total: sortedRequests.length,
    open: sortedRequests.filter((request: any) => request.status === "open").length,
    inProgress: sortedRequests.filter((request: any) => request.status === "in_progress").length,
    resolved: sortedRequests.filter((request: any) => request.status === "resolved").length,
    closed: sortedRequests.filter((request: any) => request.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Support Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Review client support requests, keep statuses updated, and reply from one place.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total", value: stats.total, cls: "text-foreground" },
            { label: "Open", value: stats.open, cls: "text-amber-600" },
            { label: "In Progress", value: stats.inProgress, cls: "text-blue-600" },
            { label: "Resolved", value: stats.resolved, cls: "text-emerald-600" },
            { label: "Closed", value: stats.closed, cls: "text-zinc-600" },
          ].map((item) => (
            <Card key={item.label} className="border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${item.cls}`}>{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedRequests.length === 0 ? (
          <Card className="border-dashed bg-card">
            <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="rounded-full bg-muted p-4">
                <LifeBuoy className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium">No support requests yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedRequests.map((request: any) => {
              const project = Array.isArray(request.projects) ? request.projects[0] : request.projects;
              const brandName = project?.current_config?.brand?.name || null;
              const siteName = brandName || project?.subdomain || "No linked site";
              const requesterEmail = request.user_id ? profileMap[request.user_id]?.email || "Unknown user" : "Unknown user";
              const assigneeEmail = request.assigned_to ? profileMap[request.assigned_to]?.email || "Unassigned" : "Unassigned";
              const typeLabel = SUPPORT_TYPE_LABELS[(request.type as SupportRequestType) ?? "other"];
              const status = (request.status as SupportRequestStatus) ?? "open";
              const preview = typeof request.message === "string" ? request.message.trim() : "";

              return (
                <Link key={request.id} href={`/admin/support/${request.id}`} className="block">
                  <Card className="border-border/60 bg-card shadow-sm transition hover:border-primary/30 hover:shadow-md">
                    <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="truncate text-base font-semibold text-foreground">
                              {request.subject || typeLabel}
                            </span>
                            <Badge className={`${SUPPORT_STATUS_STYLES[status]} border-none`}>
                              {SUPPORT_STATUS_LABELS[status]}
                            </Badge>
                            <Badge variant="outline">{typeLabel}</Badge>
                          </div>

                          <div className="mb-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <UserIcon className="h-3.5 w-3.5" />
                              {requesterEmail}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock3 className="h-3.5 w-3.5" />
                              Updated {format(new Date(request.updated_at), "MMM d, yyyy HH:mm")}
                            </span>
                          </div>

                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {preview}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>Site: <strong className="text-foreground">{siteName}</strong></span>
                            <span>Assigned: <strong className="text-foreground">{assigneeEmail}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end text-primary">
                        <span className="mr-2 text-xs font-medium text-muted-foreground">Open thread</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
