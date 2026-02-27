import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getPlansConfig } from '@/lib/plans-config-server'
import { resolveAmountFromPlans, resolveDescriptionFromPlans } from '@/lib/plans-config'

const PAYMONGO_API = 'https://api.paymongo.com/v1'

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
      .select('id, client_id, subscription_status, has_paid_initial, subdomain, subscription_plan_id')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
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
    const isInitial = !proj.has_paid_initial
    const amount = resolveAmountFromPlans(PLANS, activePlanId, !isInitial, interval)
    const description = resolveDescriptionFromPlans(PLANS, activePlanId, !isInitial, interval)





    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://estabweb.com'
    const successUrl = `${origin}/dashboard?projectId=${projectId}&payment_success=true`
    const cancelUrl = `${origin}/subscribe/${projectId}`

    // Create a Checkout Session — PayMongo hosts the payment page, handles 3DS, etc.
    const res = await fetch(`${PAYMONGO_API}/checkout_sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader(),
      },
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
              plan_id: planId,
              is_initial: String(isInitial),
              interval: interval,
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

    // Store session ID so webhook can identify the project
    try {
      await supabase.from('paymongo_links').insert({
        link_id: sessionId,
        project_id: projectId,
        plan_id: planId,
      })
    } catch {
      // ignore duplicate key errors
    }

    return NextResponse.json({ checkoutUrl })

  } catch (e: any) {
    console.error('[setup-subscription]', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
