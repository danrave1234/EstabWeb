"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { setPlanLimits } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PlanLimitsFormProps {
  freeMaxPages: number
  proMaxPages: number
}

export default function PlanLimitsForm({ freeMaxPages, proMaxPages }: PlanLimitsFormProps) {
  const [pending, startTransition] = useTransition()
  const [nextProMaxPages, setNextProMaxPages] = useState<number>(proMaxPages)

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <CardTitle className="text-xl">Plan Limits</CardTitle>
        <CardDescription>
          Control how many pages paid projects can publish. Free projects remain single-page.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Free max pages</label>
            <Input
              value={freeMaxPages}
              disabled
              className="h-10 text-sm bg-muted/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Pro max pages</label>
            <Input
              type="number"
              min={1}
              value={Number.isFinite(nextProMaxPages) ? nextProMaxPages : proMaxPages}
              onChange={(e) => setNextProMaxPages(Math.max(1, Number(e.target.value) || 1))}
              className="h-10 text-sm bg-background border-primary/20 focus:border-primary/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <Button
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
            className="rounded-lg px-8 font-bold text-xs uppercase tracking-wider"
          >
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}