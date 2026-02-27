"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { setPlansConfig } from "@/app/actions/admin"

interface PlansSettingsFormProps {
    initialConfig: {
        PLANS: Record<string, any>
        ENABLE_ANNUAL_PLANS: boolean
    }
}

export default function PlansSettingsForm({ initialConfig }: PlansSettingsFormProps) {
    const [pending, startTransition] = useTransition()
    const [enableAnnual, setEnableAnnual] = useState(initialConfig.ENABLE_ANNUAL_PLANS)
    const [plans, setPlans] = useState(initialConfig.PLANS)

    const handleNumberChange = (planId: string, field: string, value: string, multiplier: number = 1) => {
        const numValue = parseInt(value, 10) || 0
        setPlans((prev: any) => ({
            ...prev,
            [planId]: {
                ...prev[planId],
                [field]: numValue * multiplier
            }
        }))
    }

    const handleSave = () => {
        startTransition(async () => {
            const result = await setPlansConfig({ PLANS: plans, ENABLE_ANNUAL_PLANS: enableAnnual })
            if (result?.error) {
                toast.error(result.error)
                return
            }
            toast.success("Plans configuration updated")
        })
    }

    const renderPlanInputs = (planId: string, label: string) => {
        const plan = plans[planId]
        if (!plan) return null
        return (
            <div className="space-y-4 border border-border rounded-xl p-4 bg-muted/20">
                <h3 className="font-bold text-sm">{label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Initial Setup (₱)</label>
                        <input
                            type="number"
                            min={0}
                            value={plan.initialAmount / 100}
                            onChange={(e) => handleNumberChange(planId, 'initialAmount', e.target.value, 100)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Monthly (₱)</label>
                        <input
                            type="number"
                            min={0}
                            value={plan.recurringAmount / 100}
                            onChange={(e) => handleNumberChange(planId, 'recurringAmount', e.target.value, 100)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Yearly (₱)</label>
                        <input
                            type="number"
                            min={0}
                            value={plan.yearlyAmount / 100}
                            onChange={(e) => handleNumberChange(planId, 'yearlyAmount', e.target.value, 100)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">AI Limit (Gens)</label>
                        <input
                            type="number"
                            min={0}
                            value={plan.aiGenerationsLimit || 0}
                            onChange={(e) => handleNumberChange(planId, 'aiGenerationsLimit', e.target.value, 1)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg border-primary/30"
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 space-y-6">
            <div>
                <h2 className="text-lg font-bold">Subscription Plans Options</h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Adjust the pricing and session limits for all plans.
                </p>
            </div>

            <div className="flex items-center gap-3 bg-muted/30 p-4 border border-border rounded-xl">
                <input
                    type="checkbox"
                    id="enableAnnualToggle"
                    checked={enableAnnual}
                    onChange={(e) => setEnableAnnual(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary cursor-pointer"
                />
                <label htmlFor="enableAnnualToggle" className="text-sm font-bold cursor-pointer select-none">
                    Enable Annual Billing Discount
                </label>
            </div>

            <div className="space-y-4">
                {renderPlanInputs('free', 'Free Plan')}
                {renderPlanInputs('basic', 'Basic Plan')}
                {renderPlanInputs('pro', 'Pro Plan')}
                {renderPlanInputs('ecommerce', 'E-Commerce Plan')}
            </div>

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="button"
                    disabled={pending}
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-full hover:opacity-90 disabled:opacity-50"
                >
                    {pending ? "Saving..." : "Save Pricing"}
                </button>
            </div>
        </div>
    )
}
