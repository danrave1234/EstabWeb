"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock3,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SUPPORT_STATUS_LABELS,
  SUPPORT_STATUS_ORDER,
  SUPPORT_STATUS_STYLES,
  SUPPORT_TYPE_LABELS,
  type SupportRequestStatus,
  type SupportRequestType,
} from "@/lib/support/support-meta";

interface SupportRequestDetailClientProps {
  request: any;
  messages: any[];
  profileMap: Record<string, { email?: string | null }>;
}

export default function SupportRequestDetailClient({
  request,
  messages,
  profileMap,
}: SupportRequestDetailClientProps) {
  const router = useRouter();
  const [reply, setReply] = React.useState("");
  const [isReplying, setIsReplying] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<SupportRequestStatus | null>(null);

  const currentStatus = (request.status as SupportRequestStatus) ?? "open";
  const requesterEmail = request.user_id ? profileMap[request.user_id]?.email ?? "Unknown user" : "Unknown user";
  const assignedEmail = request.assigned_to ? profileMap[request.assigned_to]?.email ?? "Unassigned" : "Unassigned";
  const project = Array.isArray(request.projects) ? request.projects[0] : request.projects;
  const siteName = project?.current_config?.brand?.name || project?.subdomain || "No linked site";
  const siteDomain = project?.custom_domain || (project?.subdomain ? `${project.subdomain}.estabweb.com` : null);
  const typeLabel = SUPPORT_TYPE_LABELS[(request.type as SupportRequestType) ?? "other"];
  const metadata = request.metadata && typeof request.metadata === "object" ? request.metadata : {};

  const threadMessages = React.useMemo(() => {
    if (messages.length > 0) return messages;
    return [
      {
        id: `${request.id}-initial`,
        sender_id: request.user_id,
        sender_role: "client",
        message: request.message,
        created_at: request.created_at,
      },
    ];
  }, [messages, request]);

  async function handleStatusUpdate(status: SupportRequestStatus) {
    if (status === currentStatus) return;
    setIsUpdatingStatus(status);
    try {
      const res = await fetch(`/api/admin/support/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(`Support request marked ${SUPPORT_STATUS_LABELS[status].toLowerCase()}.`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(null);
    }
  }

  async function handleReplySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reply.trim()) return;

    setIsReplying(true);
    try {
      const res = await fetch(`/api/admin/support/${request.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reply");
      }

      setReply("");
      toast.success("Reply sent to client.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to send reply");
    } finally {
      setIsReplying(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link
              href="/admin/support"
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to support inbox
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {request.subject || typeLabel}
              </h1>
              <Badge className={`${SUPPORT_STATUS_STYLES[currentStatus]} border-none`}>
                {SUPPORT_STATUS_LABELS[currentStatus]}
              </Badge>
              <Badge variant="outline">{typeLabel}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {requesterEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                Opened {format(new Date(request.created_at), "MMM d, yyyy HH:mm")}
              </span>
              <span>
                Site: <strong className="text-foreground">{siteName}</strong>
              </span>
            </div>
          </div>

          <Card className="w-full max-w-xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {SUPPORT_STATUS_ORDER.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={status === currentStatus ? "default" : "outline"}
                  size="sm"
                  disabled={Boolean(isUpdatingStatus)}
                  onClick={() => handleStatusUpdate(status)}
                  className="min-w-28"
                >
                  {isUpdatingStatus === status ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {SUPPORT_STATUS_LABELS[status]}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_360px]">
          <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {threadMessages.map((message: any) => {
                  const isAdmin = message.sender_role === "admin";
                  const senderEmail = message.sender_id ? profileMap[message.sender_id]?.email ?? null : null;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-3xl rounded-2xl border px-4 py-3 shadow-sm ${
                          isAdmin
                            ? "border-blue-500/20 bg-blue-500/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                            <UserIcon className="h-3.5 w-3.5" />
                            {isAdmin ? "Admin" : "Client"}
                          </span>
                          {senderEmail ? <span>{senderEmail}</span> : null}
                          <span>{format(new Date(message.created_at), "MMM d, yyyy HH:mm")}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Reply to client</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReplySubmit} className="space-y-4">
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Write your reply here. The client will receive it by email."
                    className="min-h-40 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Sending a reply also keeps the request assigned to you and moves resolved or closed items back to in progress.
                    </p>
                    <Button type="submit" disabled={isReplying || !reply.trim()}>
                      {isReplying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Send reply
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Requester</span>
                  <span className="text-right font-medium text-foreground">{requesterEmail}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Assigned</span>
                  <span className="text-right font-medium text-foreground">{assignedEmail}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Last activity</span>
                  <span className="text-right font-medium text-foreground">
                    {format(new Date(request.updated_at), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
                {request.last_replied_at ? (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Last admin reply</span>
                    <span className="text-right font-medium text-foreground">
                      {format(new Date(request.last_replied_at), "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                ) : null}
                {siteDomain ? (
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-muted-foreground">Site</span>
                    <a
                      href={`https://${siteDomain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-right font-medium text-primary hover:underline"
                    >
                      {siteDomain}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Client Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeof metadata.url === "string" ? (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Page URL</p>
                    <a
                      href={metadata.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-start gap-2 break-all text-sm text-primary hover:underline"
                    >
                      <Globe className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{metadata.url}</span>
                    </a>
                  </div>
                ) : null}
                {typeof metadata.ua === "string" ? (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">User Agent</p>
                    <p className="break-all text-sm text-foreground">{metadata.ua}</p>
                  </div>
                ) : null}
                {(!metadata || Object.keys(metadata).length === 0) ? (
                  <p className="text-sm text-muted-foreground">No extra metadata was captured for this request.</p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Original Request</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Initial client message
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{request.message}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
