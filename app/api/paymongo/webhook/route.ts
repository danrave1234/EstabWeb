import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY, getPlan } from '@/config/plans'
import { removeDomainFromVercel } from '@/lib/utils/vercel-domains'
import {
  computePeriodEnd,
  extractPaymongoEventId,
  extractPaymongoEventType,
  isHandledPaymongoEvent,
  verifyPaymongoSignature,
} from '@/lib/paymongo/webhook-utils'


// ---------------------------------------------------------------------------
// Signature verification — MANDATORY. Returns null on success, error string on failure.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Idempotency: record the event ID before processing.
// Returns true if this event was already processed (duplicate → skip).
// ---------------------------------------------------------------------------
async function markEventProcessed(
  eventId: string,
  eventType: string,
  supabase: ReturnType<typeof createServiceClient>,
): Promise<boolean> {
  if (!eventId) return false
  const { error } = await supabase
    .from('processed_webhook_events')
    .insert({ event_id: eventId, event_type: eventType })
  if (!error) return false

  // Unique violation means we already handled this event.
  if ((error as any).code === '23505') return true

  // Any other insert error should not block payment activation.
  console.error('[paymongo webhook] Failed to persist idempotency marker:', {
    eventId,
    eventType,
    code: (error as any).code,
    message: (error as any).message,
  })
  return false
}

