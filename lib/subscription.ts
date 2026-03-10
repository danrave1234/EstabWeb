/**
 * Subscription & publish logic.
 * - free: requires admin approval for publishes
 * - trial | active | admin_granted: can publish directly, subject to publish_limit
 * Note: Stripe is not available in Philippines. Use PayMongo for payments.
 */

export const DEFAULT_PUBLISH_LIMIT = 50
export const DEFAULT_PUBLISH_LIMIT_DAILY = 3
export const TRIAL_DAYS = 14

export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'admin_granted'
export type PlanType = 'free' | 'basic' | 'pro' | 'ecommerce' | 'custom'

export interface ProjectSubscription {
  subscription_status?: string | null
  subscription_plan_id?: PlanType | string | null
  trial_ends_at?: string | null
  subscription_ends_at?: string | null
  publish_limit?: number | null
  publish_limit_daily?: number | null
  publish_count?: number | null
  publish_count_today?: number | null
  publish_date?: string | null
  publish_period_start?: string | null
}

/** Statuses that allow direct publish (no admin approval) */
const CAN_PUBLISH_DIRECTLY: SubscriptionStatus[] = ['trial', 'active', 'admin_granted']

export function getPlanType(project: ProjectSubscription): PlanType {
  return (project?.subscription_plan_id || 'free') as PlanType
}

export function isAnalyticsAllowed(project: ProjectSubscription): boolean {
  const plan = getPlanType(project)
  const status = (project?.subscription_status || 'free').toLowerCase() as SubscriptionStatus

  // Admin granted always has access
  if (status === 'admin_granted') return true

  // Must be on an active/trial subscription — expired or free status loses access
  if (!['active', 'trial'].includes(status)) return false

  // Only basic, pro, and ecommerce have analytics. Free does not.
  // Trial users also get analytics if they are on a trial of a paid plan.
  return ['basic', 'pro', 'ecommerce', 'custom'].includes(plan)
}

/** Whether the plan has advanced analytics (Pro and above) */
export function hasAdvancedAnalytics(project: ProjectSubscription): boolean {
  const plan = getPlanType(project)
  const status = (project?.subscription_status || 'free').toLowerCase() as SubscriptionStatus
  // Must be on an active subscription (or admin_granted) to use advanced analytics
  if (!['active', 'trial', 'admin_granted'].includes(status)) return false
  return ['pro', 'ecommerce', 'custom'].includes(plan)
}

export function canPublishDirectly(project: ProjectSubscription): boolean {
  const status = (project?.subscription_status || 'free').toLowerCase() as SubscriptionStatus
  if (!CAN_PUBLISH_DIRECTLY.includes(status)) return false

  const now = new Date()

  // Trial: must be within trial period
  if (status === 'trial') {
    const endsAt = project.trial_ends_at ? new Date(project.trial_ends_at) : null
    if (endsAt && endsAt < now) return false
  }

  // Active: must be within subscription period (if set)
  if (status === 'active') {
    const endsAt = project.subscription_ends_at ? new Date(project.subscription_ends_at) : null
    if (endsAt && endsAt < now) return false
  }

  return true
}

/** Whether trial has expired */
export function isTrialExpired(project: ProjectSubscription): boolean {
  if ((project?.subscription_status || '').toLowerCase() !== 'trial') return false
  const endsAt = project.trial_ends_at ? new Date(project.trial_ends_at) : null
  return endsAt ? endsAt < new Date() : false
}

/** Get publish stats: period (50/month) + daily (3/day) */
export function getPublishStats(project: ProjectSubscription): {
  limit: number
  used: number
  remaining: number
  periodStart: Date
  limitDaily: number
  usedToday: number
  remainingToday: number
  publishDate: string | null
} {
  const limit = project?.publish_limit ?? DEFAULT_PUBLISH_LIMIT
  const used = project?.publish_count ?? 0
  const limitDaily = project?.publish_limit_daily ?? DEFAULT_PUBLISH_LIMIT_DAILY
  const periodStart = project?.publish_period_start
    ? new Date(project.publish_period_start)
    : new Date()
  const todayStr = new Date().toISOString().slice(0, 10)
  const publishDate = project?.publish_date ?? null
  const usedToday = publishDate === todayStr ? (project?.publish_count_today ?? 0) : 0
  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    periodStart,
    limitDaily,
    usedToday,
    remainingToday: Math.max(0, limitDaily - usedToday),
    publishDate,
  }
}

/** Whether the project can perform one more publish (checks both period and daily limits) */
export function canPublishNow(project: ProjectSubscription): boolean {
  if (!canPublishDirectly(project)) return false
  const { remaining, remainingToday } = getPublishStats(project)
  return remaining > 0 && remainingToday > 0
}

/** Pro-and-higher feature gate (pro, ecommerce, custom). */
export function hasProOrHigher(project: ProjectSubscription | null | undefined): boolean {
  if (!project) return false

  const plan = getPlanType(project)
  const status = (project?.subscription_status || "free").toLowerCase() as SubscriptionStatus

  // Admin-granted projects should retain premium feature access.
  if (status === "admin_granted") return true

  if (!["active", "trial"].includes(status)) return false
  return ["pro", "ecommerce", "custom"].includes(plan)
}

/** Whether the project is on a paid/active plan (custom domain + multipage allowed) */
export function isProPlan(project: ProjectSubscription | null | undefined): boolean {
  if (!project) return false
  return canPublishDirectly(project)
}
