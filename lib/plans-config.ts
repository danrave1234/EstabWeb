import { PLANS as DEFAULT_PLANS, BillingInterval } from "@/config/plans"

export function normalizePlansConfig(rawPlans: any) {
    if (!rawPlans || typeof rawPlans !== "object") return DEFAULT_PLANS

    const normalizedPlans = { ...rawPlans }

    for (const [planId, defaultPlan] of Object.entries(DEFAULT_PLANS)) {
        normalizedPlans[planId] = {
            ...defaultPlan,
            ...(rawPlans[planId] || {}),
            label: defaultPlan.label,
            name: defaultPlan.name,
        }
    }

    return normalizedPlans
}

export function resolvePlan(PLANS: any, id: string) {
    const normalizedPlans = normalizePlansConfig(PLANS)
    return (normalizedPlans && (normalizedPlans[id] || normalizedPlans.basic))
        || DEFAULT_PLANS[id as keyof typeof DEFAULT_PLANS]
        || DEFAULT_PLANS.basic
}

export function resolveAmountFromPlans(PLANS: any, id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = resolvePlan(PLANS, id)
    if (!isRecurring) return plan.initialAmount
    return interval === 'yearly' ? (plan as any).yearlyAmount : plan.recurringAmount
}

export function resolveDescriptionFromPlans(PLANS: any, id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = resolvePlan(PLANS, id)
    const isYearly = interval === 'yearly'
    if (!isRecurring) return `${plan.name} — Initial Setup + ${isYearly ? '1 Year' : '1 Month'} Care`
    return `${plan.name} — ${isYearly ? 'Annual' : 'Monthly'} Care Renewal`
}
