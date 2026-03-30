"use client"

import * as React from "react"
import { Zap } from "lucide-react"

interface UpgradeButtonProps {
  projectId: string
  subscriptionStatus?: string | null
  subscriptionPlanId?: string | null
  trialEndsAt?: string | null
  subscriptionEndsAt?: string | null
  variant?: "sidebar" | "inline" | "badge"
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  basic: "Starter",
  pro: "Business",
  ecommerce: "Ecommerce",
  custom: "Custom",
}

const STATUS_STYLES: Record<string, { inline: string; badge: string }> = {
  free: {
    inline: "text-white bg-primary border-primary hover:bg-primary/90",
    badge: "text-amber-600 bg-amber-500/10 border border-amber-500/20",
  },
  trial: {
    inline: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badge: "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20",
  },
  active: {
    inline: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badge: "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20",
  },
  admin_granted: {
    inline: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    badge: "text-purple-600 bg-purple-500/10 border border-purple-500/20",
  },
}

function normalizePlanId(planId?: string | null): keyof typeof PLAN_LABELS {
  const id = (planId || "free").toLowerCase()
  if (id in PLAN_LABELS) return id as keyof typeof PLAN_LABELS
  return "free"
}

function displayLabelForStatus(status: string, planId: keyof typeof PLAN_LABELS): string {
  if (status === "free") return "Subscribe"
  if (status === "trial") {
    const planLabel = PLAN_LABELS[planId]
    return planId === "free" ? "Trial" : `Trial ${planLabel}`
  }
  if (status === "admin_granted") {
    const planLabel = PLAN_LABELS[planId]
    return planId === "free" ? "Admin Granted" : `Admin ${planLabel}`
  }
  return PLAN_LABELS[planId]
}

export default function UpgradeButton({
  projectId,
  subscriptionStatus = "free",
  subscriptionPlanId = null,
  trialEndsAt = null,
  subscriptionEndsAt = null,
  variant = "inline",
}: UpgradeButtonProps) {
  const status = ((subscriptionStatus || "free").toLowerCase() as keyof typeof STATUS_STYLES)
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.free
  const planId = normalizePlanId(subscriptionPlanId)
  const label = displayLabelForStatus(status, planId)

  const isUpgradable = status === "free" || status === "trial"

  const expiryTooltip = React.useMemo(() => {
    if (status === "trial" && trialEndsAt) {
      const daysLeft = Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000)
      const dateStr = new Date(trialEndsAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
      if (daysLeft <= 0) return `Trial expired on ${dateStr}`
      return `Trial ends in ${daysLeft}d — ${dateStr}`
    }
    if (status === "active" && subscriptionEndsAt) {
      const daysLeft = Math.ceil((new Date(subscriptionEndsAt).getTime() - Date.now()) / 86400000)
      const dateStr = new Date(subscriptionEndsAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
      if (daysLeft <= 7) return `Plan expires in ${daysLeft}d — ${dateStr}`
    }
    return null
  }, [status, trialEndsAt, subscriptionEndsAt])

  const handleUpgrade = () => {
    if (!isUpgradable) return
    window.location.href = `/subscribe/${projectId}`
  }

  if (variant === "badge") {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle.badge}`}>
        <Zap className="w-2.5 h-2.5" />
        {label}
      </span>
    )
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleUpgrade}
        disabled={!isUpgradable}
        title={expiryTooltip || undefined}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 border ${statusStyle.inline}`}
      >
        <Zap className="w-3.5 h-3.5" />
        {label}
      </button>
    )
  }

  return (
    <button
      onClick={handleUpgrade}
      className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
    >
      <span className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Upgrade (₱500/mo)
      </span>
    </button>
  )
}
