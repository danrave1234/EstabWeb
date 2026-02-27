"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { setProjectSubscription, updateProjectAIStats } from "@/app/actions/admin"
import { TRIAL_DAYS, DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY } from "@/lib/subscription"

interface ProjectWithSubscription {
  id: string
  subdomain: string | null
  subscription_status?: string | null
  trial_ends_at?: string | null
  publish_limit?: number | null
  publish_count?: number | null
  ai_usage_count?: number | null
  ai_usage_limit?: number | null
}

interface SubscriptionManageProps {
  project: ProjectWithSubscription
}

const STATUS_LABELS: Record<string, string> = {
  free: "Free",
  trial: "Trial",
  active: "Paid",
  admin_granted: "Admin granted",
}

export default function SubscriptionManage({ project }: SubscriptionManageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Local state for AI stats to edit before saving
  const [aiCount, setAiCount] = useState<number>(project.ai_usage_count || 0)
  const [aiLimitValue, setAiLimitValue] = useState<string>(
    project.ai_usage_limit !== null && project.ai_usage_limit !== undefined
      ? String(project.ai_usage_limit)
      : ""
  )

  const status = project.subscription_status || "free"

  const handleSetStatus = async (
    newStatus: "free" | "trial" | "active" | "admin_granted",
    opts?: { trialDays?: number; publishLimit?: number; publishLimitDaily?: number }
  ) => {
    setLoading(true)
    const result = await setProjectSubscription(project.id, newStatus, opts)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(`Subscription set to ${STATUS_LABELS[newStatus]}`)
    router.refresh()
  }

  const handleSaveAIStats = async () => {
    setLoading(true)
    const limitParsed = aiLimitValue.trim() === "" ? null : parseInt(aiLimitValue, 10)

    if (limitParsed !== null && isNaN(limitParsed)) {
      toast.error("Invalid AI limit value")
      setLoading(false)
      return
    }

    const result = await updateProjectAIStats(project.id, aiCount, limitParsed)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("AI usage stats updated")
    router.refresh()
  }

  const domain = project.subdomain || project.id.slice(0, 8)
  return (
    <div className="flex flex-col gap-2 py-1">
      <div>
        <span className="text-xs font-medium text-foreground">{domain}</span>
        <span className="text-xs text-muted-foreground ml-2">
          {STATUS_LABELS[status] || status}
          {project.trial_ends_at && status === "trial" && (
            <span className="ml-1 text-[10px]">
              (until {new Date(project.trial_ends_at).toLocaleDateString()})
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => handleSetStatus("free")}
          disabled={loading || status === "free"}
          className="px-2 py-0.5 text-[10px] rounded border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Free
        </button>
        <button
          onClick={() => handleSetStatus("trial", { trialDays: TRIAL_DAYS })}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50"
        >
          Trial
        </button>
        <button
          onClick={() => handleSetStatus("active", { publishLimit: DEFAULT_PUBLISH_LIMIT, publishLimitDaily: DEFAULT_PUBLISH_LIMIT_DAILY })}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          Paid
        </button>
        <button
          onClick={() => handleSetStatus("admin_granted", { publishLimit: DEFAULT_PUBLISH_LIMIT, publishLimitDaily: DEFAULT_PUBLISH_LIMIT_DAILY })}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-50"
          title="Grant access without payment"
        >
          Grant
        </button>
      </div>

      <div className="mt-2 text-xs border border-border rounded-md bg-muted/20 p-2 space-y-2">
        <div className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">AI Limits Setup</div>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col flex-1">
            <span className="text-[10px] text-muted-foreground">Used Count</span>
            <input
              type="number"
              min={0}
              value={aiCount}
              onChange={(e) => setAiCount(parseInt(e.target.value) || 0)}
              className="px-2 py-1 bg-background border border-border rounded text-xs w-full"
            />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] text-muted-foreground">Custom Limit (blank = default)</span>
            <input
              type="number"
              min={0}
              placeholder="Plan default"
              value={aiLimitValue}
              onChange={(e) => setAiLimitValue(e.target.value)}
              className="px-2 py-1 bg-background border border-border rounded text-xs w-full"
            />
          </div>
          <div className="flex flex-col justify-end mt-4 shrink-0">
            <button
              onClick={handleSaveAIStats}
              disabled={loading}
              className="px-2 py-1 bg-primary text-primary-foreground font-bold rounded hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
