"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { toast } from "sonner"

interface UpgradeButtonProps {
  projectId: string
  subscriptionStatus?: string | null
  variant?: "sidebar" | "inline"
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "text-amber-600 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20" },
  trial: { label: "Trial", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  active: { label: "Pro", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  admin_granted: { label: "Admin Granted", color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
}

export default function UpgradeButton({ projectId, subscriptionStatus = "free", variant = "inline" }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const status = ((subscriptionStatus || "free").toLowerCase() as keyof typeof STATUS_LABELS)
  const currentStatus = STATUS_LABELS[status] || STATUS_LABELS.free

  const isUpgradable = status === "free" || status === "trial"

  const handleUpgrade = async () => {
    if (!isUpgradable) return
    setLoading(true)
    try {
      const res = await fetch("/api/paymongo/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId, 
          planId: "ph_monthly",
          successUrl: window.location.origin + `/dashboard?projectId=${projectId}&payment_success=true`
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to create payment link")
      if (json.checkoutUrl) window.open(json.checkoutUrl, '_blank')
      else toast.error("No checkout URL received")
    } catch (e: any) {
      toast.error(e?.message || "Upgrade failed")
    } finally {
      setLoading(false)
    }
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleUpgrade}
        disabled={loading || !isUpgradable}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 border ${currentStatus.color}`}
      >
        <Zap className="w-3.5 h-3.5" />
        {loading ? "Redirecting…" : currentStatus.label}
      </button>
    )
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
    >
      <span className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Upgrade (₱500/mo)
      </span>
    </button>
  )
}
