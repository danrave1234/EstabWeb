import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSubdomain } from '@/lib/codes'

function deepMerge<T extends Record<string, any>>(a: T, b: T): T {
  const out: any = Array.isArray(a) ? [...a] : { ...a }
  for (const k of Object.keys(b)) {
    const av = (a as any)?.[k]
    const bv = (b as any)[k]
    if (
      av && bv &&
      typeof av === 'object' && typeof bv === 'object' &&
      !Array.isArray(av) && !Array.isArray(bv)
    ) {
      out[k] = deepMerge(av, bv)
    } else {
      out[k] = bv
    }
  }
  return out
}

export async function POST(req: Request) {
  try {
    const { code, projectId } = await req.json()
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1) Load template code
    const { data: c, error: codeErr } = await supabase
      .from('template_codes')
      .select('*')
      .eq('code', code)
      .single()

    if (codeErr || !c) return NextResponse.json({ error: 'Invalid code' }, { status: 404 })

    const now = new Date()
    const expired = c.expires_at && new Date(c.expires_at) < now
    const capped = c.usage_count >= c.max_uses
    const active = c.status === 'active'

    if (!active || expired || capped) {
      await supabase.from('code_redemptions').insert({
        code_id: c.id, redeemed_by: user.id, project_id: projectId ?? null,
        success: false, reason: !active ? 'revoked' : expired ? 'expired' : 'usage_cap'
      })
      return NextResponse.json({ error: 'Code not redeemable' }, { status: 400 })
    }

    // 2) Resolve project
    let project = null as any
    if (projectId) {
      const { data: p } = await supabase
        .from('projects')
        .select('id,current_config')
        .eq('id', projectId)
        .single()
      project = p
      if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    } else {
      // Optional: create a minimal project if not provided
      const { data: newProj, error: newErr } = await supabase
        .from('projects')
        .insert({ current_config: {}, draft_config: {}, client_id: user.id })
        .select('id,current_config')
        .single()
      if (newErr || !newProj) return NextResponse.json({ error: 'Failed to create project' }, { status: 400 })
      project = newProj
    }

    // 3) Merge payload into current_config (live baseline)
    const existing = (project.current_config ?? {}) as Record<string, unknown>
    const next = deepMerge(existing, (c.payload ?? {}) as Record<string, unknown>)

    // Ensure project has a subdomain
    const updatePayload: any = {
      current_config: next,
      draft_config: next
    }
    
    // Reset any pending change requests if applying a full template (optional, but cleaner)
    // await supabase.from('change_requests').delete().eq('project_id', project.id).eq('status', 'pending')
    
    // Fetch current subdomain to see if we need to set one
    const { data: currentProj } = await supabase
      .from('projects')
      .select('subdomain')
      .eq('id', project.id)
      .single()

    if (!currentProj?.subdomain) {
      updatePayload.subdomain = generateSubdomain(user.email || 'user')
    }

    const { error: upErr } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', project.id)
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    // 4) Audit + increment usage (fallback if RPC missing)
    await supabase.from('code_redemptions').insert({
      code_id: c.id, redeemed_by: user.id, project_id: project.id, success: true
    })

    const { error: rpcErr } = await supabase.rpc('increment_usage', { p_code_id: c.id })
    if (rpcErr) {
      await supabase.from('template_codes').update({ usage_count: (c.usage_count ?? 0) + 1 }).eq('id', c.id)
    }

    return NextResponse.json({ success: true, applied: next, projectId: project.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to redeem code' }, { status: 500 })
  }
}
