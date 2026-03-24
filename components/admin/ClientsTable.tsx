"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import {
  Globe, ExternalLink, Search, ChevronDown, ChevronUp,
  ShieldCheck, Calendar, Tag, BarChart2, Clock, AlertTriangle,
  CheckCircle2, XCircle, Ticket, RefreshCw, Eye
} from "lucide-react"
import SubscriptionManage from "@/components/admin/SubscriptionManage"
import DomainManage from "@/components/admin/DomainManage"
import SiteStatusManage from "@/components/admin/SiteStatusManage"
import { updateUserRole } from "@/app/admin/actions"

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  sub_admin: "Sub-Admin",
  client: "Client",
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-500/20",
  sub_admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  client: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
}

const STATUS_COLORS: Record<string, string> = {
  free: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  trial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  admin_granted: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  expired: "bg-red-500/10 text-red-600 border-red-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  free: "Free",
  trial: "Trial",
  active: "Active",
  admin_granted: "Granted",
  expired: "Expired",
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
  ecommerce: "Ecommerce",
  custom: "Custom",
}

const SITE_STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600",
  disabled: "text-amber-600",
  archived: "text-red-500",
}

const ALL_STATUSES = ["all", "free", "trial", "active", "admin_granted"] as const
type StatusFilter = (typeof ALL_STATUSES)[number]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(dateStr: string | null | undefined) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function daysFromNow(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function initials(email: string | null, id: string) {
  return (email || id)[0].toUpperCase()
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const role = currentRole || "client"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "admin" | "sub_admin" | "client"
    setError(null)
    startTransition(async () => {
      try { await updateUserRole(userId, newRole) }
      catch (err: any) { setError(err.message) }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className="text-xs rounded-lg border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 cursor-pointer"
      >
        <option value="client">Client</option>
        <option value="sub_admin">Sub-Admin</option>
        <option value="admin">Admin</option>
      </select>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[status] || STATUS_COLORS.free}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function SiteStatusIcon({ status }: { status: string | null | undefined }) {
  const s = status || "active"
  if (s === "active") return <CheckCircle2 className={`w-3.5 h-3.5 ${SITE_STATUS_COLORS.active}`} />
  if (s === "disabled") return <AlertTriangle className={`w-3.5 h-3.5 ${SITE_STATUS_COLORS.disabled}`} />
  return <XCircle className={`w-3.5 h-3.5 ${SITE_STATUS_COLORS.archived}`} />
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface ProfileRow {
  id: string
  email: string | null
  role: string | null
  avatar_url?: string | null
}

interface ProjectRow {
  id: string
  client_id: string | null
  subdomain: string | null
  custom_domain?: string | null
  created_at?: string | null
  subscription_status?: string | null
  subscription_plan_id?: string | null
  subscription_ends_at?: string | null
  trial_ends_at?: string | null
  publish_limit?: number | null
  publish_limit_daily?: number | null
  publish_count?: number | null
  publish_count_today?: number | null
  publish_date?: string | null
  site_status?: string | null
  site_status_reason?: string | null
  promo_code_used?: string | null
}

interface ClientRow {
  profile: ProfileRow
  projects: ProjectRow[]
}

interface ClientsTableProps {
  rows: ClientRow[]
  rootDomain: string
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ proj, rootDomain, index }: { proj: ProjectRow; rootDomain: string; index: number }) {
  const [showManage, setShowManage] = useState(false)
  const status = proj.subscription_status || "free"
  const plan = proj.subscription_plan_id || "free"
  const siteUrl = proj.custom_domain
    ? `https://${proj.custom_domain}`
    : proj.subdomain
    ? `https://${proj.subdomain}.${rootDomain}`
    : null

  const trialDays = daysFromNow(proj.trial_ends_at)
  const subDays = daysFromNow(proj.subscription_ends_at)
  const isTrialExpired = status === "trial" && trialDays !== null && trialDays < 0
  const isExpiringSoon = status === "active" && subDays !== null && subDays <= 7 && subDays >= 0

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Site header */}
      <div className="px-4 py-3 bg-muted/20 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <SiteStatusIcon status={proj.site_status} />
          <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
          {siteUrl ? (
            <Link
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline truncate max-w-[260px]"
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {proj.custom_domain || `${proj.subdomain}.${rootDomain}`}
              <ExternalLink className="w-3 h-3 opacity-40 shrink-0" />
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground italic">No domain set</span>
          )}
          {proj.custom_domain && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Custom
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusPill status={status} />
          <button
            onClick={() => setShowManage(v => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition-colors cursor-pointer"
          >
            {showManage ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Manage
          </button>
        </div>
      </div>

      {/* Subscription details grid */}
      <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">

        {/* Plan */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Plan
          </p>
          <p className="text-sm font-semibold capitalize">
            {PLAN_LABELS[plan] || plan}
          </p>
        </div>

        {/* Trial / Subscription expiry */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {status === "trial" ? "Trial Ends" : "Renews / Ends"}
          </p>
          {status === "trial" && proj.trial_ends_at ? (
            <p className={`text-sm font-medium ${isTrialExpired ? "text-red-600" : trialDays !== null && trialDays <= 3 ? "text-amber-600" : ""}`}>
              {fmt(proj.trial_ends_at)}
              {isTrialExpired
                ? <span className="ml-1 text-[10px] font-semibold text-red-500">(Expired)</span>
                : trialDays !== null && trialDays >= 0
                ? <span className="ml-1 text-[10px] text-muted-foreground">{trialDays}d left</span>
                : null}
            </p>
          ) : status === "active" && proj.subscription_ends_at ? (
            <p className={`text-sm font-medium ${isExpiringSoon ? "text-amber-600" : ""}`}>
              {fmt(proj.subscription_ends_at)}
              {isExpiringSoon && subDays !== null && (
                <span className="ml-1 text-[10px] font-semibold text-amber-500">{subDays}d left</span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>

        {/* Promo code */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
            <Ticket className="w-3 h-3" /> Promo Code
          </p>
          {proj.promo_code_used ? (
            <p className="text-sm font-mono font-semibold text-primary">{proj.promo_code_used}</p>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>

        {/* Publish usage */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
            <BarChart2 className="w-3 h-3" /> Publishes
          </p>
          <p className="text-sm font-medium">
            {proj.publish_count ?? 0}
            <span className="text-muted-foreground text-xs"> / {proj.publish_limit ?? "∞"} total</span>
          </p>
          <p className="text-[10px] text-muted-foreground">
            {proj.publish_count_today ?? 0} / {proj.publish_limit_daily ?? "∞"} today
          </p>
        </div>

        {/* Site status */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Visibility
          </p>
          <p className={`text-sm font-medium capitalize ${SITE_STATUS_COLORS[proj.site_status || "active"]}`}>
            {proj.site_status || "active"}
          </p>
          {proj.site_status_reason && (
            <p className="text-[10px] text-muted-foreground truncate max-w-[140px]" title={proj.site_status_reason}>
              {proj.site_status_reason}
            </p>
          )}
        </div>

        {/* Created */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Created
          </p>
          <p className="text-sm text-muted-foreground">{fmt(proj.created_at) || "—"}</p>
        </div>

        {/* Project ID */}
        <div className="col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
            Project ID
          </p>
          <p className="text-[11px] font-mono text-muted-foreground truncate">{proj.id}</p>
        </div>
      </div>

      {/* Manage panel */}
      {showManage && (
        <div className="border-t border-border px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Subscription
            </p>
            <SubscriptionManage project={proj as any} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Custom Domain
            </p>
            <DomainManage project={proj as any} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Site Visibility
            </p>
            <SiteStatusManage project={proj as any} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientsTable({ rows, rootDomain }: ClientsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(({ profile, projects }) => {
      const matchesSearch =
        !q ||
        (profile.email || "").toLowerCase().includes(q) ||
        profile.id.toLowerCase().includes(q) ||
        projects.some(
          (p) =>
            (p.subdomain || "").toLowerCase().includes(q) ||
            (p.custom_domain || "").toLowerCase().includes(q) ||
            (p.promo_code_used || "").toLowerCase().includes(q)
        )

      const matchesStatus =
        statusFilter === "all" ||
        projects.some((p) => (p.subscription_status || "free") === statusFilter)

      return matchesSearch && matchesStatus
    })
  }, [rows, search, statusFilter])

  return (
    <div className="flex flex-col gap-5">

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, subdomain, domain, or promo code…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground -mt-2">
        Showing {filtered.length} of {rows.length} clients
      </p>

      {/* Client list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-20 text-center text-muted-foreground text-sm">
          No clients match your search.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(({ profile, projects: clientProjects }) => {
            const isExpanded = expandedIds.has(profile.id)
            const hasProjects = clientProjects.length > 0

            // Summary badges for collapsed view
            const statusSummary = clientProjects.reduce<Record<string, number>>((acc, p) => {
              const s = p.subscription_status || "free"
              acc[s] = (acc[s] || 0) + 1
              return acc
            }, {})

            return (
              <div key={profile.id} className="rounded-xl border border-border bg-card overflow-hidden">

                {/* Client header */}
                <button
                  onClick={() => toggleExpand(profile.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary overflow-hidden border border-border">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        initials(profile.email, profile.id)
                      )}
                    </div>

                    {/* Email + ID */}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate leading-tight">{profile.email || "—"}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{profile.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {/* Status summary pills */}
                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-end">
                      {Object.entries(statusSummary).map(([s, count]) => (
                        <span key={s} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[s] || STATUS_COLORS.free}`}>
                          {count > 1 && <span>{count}×</span>}
                          {STATUS_LABELS[s] || s}
                        </span>
                      ))}
                      {!hasProjects && (
                        <span className="text-xs text-muted-foreground italic">No websites</span>
                      )}
                    </div>

                    {/* Site count */}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {clientProjects.length} {clientProjects.length === 1 ? "site" : "sites"}
                    </span>

                    {/* Role badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${ROLE_COLORS[profile.role || "client"] || ROLE_COLORS.client}`}>
                      {ROLE_LABELS[profile.role || "client"] || profile.role || "Client"}
                    </span>

                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border">

                    {/* Role management row */}
                    <div className="px-5 py-3 bg-muted/10 border-b border-border flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account Role</span>
                      </div>
                      <RoleSelect userId={profile.id} currentRole={profile.role} />
                      <div className="flex items-center gap-2 ml-auto">
                        <RefreshCw className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {hasProjects ? `${clientProjects.length} website${clientProjects.length !== 1 ? "s" : ""}` : "No websites yet"}
                        </span>
                      </div>
                    </div>

                    {/* Projects */}
                    {!hasProjects ? (
                      <div className="px-5 py-8 text-center text-sm text-muted-foreground italic">
                        This client has no websites yet.
                      </div>
                    ) : (
                      <div className="p-4 flex flex-col gap-4">
                        {clientProjects.map((proj, idx) => (
                          <ProjectCard key={proj.id} proj={proj} rootDomain={rootDomain} index={idx} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