// ---------------------------------------------------------------------------
// Project-ID extraction (metadata → paymongo_links → PayMongo API fetch)
// ---------------------------------------------------------------------------
async function extractProjectId(
  body: any,
  supabase: ReturnType<typeof createServiceClient>,
): Promise<string | null> {
  const eventType = body?.data?.attributes?.type || body?.type

  let data = body?.data?.attributes?.data
  let meta = data?.attributes?.metadata

  if (eventType === 'payment_intent.succeeded') {
    data = body?.data
    meta = data?.attributes?.metadata
    console.log('[paymongo webhook] payment_intent.succeeded meta:', meta)
  }

  // 1. Direct metadata
  if (meta?.project_id) return meta.project_id

  // 2. Look up via paymongo_links table (link_id stored at link-creation time)
  const linkId = data?.id?.startsWith('link_')
    ? data.id
    : body?.included?.find((i: any) => i?.type === 'link')?.id
  if (linkId) {
    console.log('[paymongo webhook] Searching paymongo_links for linkId:', linkId)
    const { data: row } = await supabase
      .from('paymongo_links')
      .select('project_id')
      .eq('link_id', linkId)
      .single()
    if (row?.project_id) {
      console.log('[paymongo webhook] Found project_id from linkId:', row.project_id)
      return row.project_id
    }
  }

  // 3. Last-resort: fetch from PayMongo API (only for direct pay_ IDs)
  const paymentId = data?.id?.startsWith('pay_') ? data.id : null
  if (paymentId) {
    try {
      console.log('[paymongo webhook] Fetching payment from PayMongo API:', paymentId)
      const r = await fetch(`https://api.paymongo.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64')}`,
        },
      })
      const j = await r.json()
      const fetchedMeta = j?.data?.attributes?.metadata
      if (fetchedMeta?.project_id) {
        console.log('[paymongo webhook] Found project_id via API:', fetchedMeta.project_id)
        return fetchedMeta.project_id
      }
    } catch (e) {
      console.error('[paymongo webhook] Error fetching payment from API:', e)
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
/** Compute period end — prefer payload dates, fall back to +1 month/year from now. */
/** Insert a payment row, ignoring duplicate paymongo_payment_id (idempotent). */
async function logPayment(
  supabase: ReturnType<typeof createServiceClient>,
  row: {
    project_id: string
    amount: number
    currency: string
    paymongo_payment_id?: string | null
    paymongo_link_id?: string | null
    metadata?: Record<string, unknown>
  },
) {
  try {
    await supabase.from('payments').upsert(
      {
        project_id: row.project_id,
        amount: row.amount,
        currency: row.currency,
        status: 'paid',
        paymongo_payment_id: row.paymongo_payment_id ?? null,
        paymongo_link_id: row.paymongo_link_id ?? null,
        metadata: row.metadata ?? {},
      },
      { onConflict: 'paymongo_payment_id', ignoreDuplicates: true },
    )
  } catch (logErr) {
    console.error('[paymongo webhook] Failed to log payment (non-fatal):', logErr)
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const raw = await req.text()
    const sig = req.headers.get('paymongo-signature')
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET

    // ── Signature verification is MANDATORY ──────────────────────────────
    if (!webhookSecret) {
      console.error('[paymongo webhook] PAYMONGO_WEBHOOK_SECRET is not set — rejecting request')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }
    const sigError = verifyPaymongoSignature(raw, sig, webhookSecret)
    if (sigError) {
      console.warn('[paymongo webhook] Signature verification failed:', sigError)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    // ─────────────────────────────────────────────────────────────────────

    const body = JSON.parse(raw)
    const eventType = extractPaymongoEventType(body)
    const eventId = extractPaymongoEventId(body)
    if (!isHandledPaymongoEvent(eventType)) {
      return NextResponse.json({ received: true })
    }

    let supabase: ReturnType<typeof createServiceClient>
    try {
      supabase = createServiceClient()
    } catch (e: any) {
      console.error('[paymongo webhook] Failed to initialise Supabase service client:', e.message)
      return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 })
    }

    // ── Idempotency guard — must run before any state mutation ───────────
    const alreadyProcessed = await markEventProcessed(eventId, eventType, supabase)
    if (alreadyProcessed) {
      console.log('[paymongo webhook] Duplicate event skipped:', eventId, eventType)
      return NextResponse.json({ received: true })
    }
    // ─────────────────────────────────────────────────────────────────────

    if (eventType === 'checkout_session.payment.paid') {
      return await handleCheckoutSessionPaid(body, supabase)
    }
    if (eventType === 'subscription.invoice.paid') {
      return await handleSubscriptionInvoicePaid(body, supabase)
    }
    if (eventType === 'subscription.unpaid') {
      return await handleSubscriptionUnpaid(body, supabase)
    }

    // ── link.payment.paid / payment.paid / payment_intent.succeeded ──────
    const projectId = await extractProjectId(body, supabase)
    console.log('[paymongo webhook] Extracted projectId:', projectId, 'for event:', eventType)

    if (!projectId) {
      console.warn('[paymongo webhook] No projectId in payload:', JSON.stringify(body, null, 2))
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
    const data = body?.data?.attributes?.data || body?.data
    const periodEnd = computePeriodEnd(data?.attributes)
    const planId =
      body?.data?.attributes?.data?.attributes?.metadata?.plan_id ||
      body?.data?.attributes?.metadata?.plan_id ||
      null
    const planConfig = planId ? getPlan(planId) : null

    const { error } = await supabase
      .from('projects')
      .update({
        subscription_status: 'active',
        subscription_ends_at: periodEnd.toISOString(),
        publish_limit: planConfig?.publishLimit ?? DEFAULT_PUBLISH_LIMIT,
        publish_limit_daily: planConfig?.publishLimitDaily ?? DEFAULT_PUBLISH_LIMIT_DAILY,
        publish_count: 0,
        publish_count_today: 0,
        publish_date: null,
        publish_period_start: now.toISOString(),
        trial_ends_at: null,
        auto_renew: true,
        subscription_plan_id: planId,
        subscription_interval:
          body?.data?.attributes?.data?.attributes?.metadata?.interval ||
          body?.data?.attributes?.metadata?.interval ||
          'monthly',
        has_paid_initial: true,
        renewal_link: null,
        renewal_link_id: null,
        renewal_link_created_at: null,
      })
      .eq('id', projectId)

    if (error) {
      console.error('[paymongo webhook] Project update failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await logPayment(supabase, {
      project_id: projectId,
      amount: data?.attributes?.amount ? data.attributes.amount / 100 : 0,
      currency: data?.attributes?.currency || 'PHP',
      paymongo_payment_id: data?.id,
      paymongo_link_id:
        data?.attributes?.reference_number ||
        data?.attributes?.external_reference_number ||
        null,
      metadata: { event_id: eventId, type: eventType, raw_amount: data?.attributes?.amount },
    })

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[paymongo webhook] Unhandled error:', e)
    return NextResponse.json({ error: e?.message || 'Webhook error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// checkout_session.payment.paid
// ---------------------------------------------------------------------------
async function handleCheckoutSessionPaid(
  body: any,
  supabase: ReturnType<typeof createServiceClient>,
): Promise<Response> {
  try {
    const sessionData = body?.data?.attributes?.data
    const meta = sessionData?.attributes?.metadata || body?.data?.attributes?.metadata
    let projectId: string | null = meta?.project_id || null

    // Fallback 1: session ID → paymongo_links
    if (!projectId) {
      const sessionId = sessionData?.id
      if (sessionId) {
        const { data: row } = await supabase
          .from('paymongo_links')
          .select('project_id')
          .eq('link_id', sessionId)
          .maybeSingle()
        projectId = row?.project_id || null
      }
    }

    // Fallback 2: payment IDs → paymongo_links
    if (!projectId) {
      const payments: any[] = sessionData?.attributes?.payments || []
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
    const basePeriodEnd = computePeriodEnd(sessionData?.attributes)
    const isUpgrade = meta?.is_upgrade === 'true'
    const remainingDays = isUpgrade ? Math.max(0, parseInt(meta?.remaining_days || '0', 10)) : 0
    const periodEnd = remainingDays > 0
      ? new Date(basePeriodEnd.getTime() + remainingDays * 24 * 60 * 60 * 1000)
      : basePeriodEnd
    const planId = meta?.plan_id || 'basic'
    const planConfig = getPlan(planId)

    const { error: updateError } = await supabase.from('projects').update({
      subscription_status: 'active',
      subscription_ends_at: periodEnd.toISOString(),
      has_paid_initial: true,
      auto_renew: true,
      renewal_link: null,
      renewal_link_id: null,
      renewal_link_created_at: null,
      publish_limit: planConfig.publishLimit,
      publish_limit_daily: planConfig.publishLimitDaily,
      publish_count: 0,
      publish_count_today: 0,
      publish_date: null,
      publish_period_start: now.toISOString(),
      trial_ends_at: null,
      subscription_plan_id: planId,
      subscription_interval: meta?.interval || 'monthly',
    }).eq('id', projectId)
    if (updateError) {
      console.error('[webhook] checkout_session.payment.paid: failed to update project:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    if (isUpgrade) {
      console.log(`[webhook] Upgrade activated: ${meta?.previous_plan_id} → ${planId}, carry-over: ${remainingDays}d, new end: ${periodEnd.toISOString()}`)
    }


    const payment = sessionData?.attributes?.payments?.[0]
    await logPayment(supabase, {
      project_id: projectId,
      amount: payment?.attributes?.amount ? payment.attributes.amount / 100 : 0,
      currency: 'PHP',
      paymongo_payment_id: payment?.id,
      paymongo_link_id: sessionData?.id,
      metadata: { event_type: 'checkout_session.payment.paid' },
    })

    console.log('[webhook] checkout_session.payment.paid: activated project', projectId)
    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[webhook] handleCheckoutSessionPaid error:', e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// subscription.invoice.paid
// ---------------------------------------------------------------------------
async function handleSubscriptionInvoicePaid(
  body: any,
  supabase: ReturnType<typeof createServiceClient>,
): Promise<Response> {
  try {
    const invoice = body?.data?.attributes?.data
    const subscriptionId = invoice?.attributes?.resource_id || invoice?.attributes?.subscription_id
    const amount = invoice?.attributes?.amount ? invoice.attributes.amount / 100 : 0
    const currency = invoice?.attributes?.currency || 'PHP'

    if (!subscriptionId) {
      console.warn('[webhook] subscription.invoice.paid: no subscription_id')
      return NextResponse.json({ received: true })
    }

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, subscription_plan_id')
      .eq('paymongo_subscription_id', subscriptionId)
      .single()

    if (!proj) {
      console.warn('[webhook] subscription.invoice.paid: no project for subscription', subscriptionId)
      return NextResponse.json({ received: true })
    }

    const now = new Date()
    const periodEnd = computePeriodEnd(invoice?.attributes)
    const planId = (proj.subscription_plan_id || 'basic') as string
    const planConfig = getPlan(planId)

    const { error: updateError } = await supabase.from('projects').update({
      subscription_status: 'active',
      subscription_ends_at: periodEnd.toISOString(),
      has_paid_initial: true,
      auto_renew: true,
      renewal_link: null,
      renewal_link_id: null,
      renewal_link_created_at: null,
      publish_limit: planConfig.publishLimit ?? DEFAULT_PUBLISH_LIMIT,
      publish_limit_daily: planConfig.publishLimitDaily ?? DEFAULT_PUBLISH_LIMIT_DAILY,
      publish_count: 0,
      publish_count_today: 0,
      publish_date: null,
      publish_period_start: now.toISOString(),
    }).eq('id', proj.id)
    if (updateError) {
      console.error('[webhook] subscription.invoice.paid: failed to update project:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    await logPayment(supabase, {
      project_id: proj.id,
      amount,
      currency,
      paymongo_payment_id: invoice?.id,
      paymongo_link_id: subscriptionId,
      metadata: { event_type: 'subscription.invoice.paid', subscription_id: subscriptionId },
    })

    console.log('[webhook] subscription.invoice.paid: renewed project', proj.id)
    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[webhook] handleSubscriptionInvoicePaid error:', e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// subscription.unpaid
// ---------------------------------------------------------------------------
async function handleSubscriptionUnpaid(
  body: any,
  supabase: ReturnType<typeof createServiceClient>,
): Promise<Response> {
  try {
    const subscription = body?.data?.attributes?.data
    const subscriptionId = subscription?.id

    if (!subscriptionId) return NextResponse.json({ received: true })

    const { data: proj } = await supabase
      .from('projects')
      .select('id, custom_domain')
      .eq('paymongo_subscription_id', subscriptionId)
      .single()

    if (!proj) return NextResponse.json({ received: true })

    // Remove custom domain from Vercel immediately on non-payment
    if (proj.custom_domain) {
      await removeDomainFromVercel(proj.custom_domain)
    }

    const { error: updateError } = await supabase.from('projects').update({
      subscription_status: 'free',
      subscription_plan_id: 'free',
      custom_domain: null,
      auto_renew: false,
      publish_limit: 5,
      publish_limit_daily: 1,
    }).eq('id', proj.id)
    if (updateError) {
      console.error('[webhook] subscription.unpaid: failed to downgrade project:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    console.log('[webhook] subscription.unpaid: downgraded project to free', proj.id)
    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[webhook] handleSubscriptionUnpaid error:', e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}
