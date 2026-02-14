import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSubdomain } from '@/lib/codes'
import { GENRE_PRESETS } from '@/config/presets'
import { deepMerge } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { presetKey, projectId } = await req.json()
    console.log('[apply-preset] Request:', { presetKey, projectId })
    
    if (!presetKey) return NextResponse.json({ error: 'Missing preset key' }, { status: 400 })

    const preset = GENRE_PRESETS[presetKey.toLowerCase()]
    if (!preset) {
      console.error('[apply-preset] Invalid preset key:', presetKey)
      return NextResponse.json({ error: 'Invalid preset key' }, { status: 404 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 0) Ensure profile exists (it might be missing if user was created before the trigger was active)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (!profile) {
      console.log('[apply-preset] Profile missing for user, creating one...', user.id)
      const { error: profErr } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email, role: 'client' })
      
      if (profErr) {
        console.error('[apply-preset] Failed to create missing profile:', profErr)
        return NextResponse.json({ error: 'User profile initialization failed' }, { status: 500 })
      }
    }

    // 1) Prepare the full config based on the preset
    const presetConfig = {
      theme: preset.theme,
      colorTheme: preset.colorTheme,
      typographyStyle: preset.typographyStyle || 'elegant',
      activeSections: preset.activeSections,
      ...preset.content
    }

    // 2) Resolve project
    let project = null as any
    if (projectId) {
      const { data: p, error: pErr } = await supabase
        .from('projects')
        .select('id,current_config,subdomain')
        .eq('id', projectId)
        .single()
      
      if (pErr || !p) {
        console.error('[apply-preset] Project not found:', projectId, pErr)
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      project = p
    } else {
      const subdomain = generateSubdomain(user.email || 'user')
      const { data: newProj, error: newErr } = await supabase
        .from('projects')
        .insert({ 
          current_config: {}, 
          draft_config: {}, 
          client_id: user.id,
          subdomain
        })
        .select('id,current_config,subdomain')
        .single()
      
    if (newErr || !newProj) {
      console.error('[apply-preset] Failed to create project:', newErr)
      return NextResponse.json({ 
        error: 'Failed to create project', 
        details: newErr?.message,
        hint: newErr?.hint,
        code: newErr?.code 
      }, { status: 400 })
    }
    project = newProj
  }

  // 3) Merge preset config
  const existing = (project.current_config ?? {}) as Record<string, unknown>
  const next = deepMerge(existing, presetConfig as any)

  const updatePayload: any = {
    current_config: next,
    draft_config: next
  }

  // Update subdomain if not set
  if (!project.subdomain) {
    const brandName = (next as any)?.brand?.name
    updatePayload.subdomain = generateSubdomain(brandName || user.email || 'user')
  }

  const { error: upErr } = await supabase
    .from('projects')
    .update(updatePayload)
    .eq('id', project.id)
  
  if (upErr) {
    console.error('[apply-preset] Failed to update project:', upErr)
    return NextResponse.json({ 
      error: 'Failed to update project',
      details: upErr.message,
      hint: upErr.hint,
      code: upErr.code
    }, { status: 400 })
  }

    return NextResponse.json({ success: true, applied: next, projectId: project.id })
  } catch (e: any) {
    console.error('[apply-preset] Critical error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to apply preset' }, { status: 500 })
  }
}
