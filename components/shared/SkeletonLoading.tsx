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

// ─── Login (/login) ───────────────────────────────────────────────────────────
// Layout: two-panel — left bg-primary branding panel (hidden on mobile) + right form panel
function LoginSkeleton() {
  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Back link */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-2">
        <Shimmer className="h-4 w-4 rounded" />
        <Shimmer className="h-4 w-10" />
      </div>

      {/* Left branding panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/90 items-center justify-center p-12">
        <div className="relative z-10 max-w-lg w-full space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Shimmer className="w-12 h-12 rounded-xl bg-white/20" />
            <Shimmer className="h-7 w-32 bg-white/20" />
          </div>
          {/* Headline */}
          <div className="space-y-4">
            <Shimmer className="h-12 w-full bg-white/20" />
            <Shimmer className="h-12 w-4/5 bg-white/20" />
            <Shimmer className="h-5 w-full bg-white/20 mt-2" />
            <Shimmer className="h-5 w-3/4 bg-white/20" />
          </div>
          {/* Feature pills grid */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
                <Shimmer className="h-5 w-5 rounded bg-white/20 shrink-0" />
                <Shimmer className="h-4 w-24 bg-white/20" />
              </div>
            ))}
          </div>
          {/* Social proof */}
          <div className="pt-8 border-t border-white/10 space-y-3">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <Shimmer key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-primary" />
              ))}
            </div>
            <Shimmer className="h-4 w-64 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 pt-24 lg:pt-12">
        {/* Mobile logo */}
        <div className="absolute top-8 right-8 lg:hidden flex items-center gap-2">
          <Shimmer className="w-8 h-8 rounded-lg" />
          <Shimmer className="h-5 w-24" />
        </div>

        <div className="w-full max-w-[400px] space-y-10">
          {/* Title + subtitle */}
          <div className="space-y-3 text-center lg:text-left">
            <Shimmer className="h-8 w-48 mx-auto lg:mx-0" />
            <Shimmer className="h-4 w-72 mx-auto lg:mx-0" />
          </div>

          <div className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-12 w-full rounded-2xl" />
            </div>
            {/* Password field */}
            <div className="space-y-2">
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-12 w-full rounded-2xl" />
            </div>
            {/* Submit button */}
            <Shimmer className="h-14 w-full rounded-2xl mt-4" />
            {/* Divider */}
            <div className="flex items-center gap-3">
              <Shimmer className="flex-1 h-px rounded" />
              <Shimmer className="h-4 w-6" />
              <Shimmer className="flex-1 h-px rounded" />
            </div>
            {/* Google button */}
            <Shimmer className="h-12 w-full rounded-2xl" />
            {/* Mode toggle */}
            <div className="flex justify-center gap-2 pt-2">
              <Shimmer className="h-4 w-36" />
              <Shimmer className="h-4 w-28" />
            </div>
          </div>

          {/* Terms footer */}
          <div className="flex justify-center">
            <Shimmer className="h-3 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing (/pricing) ───────────────────────────────────────────────────────
