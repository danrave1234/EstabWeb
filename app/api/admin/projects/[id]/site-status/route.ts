import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { removeDomainFromVercel } from '@/lib/utils/vercel-domains'
import { logAudit } from '@/lib/audit'

/**
 * PATCH /api/admin/projects/[id]/site-status
 *
 * Admin-only endpoint to manage a project's site visibility status.
 *
 * Allowed statuses:
 *   active   — site is live and publicly accessible
 *   disabled — site is temporarily offline (client or admin action)
 *   archived — site is soft-deleted; domain removed; only admin can restore
 *
 * Also supports:
 *   DELETE /api/admin/projects/[id]/site-status — permanently hard-deletes a project
 *
 * Body (PATCH): { status: 'active' | 'disabled' | 'archived', reason?: string }
 */

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401, user: null, supabase: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'sub_admin') {
    return { error: 'Forbidden', status: 403, user: null, supabase: null }
  }
  return { error: null, status: 200, user, supabase }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { error: authErr, status: authStatus, user, supabase } = await requireAdmin()
    if (authErr || !user || !supabase) {
      return NextResponse.json({ error: authErr }, { status: authStatus })
    }

    const body = await req.json()
    const { status, reason } = body as { status: string; reason?: string }

    const ALLOWED_STATUSES = ['active', 'disabled', 'archived']
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Use service client so admin can operate on any project regardless of RLS
    const serviceSupabase = createServiceClient()
    const { data: project, error: fetchErr } = await serviceSupabase
      .from('projects')
      .select('id, client_id, custom_domain, site_status')
      .eq('id', projectId)
      .single()

    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const currentStatus = project.site_status || 'active'

    const updatePayload: Record<string, unknown> = {
      site_status: status,
      site_status_updated_at: new Date().toISOString(),
      site_status_reason: reason ?? null,
    }

    // When archiving, remove custom domain from Vercel and clear it
    if (status === 'archived' && project.custom_domain) {
      updatePayload.custom_domain = null
      await removeDomainFromVercel(project.custom_domain)
    }

    const { error: updateErr } = await serviceSupabase
      .from('projects')
      .update(updatePayload)
      .eq('id', projectId)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // Audit log
    const actionMap: Record<string, 'site_disabled' | 'site_enabled' | 'site_archived' | 'site_restored'> = {
      disabled: 'site_disabled',
      active: currentStatus === 'archived' ? 'site_restored' : 'site_enabled',
      archived: 'site_archived',
    }
    await logAudit(supabase, actionMap[status], user.id, projectId, {
      previous_status: currentStatus,
      reason: reason ?? null,
      performed_by_admin: true,
    })

    return NextResponse.json({ success: true, site_status: status })
  } catch (e: any) {
    console.error('[admin/projects/site-status PATCH] Error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/projects/[id]/site-status
 *
 * Permanently hard-deletes a project. This is irreversible.
 * Removes the custom domain from Vercel before deletion.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { error: authErr, status: authStatus, user, supabase } = await requireAdmin()
    if (authErr || !user || !supabase) {
      return NextResponse.json({ error: authErr }, { status: authStatus })
    }

    const serviceSupabase = createServiceClient()
    const { data: project, error: fetchErr } = await serviceSupabase
      .from('projects')
      .select('id, custom_domain, subdomain')
      .eq('id', projectId)
      .single()

    if (fetchErr || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Remove custom domain from Vercel if present
    if (project.custom_domain) {
      await removeDomainFromVercel(project.custom_domain)
    }

    // Log before deleting (project_id will cascade to null in audit_logs)
    await logAudit(supabase, 'site_deleted', user.id, projectId, {
      subdomain: project.subdomain,
      custom_domain: project.custom_domain,
      performed_by_admin: true,
    })

    const { error: deleteErr } = await serviceSupabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, deleted: true })
  } catch (e: any) {
    console.error('[admin/projects/site-status DELETE] Error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
