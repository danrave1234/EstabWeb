'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
    const project = request.projects
    const sectionId = request.section_id
    const requestedChanges = request.requested_changes

    // Deep clone current config
    const newConfig = JSON.parse(JSON.stringify(project.current_config))

    // Map section_id to config key
    const sectionKey = sectionId === 'hero-emergency' ? 'heroEmergency' : 
                       sectionId === 'practice-areas' ? 'practiceAreas' :
                       sectionId === 'attorney-profile' ? 'attorneyProfile' :
                       sectionId === 'free-consultation' ? 'freeConsultation' :
                       sectionId === 'how-it-works' ? 'howItWorks' :
                       sectionId === 'review-trust-bar' ? 'reviewTrustBar' :
                       sectionId === 'feature-highlight' ? 'featureHighlight' :
                       sectionId === 'team-carousel' ? 'teamCarousel' :
                       sectionId === 'patient-faq' ? 'patientFaq' :
                       sectionId === 'pricing' ? 'pricingTable' :
                       sectionId === 'awards' ? 'awardsStrip' :
                       sectionId;

    // Update the config
    newConfig[sectionKey] = {
      ...newConfig[sectionKey],
      ...requestedChanges
    }

    // Update project config
    const { error: projectError } = await supabase
      .from('projects')
      .update({ current_config: newConfig })
      .eq('id', request.project_id)

    if (projectError) return { error: projectError.message }
  }

  // 2. Update request status and note
  const { error: requestError } = await supabase
    .from('change_requests')
    .update({ 
      status: action,
      admin_note: adminNote || null
    })
    .eq('id', requestId)

  if (requestError) return { error: requestError.message }

  // 3. Live Sync / Revalidation
  // Revalidate the home page (where client sites render)
  revalidatePath('/')
  // Revalidate the admin dashboard
  revalidatePath('/admin-internal/dashboard', 'page')

  return { success: true }
}