// Layout: MainHeader offset → badge + title + subtitle → interval toggle → 4 plan cards
function PricingSkeleton() {
  return (
    <main className="flex-1 container mx-auto px-4 py-24 lg:py-32 flex flex-col items-center min-h-screen">
      {/* Badge + title + subtitle */}
      <div className="w-full max-w-4xl text-center mb-12 space-y-4">
        <Shimmer className="h-6 w-40 rounded-full mx-auto" />
        <Shimmer className="h-14 w-3/4 mx-auto" />
        <Shimmer className="h-14 w-1/2 mx-auto" />
        <Shimmer className="h-5 w-2/3 mx-auto mt-2" />
        <Shimmer className="h-5 w-1/2 mx-auto" />
      </div>

      {/* Interval toggle */}
      <Shimmer className="h-11 w-48 rounded-full mb-16" />

      {/* 4 plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 ${i === 2 ? "ring-2 ring-primary" : ""}`}>
            <div className="space-y-2">
              <Shimmer className="h-5 w-20" />
              <Shimmer className="h-9 w-24" />
              <Shimmer className="h-3 w-32 mt-1" />
            </div>
            <Shimmer className="h-10 w-full rounded-xl" />
            <div className="space-y-2.5 flex-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Shimmer className="h-4 w-4 rounded-full shrink-0" />
                  <Shimmer className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── Admin Codes (/admin/codes) ───────────────────────────────────────────────
// Layout: title + subtitle → search bar + create button → table with code rows
function AdminCodesSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Shimmer className="h-8 w-40" />
            <Shimmer className="h-4 w-64" />
          </div>
          <Shimmer className="h-10 w-32 rounded-xl" />
        </div>

        {/* Search bar */}
        <Shimmer className="h-9 w-full max-w-sm rounded-lg mb-6" />

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-muted/40 border-b border-border">
            {["w-12", "w-24", "w-20", "w-16", "w-20", "w-16"].map((w, i) => (
              <Shimmer key={i} className={`h-3 ${w}`} />
            ))}
          </div>
          {/* Table rows */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 px-5 py-4 border-b border-border last:border-0 items-center">
              <Shimmer className="h-6 w-24 rounded-full font-mono" />
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-5 w-16 rounded-full" />
              <Shimmer className="h-4 w-12" />
              <Shimmer className="h-4 w-20" />
              <div className="flex gap-2">
                <Shimmer className="h-8 w-8 rounded-lg" />
                <Shimmer className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Transactions (/admin/transactions) ─────────────────────────────────
// Layout: title + subtitle → 3-stat cards → table with transaction rows
function AdminTransactionsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        {/* Page header */}
        <div className="mb-8 space-y-2">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-72" />
        </div>

        {/* 3-stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <Shimmer className="h-4 w-28" />
                <Shimmer className="h-8 w-8 rounded-lg" />
              </div>
              <Shimmer className="h-8 w-24" />
              <Shimmer className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-muted/40 border-b border-border">
            {["w-20", "w-28", "w-16", "w-20", "w-24"].map((w, i) => (
              <Shimmer key={i} className={`h-3 ${w}`} />
            ))}
          </div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-border last:border-0 items-center">
              <Shimmer className="h-4 w-24 font-mono" />
              <Shimmer className="h-4 w-36" />
              <Shimmer className="h-6 w-16 rounded-full" />
              <Shimmer className="h-5 w-20 font-semibold" />
              <Shimmer className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Audit Logs (/admin/audit-logs) ────────────────────────────────────
// Layout: title + subtitle → table with icon + action + metadata + user + time
function AdminAuditLogsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        {/* Page header */}
        <div className="mb-8 space-y-2">
          <Shimmer className="h-8 w-40" />
          <Shimmer className="h-4 w-64" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-muted/40 border-b border-border">
            {["w-16", "w-24", "w-28", "w-20"].map((w, i) => (
              <Shimmer key={i} className={`h-3 ${w}`} />
            ))}
          </div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 px-5 py-4 border-b border-border last:border-0 items-center">
              <div className="flex items-center gap-2">
                <Shimmer className="h-6 w-6 rounded-md shrink-0" />
                <Shimmer className="h-5 w-20 rounded-full" />
              </div>
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-36" />
              <Shimmer className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Settings (/admin/settings) ────────────────────────────────────────
// Layout: title + subtitle → 2–3 card sections each with form fields
function AdminSettingsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        {/* Page header */}
        <div className="mb-8 space-y-2">
          <Shimmer className="h-8 w-44" />
          <Shimmer className="h-4 w-80" />
        </div>

        <div className="space-y-6">
          {/* Section card 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-1.5 pb-2 border-b border-border">
              <Shimmer className="h-5 w-36" />
              <Shimmer className="h-3 w-72" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Shimmer className="h-4 w-24" />
                  <Shimmer className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Shimmer className="h-10 w-28 rounded-xl" />
          </div>

          {/* Section card 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-1.5 pb-2 border-b border-border">
              <Shimmer className="h-5 w-28" />
              <Shimmer className="h-3 w-60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Shimmer className="h-4 w-20" />
                  <Shimmer className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <Shimmer className="h-10 w-28 rounded-xl" />
          </div>

          {/* Section card 3 (danger/cache) */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="space-y-1.5 pb-2 border-b border-border">
              <Shimmer className="h-5 w-32" />
              <Shimmer className="h-3 w-56" />
            </div>
            <Shimmer className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Analytics (/dashboard/analytics) ───────────────────────────────
// Layout: MainHeader offset → back link + title → stat cards → leads table + section chart
function DashboardAnalyticsSkeleton() {
  return (
    <>
      {/* Header placeholder */}
      <div className="h-16 border-b border-border bg-background/80 backdrop-blur" />
      <main className="min-h-screen pt-8 pb-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          {/* Back link + title */}
          <div className="flex items-center gap-3 mb-8">
            <Shimmer className="h-8 w-8 rounded-full" />
            <div className="space-y-1.5">
              <Shimmer className="h-7 w-40" />
              <Shimmer className="h-3 w-52" />
            </div>
          </div>

          {/* 4-stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <Shimmer className="h-3 w-20" />
                  <Shimmer className="h-7 w-7 rounded-lg" />
                </div>
                <Shimmer className="h-8 w-16" />
                <Shimmer className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Two-column layout: lead table + source breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Leads table (wider) */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-5 border-b border-border space-y-1">
                <Shimmer className="h-5 w-24" />
                <Shimmer className="h-3 w-40" />
              </div>
              <div className="divide-y divide-border">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <Shimmer className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Shimmer className="h-4 w-32" />
                      <Shimmer className="h-3 w-44" />
                    </div>
                    <Shimmer className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Source breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="space-y-1">
                <Shimmer className="h-5 w-28" />
                <Shimmer className="h-3 w-36" />
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Shimmer className="h-3 w-20" />
                    <Shimmer className="h-3 w-8" />
                  </div>
                  <Shimmer className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Section performance table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <Shimmer className="h-5 w-40" />
            </div>
            <div className="divide-y divide-border">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 px-5 py-4 items-center">
                  <Shimmer className="h-4 w-28" />
                  <Shimmer className="h-4 w-12" />
                  <Shimmer className="h-4 w-12" />
                  <Shimmer className="h-4 w-12" />
                  <Shimmer className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Dashboard Profile (/dashboard/profile) ──────────────────────────────────
// Layout: MainHeader offset → title + subtitle → single form card
function DashboardProfileSkeleton() {
  return (
    <>
      {/* Header placeholder */}
      <div className="h-16 border-b border-border bg-background/80 backdrop-blur" />
      <main className="min-h-screen pt-8 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Title */}
          <div className="mb-8 space-y-2">
            <Shimmer className="h-7 w-48" />
            <Shimmer className="h-4 w-72" />
          </div>

          {/* Profile form card */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            {/* Avatar + name row */}
            <div className="flex items-center gap-4">
              <Shimmer className="h-16 w-16 rounded-full shrink-0" />
              <div className="space-y-2">
                <Shimmer className="h-5 w-36" />
                <Shimmer className="h-3 w-48" />
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-5">
              {/* Full name */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-11 w-full rounded-xl" />
              </div>
              {/* Email (readonly) */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16" />
                <Shimmer className="h-11 w-full rounded-xl" />
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-11 w-full rounded-xl" />
              </div>
              {/* Bio */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-10" />
                <Shimmer className="h-24 w-full rounded-xl" />
              </div>
              {/* Save button */}
              <Shimmer className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </>
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

type SkeletonVariant =
  | "login"
  | "pricing"
  | "admin-clients"
  | "admin-approvals"
  | "admin-dashboard"
  | "admin-codes"
  | "admin-transactions"
  | "admin-audit-logs"
  | "admin-settings"
  | "hub-dashboard"
  | "dashboard-analytics"
  | "dashboard-profile"
  | "onboarding";

export default function SkeletonLoading({
  className = "",
  type = "full",
  message,
  variant,
}: SkeletonLoadingProps & { variant?: SkeletonVariant }) {
  if (variant === "login") return <LoginSkeleton />;
  if (variant === "pricing") return <PricingSkeleton />;
  if (variant === "admin-clients") return <AdminClientsSkeleton />;
  if (variant === "admin-approvals") return <AdminApprovalsSkeleton />;
  if (variant === "admin-dashboard") return <AdminDashboardSkeleton />;
  if (variant === "admin-codes") return <AdminCodesSkeleton />;
  if (variant === "admin-transactions") return <AdminTransactionsSkeleton />;
  if (variant === "admin-audit-logs") return <AdminAuditLogsSkeleton />;
  if (variant === "admin-settings") return <AdminSettingsSkeleton />;
  if (variant === "hub-dashboard") return <HubDashboardSkeleton />;
  if (variant === "dashboard-analytics") return <DashboardAnalyticsSkeleton />;
  if (variant === "dashboard-profile") return <DashboardProfileSkeleton />;
  if (variant === "onboarding") return <OnboardingSkeleton />;

  if (type === "circle") return <div className={`animate-pulse bg-muted rounded-full ${className}`} />;
  if (type === "text") return <div className={`animate-pulse bg-muted rounded h-4 w-full ${className}`} />;
  if (type === "block") return <div className={`animate-pulse bg-muted rounded-xl ${className}`} />;

  return <FullPageSkeleton message={message} className={className} />;
}
