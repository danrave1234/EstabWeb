import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getSectionKey } from '@/lib/utils/config-mapping'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Admin check (profiles.role === 'admin')
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Load change request
    const { data: cr, error: crErr } = await supabase
      .from('change_requests')
      .select('*, projects(*)')
      .eq('id', id)
      .single()

    if (crErr || !cr) return NextResponse.json({ error: 'Change request not found' }, { status: 404 })
    if (cr.status !== 'pending') return NextResponse.json({ error: 'Request is not pending' }, { status: 400 })

    const project = Array.isArray(cr.projects) ? cr.projects[0] : cr.projects
    if (!project) return NextResponse.json({ error: 'Project data missing' }, { status: 400 })

    const sectionId = cr.section_id
    const requestedChanges = cr.requested_changes

    let newConfig: any

    if (!sectionId || sectionId === 'full-site') {
      newConfig = requestedChanges
    } else {
      newConfig = JSON.parse(JSON.stringify(project.current_config || {}))
      const sectionKey = getSectionKey(cr.section_id)
      newConfig[sectionKey] = {
        ...(newConfig[sectionKey] || {}),
        ...requestedChanges
      }
    }

    const nextVersion = (project.config_version || 0) + 1

    // Apply to project (promote to live) and clear draft
    const { error: upProjErr } = await supabase
      .from('projects')
      .update({ 
        current_config: newConfig, 
        draft_config: {}, // Clear draft once approved
        config_version: nextVersion
      })
      .eq('id', cr.project_id)

    if (upProjErr) return NextResponse.json({ error: upProjErr.message }, { status: 400 })

    // Create a version snapshot
    await supabase
      .from('project_versions')
      .insert({
        project_id: cr.project_id,
        version: nextVersion,
        snapshot: newConfig
      })

    // Mark request approved
    const { error: upCrErr } = await supabase
      .from('change_requests')
      .update({ 
        status: 'approved', 
        decided_at: new Date().toISOString(),
        decided_by: user.id
      })
      .eq('id', id)

    if (upCrErr) return NextResponse.json({ error: upCrErr.message }, { status: 400 })

    // Invalidate the site cache for this project
    const { data: proj } = await supabase
      .from('projects')
      .select('subdomain,custom_domain')
      .eq('id', cr.project_id)
      .single()

    const domainParam = proj?.subdomain || proj?.custom_domain
    if (domainParam) {
      // Revalidate the public path served by middleware as /{domain}
      revalidatePath(`/${domainParam}`)
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to approve change request' }, { status: 500 })
  }
}
