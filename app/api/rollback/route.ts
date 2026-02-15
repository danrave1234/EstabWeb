import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const { projectId, version } = await req.json()
    if (!projectId || typeof version !== 'number') {
      return NextResponse.json({ error: 'Missing projectId or version' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .select('id, client_id, config_version, subdomain, custom_domain')
      .eq('id', projectId)
      .single()

    if (projErr || !proj || proj.client_id !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: versionRow, error: verErr } = await supabase
      .from('project_versions')
      .select('id, version, snapshot')
      .eq('project_id', projectId)
      .eq('version', version)
      .single()

    if (verErr || !versionRow) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    const snapshot = versionRow.snapshot as Record<string, unknown>
    const nextVersion = (proj.config_version ?? 0) + 1

    const { error: upErr } = await supabase
      .from('projects')
      .update({
        current_config: snapshot,
        draft_config: {},
        config_version: nextVersion,
      })
      .eq('id', projectId)

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    await supabase.from('project_versions').insert({
      project_id: projectId,
      version: nextVersion,
      snapshot,
    })

    const domainParam = proj.subdomain || proj.custom_domain
    if (domainParam) revalidatePath(`/${domainParam}`)

    return NextResponse.json({ success: true, version: nextVersion })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to rollback' }, { status: 500 })
  }
}
