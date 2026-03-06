import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getPlansConfig } from '@/lib/plans-config-server'
import { resolveAmountFromPlans, resolveDescriptionFromPlans } from '@/lib/plans-config'

const PAYMONGO_API = 'https://api.paymongo.com/v1'

/** Tier ranking — higher = more expensive plan */
const PLAN_TIER: Record<string, number> = {
  free: 0,
  basic: 1,
  ph_monthly: 1,
  pro: 2,
  ecommerce: 3,
}

function getPlanTier(planId: string): number {
  return PLAN_TIER[planId] ?? 1
}

function authHeader() {
  const secret = process.env.PAYMONGO_SECRET_KEY!
  return `Basic ${Buffer.from(`${secret}:`).toString('base64')}`
}

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })

    const { projectId, planId = 'ph_monthly', interval = 'monthly' } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    // Auth check – must be the project owner
    const supabaseUser = await createClient()
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceClient()

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, subscription_status, has_paid_initial, subdomain, subscription_plan_id, subscription_ends_at')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { PLANS } = await getPlansConfig()
    const isInitial = !proj.has_paid_initial
    const currentPlanId = proj.subscription_plan_id || 'free'
    const targetPlanId = planId

    // ── UPGRADE / DOWNGRADE (only when user has already paid at least once) ──
    if (!isInitial) {
      const currentTier = getPlanTier(currentPlanId)
      const targetTier = getPlanTier(targetPlanId)

      // ── DOWNGRADE: apply immediately, no payment needed ─────────────────
      if (targetTier < currentTier) {
        const newPlan = PLANS[targetPlanId as keyof typeof PLANS] || PLANS.basic
        const { error } = await supabase.from('projects').update({
          subscription_plan_id: targetPlanId,
          publish_limit: newPlan.publishLimit,
          publish_limit_daily: newPlan.publishLimitDaily,
          publish_count: 0,
          publish_count_today: 0,
          publish_date: null,
        }).eq('id', projectId)

        if (error) {
          console.error('[setup-subscription] Downgrade DB error:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`[setup-subscription] Downgraded project ${projectId}: ${currentPlanId} → ${targetPlanId}`)
        return NextResponse.json({ downgraded: true, plan: targetPlanId })
      }

      // ── UPGRADE: charge only the setup-fee difference ───────────────────
      if (targetTier > currentTier) {
        const currentPlan = PLANS[currentPlanId as keyof typeof PLANS] || PLANS.basic
        const newPlan = PLANS[targetPlanId as keyof typeof PLANS] || PLANS.pro

        // Setup-fee difference (e.g. Pro ₱2,500 − Basic ₱1,500 = ₱1,000)
        const upgradeAmount = Math.max(0, newPlan.initialAmount - currentPlan.initialAmount)

        // Carry over remaining days from the current paid period
        const now = new Date()
        const currentEnd = proj.subscription_ends_at ? new Date(proj.subscription_ends_at) : now
        const remainingMs = Math.max(0, currentEnd.getTime() - now.getTime())
        const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24))

        const description = `Upgrade ${currentPlan.name} → ${newPlan.name} — Setup Difference${remainingDays > 0 ? ` (+${remainingDays} days carry-over)` : ''}`

        const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://estabweb.com'
        const successUrl = `${origin}/dashboard?projectId=${projectId}&payment_success=true`
        const cancelUrl = `${origin}/subscribe/${projectId}`

        const res = await fetch(`${PAYMONGO_API}/checkout_sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
          body: JSON.stringify({
            data: {
              attributes: {
                billing: {
                  email: user.email,
                  name: user.user_metadata?.full_name || 'EstabWeb Customer',
                },
                send_email_receipt: true,
                show_description: true,
                show_line_items: true,
                cancel_url: cancelUrl,
                success_url: successUrl,
                description,
                line_items: [
                  {
                    currency: newPlan.currency,
                    amount: upgradeAmount,
                    description,
                    name: `Upgrade to ${newPlan.name}`,
                    quantity: 1,
                  },
                ],
                payment_method_types: ['card', 'gcash', 'paymaya'],
                metadata: {
                  project_id: projectId,
                  user_id: user.id,
                  plan_id: targetPlanId,
                  previous_plan_id: currentPlanId,
                  is_upgrade: 'true',
                  remaining_days: String(remainingDays),
                  interval,
                },
              },
            },
          }),
        })

        const json = await res.json()
        if (!res.ok) {
          const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'PayMongo error'
          console.error('[setup-subscription] Upgrade PayMongo error:', JSON.stringify(json))
          return NextResponse.json({ error: String(msg) }, { status: 502 })
        }

        const checkoutUrl: string = json.data.attributes.checkout_url
        const sessionId: string = json.data.id

        try {
          await supabase.from('paymongo_links').insert({
            link_id: sessionId,
            project_id: projectId,
            plan_id: targetPlanId,
          })
        } catch { /* ignore duplicate */ }

        console.log(`[setup-subscription] Upgrade checkout created: ${currentPlanId} → ${targetPlanId}, amount: ${upgradeAmount}, carry-over: ${remainingDays}d`)
        return NextResponse.json({ checkoutUrl })
      }

      // ── SAME PLAN: fall through to standard recurring renewal ───────────
    }
    // ────────────────────────────────────────────────────────────────────────

    // ── FIRST PAYMENT or SAME-PLAN RENEWAL ──────────────────────────────────
    const activePlanId = isInitial ? targetPlanId : currentPlanId

    if (isInitial) {
      await supabase.from('projects').update({ subscription_plan_id: activePlanId }).eq('id', projectId)
    }

    const plan = PLANS[activePlanId as keyof typeof PLANS] || PLANS.basic
    const amount = resolveAmountFromPlans(PLANS, activePlanId, !isInitial, interval)
    const description = resolveDescriptionFromPlans(PLANS, activePlanId, !isInitial, interval)

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://estabweb.com'
    const successUrl = `${origin}/dashboard?projectId=${projectId}&payment_success=true`
    const cancelUrl = `${origin}/subscribe/${projectId}`

    const res = await fetch(`${PAYMONGO_API}/checkout_sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: {
              email: user.email,
              name: user.user_metadata?.full_name || 'EstabWeb Customer',
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            cancel_url: cancelUrl,
            success_url: successUrl,
            description,
            line_items: [
              {
                currency: plan.currency,
                amount,
                description,
                name: plan.name,
                quantity: 1,
              },
            ],
            payment_method_types: ['card', 'gcash', 'paymaya'],
            metadata: {
              project_id: projectId,
              user_id: user.id,
              plan_id: activePlanId,
              is_initial: String(isInitial),
              interval,
            },
          },
        },
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'PayMongo error'
      console.error('[setup-subscription] PayMongo error:', JSON.stringify(json))
      return NextResponse.json({ error: String(msg) }, { status: 502 })
    }

    const checkoutUrl: string = json.data.attributes.checkout_url
    const sessionId: string = json.data.id

    try {
      await supabase.from('paymongo_links').insert({
        link_id: sessionId,
        project_id: projectId,
        plan_id: activePlanId,
      })
    } catch { /* ignore duplicate */ }

    return NextResponse.json({ checkoutUrl })

  } catch (e: any) {
    console.error('[setup-subscription]', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
