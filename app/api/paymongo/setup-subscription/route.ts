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

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYMONGO_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'PayMongo not configured' }, { status: 503 })

    const { projectId } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    // Auth check – must be the project owner
    const supabaseUser = await createClient()
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceClient()

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, subscription_status, has_paid_initial, subdomain')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const amount = proj.has_paid_initial ? MONTHLY_AMOUNT : INITIAL_AMOUNT
    const description = proj.has_paid_initial
      ? 'EstabWeb Monthly Subscription'
      : 'EstabWeb Initial Setup + First Month'

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
              name: 'EstabWeb',
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            cancel_url: cancelUrl,
            success_url: successUrl,
            description,
            line_items: [
              {
                currency: 'PHP',
                amount,
                description,
                name: proj.has_paid_initial ? 'Monthly Subscription' : 'Initial Setup + First Month',
                quantity: 1,
              },
            ],
            payment_method_types: ['card', 'gcash', 'paymaya'],
            metadata: {
              project_id: projectId,
              user_id: user.id,
              is_initial: String(!proj.has_paid_initial),
              plan_id: 'ph_monthly',
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
        plan_id: 'ph_monthly',
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
