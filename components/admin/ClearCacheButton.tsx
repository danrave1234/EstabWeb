"use client"
import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

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
    <Card className="border-destructive/20 shadow-sm overflow-hidden bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
            <CardDescription className="text-destructive/70">
              System-level cache management. Use with caution.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-destructive/80 font-medium">
          Manually flush the entire Redis cache. All sites will re-fetch fresh data from the database on their next request. This may cause a temporary spike in database load.
        </p>
        <Button
          onClick={handleClearCache}
          disabled={loading}
          variant="destructive"
          className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider"
        >
          {loading ? "Clearing Cache..." : "Clear Redis Cache"}
        </Button>
      </CardContent>
    </Card>
  )
}
