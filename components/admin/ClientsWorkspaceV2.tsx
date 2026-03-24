"use client"

import Link from "next/link"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, ChevronDown, Clock3, Globe, Search, Shield, Sparkles, WandSparkles } from "lucide-react"
import { updateUserRole } from "@/app/admin/actions"
import { setCustomDomain as setProjectCustomDomain, updateProjectAdminControls } from "@/app/actions/admin"
import { getPlan, TRIAL_DAYS } from "@/config/plans"

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
  ai_usage_count?: number | null
  ai_usage_limit?: number | null
}

interface ClientRow {
  profile: ProfileRow
  projects: ProjectRow[]
}

interface ClientsWorkspaceV2Props {
  rows: ClientRow[]
  rootDomain: string
}

type SubscriptionStatus = "free" | "trial" | "active" | "admin_granted"
type PlanId = "free" | "basic" | "pro" | "ecommerce" | "custom"

const STATUS_OPTIONS: SubscriptionStatus[] = ["free", "trial", "active", "admin_granted"]
const PLAN_OPTIONS: PlanId[] = ["free", "basic", "pro", "ecommerce", "custom"]

function formatDate(value: string | null | undefined) {
  if (!value) return "No date"
  return new Date(value).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
}

function daysRemaining(value: string | null | undefined) {
  if (!value) return null
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86400000)
}

function toDateInput(value: string | null | undefined) {
  if (!value) return ""
  return new Date(value).toISOString().slice(0, 10)
}

function toIsoFromDateInput(value: string) {
  if (!value) return null
  return new Date(`${value}T23:59:59.000Z`).toISOString()
}

function getAvatarInitial(email: string | null | undefined, id: string) {
  const source = (email || id || "u").trim()
  return source.charAt(0).toUpperCase()
}

