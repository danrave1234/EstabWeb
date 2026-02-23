import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const PAYMONGO_API = 'https://api.paymongo.com/v1'
const MONTHLY_AMOUNT = 50000   // ₱500 in centavos
const INITIAL_AMOUNT = 500000  // ₱5,000 in centavos
const PLAN_NAME = 'EstabWeb Monthly'
const PLAN_DESCRIPTION = 'Monthly website subscription – EstabWeb'

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

async function pmGet(path: string) {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    headers: { Authorization: authHeader() },
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'PayMongo error'
    throw new Error(String(msg))
  }
  return json
}

/** Get or create the shared monthly plan. Stores plan_id in env-level cache via DB. */
async function getOrCreatePlan(supabase: ReturnType<typeof createServiceClient>): Promise<string> {
  // Check if we already have a plan stored in any project row (use first found)
  const { data: existing } = await supabase
    .from('projects')
    .select('paymongo_plan_id')
    .not('paymongo_plan_id', 'is', null)
    .limit(1)
    .single()

  if (existing?.paymongo_plan_id) return existing.paymongo_plan_id

  // Create a new plan
  const json = await pmPost('/plans', {
    data: {
      attributes: {
        name: PLAN_NAME,
        description: PLAN_DESCRIPTION,
        amount: String(MONTHLY_AMOUNT),
        currency: 'PHP',
        interval: 'monthly',
        interval_count: '1',
      },
    },
  })
  return json.data.id as string
}

/** Get or create a PayMongo Customer for this user. */
async function getOrCreateCustomer(
  supabase: ReturnType<typeof createServiceClient>,
  projectId: string,
  email: string,
  name: string
): Promise<string> {
  const { data: proj } = await supabase
    .from('projects')
    .select('paymongo_customer_id')
    .eq('id', projectId)
    .single()

  if (proj?.paymongo_customer_id) return proj.paymongo_customer_id

  const json = await pmPost('/customers', {
    data: {
      attributes: {
        email,
        first_name: name || email,
        last_name: '',
        phone: '',
      },
    },
  })
  const customerId = json.data.id as string

  await supabase.from('projects').update({ paymongo_customer_id: customerId }).eq('id', projectId)
  return customerId
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
      .select('id, client_id, subscription_status, has_paid_initial, paymongo_customer_id, paymongo_subscription_id')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get user profile for customer creation
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    const email = profile?.email || user.email || ''
    const name = profile?.full_name || email

    // 1. Get or create plan
    const planId = await getOrCreatePlan(supabase)

    // 2. Get or create customer
    const customerId = await getOrCreateCustomer(supabase, projectId, email, name)

    // 3. Create subscription → PayMongo auto-generates first invoice + payment intent
    const subJson = await pmPost('/subscriptions', {
      data: {
        attributes: {
          customer_id: customerId,
          plan_id: planId,
          metadata: {
            project_id: projectId,
            user_id: user.id,
          },
        },
      },
    })

    const subscriptionId = subJson.data.id as string
    const paymentIntentId = subJson.data.attributes?.latest_invoice?.payment_intent?.id as string | undefined
    const clientKey = subJson.data.attributes?.latest_invoice?.payment_intent?.attributes?.client_key as string | undefined

    if (!paymentIntentId || !clientKey) {
      return NextResponse.json({ error: 'No payment intent returned from subscription' }, { status: 500 })
    }

    // Store subscription id and plan id
    await supabase.from('projects').update({
      paymongo_subscription_id: subscriptionId,
      paymongo_plan_id: planId,
    }).eq('id', projectId)

    // Determine amount for initial vs renewal
    const amount = proj.has_paid_initial ? MONTHLY_AMOUNT : INITIAL_AMOUNT

    // If initial payment, update the payment intent amount (create a new one at correct amount)
    // For initial: we use a regular payment intent (not subscription) for the setup fee
    // then subscription handles recurring ₱500/mo
    // For renewal (has_paid_initial=true): subscription PI is used directly
    let finalClientKey = clientKey
    let finalPaymentIntentId = paymentIntentId

    if (!proj.has_paid_initial) {
      // Create a separate one-time payment intent for the ₱5,000 setup fee
      const piJson = await pmPost('/payment_intents', {
        data: {
          attributes: {
            amount: INITIAL_AMOUNT,
            payment_method_allowed: ['card'],
            currency: 'PHP',
            description: 'EstabWeb: Initial Setup Fee',
            statement_descriptor: 'ESTABWEB SETUP',
            metadata: {
              project_id: projectId,
              plan_id: 'ph_monthly',
              user_id: user.id,
              is_initial: true,
              subscription_id: subscriptionId,
            },
          },
        },
      })
      finalPaymentIntentId = piJson.data.id
      finalClientKey = piJson.data.attributes.client_key
    } else {
      // Update PI metadata so webhook can identify project
      // (PayMongo doesn't allow updating PI metadata after creation, so we store in paymongo_links)
      await supabase.from('paymongo_links').upsert({
        link_id: paymentIntentId,
        project_id: projectId,
        plan_id: 'ph_monthly',
      }, { onConflict: 'link_id', ignoreDuplicates: true })
    }

    const returnUrl = successUrl || `${req.headers.get('origin') || ''}/dashboard?projectId=${projectId}&payment_success=true`

    return NextResponse.json({
      clientKey: finalClientKey,
      paymentIntentId: finalPaymentIntentId,
      subscriptionId,
      customerId,
      publicKey: process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY || process.env.PAYMONGO_PUBLIC_KEY,
      returnUrl,
      isInitial: !proj.has_paid_initial,
      amount,
    })
  } catch (e: any) {
    console.error('[setup-subscription]', e)
    return NextResponse.json({ error: e?.message || 'Failed to setup subscription' }, { status: 500 })
  }
}
