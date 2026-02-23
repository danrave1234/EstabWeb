import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PAYMONGO_API = 'https://api.paymongo.com/v1'

/**
 * Server-side attach: keeps the secret key off the client.
 * Body: { paymentIntentId, paymentMethodId, clientKey, returnUrl }
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })

    // Must be authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { paymentIntentId, paymentMethodId, returnUrl } = await req.json()
    if (!paymentIntentId || !paymentMethodId) {
      return NextResponse.json({ error: 'Missing paymentIntentId or paymentMethodId' }, { status: 400 })
    }

    const auth = Buffer.from(`${secret}:`).toString('base64')

    const res = await fetch(`${PAYMONGO_API}/payment_intents/${paymentIntentId}/attach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: paymentMethodId,
            return_url: returnUrl,
          },
        },
      }),
    })

    const json = await res.json()
    if (!res.ok) {
      const msg = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || 'Attach failed'
      return NextResponse.json({ error: String(msg) }, { status: res.status >= 400 ? res.status : 500 })
    }

    const status = json?.data?.attributes?.status
    const nextActionUrl = json?.data?.attributes?.next_action?.redirect?.url

    return NextResponse.json({ status, nextActionUrl })
  } catch (e: any) {
    console.error('[attach-payment-method]', e)
    return NextResponse.json({ error: e?.message || 'Attach failed' }, { status: 500 })
  }
}