function UserAvatar({
  email,
  id,
  avatarUrl,
  size = "md",
}: {
  email: string | null | undefined
  id: string
  avatarUrl?: string | null
  size?: "sm" | "md"
}) {
  const classes = size === "sm"
    ? "h-8 w-8 text-xs"
    : "h-10 w-10 text-sm"

  return (
    <div className={`shrink-0 overflow-hidden rounded-full border border-border bg-muted ${classes}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-foreground">
          {getAvatarInitial(email, id)}
        </div>
      )}
    </div>
  )
}

function readableRole(role: string | null | undefined) {
  if (!role) return "client"
  return role === "sub_admin" ? "sub-admin" : role
}

function roleBadgeClass(role: string | null | undefined) {
  if (role === "admin") return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
  if (role === "sub_admin") return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
  return "bg-muted text-foreground border-border"
}

function statusPillClass(status: string | null | undefined) {
  const current = status || "free"
  if (current === "active") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
  if (current === "trial") return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
  if (current === "admin_granted") return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30"
  if (current === "expired") return "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30"
  return "bg-muted text-foreground border-border"
}

function siteStatusPillClass(status: string | null | undefined) {
  const current = status || "active"
  if (current === "active") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
  if (current === "disabled") return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
  return "bg-muted text-foreground border-border"
}

function ProjectControlCard({ project, rootDomain }: { project: ProjectRow; rootDomain: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>((project.subscription_status as SubscriptionStatus) || "free")
  const [planId, setPlanId] = useState<PlanId>((project.subscription_plan_id as PlanId) || "free")
  const [trialDays, setTrialDays] = useState<number>(TRIAL_DAYS)
  const [subscriptionEndsAt, setSubscriptionEndsAt] = useState<string>(toDateInput(project.subscription_ends_at))
  const [publishLimit, setPublishLimit] = useState<string>(String(project.publish_limit ?? 0))
  const [publishLimitDaily, setPublishLimitDaily] = useState<string>(String(project.publish_limit_daily ?? 0))
  const [publishCount, setPublishCount] = useState<string>(String(project.publish_count ?? 0))
  const [publishCountToday, setPublishCountToday] = useState<string>(String(project.publish_count_today ?? 0))
  const [aiUsageCount, setAiUsageCount] = useState<string>(String(project.ai_usage_count ?? 0))
  const [aiUsageLimit, setAiUsageLimit] = useState<string>(project.ai_usage_limit == null ? "" : String(project.ai_usage_limit))
  const [customDomain, setCustomDomainValue] = useState<string>(project.custom_domain || "")
  const [siteStatus, setSiteStatus] = useState<"active" | "disabled" | "archived">((project.site_status as "active" | "disabled" | "archived") || "active")
  const [siteReason, setSiteReason] = useState<string>(project.site_status_reason || "")

  const domain = project.custom_domain || (project.subdomain ? `${project.subdomain}.${rootDomain}` : "")
  const siteUrl = domain ? `https://${domain}` : null
  const trialDaysLeft = daysRemaining(project.trial_ends_at)
  const paidDaysLeft = daysRemaining(project.subscription_ends_at)
  const publishLeft = Math.max((project.publish_limit ?? 0) - (project.publish_count ?? 0), 0)
  const aiLeft = project.ai_usage_limit == null ? "Unlimited" : Math.max(project.ai_usage_limit - (project.ai_usage_count ?? 0), 0)

  const applyPreset = (preset: "free" | "trial" | "basic" | "pro" | "ecommerce") => {
    const plan = getPlan(preset === "trial" ? "basic" : preset)
    const nextStatus: SubscriptionStatus = preset === "free" ? "free" : preset === "trial" ? "trial" : "active"
    const nextPlan: PlanId = preset === "trial" ? "basic" : preset

    startTransition(async () => {
      const result = await updateProjectAdminControls(project.id, {
        subscriptionStatus: nextStatus,
        planId: nextPlan,
        trialDays: preset === "trial" ? TRIAL_DAYS : undefined,
        publishLimit: plan.publishLimit,
        publishLimitDaily: plan.publishLimitDaily,
        aiUsageLimit: plan.aiGenerationsLimit,
        resetPublishCounters: true,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`Applied ${preset === "ecommerce" ? "e-commerce" : preset} package`)
      router.refresh()
    })
  }

  const saveAccess = () => {
    const parsedLimit = Number.parseInt(publishLimit, 10)
    const parsedDailyLimit = Number.parseInt(publishLimitDaily, 10)
    const parsedCount = Number.parseInt(publishCount, 10)
    const parsedCountToday = Number.parseInt(publishCountToday, 10)
    const parsedAiCount = Number.parseInt(aiUsageCount, 10)
    const parsedAiLimit = aiUsageLimit.trim() === "" ? null : Number.parseInt(aiUsageLimit, 10)

    if ([parsedLimit, parsedDailyLimit, parsedCount, parsedCountToday, parsedAiCount].some((n) => Number.isNaN(n) || n < 0)) {
      toast.error("Publish and AI fields must be valid non-negative numbers")
      return
    }
    if (parsedAiLimit !== null && (Number.isNaN(parsedAiLimit) || parsedAiLimit < 0)) {
      toast.error("AI limit must be empty or a non-negative number")
      return
    }

    startTransition(async () => {
      const result = await updateProjectAdminControls(project.id, {
        subscriptionStatus: subStatus,
        planId,
        trialDays,
        subscriptionEndsAt: toIsoFromDateInput(subscriptionEndsAt),
        publishLimit: parsedLimit || 1,
        publishLimitDaily: parsedDailyLimit || 1,
        publishCount: parsedCount,
        publishCountToday: parsedCountToday,
        aiUsageCount: parsedAiCount,
        aiUsageLimit: parsedAiLimit,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Project access settings saved")
      router.refresh()
    })
  }

  const resetPublishCounters = () => {
    startTransition(async () => {
      const result = await updateProjectAdminControls(project.id, { resetPublishCounters: true })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Publish counters reset")
      router.refresh()
    })
  }

  const saveDomain = () => {
    const cleaned = customDomain.trim().toLowerCase().replace(/^https?:\/\//, "")
    startTransition(async () => {
      const result = await setProjectCustomDomain(project.id, cleaned || null)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(cleaned ? "Domain updated" : "Domain removed")
      router.refresh()
    })
  }

  const saveVisibility = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}/site-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: siteStatus, reason: siteReason.trim() || undefined }),
      })
      const payload = await res.json()
      if (!res.ok) {
        toast.error(payload.error || "Failed to update site visibility")
        return
      }
      toast.success("Site visibility updated")
      router.refresh()
    } catch {
      toast.error("Network error while updating visibility")
    }
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusPillClass(project.subscription_status)}`}>
              {(project.subscription_status || "free").replace("_", " ")}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground">
              {(project.subscription_plan_id || "free").replace("_", " ")}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${siteStatusPillClass(project.site_status)}`}>
              site: {project.site_status || "active"}
            </span>
          </div>
          <div className="mt-2">
            {siteUrl ? (
              <Link href={siteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-foreground hover:underline">
                {domain}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-foreground">No active domain</p>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Project ID: <span className="font-mono">{project.id}</span></p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-muted-foreground">Publish Left</p>
            <p className="font-semibold text-foreground">{publishLeft}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-muted-foreground">AI Left</p>
            <p className="font-semibold text-foreground">{aiLeft}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            {isOpen ? "Hide controls" : "Manage website"}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && (
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subscription & Limits</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => applyPreset("free")} disabled={isPending} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50">Free</button>
            <button onClick={() => applyPreset("trial")} disabled={isPending} className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 disabled:opacity-50">Trial</button>
            <button onClick={() => applyPreset("basic")} disabled={isPending} className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50">Basic</button>
            <button onClick={() => applyPreset("pro")} disabled={isPending} className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 disabled:opacity-50">Pro</button>
            <button onClick={() => applyPreset("ecommerce")} disabled={isPending} className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-50">E-commerce</button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <label className="space-y-1">
              <span className="text-muted-foreground">Status</span>
              <select value={subStatus} onChange={(e) => setSubStatus(e.target.value as SubscriptionStatus)} className="w-full rounded-md border border-border bg-card px-2 py-1.5">
                {STATUS_OPTIONS.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Plan</span>
              <select value={planId} onChange={(e) => setPlanId(e.target.value as PlanId)} className="w-full rounded-md border border-border bg-card px-2 py-1.5">
                {PLAN_OPTIONS.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Trial Days</span>
              <input value={trialDays} onChange={(e) => setTrialDays(Number.parseInt(e.target.value, 10) || 0)} type="number" min={0} className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Expiry Date</span>
              <input value={subscriptionEndsAt} onChange={(e) => setSubscriptionEndsAt(e.target.value)} type="date" className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Publish Limit</span>
              <input value={publishLimit} onChange={(e) => setPublishLimit(e.target.value)} type="number" min={1} className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Daily Limit</span>
              <input value={publishLimitDaily} onChange={(e) => setPublishLimitDaily(e.target.value)} type="number" min={1} className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Published Used</span>
              <input value={publishCount} onChange={(e) => setPublishCount(e.target.value)} type="number" min={0} className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">Published Today</span>
              <input value={publishCountToday} onChange={(e) => setPublishCountToday(e.target.value)} type="number" min={0} className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">AI Usage Count</span>
              <input value={aiUsageCount} onChange={(e) => setAiUsageCount(e.target.value)} type="number" min={0} className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
            <label className="space-y-1">
              <span className="text-muted-foreground">AI Usage Limit</span>
              <input value={aiUsageLimit} onChange={(e) => setAiUsageLimit(e.target.value)} type="number" min={0} placeholder="blank = no limit" className="w-full rounded-md border border-border px-2 py-1.5" />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={saveAccess} disabled={isPending} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              Save Access
            </button>
            <button onClick={resetPublishCounters} disabled={isPending} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50">
              Reset Publish Counters
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Trial ends: {project.trial_ends_at ? `${formatDate(project.trial_ends_at)} (${trialDaysLeft}d)` : "No trial"} | Subscription ends: {project.subscription_ends_at ? `${formatDate(project.subscription_ends_at)} (${paidDaysLeft}d)` : "No expiry"}
          </p>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Domain</p>
            <div className="mt-3 flex gap-2">
              <input value={customDomain} onChange={(e) => setCustomDomainValue(e.target.value)} placeholder="customdomain.com" className="w-full rounded-md border border-border px-2 py-1.5 text-xs" />
              <button onClick={saveDomain} disabled={isPending} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                Save
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Use bare domain only. Leave empty to remove custom domain.</p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Site Visibility</p>
            <div className="mt-3 grid gap-3 text-xs">
              <select value={siteStatus} onChange={(e) => setSiteStatus(e.target.value as "active" | "disabled" | "archived")} className="rounded-md border border-border px-2 py-1.5">
                <option value="active">active</option>
                <option value="disabled">disabled</option>
                <option value="archived">archived</option>
              </select>
              <input value={siteReason} onChange={(e) => setSiteReason(e.target.value)} placeholder="Reason (optional)" className="rounded-md border border-border px-2 py-1.5" />
              <button onClick={saveVisibility} className="w-fit rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                Save Visibility
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <p>Promo code: <span className="font-semibold text-foreground">{project.promo_code_used || "None"}</span></p>
            <p className="mt-1">Created: <span className="font-semibold text-foreground">{formatDate(project.created_at)}</span></p>
          </div>
        </section>
      </div>
      )}
    </article>
  )
}

function RoleControl({ userId, role }: { userId: string; role: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [currentRole, setCurrentRole] = useState<string>(role || "client")

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentRole}
        onChange={(e) => {
          const nextRole = e.target.value
          setCurrentRole(nextRole)
          startTransition(async () => {
            try {
              await updateUserRole(userId, nextRole as "admin" | "sub_admin" | "client")
              toast.success("Role updated")
            } catch (error: any) {
              toast.error(error?.message || "Failed to update role")
            }
          })
        }}
        disabled={isPending}
        className="rounded-md border border-border bg-card px-3 py-1.5 text-xs"
      >
        <option value="client">client</option>
        <option value="sub_admin">sub-admin</option>
        <option value="admin">admin</option>
      </select>
    </div>
  )
}

