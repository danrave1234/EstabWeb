import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Clock3, LifeBuoy, User as UserIcon } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import {
  SUPPORT_STATUS_LABELS,
  SUPPORT_STATUS_STYLES,
  SUPPORT_TYPE_LABELS,
  type SupportRequestStatus,
  type SupportRequestType,
} from "@/lib/support/support-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardSupport() {
  const service = createServiceClient();
  const { data: rawRequests, error } = await service
    .from("support_requests")
    .select("id, user_id, type, subject, status, created_at, updated_at")
    .in("status", ["open", "in_progress"])
    .order("updated_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("[admin/dashboard/support] fetch:", error);
  }

  const requests = rawRequests ?? [];

  const userIds = [...new Set(requests.map((request: any) => request.user_id).filter(Boolean))] as string[];
  let profileMap: Record<string, { email?: string | null }> = {};

  if (userIds.length > 0) {
    const { data: profileRows } = await service
      .from("profiles")
      .select("id, email")
      .in("id", userIds);

    profileMap = Object.fromEntries((profileRows ?? []).map((row: any) => [row.id, row]));
  }

  if (requests.length === 0) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
          <div className="rounded-full bg-muted/60 p-4">
            <LifeBuoy className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium">No open support requests.</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/support">Open inbox</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {requests.map((request: any) => {
        const status = (request.status as SupportRequestStatus) ?? "open";
        const type = (request.type as SupportRequestType) ?? "other";

        return (
          <Card key={request.id} className="border-border/60 shadow-sm transition hover:border-primary/30">
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="truncate font-semibold text-foreground">
                      {request.subject || SUPPORT_TYPE_LABELS[type]}
                    </span>
                    <Badge className={`${SUPPORT_STATUS_STYLES[status]} border-none`}>
                      {SUPPORT_STATUS_LABELS[status]}
                    </Badge>
                    <Badge variant="outline">{SUPPORT_TYPE_LABELS[type]}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" />
                      {request.user_id ? profileMap[request.user_id]?.email || "Unknown user" : "Unknown user"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {format(new Date(request.updated_at), "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href={`/admin/support/${request.id}`}>
                  Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
