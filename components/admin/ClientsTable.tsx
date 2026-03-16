"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import { Globe, ExternalLink, Search, ChevronDown, ChevronUp, Users, ShieldCheck } from "lucide-react"
import SubscriptionManage from "@/components/admin/SubscriptionManage"
import DomainManage from "@/components/admin/DomainManage"
import SiteStatusManage from "@/components/admin/SiteStatusManage"
import { updateUserRole } from "@/app/admin/actions"

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

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const role = currentRole || "client"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "admin" | "sub_admin" | "client"
    setError(null)
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className="text-xs rounded-lg border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
      >
        <option value="client">Client</option>
        <option value="sub_admin">Sub-Admin</option>
        <option value="admin">Admin</option>
      </select>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  )
}

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
  trial_ends_at?: string | null
  publish_limit?: number | null
  publish_count?: number | null
  site_status?: string | null
  site_status_reason?: string | null
}

interface ClientRow {
  profile: ProfileRow
  projects: ProjectRow[]
}

interface ClientsTableProps {
  rows: ClientRow[]
  rootDomain: string
}

const STATUS_COLORS: Record<string, string> = {
  free: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  trial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  admin_granted: "bg-purple-500/10 text-purple-600 border-purple-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  free: "Free",
  trial: "Trial",
  active: "Paid",
  admin_granted: "Granted",
}

const ALL_STATUSES = ["all", "free", "trial", "active", "admin_granted"] as const
type StatusFilter = (typeof ALL_STATUSES)[number]

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
            (p.custom_domain || "").toLowerCase().includes(q)
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
            placeholder="Search by email, subdomain, or domain…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
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
        <div className="rounded-xl border border-border bg-card py-20 text-center text-muted-foreground">
          No clients match your search.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(({ profile, projects: clientProjects }) => {
            const isExpanded = expandedIds.has(profile.id)
            const hasProjects = clientProjects.length > 0

            return (
              <div key={profile.id} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Client header row */}
                <button
                  onClick={() => toggleExpand(profile.id)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary overflow-hidden">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        (profile.email || profile.id)[0].toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{profile.email || profile.id}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{profile.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {/* Status badges summary */}
                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-end">
                      {clientProjects.map((p) => {
                        const s = p.subscription_status || "free"
                        return (
                          <span
                            key={p.id}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[s] || STATUS_COLORS.free}`}
                          >
                            {p.custom_domain || p.subdomain || "—"} · {STATUS_LABELS[s] || s}
                          </span>
                        )
                      })}
                      {clientProjects.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">No websites</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {clientProjects.length} {clientProjects.length === 1 ? "site" : "sites"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${ROLE_COLORS[profile.role || "client"] || ROLE_COLORS.client}`}>
                      {ROLE_LABELS[profile.role || "client"] || profile.role || "Client"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded: project rows */}
                {isExpanded && (
                  <div className="divide-y divide-border">
                    {!hasProjects ? (
                      <div className="px-5 py-6 flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground italic">No websites yet.</p>
                        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 max-w-xs">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Role
                          </p>
                          <RoleSelect userId={profile.id} currentRole={profile.role} />
                        </div>
                      </div>
                    ) : (
                      clientProjects.map((proj, idx) => {
                        const href = proj.custom_domain
                          ? `https://${proj.custom_domain}`
                          : proj.subdomain
                          ? `https://${proj.subdomain}.${rootDomain}`
                          : "#"
                        const status = proj.subscription_status || "free"
                        const statusColor = STATUS_COLORS[status] || STATUS_COLORS.free
                        const statusLabel = STATUS_LABELS[status] || status

                        return (
                          <div key={proj.id} className="px-5 py-4">
                            {/* Site info row */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                              <Link
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  proj.custom_domain
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20"
                                    : "bg-background hover:bg-muted"
                                } ${
                                  proj.subdomain || proj.custom_domain
                                    ? ""
                                    : "opacity-40 pointer-events-none"
                                }`}
                              >
                                <Globe className="w-3 h-3" />
                                {proj.custom_domain
                                  ? proj.custom_domain
                                  : proj.subdomain
                                  ? `${proj.subdomain}.${rootDomain}`
                                  : "no-subdomain"}
                                {(proj.subdomain || proj.custom_domain) && (
                                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                )}
                              </Link>
                              {proj.custom_domain && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                                  Custom
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}
                              >
                                {statusLabel}
                                {proj.trial_ends_at && status === "trial" && (
                                  <span className="ml-1 opacity-70">
                                    · {new Date(proj.trial_ends_at).toLocaleDateString()}
                                  </span>
                                )}
                              </span>
                            </div>

                            {/* Actions row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                              <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                  Custom Domain
                                </p>
                                <DomainManage project={proj as any} />
                              </div>
                              <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                  Subscription
                                </p>
                                <SubscriptionManage project={proj as any} />
                              </div>
                            </div>
                            {/* Site visibility */}
                            <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 mt-4">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Site Visibility
                              </p>
                              <SiteStatusManage project={proj as any} />
                            </div>
                            {/* Role management — only shown on last project row to avoid duplication */}
                            {idx === 0 && (
                              <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 mt-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> Role
                                </p>
                                <RoleSelect userId={profile.id} currentRole={profile.role} />
                              </div>
                            )}
                          </div>
                        )
                      })
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