export default function ClientsWorkspaceV2({ rows, rootDomain }: ClientsWorkspaceV2Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "free" | "trial" | "active" | "admin_granted">("all")
  const [selectedClientId, setSelectedClientId] = useState<string>(rows[0]?.profile.id || "")

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(({ profile, projects }) => {
      const matchesSearch =
        !q ||
        (profile.email || "").toLowerCase().includes(q) ||
        profile.id.toLowerCase().includes(q) ||
        projects.some((project) =>
          (project.subdomain || "").toLowerCase().includes(q) ||
          (project.custom_domain || "").toLowerCase().includes(q) ||
          (project.promo_code_used || "").toLowerCase().includes(q)
        )
      const matchesStatus =
        statusFilter === "all" ||
        projects.some((project) => (project.subscription_status || "free") === statusFilter)
      return matchesSearch && matchesStatus
    })
  }, [rows, search, statusFilter])

  const selectedClientIdSafe =
    filteredRows.some((row) => row.profile.id === selectedClientId)
      ? selectedClientId
      : (filteredRows[0]?.profile.id || "")

  const selected = filteredRows.find((row) => row.profile.id === selectedClientIdSafe) || null
  const allProjects = rows.flatMap((row) => row.projects)
  const activeProjects = allProjects.filter((project) => ["active", "admin_granted"].includes(project.subscription_status || "free")).length
  const trialProjects = allProjects.filter((project) => project.subscription_status === "trial").length
  const promoProjects = allProjects.filter((project) => Boolean(project.promo_code_used)).length

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clients Workspace v2</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage non-admin users, websites, subscriptions, promo usage, roles, visibility, domains, AI limits, and publish counters in one place.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-muted-foreground">Clients</p>
                <p className="font-semibold text-foreground">{rows.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-muted-foreground">Sites</p>
                <p className="font-semibold text-foreground">{allProjects.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-muted-foreground">Active + Granted</p>
                <p className="font-semibold text-foreground">{activeProjects}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-muted-foreground">Trial</p>
                <p className="font-semibold text-foreground">{trialProjects}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, ID, domain, or promo code"
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {(["all", "free", "trial", "active", "admin_granted"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                    statusFilter === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {value === "admin_granted" ? "granted" : value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1"><Shield className="h-3.5 w-3.5" /> {filteredRows.length} clients shown</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1"><Globe className="h-3.5 w-3.5" /> {allProjects.length} total websites</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1"><WandSparkles className="h-3.5 w-3.5" /> {promoProjects} promo redemptions</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1"><Sparkles className="h-3.5 w-3.5" /> Direct package assign enabled</span>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client Directory</p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {filteredRows.map(({ profile, projects }) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedClientId(profile.id)}
                  className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition ${
                    selectedClientIdSafe === profile.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      email={profile.email}
                      id={profile.id}
                      avatarUrl={profile.avatar_url}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{profile.email || "No email"}</p>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 ${selectedClientIdSafe === profile.id ? "border-primary/60 bg-primary/80 text-primary-foreground/90" : roleBadgeClass(profile.role)}`}>
                          {readableRole(profile.role)}
                        </span>
                        <span>{projects.length} site(s)</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {!filteredRows.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matching clients.</p>}
            </div>
          </aside>

          <div className="space-y-4">
            {!selected && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Select a client from the left column.
              </div>
            )}

            {selected && (
              <>
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar
                        email={selected.profile.email}
                        id={selected.profile.id}
                        avatarUrl={selected.profile.avatar_url}
                        size="md"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-foreground">{selected.profile.email || "No email"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">User ID: <span className="font-mono">{selected.profile.id}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-1 text-xs font-medium ${roleBadgeClass(selected.profile.role)}`}>{readableRole(selected.profile.role)}</span>
                      <RoleControl userId={selected.profile.id} role={selected.profile.role} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1"><CheckCircle2 className="h-3.5 w-3.5" /> {selected.projects.length} site(s)</span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-1"><Clock3 className="h-3.5 w-3.5" /> Subscription expiries visible below</span>
                  </div>
                </section>

                {selected.projects.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">This client has no sites yet.</div>
                ) : (
                  <div className="space-y-4">
                    {selected.projects.map((project) => (
                      <ProjectControlCard
                        key={`${project.id}-${project.subscription_status}-${project.subscription_plan_id}-${project.custom_domain}-${project.publish_count}-${project.publish_count_today}-${project.publish_limit}-${project.ai_usage_count}-${project.ai_usage_limit}-${project.site_status}-${project.site_status_reason}-${project.subscription_ends_at}-${project.trial_ends_at}`}
                        project={project}
                        rootDomain={rootDomain}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

