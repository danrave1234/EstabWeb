import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Load project draft (RLS should ensure ownership)
    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .select('id,draft_config')
      .eq('id', projectId)
      .single()

    if (projErr || !proj) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const snapshot = (proj.draft_config ?? {}) as Record<string, unknown>

    const { data: inserted, error: insErr } = await supabase
      .from('change_requests')
      .insert({
        project_id: projectId,
        requested_by: user.id, // Correct column name is requested_by per schema
        status: 'pending',
        requested_changes: snapshot,
        section_id: 'full-site' // Indicate this is a full draft snapshot
      })
      .select('id')
      .single()

    if (insErr || !inserted) {
      return NextResponse.json({ error: insErr?.message || 'Failed to create change request' }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: inserted.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to submit change request' }, { status: 500 })
  }
}
