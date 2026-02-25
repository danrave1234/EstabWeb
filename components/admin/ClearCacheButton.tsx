"use client"
import { useState } from "react"
import { toast } from "sonner"

export default function ClearCacheButton() {
  const [loading, setLoading] = useState(false)

  async function handleClearCache() {
    if (!confirm("Are you sure you want to clear the entire Redis cache? All cached site data will be re-fetched on next request.")) return
    setLoading(true)
    try {
      const res = await fetch("/api/admin/clear-cache", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Failed to clear cache")
      } else {
        toast.success("Redis cache cleared successfully")
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold">Cache Management</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manually flush the entire Redis cache. All sites will re-fetch fresh data from the database on their next request.
        </p>
      </div>
      <button
        onClick={handleClearCache}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Clearing…" : "Clear Redis Cache"}
      </button>
    </div>
  )
}
