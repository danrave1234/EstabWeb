'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type LeadStatus = 'new' | 'contacted' | 'closed'

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('project_leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/leads')
  return { success: true }
}

export async function updateLeadNotes(leadId: string, notes: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('project_leads')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/leads')
  return { success: true }
}
