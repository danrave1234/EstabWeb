import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const { projectId, patch } = await req.json()
    if (!projectId || typeof patch !== 'object') {
      return NextResponse.json({ error: 'Missing projectId or patch' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Load
    const { data: proj, error } = await supabase
      .from('projects')
      .select('id,draft_config')
      .eq('id', projectId)
      .single()

    if (error || !proj) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const existing = (proj.draft_config ?? {}) as Record<string, unknown>
    const next = deepMerge(existing, patch as Record<string, unknown>)

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
