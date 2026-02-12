'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSectionKey } from '@/lib/utils/config-mapping'

const processChangeRequestSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['approved', 'rejected']),
  adminNote: z.string().optional(),
})

export async function processChangeRequest(
  requestId: string,
  action: 'approved' | 'rejected',
  adminNote?: string
) {
  const validated = processChangeRequestSchema.safeParse({ requestId, action, adminNote })
  if (!validated.success) {
    return { error: 'Invalid input' }
  }

  const supabase = await createClient()

  // Verify authorization
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  // 1. Get the request data
  const { data: request, error: fetchError } = await supabase
    .from('change_requests')
    .select('*, projects(*)')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) {
    return { error: 'Request not found' }
  }

  if (action === 'approved') {
    // Ensure project is an object
    const project = Array.isArray(request.projects) ? request.projects[0] : request.projects
    if (!project) return { error: 'Project data missing' }

    const sectionId = request.section_id
    const requestedChanges = request.requested_changes

    let newConfig: any

    if (!sectionId || sectionId === 'full-site') {
      // If no sectionId or 'full-site', this is a full site configuration snapshot
      newConfig = requestedChanges
    } else {
      // Deep clone current config for partial update
      newConfig = JSON.parse(JSON.stringify(project.current_config || {}))

      // Map section_id to config key
      const sectionKey = getSectionKey(sectionId);

      // Update the specific section
      newConfig[sectionKey] = {
        ...(newConfig[sectionKey] || {}),
        ...requestedChanges
      }
    }

    const nextVersion = (project.config_version || 0) + 1

    // Update project config and clear draft
    const { error: projectError } = await supabase
      .from('projects')
      .update({ 
        current_config: newConfig,
        draft_config: {}, // Clear draft once approved
        config_version: nextVersion
      })
      .eq('id', request.project_id)

    if (projectError) return { error: projectError.message }

    // Create a version snapshot
    await supabase
      .from('project_versions')
      .insert({
        project_id: request.project_id,
        version: nextVersion,
        snapshot: newConfig
      })
  }

  // 2. Update request status and note
  const { error: requestError } = await supabase
    .from('change_requests')
    .update({ 
      status: action,
      admin_note: adminNote || null,
      decided_at: new Date().toISOString(),
      decided_by: user.id
    })
    .eq('id', requestId)

  if (requestError) return { error: requestError.message }

  // 3. Live Sync / Revalidation
  // Revalidate the home page (where client sites render)
  revalidatePath('/')
  
  // Revalidate the specific site if domain is known
  const project = Array.isArray(request.projects) ? request.projects[0] : request.projects
  const domainParam = project?.subdomain || project?.custom_domain
  if (domainParam) {
    revalidatePath(`/${domainParam}`)
  }

  // Revalidate the admin dashboard and approvals page
  revalidatePath('/admin/dashboard', 'page')
  revalidatePath('/admin/approvals', 'page')

  return { success: true }
}
