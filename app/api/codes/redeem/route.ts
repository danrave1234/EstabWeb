import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSubdomain } from '@/lib/codes'
import { normalizeConfig } from '@/lib/utils'
import { TRIAL_DAYS, DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY } from '@/lib/subscription'
import { addSubdomainToVercel } from '@/lib/utils/vercel-domains'

export async function POST(req: Request) {
  try {
    const { code, projectId } = await req.json()
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 0) Ensure profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (!profile) {
      console.log('[redeem] Profile missing for user, creating one...', user.id)
      await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email, role: 'client' })
    }

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
      const subdomain = generateSubdomain(user.email || 'user')
      const { data: newProj, error: newErr } = await supabase
        .from('projects')
        .insert({ 
          current_config: {}, 
          draft_config: {}, 
          client_id: user.id,
          subdomain
        })
        .select('id,current_config')
        .single()
      
      if (newErr || !newProj) {
        console.error('[redeem] Project creation failed:', newErr)
        return NextResponse.json({ 
          error: 'Failed to create project',
          details: newErr?.message,
          code: newErr?.code
        }, { status: 400 })
      }
      project = newProj
    }

    // 3) Payload is the full config snapshot — no merging
    const next = normalizeConfig((c.payload ?? {}) as Record<string, any>)

    const isNewProject = !projectId
    const trialEnds = new Date()
    trialEnds.setDate(trialEnds.getDate() + TRIAL_DAYS)

    // Ensure project has a subdomain; new projects get free trial
    const updatePayload: any = {
      current_config: next,
      draft_config: next
    }
    if (isNewProject) {
      updatePayload.subscription_status = 'trial'
      updatePayload.trial_ends_at = trialEnds.toISOString()
      updatePayload.publish_limit = DEFAULT_PUBLISH_LIMIT
      updatePayload.publish_limit_daily = DEFAULT_PUBLISH_LIMIT_DAILY
      updatePayload.publish_count = 0
      updatePayload.publish_count_today = 0
      updatePayload.publish_period_start = new Date().toISOString()
      updatePayload.auto_renew = false
    }
    
    // Reset any pending change requests if applying a full template (optional, but cleaner)
    // await supabase.from('change_requests').delete().eq('project_id', project.id).eq('status', 'pending')
    
    // Fetch current subdomain to see if we need to set one
    const { data: currentProj } = await supabase
      .from('projects')
      .select('subdomain')
      .eq('id', project.id)
      .single()

    if (!currentProj?.subdomain && !updatePayload.subdomain) {
      // Use brand name if available in the template payload, otherwise fall back to email
      const brandName = (next as any)?.brand?.name
      updatePayload.subdomain = generateSubdomain(brandName || user.email || 'user')
    }

    // Register subdomain with Vercel automatically (fire-and-forget, non-blocking)
    const finalSubdomain = updatePayload.subdomain || currentProj?.subdomain
    if (finalSubdomain) {
      addSubdomainToVercel(finalSubdomain).catch((e) =>
        console.error('[redeem] Vercel domain registration error:', e)
      )
    }

    const { data: projBefore } = await supabase.from('projects').select('config_version').eq('id', project.id).single()
    const nextVersion = (projBefore?.config_version ?? 0) + 1
    ;(updatePayload as any).config_version = nextVersion

    const { error: upErr } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', project.id)
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    await supabase.from('project_versions').insert({
      project_id: project.id,
      version: nextVersion,
      snapshot: next,
    })

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
