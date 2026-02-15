import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY } from '@/lib/subscription'

const PAYMONGO_API = 'https://api.paymongo.com/v1'

const PLANS = {
  ph_monthly: { amount: 100000, currency: 'PHP' as const, label: '1 month direct publish' },  // ₱1,000
  ph_3months: { amount: 270000, currency: 'PHP' as const, label: '3 months direct publish' }, // ₱2,700 (10% off)
}

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })

    const { projectId, planId = 'ph_monthly' } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    const plan = PLANS[planId as keyof typeof PLANS] ?? PLANS.ph_monthly

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, subscription_status')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if ((proj.subscription_status || 'free') === 'active') {
      return NextResponse.json({ error: 'Project already has an active subscription' }, { status: 400 })
    }

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
            amount: plan.amount,
            currency: plan.currency,
            description: `EstabWeb: ${plan.label} - ${proj.subscription_status === 'free' ? 'Upgrade' : 'Renew'}`,
            metadata: {
              project_id: projectId,
              plan_id: planId,
              user_id: user.id,
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
