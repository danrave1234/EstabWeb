import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPlansConfig } from '@/lib/plans-config-server'
import { resolveAmountFromPlans, resolveDescriptionFromPlans } from '@/lib/plans-config'

const PAYMONGO_API = 'https://api.paymongo.com/v1'

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })

    const { projectId, planId = 'ph_monthly', interval = 'monthly', successUrl } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proj } = await supabase

      .from('projects')
      .select('id, client_id, subscription_status, has_paid_initial, subscription_plan_id')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if ((proj.subscription_status || 'free') === 'active') {
      return NextResponse.json({ error: 'Project already has an active subscription' }, { status: 400 })
    }

    // ── PLAN LOCKING ────────────────────────────────────────────────────────
    let activePlanId = proj.subscription_plan_id || planId
    if (planId && !proj.subscription_plan_id) {
      await supabase.from('projects').update({ subscription_plan_id: planId }).eq('id', projectId)
      activePlanId = planId
    }
    // ────────────────────────────────────────────────────────────────────────

    const { PLANS } = await getPlansConfig()
    const plan = PLANS[activePlanId as keyof typeof PLANS] || PLANS.basic

    // Determine price and description based on shared config
    const amount = resolveAmountFromPlans(PLANS, activePlanId, !!proj.has_paid_initial, interval)
    const description = resolveDescriptionFromPlans(PLANS, activePlanId, !!proj.has_paid_initial, interval)





    const auth = Buffer.from(`${secret}:`).toString('base64')
    const res = await fetch(`${PAYMONGO_API}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount,
            currency: plan.currency,
            description: description,
            success_url: successUrl || undefined,
            metadata: {
              project_id: projectId,
              plan_id: planId,
              user_id: user.id,
              is_initial: !proj.has_paid_initial,
              interval: interval,
            },
          },
        },
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      const err = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || json?.message || 'PayMongo error'
      return NextResponse.json({ error: String(err) }, { status: res.status >= 400 ? res.status : 500 })
    }

    const checkoutUrl = json?.data?.attributes?.checkout_url
    const linkId = json?.data?.id
    if (!checkoutUrl || !linkId) return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 })

    await supabase.from('paymongo_links').insert({ link_id: linkId, project_id: projectId, plan_id: planId })

    return NextResponse.json({ checkoutUrl, linkId })

  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create payment link' }, { status: 500 })
  }
}
