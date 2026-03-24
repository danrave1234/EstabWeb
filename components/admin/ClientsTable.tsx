"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import {
  Search, ChevronDown, Globe, ExternalLink, Ticket,
  ShieldCheck, MoreHorizontal, X, Check, AlertCircle,
  Clock, Layers, Zap, Ban, Archive
} from "lucide-react"
import SubscriptionManage from "@/components/admin/SubscriptionManage"
import DomainManage from "@/components/admin/DomainManage"
import SiteStatusManage from "@/components/admin/SiteStatusManage"
import { updateUserRole } from "@/app/admin/actions"

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(d: string | null | undefined) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
}

function daysLeft(d: string | null | undefined): number | null {
  if (!d) return null
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
}

function avatar(email: string | null, id: string) {
  return (email || id)[0].toUpperCase()
}

function planLabel(p: string | null | undefined) {
  const map: Record<string, string> = { free: "Free", basic: "Basic", pro: "Pro", ecommerce: "Ecom", custom: "Custom" }
  return map[p || "free"] || p || "Free"
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function SubBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    active:        { label: "Active",   cls: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20" },
    trial:         { label: "Trial",    cls: "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/20" },
    admin_granted: { label: "Granted",  cls: "bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20" },
    free:          { label: "Free",     cls: "bg-zinc-500/10 text-zinc-500 ring-1 ring-zinc-500/20" },
    expired:       { label: "Expired",  cls: "bg-red-500/10 text-red-500 ring-1 ring-red-500/20" },
  }
  const c = cfg[status] || cfg.free
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${c.cls}`}>
      {c.label}
    </span>
  )
}

function SiteVisibilityDot({ status }: { status: string | null | undefined }) {
  const s = status || "active"
  const cls = s === "active" ? "bg-emerald-500" : s === "disabled" ? "bg-amber-400" : "bg-red-500"
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${cls} shrink-0`} />
}

// ─── Role Select ──────────────────────────────────────────────────────────────

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [err, setErr] = useState<string | null>(null)
  const role = currentRole || "client"

  return (
    <div>
      <select
        value={role}
        disabled={isPending}
        onChange={(e) => {
          setErr(null)
          startTransition(async () => {
            try { await updateUserRole(userId, e.target.value as any) }
            catch (ex: any) { setErr(ex.message) }
          })
        }}
        className="text-xs rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 cursor-pointer"
      >
        <option value="client">Client</option>
        <option value="sub_admin">Sub-Admin</option>
        <option value="admin">Admin</option>
      </select>
      {err && <p className="text-[10px] text-red-500 mt-1">{err}</p>}
    </div>
  )
}

// ─── Manage Drawer ────────────────────────────────────────────────────────────

