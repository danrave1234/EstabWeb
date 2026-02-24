import { SupabaseClient } from '@supabase/supabase-js'

export type AuditAction = 'publish' | 'rollback' | 'preset_change' | 'domain_change' | 'change_request_submit' | 'change_request_approve' | 'change_request_reject'

export async function logAudit(
  supabase: SupabaseClient,
  action: AuditAction,
  performedBy: string,
  projectId: string | null,
  metadata: Record<string, unknown> = {}
) {
  const { error } = await supabase.from('audit_logs').insert({
    action,
    performed_by: performedBy,
    project_id: projectId,
    metadata,
  })
  if (error) {
    console.error('[audit] Failed to write audit log:', error.message)
  }
}
