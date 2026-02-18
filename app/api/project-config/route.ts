import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deepMerge } from '@/lib/utils'
import { getMaxPagesForProject, getPlanLimits, isLegalPageSlug, normalizePages } from '@/lib/utils/site-pages'

export async function POST(req: Request) {
  try {
    const { projectId, patch } = await req.json()
    if (!projectId || typeof patch !== 'object') {
      return NextResponse.json({ error: 'Missing projectId or patch' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Load project to get both current and draft configs
    const { data: proj, error } = await supabase
      .from('projects')
      .select('id, current_config, draft_config, subscription_status, trial_ends_at, subscription_ends_at')
      .eq('id', projectId)
      .single()

    if (error || !proj) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // If there's an existing draft, use it as the base. 
    // Otherwise, use the current_config as the base for the new draft.
    const hasDraft = proj.draft_config && Object.keys(proj.draft_config).length > 0
    const base = hasDraft ? (proj.draft_config as any) : (proj.current_config as any || {})
    
    const next = deepMerge(base, patch as Record<string, unknown>)

    const pages = normalizePages((next as any)?.pages)
    if (pages.length > 0) {
      const planLimits = await getPlanLimits(supabase)
      const maxPages = getMaxPagesForProject(proj, planLimits)
      const paidPages = pages.filter((page) => page.slug && !isLegalPageSlug(page.slug))
      if (paidPages.length > maxPages) {
        return NextResponse.json(
          { error: `Page limit exceeded (${paidPages.length}/${maxPages}).` },
          { status: 400 }
        )
      }
    }

    const { error: upErr } = await supabase
      .from('projects')
      .update({ draft_config: next })
      .eq('id', projectId)

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    return NextResponse.json({ success: true, draft: next })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to save project draft' }, { status: 500 })
  }
}
