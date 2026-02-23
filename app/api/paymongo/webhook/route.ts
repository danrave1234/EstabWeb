import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY } from '@/lib/subscription'
import crypto from 'crypto'

async function extractProjectId(body: any, supabase: ReturnType<typeof createServiceClient>): Promise<string | null> {
  const eventType = body?.data?.attributes?.type || body?.type
  if (eventType !== 'link.payment.paid' && eventType !== 'payment.paid' && eventType !== 'payment_intent.succeeded') {
    return Promise.resolve(null)
  }

  // data depends on event type
  let data = body?.data?.attributes?.data
  let meta = data?.attributes?.metadata

  if (eventType === 'payment_intent.succeeded') {
    data = body?.data
    meta = data?.attributes?.metadata
    console.log('[paymongo webhook] payment_intent.succeeded meta:', meta)

    // NEW: Search for project_id in related objects if not in metadata directly
    if (!meta?.project_id) {
       const pmRef = data?.attributes?.metadata?.pm_reference_number
       if (pmRef) {
         console.log('[paymongo webhook] Found pm_reference_number in PI metadata:', pmRef)
       }
    }
  }

  if (meta?.project_id) {
    return Promise.resolve(meta.project_id)
  }

  const linkId = data?.id?.startsWith('link_') ? data.id : body?.included?.find((i: any) => i?.type === 'link')?.id
  if (linkId) {
    console.log('[paymongo webhook] Searching for linkId in database:', linkId)
    const { data: row } = await supabase.from('paymongo_links').select('project_id').eq('link_id', linkId).single()
    if (row?.project_id) {
      console.log('[paymongo webhook] Found project_id from linkId in DB:', row.project_id)
      return row.project_id
    }
  }

  // Fallback: Check external payment source if it's a direct payment from a link
  const paymentId = data?.id?.startsWith('pay_') ? data.id : null
  const isFromLink = data?.attributes?.origin === 'links' || eventType === 'link.payment.paid'
  
  if (paymentId && !meta?.project_id) {
    try {
      console.log('[paymongo webhook] Fetching payment details for ID:', paymentId)
      const r = await fetch(`https://api.paymongo.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Basic ${Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64')}` },
      })
      const j = await r.json()
      const fetchedMeta = j?.data?.attributes?.metadata
      if (fetchedMeta?.project_id) {
        console.log('[paymongo webhook] Found project_id in fetched payment metadata:', fetchedMeta.project_id)
        return fetchedMeta.project_id
      }
    } catch (e) {
      console.error('[paymongo webhook] Error fetching payment:', e)
    }
  }
  return Promise.resolve(null)
}

