import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const PAYMONGO_API = 'https://api.paymongo.com/v1'
const MONTHLY_AMOUNT = 50000   // ₱500 in centavos
const INITIAL_AMOUNT = 500000  // ₱5,000 in centavos

function authHeader() {
  const secret = process.env.PAYMONGO_SECRET_KEY!
  return `Basic ${Buffer.from(`${secret}:`).toString('base64')}`
}

async function pmPost(path: string, body: object) {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'PayMongo error'
    throw new Error(String(msg))
  }
  return json
}

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })

    const { projectId, successUrl } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    // Auth check – must be the project owner
    const supabaseUser = await createClient()
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceClient()

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, subscription_status, has_paid_initial, paymongo_customer_id')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get or create a PayMongo Customer (required for setup_future_usage)
    let customerId: string = proj.paymongo_customer_id || ''
    if (!customerId) {
      const email = user.email
      const custJson = await pmPost('/customers', {
        data: {
          attributes: {
            email: email || `${user.id}@estabweb.com`,
            metadata: { project_id: projectId, user_id: user.id },
          },
        },
      })
      customerId = custJson.data.id
      await supabase.from('projects').update({ paymongo_customer_id: customerId }).eq('id', projectId)
    }

    const amount = proj.has_paid_initial ? MONTHLY_AMOUNT : INITIAL_AMOUNT
    const description = proj.has_paid_initial
      ? 'EstabWeb: Monthly Subscription'
      : 'EstabWeb: Initial Setup + First Month'

    // Create a PaymentIntent — setup_future_usage saves the card for future off-session charges
    const piJson = await pmPost('/payment_intents', {
      data: {
        attributes: {
          amount,
          payment_method_allowed: ['card'],
          currency: 'PHP',
          description,
          statement_descriptor: 'ESTABWEB',
          setup_future_usage: { session: 'off_session', customer_id: customerId },
          metadata: {
            project_id: projectId,
            user_id: user.id,
            is_initial: String(!proj.has_paid_initial),
            plan_id: 'ph_monthly',
          },
        },
      },
    })

    const paymentIntentId: string = piJson.data.id
    const clientKey: string = piJson.data.attributes.client_key

    // Store the payment intent link so webhook can identify the project
    await supabase.from('paymongo_links').upsert({
      link_id: paymentIntentId,
      project_id: projectId,
      plan_id: 'ph_monthly',
    }, { onConflict: 'link_id' })

    const returnUrl = successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://subscribe.estabweb.com'}/dashboard?projectId=${projectId}&payment_success=true`

    return NextResponse.json({
      paymentIntentId,
      clientKey,
      publicKey: process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY,
      returnUrl,
    })
  } catch (e: any) {
    console.error('[setup-subscription]', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
