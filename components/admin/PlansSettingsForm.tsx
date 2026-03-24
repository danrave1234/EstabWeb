"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { setPlansConfig } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

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
            <div className="space-y-4 border border-border/50 rounded-xl p-5 bg-muted/20 hover:bg-muted/30 transition-colors">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">{label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Initial Setup (₱)</label>
                        <Input
                            type="number"
                            min={0}
                            value={plan.initialAmount / 100}
                            onChange={(e) => handleNumberChange(planId, 'initialAmount', e.target.value, 100)}
                            className="h-10 text-sm bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Monthly (₱)</label>
                        <Input
                            type="number"
                            min={0}
                            value={plan.recurringAmount / 100}
                            onChange={(e) => handleNumberChange(planId, 'recurringAmount', e.target.value, 100)}
                            className="h-10 text-sm bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Yearly (₱)</label>
                        <Input
                            type="number"
                            min={0}
                            value={plan.yearlyAmount / 100}
                            onChange={(e) => handleNumberChange(planId, 'yearlyAmount', e.target.value, 100)}
                            className="h-10 text-sm bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">AI Limit (Gens)</label>
                        <Input
                            type="number"
                            min={0}
                            value={plan.aiGenerationsLimit || 0}
                            onChange={(e) => handleNumberChange(planId, 'aiGenerationsLimit', e.target.value, 1)}
                            className="h-10 text-sm bg-background border-primary/20 focus:border-primary/50"
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
                <CardTitle className="text-xl">Subscription Plans Options</CardTitle>
                <CardDescription>Adjust the pricing and session limits for all plans.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 bg-primary/5 p-4 border border-primary/10 rounded-xl">
                    <Checkbox
                        id="enableAnnualToggle"
                        checked={enableAnnual}
                        onCheckedChange={(checked) => setEnableAnnual(!!checked)}
                    />
                    <label htmlFor="enableAnnualToggle" className="text-sm font-bold cursor-pointer select-none text-primary/80">
                        Enable Annual Billing Discount
                    </label>
                </div>

                <div className="space-y-6">
                    {renderPlanInputs('free', 'Free Plan')}
                    {renderPlanInputs('basic', 'Basic Plan')}
                    {renderPlanInputs('pro', 'Pro Plan')}
                    {renderPlanInputs('ecommerce', 'E-Commerce Plan')}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <Button
                        disabled={pending}
                        onClick={handleSave}
                        className="rounded-lg px-8 font-bold text-xs uppercase tracking-wider"
                    >
                        {pending ? "Saving..." : "Save Pricing Configuration"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
