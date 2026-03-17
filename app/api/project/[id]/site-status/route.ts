import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { removeDomainFromVercel } from '@/lib/utils/vercel-domains'
import { logAudit } from '@/lib/audit'

/**
 * PATCH /api/project/[id]/site-status
 *
 * Allows an authenticated client to change the visibility of their own website.
 *
 * Allowed transitions by clients:
 *   active   → disabled  (take site offline temporarily)
 *   disabled → active    (bring site back online)
 *   active   → archived  (soft-delete; custom domain removed)
 *
 * Admins use /api/admin/projects/[id]/site-status for all actions including restore from archive.
 *
 * Body: { action: 'disable' | 'enable' | 'archive', reason?: string }
 *
 * DELETE /api/project/[id]/site-status
 *
 * Permanently deletes an archived project owned by the authenticated client.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { action, reason } = body as { action: string; reason?: string }

    // Map action → target status
    const actionToStatus: Record<string, string> = {
      disable: 'disabled',
      enable: 'active',
      archive: 'archived',
    }
    const status = actionToStatus[action]
    if (!status) {
      return NextResponse.json(
        { error: `action must be one of: ${Object.keys(actionToStatus).join(', ')}` },
        { status: 400 }
      )
    }

    // Fetch and verify ownership
    const { data: project, error: fetchErr } = await supabase
      .from('projects')
      .select('id, client_id, custom_domain, site_status')
      .eq('id', projectId)
      .single()
    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const currentStatus = project.site_status || 'active'

    // Clients cannot restore an archived site — only admins can
    if (currentStatus === 'archived' && status !== 'archived') {
      return NextResponse.json(
        { error: 'Archived sites can only be restored by an admin.' },
        { status: 403 }
      )
    }

    // Build update payload
    const updatePayload: Record<string, unknown> = {
      site_status: status,
      site_status_updated_at: new Date().toISOString(),
      site_status_reason: reason ?? null,
    }

    // When archiving, remove custom domain
    if (status === 'archived' && project.custom_domain) {
      updatePayload.custom_domain = null
      await removeDomainFromVercel(project.custom_domain)
    }

    const { error: updateErr } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', projectId)
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // Audit log
    const actionMap: Record<string, 'site_disabled' | 'site_enabled' | 'site_archived'> = {
      disabled: 'site_disabled',
      active: 'site_enabled',
      archived: 'site_archived',
    }
    await logAudit(supabase, actionMap[status], user.id, projectId, {
      previous_status: currentStatus,
      reason: reason ?? null,
    })

    return NextResponse.json({ success: true, site_status: status })
  } catch (e: unknown) {
    const err = e as Error
    console.error('[project/site-status PATCH] Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify ownership and archived status using session client
    const { data: project, error: fetchErr } = await supabase
      .from('projects')
      .select('id, client_id, custom_domain, site_status')
      .eq('id', projectId)
      .single()
    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (project.site_status !== 'archived') {
      return NextResponse.json(
        { error: 'Only archived sites can be permanently deleted. Archive the site first.' },
        { status: 400 }
      )
    }

    // Use service client for hard delete (bypasses RLS)
    const serviceClient = createServiceClient()
    const { error: deleteErr } = await serviceClient
      .from('projects')
      .delete()
      .eq('id', projectId)
    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message }, { status: 500 })
    }

    await logAudit(supabase, 'site_deleted', user.id, projectId, {
      deleted_by: 'client',
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const err = e as Error
    console.error('[project/site-status DELETE] Error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
