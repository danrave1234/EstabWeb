"use client"

import { useState } from "react"
import {
  CreditCard, Calendar, RefreshCw, XCircle, AlertTriangle,
  CheckCircle2, Clock, Zap, ArrowRight, ShieldCheck
} from "lucide-react"
import { toggleAutoRenew, cancelSubscription } from "@/app/actions/subscription"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import UpgradeButton from "@/components/dashboard/UpgradeButton"
import { resolveAmountFromPlans, resolvePlan } from "@/lib/plans-config"

interface SubscriptionSettingsProps {
  project: {
    id: string
    subscription_status?: string | null
    subscription_plan_id?: string | null
    subscription_ends_at?: string | null
    trial_ends_at?: string | null
    auto_renew?: boolean
    has_paid_initial?: boolean
    renewal_link?: string | null
    renewal_link_created_at?: string | null
    subscription_interval?: string | null
  }
  initialPlansConfig: {
    PLANS: any
    ENABLE_ANNUAL_PLANS: boolean
  }
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active:        { label: "Active",        className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    trial:         { label: "Trial",         className: "bg-blue-50 text-blue-700 border-blue-200" },
    free:          { label: "Free",          className: "bg-muted text-muted-foreground border-border" },
    admin_granted: { label: "Granted",       className: "bg-violet-50 text-violet-700 border-violet-200" },
    expired:       { label: "Expired",       className: "bg-red-50 text-red-700 border-red-200" },
    cancelled:     { label: "Cancelled",     className: "bg-orange-50 text-orange-700 border-orange-200" },
  }
  const s = map[status] ?? { label: status, className: "bg-muted text-muted-foreground border-border" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${s.className}`}>
      {s.label}
    </span>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-muted-foreground/60">{icon}</span>
        {label}
      </div>
      <div className="text-xs font-semibold text-foreground text-right">{value}</div>
    </div>
  )
}

export default function SubscriptionSettings({ project, initialPlansConfig }: SubscriptionSettingsProps) {
  const { PLANS, ENABLE_ANNUAL_PLANS } = initialPlansConfig
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const status = project?.subscription_status || "free"
  const isPaid = status === "active" || status === "admin_granted"
  const isTrial = status === "trial"
  const isFree = status === "free"

  const endsAt = project.subscription_ends_at ? new Date(project.subscription_ends_at) : null
  const trialEndsAt = project.trial_ends_at ? new Date(project.trial_ends_at) : null
  const autoRenew = project.auto_renew ?? true
  const hasPaidInitial = project.has_paid_initial ?? false
  const interval = project.subscription_interval || "monthly"

  const planId = project.subscription_plan_id || "basic"
  const plan = resolvePlan(PLANS, planId)
  const amount = resolveAmountFromPlans(PLANS, planId, hasPaidInitial, interval as any)

  // Trial expiry info
  const trialDaysLeft = trialEndsAt ? Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000) : null
  const trialExpired = trialDaysLeft !== null && trialDaysLeft <= 0

  // Subscription expiry info
  const subDaysLeft = endsAt ? Math.ceil((endsAt.getTime() - Date.now()) / 86400000) : null
  const subExpiringSoon = subDaysLeft !== null && subDaysLeft <= 7

  const handleToggleAutoRenew = async () => {
    setLoading(true)
    const result = await toggleAutoRenew(project.id, !autoRenew)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(autoRenew ? "Auto-renew disabled" : "Auto-renew enabled")
      router.refresh()
    }
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.")) return
    setLoading(true)
    const result = await cancelSubscription(project.id)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Subscription cancelled. Auto-renew is now off.")
      router.refresh()
    }
  }

  const renewalLink = project.renewal_link

  return (
    <div className="space-y-5">

      {/* Trial expired alert — prominent, at top */}
      {isTrial && trialExpired && trialEndsAt && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-destructive">Your trial has expired</p>
            <p className="text-xs text-destructive/70 leading-relaxed">
              Your trial ended on <strong>{trialEndsAt.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</strong>.
              Upgrade to keep your site active.
            </p>
            <button
              onClick={() => { window.location.href = `/subscribe/${project.id}` }}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <Zap className="w-3 h-3" />
              Upgrade Now
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Trial active — info banner */}
      {isTrial && !trialExpired && trialEndsAt && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
          <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">
              Trial active — {trialDaysLeft}d remaining
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your trial ends on <strong className="text-foreground">{trialEndsAt.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</strong>.
              Upgrade before it expires to avoid interruption.
            </p>
          </div>
        </div>
      )}

      {/* Renewal link banner */}
      {renewalLink && (
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex gap-3">
          <RefreshCw className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="text-sm font-bold">Renewal ready</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your subscription is expiring soon. Complete your renewal to keep your site active.
            </p>
            <button
              onClick={() => { window.location.href = `/subscribe/${project.id}` }}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
            >
              <RefreshCw className="w-3 h-3" />
              Renew Subscription
            </button>
          </div>
        </div>
      )}

      {/* Expiring soon warning for active plans */}
      {isPaid && subExpiringSoon && endsAt && (
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">Expiring in {subDaysLeft}d</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your plan expires on <strong className="text-foreground">{endsAt.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Plan card */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        {/* Card header */}
        <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Plan</span>
          <StatusPill status={isTrial && trialExpired ? "expired" : status} />
        </div>

        {/* Plan name + price */}
        <div className="px-4 py-4 flex items-center gap-3 border-b border-border/60">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isPaid ? "bg-emerald-50 text-emerald-600" : isTrial ? "bg-blue-50 text-blue-600" : "bg-muted text-muted-foreground"}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold capitalize leading-tight">
              {isTrial
                ? `${plan.label} Trial`
                : isPaid
                  ? `${plan.label} ${hasPaidInitial ? (interval === "yearly" ? "Annual" : "Monthly") : "Setup"} Plan`
                  : "Free Plan"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isPaid
                ? `₱${(amount / 100).toLocaleString()} ${hasPaidInitial ? (interval === "yearly" ? "/ year" : "/ month") : "setup fee"}`
                : isTrial
                  ? "No charge during trial"
                  : "₱0 / month"}
            </p>
          </div>
          {isPaid && (
            <div className="shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          )}
        </div>

        {/* Details rows */}
        <div className="px-4 py-1">
          {isTrial && trialEndsAt && (
            <InfoRow
              icon={<Clock className="w-3.5 h-3.5" />}
              label={trialExpired ? "Trial ended" : "Trial expires"}
              value={
                <span className={trialExpired ? "text-destructive" : "text-foreground"}>
                  {trialEndsAt.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  {!trialExpired && trialDaysLeft !== null ? ` (${trialDaysLeft}d left)` : ""}
                </span>
              }
            />
          )}
          {isPaid && endsAt && (
            <InfoRow
              icon={<Calendar className="w-3.5 h-3.5" />}
              label={autoRenew ? "Next billing date" : "Expires on"}
              value={endsAt.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
            />
          )}
          {isPaid && (
            <InfoRow
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              label="Auto-renew"
              value={
                <span className={autoRenew ? "text-emerald-600" : "text-muted-foreground"}>
                  {autoRenew ? "Enabled" : "Disabled"}
                </span>
              }
            />
          )}
          {isPaid && (
            <InfoRow
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              label="Billing cycle"
              value={<span className="capitalize">{interval}</span>}
            />
          )}
        </div>

        {/* Upgrade CTA embedded in card — expired trial or free */}
        {(isFree || (isTrial && trialExpired)) && (
          <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold">Upgrade your plan</p>
              <p className="text-[11px] text-muted-foreground">
                {hasPaidInitial
                  ? `From ₱${(resolvePlan(PLANS, "basic").recurringAmount / 100).toLocaleString()}/month.`
                  : `Starting at ₱${(resolvePlan(PLANS, "basic").initialAmount / 100).toLocaleString()} setup.`}
              </p>
            </div>
            <UpgradeButton
              projectId={project.id}
              subscriptionStatus={status}
              subscriptionPlanId={project.subscription_plan_id}
              variant="inline"
            />
          </div>
        )}

        {/* Upgrade CTA embedded in card — active trial */}
        {isTrial && !trialExpired && (
          <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold">Lock in your plan</p>
              <p className="text-[11px] text-muted-foreground">Upgrade before the trial ends.</p>
            </div>
            <UpgradeButton
              projectId={project.id}
              subscriptionStatus={status}
              subscriptionPlanId={project.subscription_plan_id}
              variant="inline"
            />
          </div>
        )}
      </div>

      {/* Auto-renew toggle — paid only */}
      {isPaid && (
        <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-bold">Auto-Renewal</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Automatically charge your payment method when the billing period ends.
            </p>
          </div>
          <button
            onClick={handleToggleAutoRenew}
            disabled={loading}
            aria-label="Toggle auto-renew"
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${autoRenew ? "bg-primary" : "bg-muted border border-border"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${autoRenew ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      )}

      {/* Cancel subscription — paid only */}
      {isPaid && (
        <div className="rounded-xl border border-border bg-background p-4 space-y-2">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold">Cancel Subscription</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your site stays active until{" "}
                <strong>{endsAt?.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</strong>.
                After that, it reverts to the Free plan.
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading || !autoRenew}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-destructive border border-destructive/20 bg-destructive/5 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <XCircle className="w-3 h-3" />
            Cancel Plan
          </button>
          {!autoRenew && (
            <p className="text-[10px] text-muted-foreground">Auto-renew is already off — your plan will not renew.</p>
          )}
        </div>
      )}

    </div>
  )
}