function ManageDrawer({ proj, onClose }: { proj: ProjectRow; onClose: () => void }) {
  const [tab, setTab] = useState<"subscription" | "domain" | "visibility">("subscription")
  const tabs = [
    { id: "subscription" as const, label: "Subscription" },
    { id: "domain" as const, label: "Domain" },
    { id: "visibility" as const, label: "Visibility" },
  ]
  return (
    <div className="border-t border-border bg-muted/5">
      <div className="flex items-center justify-between px-5 pt-3 pb-0">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors cursor-pointer ${
                tab === t.id
                  ? "bg-background border border-b-0 border-border text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="border-t border-border bg-background px-5 py-4">
        {tab === "subscription" && <SubscriptionManage project={proj as any} />}
        {tab === "domain" && <DomainManage project={proj as any} />}
        {tab === "visibility" && <SiteStatusManage project={proj as any} />}
      </div>
    </div>
  )
}

// ─── Project Row ──────────────────────────────────────────────────────────────

function ProjectRow({ proj, rootDomain }: { proj: ProjectRow; rootDomain: string }) {
  const [managing, setManaging] = useState(false)
  const status = proj.subscription_status || "free"
  const plan = proj.subscription_plan_id || "free"
  const siteUrl = proj.custom_domain
    ? `https://${proj.custom_domain}`
    : proj.subdomain ? `https://${proj.subdomain}.${rootDomain}` : null
  const displayDomain = proj.custom_domain || (proj.subdomain ? `${proj.subdomain}.${rootDomain}` : "—")

  const trialDays = daysLeft(proj.trial_ends_at)
  const subDays = daysLeft(proj.subscription_ends_at)
  const isTrialExpired = status === "trial" && trialDays !== null && trialDays < 0
  const isExpiringSoon = status === "active" && subDays !== null && subDays <= 7 && subDays >= 0

  let expiryNode: React.ReactNode = <span className="text-muted-foreground">—</span>
  if (status === "trial" && proj.trial_ends_at) {
    expiryNode = (
      <span className={isTrialExpired ? "text-red-500" : trialDays !== null && trialDays <= 3 ? "text-amber-500" : ""}>
        {fmt(proj.trial_ends_at)}
        {isTrialExpired
          ? <span className="ml-1 text-[10px] font-semibold">(Expired)</span>
          : trialDays !== null && trialDays >= 0
          ? <span className="ml-1 text-[10px] text-muted-foreground">{trialDays}d left</span>
          : null}
      </span>
    )
  } else if ((status === "active" || status === "admin_granted") && proj.subscription_ends_at) {
    expiryNode = (
      <span className={isExpiringSoon ? "text-amber-500" : ""}>
        {fmt(proj.subscription_ends_at)}
        {isExpiringSoon && subDays !== null && (
          <span className="ml-1 text-[10px] font-semibold">{subDays}d left</span>
        )}
      </span>
    )
  }

  const publishPct = proj.publish_limit
    ? Math.min(100, Math.round(((proj.publish_count ?? 0) / proj.publish_limit) * 100))
    : 0

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Main row */}
      <div className="grid grid-cols-[1fr_auto] items-start gap-3 px-4 py-3">
        <div className="min-w-0 flex flex-col gap-2">
          {/* Domain + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <SiteVisibilityDot status={proj.site_status} />
            {siteUrl ? (
              <Link href={siteUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline truncate max-w-[280px] flex items-center gap-1">
                {displayDomain}
                <ExternalLink className="w-3 h-3 opacity-40 shrink-0" />
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground italic">No domain</span>
            )}
            {proj.custom_domain && (
              <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                Custom Domain
              </span>
            )}
            <SubBadge status={status} />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              {planLabel(plan)}
            </span>
          </div>

          {/* Detail chips */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              {status === "trial" ? "Trial ends:" : "Renews:"} <span className="text-foreground ml-0.5">{expiryNode}</span>
            </span>
            {proj.promo_code_used && (
              <span className="flex items-center gap-1">
                <Ticket className="w-3 h-3 shrink-0" />
                Promo: <span className="font-mono font-semibold text-primary ml-0.5">{proj.promo_code_used}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 shrink-0" />
              Publishes: <span className="text-foreground ml-0.5">{proj.publish_count ?? 0}/{proj.publish_limit ?? "∞"}</span>
              <span className="text-[10px]">({proj.publish_count_today ?? 0}/{proj.publish_limit_daily ?? "∞"} today)</span>
            </span>
            <span className="flex items-center gap-1">
              {proj.site_status === "disabled" ? <Ban className="w-3 h-3 text-amber-500 shrink-0" /> :
               proj.site_status === "archived" ? <Archive className="w-3 h-3 text-red-500 shrink-0" /> :
               <Check className="w-3 h-3 text-emerald-500 shrink-0" />}
              <span className="capitalize">{proj.site_status || "active"}</span>
            </span>
            <span className="text-[10px] font-mono opacity-50 truncate max-w-[180px]">{proj.id}</span>
          </div>

          {/* Publish bar */}
          {proj.publish_limit && (
            <div className="flex items-center gap-2 max-w-[240px]">
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${publishPct >= 90 ? "bg-red-500" : publishPct >= 70 ? "bg-amber-400" : "bg-primary"}`}
                  style={{ width: `${publishPct}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{publishPct}%</span>
            </div>
          )}
        </div>

        {/* Manage button */}
        <button
          onClick={() => setManaging(v => !v)}
          className={`mt-0.5 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
            managing
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border hover:bg-muted text-muted-foreground"
          }`}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
          {managing ? "Close" : "Manage"}
        </button>
      </div>

      {/* Manage drawer */}
      {managing && <ManageDrawer proj={proj} onClose={() => setManaging(false)} />}
    </div>
  )
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ profile, projects, rootDomain }: { profile: ProfileRow; projects: ProjectRow[]; rootDomain: string }) {
  const [open, setOpen] = useState(false)

  const statusCounts = projects.reduce<Record<string, number>>((acc, p) => {
    const s = p.subscription_status || "free"
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const roleColor: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600",
    sub_admin: "bg-violet-500/10 text-violet-600",
    client: "bg-zinc-500/10 text-zinc-500",
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left cursor-pointer"
      >
        {/* Avatar */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-border flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            : avatar(profile.email, profile.id)
          }
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold truncate">{profile.email || "—"}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${roleColor[profile.role || "client"] || roleColor.client}`}>
              {profile.role === "sub_admin" ? "Sub-Admin" : profile.role || "Client"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">{profile.id}</span>
            {Object.entries(statusCounts).map(([s, n]) => (
              <SubBadge key={s} status={s} />
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground">
            {projects.length} {projects.length === 1 ? "site" : "sites"}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-border">
          {/* Role management */}
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/10 border-b border-border">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground font-medium">Account Role</span>
            <RoleSelect userId={profile.id} currentRole={profile.role} />
          </div>

          {/* Sites */}
          {projects.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground italic">
              No websites yet.
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-3">
              {projects.map(proj => (
                <ProjectRow key={proj.id} proj={proj} rootDomain={rootDomain} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["all", "free", "trial", "active", "admin_granted"] as const
type SF = typeof STATUS_FILTERS[number]

export default function ClientsTable({ rows, rootDomain }: ClientsTableProps) {
  const [search, setSearch] = useState("")
  const [sf, setSf] = useState<SF>("all")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(({ profile, projects }) => {
      const matchQ = !q
        || (profile.email || "").toLowerCase().includes(q)
        || profile.id.toLowerCase().includes(q)
        || projects.some(p =>
            (p.subdomain || "").toLowerCase().includes(q) ||
            (p.custom_domain || "").toLowerCase().includes(q) ||
            (p.promo_code_used || "").toLowerCase().includes(q)
          )
      const matchS = sf === "all" || projects.some(p => (p.subscription_status || "free") === sf)
      return matchQ && matchS
    })
  }, [rows, search, sf])

  const sfLabels: Record<SF, string> = {
    all: "All", free: "Free", trial: "Trial", active: "Active", admin_granted: "Granted"
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search email, domain, or promo code…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setSf(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                sf === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              {sfLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {rows.length} clients
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-24 text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No clients match your search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(({ profile, projects }) => (
            <ClientCard key={profile.id} profile={profile} projects={projects} rootDomain={rootDomain} />
          ))}
        </div>
      )}
    </div>
  )
}
