import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { removeDomainFromVercel } from '@/lib/utils/vercel-domains'
import { getPlan } from '@/config/plans'

const PAYMONGO_API = 'https://api.paymongo.com/v1'
const DAYS_BEFORE_EXPIRY = 3   // send renewal link 3 days before expiry

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = process.env.PAYMONGO_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })
  }

  const supabase = createServiceClient()

  // Find projects that:
  // 1. Have auto_renew = true
  // 2. Are currently active
  // 3. Expire within DAYS_BEFORE_EXPIRY days
  // 4. Don't already have a pending renewal link
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + DAYS_BEFORE_EXPIRY)

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, subdomain, subscription_plan_id, subscription_interval, subscription_ends_at, renewal_link_created_at')
    .eq('auto_renew', true)
    .eq('subscription_status', 'active')
    .lte('subscription_ends_at', cutoff.toISOString())
    .is('renewal_link', null)

  if (error) {
    console.error('[cron/renew-subscriptions] Query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!projects || projects.length === 0) {
    return NextResponse.json({ message: 'No projects need renewal', processed: 0 })
  }

  const auth = Buffer.from(`${secret}:`).toString('base64')
  const results: { projectId: string; status: string; checkoutUrl?: string; error?: string }[] = []

  for (const proj of projects) {
    try {
      const activePlanId = proj.subscription_plan_id || 'basic'
      const plan = getPlan(activePlanId)
      const interval = proj.subscription_interval === 'yearly' ? 'yearly' : 'monthly'
      const recurringAmount = interval === 'yearly'
        ? ((plan as any).yearlyAmount ?? plan.recurringAmount)
        : plan.recurringAmount
      const description = `EstabWeb: Monthly Renewal - ${proj.subdomain}`

      const res = await fetch(`${PAYMONGO_API}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              amount: recurringAmount,
              currency: 'PHP',
              description,
              metadata: {
                project_id: proj.id,
                plan_id: activePlanId,
                is_initial: false,
                interval,
                source: 'auto_renew_cron',
              },
            },
          },
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        const err = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'PayMongo error'
        console.error(`[cron/renew-subscriptions] PayMongo error for project ${proj.id}:`, err)
        results.push({ projectId: proj.id, status: 'error', error: String(err) })
        continue
      }

      const checkoutUrl = json?.data?.attributes?.checkout_url
      const linkId = json?.data?.id

      if (!checkoutUrl || !linkId) {
        results.push({ projectId: proj.id, status: 'error', error: 'No checkout URL returned' })
        continue
      }

      // Store the renewal link in the project row
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          renewal_link: checkoutUrl,
          renewal_link_id: linkId,
          renewal_link_created_at: new Date().toISOString(),
        })
        .eq('id', proj.id)

      if (updateError) {
        console.error(`[cron/renew-subscriptions] Update error for project ${proj.id}:`, updateError)
        results.push({ projectId: proj.id, status: 'error', error: updateError.message })
        continue
      }

      // Also log in paymongo_links table for tracking
      await supabase.from('paymongo_links').insert({
        link_id: linkId,
        project_id: proj.id,
        plan_id: activePlanId,
      })

      results.push({ projectId: proj.id, status: 'ok', checkoutUrl })
    } catch (e: any) {
      console.error(`[cron/renew-subscriptions] Exception for project ${proj.id}:`, e)
      results.push({ projectId: proj.id, status: 'error', error: e?.message || 'Unknown error' })
    }
  }

  const succeeded = results.filter(r => r.status === 'ok').length
  const failed = results.filter(r => r.status === 'error').length

  // --- Downgrade expired subscriptions ---
  // Find active/trial projects whose subscription has already expired
  const now = new Date().toISOString()
  const { data: expiredProjects, error: expiredError } = await supabase
    .from('projects')
    .select('id, subdomain, custom_domain, subscription_status, subscription_ends_at, trial_ends_at')
    .in('subscription_status', ['active', 'trial', 'expired'])
    .or(`subscription_ends_at.lt.${now},trial_ends_at.lt.${now}`)

  const downgradeResults: { projectId: string; status: string; domain?: string; error?: string }[] = []

  if (expiredError) {
    console.error('[cron/renew-subscriptions] Error fetching expired projects:', expiredError)
  }

  if (!expiredError && expiredProjects && expiredProjects.length > 0) {
    for (const proj of expiredProjects) {
      // Double-check: only downgrade if the relevant expiry date has passed
      const isActiveExpired =
        proj.subscription_status === 'active' &&
        proj.subscription_ends_at &&
        new Date(proj.subscription_ends_at) < new Date()
      const isTrialExpired =
        proj.subscription_status === 'trial' &&
        proj.trial_ends_at &&
        new Date(proj.trial_ends_at) < new Date()
      // Projects stuck in 'expired' limbo (set by webhook) always need downgrade cleanup
      const isWebhookExpired = proj.subscription_status === 'expired'

      if (!isActiveExpired && !isTrialExpired && !isWebhookExpired) continue

      try {
        // Remove custom domain from Vercel if set
        if (proj.custom_domain) {
          await removeDomainFromVercel(proj.custom_domain)
        }

        // Downgrade project: set status to free, clear custom_domain and reset plan/limits
        const { error: downgradeError } = await supabase
          .from('projects')
          .update({
            subscription_status: 'free',
            subscription_plan_id: 'free',
            custom_domain: null,
            publish_limit: 5,
            publish_limit_daily: 1,
            auto_renew: false,
          })
          .eq('id', proj.id)

        if (downgradeError) {
          console.error(`[cron/renew-subscriptions] Downgrade error for project ${proj.id}:`, downgradeError)
          downgradeResults.push({ projectId: proj.id, status: 'error', error: downgradeError.message })
        } else {
          console.log(`[cron/renew-subscriptions] Downgraded project ${proj.id} (${proj.subdomain}) to free`)
          downgradeResults.push({ projectId: proj.id, status: 'downgraded', domain: proj.custom_domain || undefined })
        }
      } catch (e: any) {
        console.error(`[cron/renew-subscriptions] Exception downgrading project ${proj.id}:`, e)
        downgradeResults.push({ projectId: proj.id, status: 'error', error: e?.message || 'Unknown error' })
      }
    }
  }

  return NextResponse.json({
    message: `Processed ${projects.length} projects: ${succeeded} succeeded, ${failed} failed. Downgraded ${downgradeResults.filter(r => r.status === 'downgraded').length} expired projects.`,
    processed: projects.length,
    succeeded,
    failed,
    results,
    downgraded: downgradeResults.filter(r => r.status === 'downgraded').length,
    downgradeResults,
  })
}
