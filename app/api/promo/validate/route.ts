import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { code, projectId } = await req.json()
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    const service = createServiceClient()
    const now = new Date().toISOString()

    const { data: promo, error } = await service
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('status', 'active')
      .single()

    if (error || !promo) return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 404 })
    if (promo.expires_at && promo.expires_at < now) return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 })
    if (promo.usage_count >= promo.max_uses) return NextResponse.json({ error: 'This promo code has reached its usage limit.' }, { status: 400 })

    // Check if user already redeemed this promo
    const { data: existing } = await service
      .from('promo_redemptions')
      .select('id')
      .eq('promo_id', promo.id)
      .eq('redeemed_by', user.id)
      .maybeSingle()

    if (existing) return NextResponse.json({ error: 'You have already used this promo code.' }, { status: 400 })

    return NextResponse.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        description: promo.description,
        plan_id: promo.plan_id,
        months: promo.months,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
