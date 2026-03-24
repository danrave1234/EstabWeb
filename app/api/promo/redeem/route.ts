import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { code, projectId } = await req.json()
    if (!code || !projectId) return NextResponse.json({ error: 'Missing code or projectId' }, { status: 400 })

    const service = createServiceClient()
    const now = new Date().toISOString()

    // Re-validate promo (atomic check)
    const { data: promo, error: promoErr } = await service
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('status', 'active')
      .single()

    if (promoErr || !promo) return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 404 })
    if (promo.expires_at && promo.expires_at < now) return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 })
    if (promo.usage_count >= promo.max_uses) return NextResponse.json({ error: 'This promo code has reached its usage limit.' }, { status: 400 })

    // Check project ownership
    const { data: proj } = await service
      .from('projects')
      .select('id, client_id, subscription_status')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
    if (proj.subscription_status === 'active') return NextResponse.json({ error: 'Project already has an active subscription.' }, { status: 400 })

    // Check if user already redeemed this promo
    const { data: existing } = await service
      .from('promo_redemptions')
      .select('id')
      .eq('promo_id', promo.id)
      .eq('redeemed_by', user.id)
      .maybeSingle()

    if (existing) return NextResponse.json({ error: 'You have already used this promo code.' }, { status: 400 })

    // Calculate subscription end date
    const endsAt = new Date()
    endsAt.setMonth(endsAt.getMonth() + promo.months)

    // Activate subscription on project
    const { error: updateErr } = await service
      .from('projects')
      .update({
        subscription_status: 'active',
        subscription_plan_id: promo.plan_id,
        subscription_ends_at: endsAt.toISOString(),
        auto_renew: false,
        has_paid_initial: true,
        publish_limit: 999,
        publish_limit_daily: 50,
      })
      .eq('id', projectId)

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

    // Record redemption
    await service.from('promo_redemptions').insert({
      promo_id: promo.id,
      redeemed_by: user.id,
      project_id: projectId,
    })

    // Increment usage count
    await service
      .from('promo_codes')
      .update({ usage_count: promo.usage_count + 1 })
      .eq('id', promo.id)

    return NextResponse.json({
      success: true,
      plan_id: promo.plan_id,
      months: promo.months,
      subscription_ends_at: endsAt.toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
