import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeConfig } from '@/lib/utils'
import { getMaxPagesForProject, getPlanLimits, isLegalPageSlug, normalizePagesWithDefaults } from '@/lib/utils/site-pages'

export async function POST(req: Request) {
  try {
    const { projectId, fullConfig } = await req.json()
    if (!projectId || typeof fullConfig !== 'object' || fullConfig === null) {
      return NextResponse.json({ error: 'Missing projectId or fullConfig' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proj, error } = await supabase
      .from('projects')
      .select('id, current_config, draft_config, subscription_status, trial_ends_at, subscription_ends_at')
      .eq('id', projectId)
      .single()

    if (error || !proj) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // Normalize the full snapshot before saving
    const next = normalizeConfig(fullConfig as Record<string, any>)

    const pages = normalizePagesWithDefaults((next as any)?.pages)
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

    if (pages.length > 0) {
      (next as any).pages = pages
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
