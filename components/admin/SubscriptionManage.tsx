"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { setProjectSubscription } from "@/app/actions/admin"
import { TRIAL_DAYS, DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY } from "@/lib/subscription"

interface ProjectWithSubscription {
  id: string
  subdomain: string | null
  subscription_status?: string | null
  trial_ends_at?: string | null
  publish_limit?: number | null
  publish_count?: number | null
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
  const status = project.subscription_status || "free"

  const handleSet = async (
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

  const domain = project.subdomain || project.id.slice(0, 8)
  return (
    <div className="flex flex-col gap-1 py-1">
      <span className="text-xs font-medium text-foreground">{domain}</span>
      <span className="text-xs text-muted-foreground">
        {STATUS_LABELS[status] || status}
        {project.trial_ends_at && status === "trial" && (
          <span className="ml-1 text-[10px]">
            (until {new Date(project.trial_ends_at).toLocaleDateString()})
          </span>
        )}
      </span>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => handleSet("free")}
          disabled={loading || status === "free"}
          className="px-2 py-0.5 text-[10px] rounded border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Free
        </button>
        <button
          onClick={() => handleSet("trial", { trialDays: TRIAL_DAYS })}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50"
        >
          Trial
        </button>
        <button
          onClick={() => handleSet("active", { publishLimit: DEFAULT_PUBLISH_LIMIT, publishLimitDaily: DEFAULT_PUBLISH_LIMIT_DAILY })}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          Paid
        </button>
        <button
          onClick={() => handleSet("admin_granted", { publishLimit: DEFAULT_PUBLISH_LIMIT, publishLimitDaily: DEFAULT_PUBLISH_LIMIT_DAILY })}
          disabled={loading}
          className="px-2 py-0.5 text-[10px] rounded border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-50"
          title="Grant access without payment (e.g. for friends)"
        >
          Grant
        </button>
      </div>
    </div>
  )
}
