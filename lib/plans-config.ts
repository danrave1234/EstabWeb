import { PlanId, BillingInterval } from "@/config/plans"

export function resolveAmountFromPlans(PLANS: any, id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = PLANS[id] || PLANS.basic
    if (!isRecurring) return plan.initialAmount
    return interval === 'yearly' ? (plan as any).yearlyAmount : plan.recurringAmount
}

export function resolveDescriptionFromPlans(PLANS: any, id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = PLANS[id] || PLANS.basic
    const isYearly = interval === 'yearly'
    if (!isRecurring) return `${plan.name} — Initial Setup + ${isYearly ? '1 Year' : '1 Month'} Care`
    return `${plan.name} — ${isYearly ? 'Annual' : 'Monthly'} Care Renewal`
}
