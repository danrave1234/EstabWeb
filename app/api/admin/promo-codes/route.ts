import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'sub_admin'].includes(profile.role)) return null
  return user
}

function generatePromoCode(prefix?: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return prefix ? `${prefix.toUpperCase()}-${rand}` : rand
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const service = createServiceClient()
  const { data, error } = await service
    .from('promo_codes')
    .select('*, promo_redemptions(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { description, plan_id = 'basic', months = 1, max_uses = 1, expires_at, prefix } = body

  if (!['basic', 'pro', 'ecommerce', 'custom'].includes(plan_id)) {
    return NextResponse.json({ error: 'Invalid plan_id' }, { status: 400 })
  }

  const code = generatePromoCode(prefix)
  const service = createServiceClient()
  const { data, error } = await service
    .from('promo_codes')
    .insert({ code, description, plan_id, months, max_uses, expires_at: expires_at || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const allowed = ['description', 'plan_id', 'months', 'max_uses', 'expires_at', 'status']
  const update: any = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in fields) update[key] = fields[key]
  }

  const service = createServiceClient()
  const { data, error } = await service.from('promo_codes').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service.from('promo_codes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
