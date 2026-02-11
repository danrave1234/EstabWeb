import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')?.trim()
  if (!code) return NextResponse.json({ valid: false, error: 'Missing code' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('template_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (error || !data) return NextResponse.json({ valid: false, error: 'Invalid code' }, { status: 404 })

  const now = new Date()
  const expired = data.expires_at && new Date(data.expires_at) < now
  const capped = data.usage_count >= data.max_uses
  const active = data.status === 'active'

  return NextResponse.json({
    valid: active && !expired && !capped,
    status: data.status,
    expired,
    capped,
    label: data.label,
    preset_key: data.preset_key,
  })
}
