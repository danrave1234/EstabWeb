import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getSectionKey } from '@/lib/utils/config-mapping'
import { generateSubdomain } from '@/lib/codes'
import { logAudit } from '@/lib/audit'
import { onChangeRequestResolved } from '@/lib/cache/invalidation'

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

    // Snapshot-based: requested_changes must be a full config snapshot for full-site requests
    let newConfig: Record<string, any>

    if (!sectionId || sectionId === 'full-site') {
      // Full snapshot replace — no merging
      newConfig = JSON.parse(JSON.stringify(requestedChanges || {}))
    } else {
      // Section-only update: apply section onto current config
      const base = JSON.parse(JSON.stringify(project.current_config || {}))
      const sectionKey = getSectionKey(cr.section_id)
      base[sectionKey] = { ...(base[sectionKey] || {}), ...requestedChanges }
      newConfig = base
    }

    const nextVersion = (project.config_version || 0) + 1
    const updatePayload: any = { 
      current_config: newConfig, 
      draft_config: null, // Clear draft once approved
      config_version: nextVersion
    }

    // NEW: If brand name was updated, also update the subdomain to match the brand name
    const oldBrandName = (project.current_config as any)?.brand?.name
    const newBrandName = (newConfig as any)?.brand?.name

    if (newBrandName && newBrandName !== oldBrandName) {
      updatePayload.subdomain = generateSubdomain(newBrandName)
    }

    // Apply to project (promote to live) and clear draft
    const { error: upProjErr } = await supabase
      .from('projects')
      .update(updatePayload)
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

    if (proj?.subdomain) revalidateTag(`site:${proj.subdomain}`, 'max')
    if (proj?.custom_domain) revalidateTag(`site:${proj.custom_domain}`, 'max')
    await onChangeRequestResolved({ projectId: cr.project_id, subdomain: proj?.subdomain, customDomain: proj?.custom_domain })
    revalidatePath('/(sites)/[domain]', 'page')
    revalidatePath('/(sites)/[domain]/[slug]', 'page')

    await logAudit(supabase, 'change_request_approve', user.id, cr.project_id, { requestId: id, version: nextVersion })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to approve change request' }, { status: 500 })
  }
}
