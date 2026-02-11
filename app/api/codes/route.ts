import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateTemplateCode } from '@/lib/codes'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { label, payload, preset_key, expires_at, max_uses = 1, prefix } = body || {}

    const expiresIso = expires_at
      ? new Date(expires_at).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const code = generateTemplateCode(prefix)

    const { error } = await supabase.from('template_codes').insert({
      code,
      label: label ?? null,
      payload,
      preset_key: preset_key ?? null,
      created_by: user.id,
      expires_at: expiresIso,
      max_uses,
      status: 'active',
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ code })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create code' }, { status: 500 })
  }
}
