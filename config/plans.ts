/**
 * PayMongo plan definitions — single source of truth.
 * All amounts are in centavos (PHP × 100).
 */

export const DEFAULT_PUBLISH_LIMIT = 50
export const DEFAULT_PUBLISH_LIMIT_DAILY = 3
export const TRIAL_DAYS = 14

/** Toggle this to show/hide yearly options in the UI */
export const ENABLE_ANNUAL_PLANS = true

export type BillingInterval = 'monthly' | 'yearly'

export const PLANS = {
    free: {
        initialAmount: 0,
        recurringAmount: 0,
        yearlyAmount: 0,
        currency: 'PHP' as const,
        label: 'Free',
        name: 'Free',
        description: 'Perfect for personal projects or small sites looking to get started.',
        features: ["Managed hosting included", "Subdomain access (name.site.ph)", "Single-page website (Home + legal pages)", "Industry-specific templates", "Mobile Responsive", "SSL Certificate"],
        highlight: false,
        comingSoon: false,
        publishLimit: 5,
        publishLimitDaily: 1,
        aiGenerationsLimit: 10,
    },
    basic: {
        initialAmount: 150000,   // ₱1,500 (Setup)
        recurringAmount: 49900,  // ₱499 (Monthly)
        yearlyAmount: 548900,    // ₱5,489 (Yearly — ~8% off / 1 month free)
        currency: 'PHP' as const,
        label: 'Basic',
        name: 'Basic',
        description: 'Great for growing businesses that need professional presence and analytics.',
        features: ["Everything in Free", "Multi-page website support", "Custom Domain connection", "Basic Analytics summary", "AI-Powered Content Editor", "Priority Technical Support", "1 Month Free Monthly Care"],
        highlight: true,
        note: "Setup fee includes first month maintenance.",
        comingSoon: false,
        publishLimit: 10,
        publishLimitDaily: 1,
        aiGenerationsLimit: 50,
    },
    pro: {
        initialAmount: 250000,   // ₱2,500 (Setup)
        recurringAmount: 99900,  // ₱999 (Monthly)
        yearlyAmount: 1098900,   // ₱10,989 (Yearly — ~8% off / 1 month free)
        currency: 'PHP' as const,
        label: 'Pro',
        name: 'Pro',
        description: 'Advanced features for businesses that want deep insights and maximum growth.',
        features: ["Everything in Basic", "Multi-page website support", "Advanced Conversion Analytics", "Section Heatmaps", "SEO Audit & Optimization", "Priority Support", "1 Month Free Monthly Care"],
        highlight: false,
        note: "Setup fee includes first month maintenance.",
        comingSoon: false,
        publishLimit: 50,
        publishLimitDaily: 3,
        aiGenerationsLimit: 9999,
    },
    ecommerce: {
        initialAmount: 350000,   // ₱3,500 (Setup)
        recurringAmount: 149900, // ₱1,499 (Monthly)
        yearlyAmount: 1648900,   // ₱16,489 (Yearly — ~8% off / 1 month free)
        currency: 'PHP' as const,
        label: 'E-commerce',
        name: 'E-commerce',
        description: 'Full online store capabilities to sell products directly to your customers.',
        features: ["Everything in Pro", "Multi-page website support", "Product Inventory Management", "Online Payment Integration", "Order Tracking", "1 Month Free Monthly Care", "Coming Soon"],
        highlight: false,
        comingSoon: true,
        note: "Setup fee includes first month maintenance.",
        publishLimit: 100,
        publishLimitDaily: 10,
        aiGenerationsLimit: 9999,
    },
    // Legacy / Default fallback
    ph_monthly: {
        initialAmount: 500000,   // ₱5,000
        recurringAmount: 50000,  // ₱500
        yearlyAmount: 500000,
        currency: 'PHP' as const,
        label: 'Direct Publish',
        name: 'EstabWeb Monthly',
        description: 'Legacy monthly plan',
        features: [],
        highlight: false,
        comingSoon: false,
        publishLimit: DEFAULT_PUBLISH_LIMIT,
        publishLimitDaily: DEFAULT_PUBLISH_LIMIT_DAILY,
        aiGenerationsLimit: 50,
    },
} as const

export type PlanId = keyof typeof PLANS

export function getPlan(id: string) {
    return PLANS[id as PlanId] || PLANS.basic
}

export function resolveAmount(id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = getPlan(id)
    if (!isRecurring) return plan.initialAmount
    return interval === 'yearly' ? (plan as any).yearlyAmount : plan.recurringAmount
}

export function resolveDescription(id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = getPlan(id)
    const isYearly = interval === 'yearly'
    if (!isRecurring) return `${plan.name} — Initial Setup + ${isYearly ? '1 Year' : '1 Month'} Care`
    return `${plan.name} — ${isYearly ? 'Annual' : 'Monthly'} Care Renewal`
}

function resolvePlanFromDynamic(dynamicPlans: any, id: string) {
    return (dynamicPlans && (dynamicPlans[id] || dynamicPlans.basic))
        || PLANS[id as PlanId]
        || PLANS.basic
}

export function resolveAmountFromPlans(dynamicPlans: any, id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = resolvePlanFromDynamic(dynamicPlans, id)
    if (!isRecurring) return plan.initialAmount
    return interval === 'yearly' ? (plan as any).yearlyAmount : plan.recurringAmount
}

export function resolveDescriptionFromPlans(dynamicPlans: any, id: string, isRecurring: boolean = false, interval: BillingInterval = 'monthly') {
    const plan = resolvePlanFromDynamic(dynamicPlans, id)
    const isYearly = interval === 'yearly'
    if (!isRecurring) return `${plan.name} — Initial Setup + ${isYearly ? '1 Year' : '1 Month'} Care`
    return `${plan.name} — ${isYearly ? 'Annual' : 'Monthly'} Care Renewal`
}
