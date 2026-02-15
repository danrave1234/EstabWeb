"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { toast } from "sonner"

interface UpgradeButtonProps {
  projectId: string
  variant?: "sidebar" | "inline"
}

export default function UpgradeButton({ projectId, variant = "inline" }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/paymongo/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId, 
          planId: "ph_monthly",
          successUrl: window.location.origin + "/dashboard?payment_success=true"
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
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg transition-colors disabled:opacity-50"
      >
        <Zap className="w-3.5 h-3.5" />
        {loading ? "Redirecting…" : "Free"}
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
        Upgrade (₱1,000/mo)
      </span>
    </button>
  )
}
