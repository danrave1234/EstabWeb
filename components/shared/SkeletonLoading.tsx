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
// Layout: page title + subtitle → 3-stat cards → search bar + filter pills → results count → accordion client rows
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

        {/* Search bar + filter pills */}
        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          <Shimmer className="h-9 flex-1 rounded-lg" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Shimmer key={i} className="h-9 w-14 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Results count */}
        <Shimmer className="h-3 w-36 mb-5" />

        {/* Accordion client rows (collapsed) */}
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Shimmer className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Shimmer className="h-4 w-44" />
                    <Shimmer className="h-3 w-56" />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Shimmer className="h-5 w-24 rounded-full hidden sm:block" />
                  <Shimmer className="h-3 w-10" />
                  <Shimmer className="h-5 w-12 rounded-full" />
                  <Shimmer className="h-4 w-4 rounded" />
                </div>
              </div>
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

// ─── Onboarding (/onboarding) ───────────────────────────────────────────────
// Layout: fixed header (logo + buttons) → step indicators → title + subtitle → grid of industry cards → CTA button → footer
function OnboardingSkeleton() {
  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Shimmer className="w-8 h-8 rounded-lg shrink-0" />
          <Shimmer className="h-5 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-6 h-full flex flex-col">
          <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full pt-6">

            {/* Step indicators */}
            <div className="flex items-center gap-3 mb-8 justify-center shrink-0">
              {[1, 2, 3].map((n) => (
                <React.Fragment key={n}>
                  <div className="flex flex-col items-center gap-1">
                    <Shimmer className="w-8 h-8 rounded-full" />
                    <Shimmer className="h-2 w-12" />
                  </div>
                  {n < 3 && <Shimmer className="h-1 w-12 rounded-full mb-4" />}
                </React.Fragment>
              ))}
            </div>

            {/* Title + subtitle */}
            <div className="space-y-3 text-center mb-6 shrink-0">
              <Shimmer className="h-9 w-72 mx-auto" />
              <Shimmer className="h-4 w-80 mx-auto" />
            </div>

            {/* AI description box */}
            <div className="shrink-0 max-w-2xl mx-auto w-full mb-6">
              <Shimmer className="h-3 w-48 mb-2" />
              <div className="flex gap-2">
                <Shimmer className="flex-1 h-16 rounded-xl" />
                <Shimmer className="w-24 h-16 rounded-xl shrink-0" />
              </div>
            </div>

            {/* Industry grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 flex-1 content-start overflow-hidden py-2 px-1">
              {[...Array(15)].map((_, i) => (
                <Shimmer key={i} className="h-[88px] rounded-[14px]" />
              ))}
            </div>

            {/* CTA button */}
            <div className="pt-4 flex justify-center shrink-0 pb-6">
              <Shimmer className="h-14 w-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-border/50 shrink-0">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Shimmer className="h-3 w-32" />
          <div className="flex gap-6">
            <Shimmer className="h-3 w-12" />
            <Shimmer className="h-3 w-10" />
            <Shimmer className="h-3 w-14" />
          </div>
        </div>
      </footer>
    </div>
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
}: SkeletonLoadingProps & { variant?: "admin-clients" | "admin-approvals" | "admin-dashboard" | "hub-dashboard" | "onboarding" }) {
  if (variant === "admin-clients") return <AdminClientsSkeleton />;
  if (variant === "admin-approvals") return <AdminApprovalsSkeleton />;
  if (variant === "admin-dashboard") return <AdminDashboardSkeleton />;
  if (variant === "hub-dashboard") return <HubDashboardSkeleton />;
  if (variant === "onboarding") return <OnboardingSkeleton />;

  if (type === "circle") return <div className={`animate-pulse bg-muted rounded-full ${className}`} />;
  if (type === "text") return <div className={`animate-pulse bg-muted rounded h-4 w-full ${className}`} />;
  if (type === "block") return <div className={`animate-pulse bg-muted rounded-xl ${className}`} />;

  return <FullPageSkeleton message={message} className={className} />;
}
