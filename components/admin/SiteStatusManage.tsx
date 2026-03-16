"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProjectSiteStatus {
  id: string
  subdomain: string | null
  site_status?: string | null
  site_status_reason?: string | null
}

interface SiteStatusManageProps {
  project: ProjectSiteStatus
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  disabled: "Disabled",
  archived: "Archived",
}

const STATUS_COLORS: Record<string, string> = {
  active: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700",
  disabled: "border-amber-500/50 bg-amber-500/10 text-amber-700",
  archived: "border-zinc-500/50 bg-zinc-500/10 text-zinc-600",
}

export default function SiteStatusManage({ project }: SiteStatusManageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState(project.site_status_reason || "")
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

  const currentStatus = project.site_status || "active"

  const handleSetStatus = async (newStatus: string) => {
    if (newStatus === "archived" && confirmTarget !== "archived") {
      setConfirmTarget("archived")
      return
    }
    if (newStatus === "deleted" && confirmTarget !== "deleted") {
      setConfirmTarget("deleted")
      return
    }

    setLoading(true)
    setConfirmTarget(null)

    try {
      if (newStatus === "deleted") {
        const res = await fetch(`/api/admin/projects/${project.id}/site-status`, {
          method: "DELETE",
        })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error || "Failed to delete project")
          setLoading(false)
          return
        }
        toast.success("Project permanently deleted")
        router.refresh()
        return
      }

      const res = await fetch(`/api/admin/projects/${project.id}/site-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason: reason.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to update site status")
        setLoading(false)
        return
      }
      toast.success(`Site status set to ${STATUS_LABELS[newStatus] || newStatus}`)
      router.refresh()
    } catch {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  const domain = project.subdomain || project.id.slice(0, 8)

  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-foreground">{domain}</span>
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[currentStatus] || STATUS_COLORS.active}`}
        >
          {STATUS_LABELS[currentStatus] || currentStatus}
        </span>
      </div>

      {/* Optional reason field */}
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="px-2 py-1 bg-background border border-border rounded text-xs w-full"
      />

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => handleSetStatus("active")}
          disabled={loading || currentStatus === "active"}
          className="px-2 py-0.5 text-[10px] rounded border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Set Active
        </button>
        <button
          onClick={() => handleSetStatus("disabled")}
          disabled={loading || currentStatus === "disabled"}
          className="px-2 py-0.5 text-[10px] rounded border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Disable
        </button>
        <button
          onClick={() => handleSetStatus("archived")}
          disabled={loading || currentStatus === "archived"}
          className="px-2 py-0.5 text-[10px] rounded border border-zinc-500/50 bg-zinc-500/10 hover:bg-zinc-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Archive
        </button>
        <button
          onClick={() => handleSetStatus("deleted")}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-red-500/50 bg-red-500/10 text-red-700 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>

      {/* Confirmation prompt for destructive actions */}
      {confirmTarget && (
        <div className="mt-1 p-2 rounded border border-destructive/30 bg-destructive/5 text-xs flex flex-col gap-2">
          <p className="font-medium text-destructive">
            {confirmTarget === "deleted"
              ? "Permanently delete this project? This cannot be undone."
              : "Archive this site? The custom domain will be removed. Only an admin can restore it."}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                handleSetStatus(confirmTarget)
              }}
              disabled={loading}
              className="px-2 py-0.5 rounded border border-destructive bg-destructive text-destructive-foreground text-[10px] hover:opacity-90 disabled:opacity-50"
            >
              {confirmTarget === "deleted" ? "Delete permanently" : "Yes, archive"}
            </button>
            <button
              onClick={() => setConfirmTarget(null)}
              disabled={loading}
              className="px-2 py-0.5 rounded border border-border text-[10px] hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
