import React from "react";

interface SkeletonLoadingProps {
  className?: string;
  type?: "full" | "block" | "text" | "circle";
  message?: string;
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} />
  );
}

// ─── Admin Clients (/admin/clients) ───────────────────────────────────────────
// Layout: page title + subtitle → 3-stat cards → N client cards (header + project rows)
function AdminClientsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        {/* Page header */}
        <div className="mb-8 space-y-2">
          <Shimmer className="h-8 w-56" />
          <Shimmer className="h-4 w-80" />
        </div>

        {/* 3-stat row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <Shimmer className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Shimmer className="h-6 w-8" />
                <Shimmer className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Client cards */}
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Client header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Shimmer className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Shimmer className="h-4 w-44" />
                    <Shimmer className="h-3 w-64" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shimmer className="h-3 w-16" />
                  <Shimmer className="h-5 w-12 rounded-full" />
                </div>
              </div>
              {/* Project rows */}
              {[...Array(i === 1 ? 2 : 1)].map((_, j) => (
                <div key={j} className="px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-start border-t border-border first:border-t-0">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Shimmer className="h-3 w-4" />
                      <Shimmer className="h-6 w-28 rounded-full" />
                      <Shimmer className="h-5 w-14 rounded-full" />
                    </div>
                    <Shimmer className="h-8 w-48 rounded-lg" />
                  </div>
                  <div className="min-w-[160px]">
                    <Shimmer className="h-20 w-40 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard (/admin/dashboard) ───────────────────────────────────────
// Layout: page title + subtitle → single-column list of request cards
function AdminDashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          {/* Page header */}
          <div className="space-y-2">
            <Shimmer className="h-8 w-64" />
            <Shimmer className="h-4 w-80" />
          </div>
          {/* Request cards */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                <Shimmer className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-5 w-20 rounded" />
                    <Shimmer className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Shimmer className="h-3 w-28" />
                    <Shimmer className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Shimmer className="h-6 w-16 rounded-full" />
                  <Shimmer className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Approvals (/admin/approvals) ───────────────────────────────────────
// Layout: page title → 3-stat cards → "Pending Review" section → cards → "Resolved" section → cards
function AdminApprovalsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        {/* Page header */}
        <div className="mb-8 space-y-2">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-72" />
        </div>

        {/* 3-stat row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <Shimmer className="h-8 w-8 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Shimmer className="h-6 w-8" />
                <Shimmer className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Pending section */}
        <div className="space-y-3 mb-8">
          <Shimmer className="h-5 w-36" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
              <Shimmer className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Shimmer className="h-4 w-32" />
                  <Shimmer className="h-5 w-20 rounded" />
                  <Shimmer className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <Shimmer className="h-3 w-28" />
                  <Shimmer className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Shimmer className="h-6 w-16 rounded-full" />
                <Shimmer className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Resolved section */}
        <div className="space-y-3">
          <Shimmer className="h-5 w-28" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl opacity-60">
              <Shimmer className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Shimmer className="h-4 w-32" />
                  <Shimmer className="h-5 w-20 rounded" />
                </div>
                <Shimmer className="h-3 w-40" />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Shimmer className="h-6 w-20 rounded-full" />
                <Shimmer className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hub Dashboard (/dashboard) ───────────────────────────────────────────────
// Layout: MainHeader height offset → "My Websites" title + subtitle + action buttons → project cards grid
function HubDashboardSkeleton() {
  return (
    <main className="flex-1 container mx-auto pt-20 sm:pt-24 pb-12 px-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-12">
        <div className="space-y-2">
          <Shimmer className="h-8 w-40 sm:h-10 sm:w-52" />
          <Shimmer className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-28 rounded-xl" />
          <Shimmer className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Preview image area */}
            <Shimmer className="h-40 sm:h-48 rounded-none" />
            <div className="p-4 sm:p-5 space-y-3">
              {/* Brand name + subdomain */}
              <div className="space-y-1.5">
                <Shimmer className="h-5 w-36" />
                <Shimmer className="h-3 w-28" />
              </div>
              {/* Status badge row */}
              <div className="flex items-center gap-2">
                <Shimmer className="h-5 w-14 rounded-full" />
                <Shimmer className="h-5 w-20 rounded-full" />
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <Shimmer className="h-9 flex-1 rounded-xl" />
                <Shimmer className="h-9 w-9 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── Generic fallback ─────────────────────────────────────────────────────────
function FullPageSkeleton({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 ${className ?? ""}`}>
      <div className="w-full max-w-2xl space-y-4 px-6">
        <Shimmer className="h-8 w-1/2 mx-auto" />
        <Shimmer className="h-4 w-3/4 mx-auto" />
        <div className="grid grid-cols-3 gap-3 pt-4">
          {[...Array(3)].map((_, i) => <Shimmer key={i} className="h-24 rounded-xl" />)}
        </div>
        {[...Array(3)].map((_, i) => <Shimmer key={i} className="h-16 rounded-xl" />)}
      </div>
      {message && (
        <p className="text-muted-foreground text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
}

export default function SkeletonLoading({
  className = "",
  type = "full",
  message,
  variant,
}: SkeletonLoadingProps & { variant?: "admin-clients" | "admin-approvals" | "admin-dashboard" | "hub-dashboard" }) {
  if (variant === "admin-clients") return <AdminClientsSkeleton />;
  if (variant === "admin-approvals") return <AdminApprovalsSkeleton />;
  if (variant === "admin-dashboard") return <AdminDashboardSkeleton />;
  if (variant === "hub-dashboard") return <HubDashboardSkeleton />;

  if (type === "circle") return <div className={`animate-pulse bg-muted rounded-full ${className}`} />;
  if (type === "text") return <div className={`animate-pulse bg-muted rounded h-4 w-full ${className}`} />;
  if (type === "block") return <div className={`animate-pulse bg-muted rounded-xl ${className}`} />;

  return <FullPageSkeleton message={message} className={className} />;
}
