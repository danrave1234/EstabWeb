"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { setPlanLimits } from "@/app/actions/admin"

interface PlanLimitsFormProps {
  freeMaxPages: number
  proMaxPages: number
}

export default function PlanLimitsForm({ freeMaxPages, proMaxPages }: PlanLimitsFormProps) {
  const [pending, startTransition] = useTransition()
  const [nextProMaxPages, setNextProMaxPages] = useState<number>(proMaxPages)

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold">Plan Limits</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Control how many pages paid projects can publish. Free projects remain single-page.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Free max pages</label>
          <input
            value={freeMaxPages}
            disabled
            className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-lg text-muted-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Pro max pages</label>
          <input
            type="number"
            min={1}
            value={Number.isFinite(nextProMaxPages) ? nextProMaxPages : proMaxPages}
            onChange={(e) => setNextProMaxPages(Math.max(1, Number(e.target.value) || 1))}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await setPlanLimits({ proMaxPages: nextProMaxPages })
              if (result?.error) {
                toast.error(result.error)
                return
              }
              toast.success("Plan limits updated")
            })
          }}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-full hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}