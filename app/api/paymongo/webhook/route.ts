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
  }

  if (meta?.project_id) {
    return Promise.resolve(meta.project_id)
  }

  const linkId = data?.id?.startsWith('link_') ? data.id : body?.included?.find((i: any) => i?.type === 'link')?.id
  if (linkId) {
    const { data: row } = await supabase.from('paymongo_links').select('project_id').eq('link_id', linkId).single()
    return row?.project_id ?? null
  }

  const paymentId = data?.id?.startsWith('pay_') ? data.id : null
  if (paymentId && data?.attributes?.origin === 'links') {
    try {
      const r = await fetch(`https://api.paymongo.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Basic ${Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64')}` },
      })
      const j = await r.json()
      return j?.data?.attributes?.metadata?.project_id ?? null
    } catch {
      return null
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
    if (eventType !== 'link.payment.paid' && eventType !== 'payment.paid' && eventType !== 'payment_intent.succeeded') {
      return NextResponse.json({ received: true })
    }

    const supabase = createServiceClient()
    const projectId = await extractProjectId(body, supabase)
    if (!projectId) {
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
      })
      .eq('id', projectId)

    if (error) {
      console.error('[paymongo webhook] Update failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('[paymongo webhook]', e)
    return NextResponse.json({ error: e?.message || 'Webhook error' }, { status: 500 })
  }
}
