import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proj } = await supabase
      .from('projects')
      .select('id, client_id, config_version')
      .eq('id', projectId)
      .single()

    if (!proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: versions, error } = await supabase
      .from('project_versions')
      .select('id, version, created_at')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
      .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const currentVersion = proj.config_version ?? 0
    return NextResponse.json({
      versions: (versions ?? []).map((v) => ({
        id: v.id,
        version: v.version,
        createdAt: v.created_at,
        isCurrent: v.version === currentVersion,
      })),
      currentVersion,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch versions' }, { status: 500 })
  }
}