export async function POST(req: Request) {
  try {
    const raw = await req.text()
    const sig = req.headers.get('paymongo-signature')
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET

    if (webhookSecret && sig) {
      const parts = sig.split(',')
      const timestamp = parts.find((p) => p.startsWith('t='))?.slice(2)
      const v1 = parts.find((p) => p.startsWith('v1='))?.slice(3)
      if (timestamp && v1) {
        const payload = `${timestamp}.${raw}`
        const expected = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex')
        if (v1 !== expected) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }
      }
    }

    const body = JSON.parse(raw)
    const eventType = body?.data?.attributes?.type || body?.type
    const HANDLED_EVENTS = [
      'link.payment.paid',
      'payment.paid',
      'payment_intent.succeeded',
      'checkout_session.payment.paid',
      'subscription.invoice.paid',
      'subscription.unpaid',
    ]
    if (!HANDLED_EVENTS.includes(eventType)) {
      return NextResponse.json({ received: true })
    }

    let supabase: ReturnType<typeof createServiceClient>
    try {
      supabase = createServiceClient()
    } catch (e: any) {
      console.error('[paymongo webhook] Failed to initialize Supabase service client:', e.message)
      return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 })
    }
    // Handle checkout session payment
    if (eventType === 'checkout_session.payment.paid') {
      return await handleCheckoutSessionPaid(body, supabase)
    }

    // Handle subscription lifecycle events separately
    if (eventType === 'subscription.invoice.paid') {
      return await handleSubscriptionInvoicePaid(body, supabase)
    }
    if (eventType === 'subscription.unpaid') {
      return await handleSubscriptionUnpaid(body, supabase)
    }

    const projectId = await extractProjectId(body, supabase)
    console.log('[paymongo webhook] Extracted projectId:', projectId, 'from event:', eventType)
    
    if (!projectId) {
      console.warn('[paymongo webhook] No projectId found in payload:', JSON.stringify(body, null, 2))
      return NextResponse.json({ received: true })
    }
    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id')
      .eq('id', projectId)
      .single()

    if (!proj) {
      console.warn('[paymongo webhook] Project not found:', projectId)
      return NextResponse.json({ received: true })
    }

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const { error } = await supabase
      .from('projects')
      .update({
        subscription_status: 'active',
        subscription_ends_at: periodEnd.toISOString(),
        publish_limit: DEFAULT_PUBLISH_LIMIT,
        publish_limit_daily: DEFAULT_PUBLISH_LIMIT_DAILY,
        publish_count: 0,
        publish_count_today: 0,
        publish_date: null,
        publish_period_start: now.toISOString(),
        trial_ends_at: null,
        auto_renew: true, // Reset auto-renew on successful payment
        subscription_plan_id: body?.data?.attributes?.data?.attributes?.metadata?.plan_id || body?.data?.attributes?.metadata?.plan_id,
        has_paid_initial: true, // Mark as initial paid regardless of which link was used
        renewal_link: null,
        renewal_link_id: null,
        renewal_link_created_at: null,
      })
      .eq('id', projectId)

    if (error) {
      console.error('[paymongo webhook] Update failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log the payment in the transactions table
    try {
      const data = body?.data?.attributes?.data || body?.data
      const amount = data?.attributes?.amount ? data.attributes.amount / 100 : 0
      const currency = data?.attributes?.currency || 'PHP'
      const paymentId = data?.id
      const linkId = data?.attributes?.reference_number || data?.attributes?.external_reference_number

      await supabase.from('payments').insert({
        project_id: projectId,
        amount,
        currency,
        status: 'paid',
        paymongo_payment_id: paymentId,
        paymongo_link_id: linkId,
        metadata: {
          event_id: body.id,
          type: eventType,
          raw_amount: data?.attributes?.amount
        }
      })
    } catch (logErr) {
      console.error('[paymongo webhook] Failed to log payment:', logErr)
      // Don't fail the webhook if logging fails, as subscription was already updated
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[paymongo webhook]', e)
    return NextResponse.json({ error: e?.message || 'Webhook error' }, { status: 500 })
  }
}

async function handleCheckoutSessionPaid(
  body: any,
  supabase: ReturnType<typeof createServiceClient>
): Promise<Response> {
  try {
    const sessionData = body?.data?.attributes?.data
    // metadata can be on the session itself or nested under attributes
    const meta = sessionData?.attributes?.metadata || body?.data?.attributes?.metadata
    let projectId: string | null = meta?.project_id || null

    // Fallback: look up by session ID in paymongo_links
    if (!projectId) {
      const sessionId = sessionData?.id || body?.data?.attributes?.data?.id
      if (sessionId) {
        const { data: row } = await supabase
          .from('paymongo_links')
          .select('project_id')
          .eq('link_id', sessionId)
          .maybeSingle()
        projectId = row?.project_id || null
      }
    }

    // Second fallback: look up by payment reference in paymongo_links
    if (!projectId) {
      const payments = sessionData?.attributes?.payments || []
      for (const p of payments) {
        const payId = p?.id || p?.data?.id
        if (payId) {
          const { data: row } = await supabase
            .from('paymongo_links')
            .select('project_id')
            .eq('link_id', payId)
            .maybeSingle()
          if (row?.project_id) { projectId = row.project_id; break }
        }
      }
    }

    if (!projectId) {
      console.warn('[webhook] checkout_session.payment.paid: no project_id found')
      return NextResponse.json({ received: true })
    }

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    await supabase.from('projects').update({
      subscription_status: 'active',
      subscription_ends_at: periodEnd.toISOString(),
      has_paid_initial: true,
      auto_renew: true,
      renewal_link: null,
      renewal_link_id: null,
      renewal_link_created_at: null,
      publish_limit: DEFAULT_PUBLISH_LIMIT,
      publish_limit_daily: DEFAULT_PUBLISH_LIMIT_DAILY,
      publish_count: 0,
      publish_count_today: 0,
      publish_date: null,
      publish_period_start: now.toISOString(),
      trial_ends_at: null,
    }).eq('id', projectId)

    // Log payment
    try {
      const payment = sessionData?.attributes?.payments?.[0]
      const amount = payment?.attributes?.amount ? payment.attributes.amount / 100 : 0
      await supabase.from('payments').insert({
        project_id: projectId,
        amount,
        currency: 'PHP',
        status: 'paid',
        paymongo_payment_id: payment?.id,
        paymongo_link_id: sessionData?.id,
        metadata: { event_type: 'checkout_session.payment.paid' },
      })
    } catch (logErr) {
      console.error('[webhook] Failed to log checkout payment:', logErr)
    }

    console.log('[webhook] checkout_session.payment.paid: activated project', projectId)
    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[webhook] handleCheckoutSessionPaid error:', e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}

async function handleSubscriptionInvoicePaid(
  body: any,
  supabase: ReturnType<typeof createServiceClient>
): Promise<Response> {
  try {
    const invoice = body?.data?.attributes?.data
    const subscriptionId = invoice?.attributes?.resource_id || invoice?.attributes?.subscription_id
    const amount = invoice?.attributes?.amount ? invoice.attributes.amount / 100 : 0
    const currency = invoice?.attributes?.currency || 'PHP'

    if (!subscriptionId) {
      console.warn('[webhook] subscription.invoice.paid: no subscription_id in payload')
      return NextResponse.json({ received: true })
    }

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id')
      .eq('paymongo_subscription_id', subscriptionId)
      .single()

    if (!proj) {
      console.warn('[webhook] subscription.invoice.paid: no project for subscription', subscriptionId)
      return NextResponse.json({ received: true })
    }

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    await supabase.from('projects').update({
      subscription_status: 'active',
      subscription_ends_at: periodEnd.toISOString(),
      has_paid_initial: true,
      auto_renew: true,
      renewal_link: null,
      renewal_link_id: null,
      renewal_link_created_at: null,
      publish_limit: DEFAULT_PUBLISH_LIMIT,
      publish_limit_daily: DEFAULT_PUBLISH_LIMIT_DAILY,
    }).eq('id', proj.id)

    // Log payment
    try {
      await supabase.from('payments').insert({
        project_id: proj.id,
        amount,
        currency,
        status: 'paid',
        paymongo_payment_id: invoice?.id,
        paymongo_link_id: subscriptionId,
        metadata: { event_type: 'subscription.invoice.paid', subscription_id: subscriptionId },
      })
    } catch (logErr) {
      console.error('[webhook] Failed to log subscription payment:', logErr)
    }

    console.log('[webhook] subscription.invoice.paid: renewed project', proj.id)
    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[webhook] handleSubscriptionInvoicePaid error:', e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}

async function handleSubscriptionUnpaid(
  body: any,
  supabase: ReturnType<typeof createServiceClient>
): Promise<Response> {
  try {
    const subscription = body?.data?.attributes?.data
    const subscriptionId = subscription?.id

    if (!subscriptionId) return NextResponse.json({ received: true })

    const { data: proj } = await supabase
      .from('projects')
      .select('id')
      .eq('paymongo_subscription_id', subscriptionId)
      .single()

    if (!proj) return NextResponse.json({ received: true })

    await supabase.from('projects').update({
      subscription_status: 'expired',
      auto_renew: false,
    }).eq('id', proj.id)

    console.log('[webhook] subscription.unpaid: expired project', proj.id)
    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[webhook] handleSubscriptionUnpaid error:', e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}
