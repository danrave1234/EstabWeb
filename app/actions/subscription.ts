'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleAutoRenew(projectId: string, autoRenew: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify ownership
  const { data: proj, error: fetchErr } = await supabase
    .from('projects')
    .select('id, client_id')
    .eq('id', projectId)
    .single()

  if (fetchErr || !proj || proj.client_id !== user.id) {
    return { error: 'Project not found or access denied' }
  }

  const { error } = await supabase
    .from('projects')
    .update({ auto_renew: autoRenew })
    .eq('id', projectId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function cancelSubscription(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify ownership
  const { data: proj, error: fetchErr } = await supabase
    .from('projects')
    .select('id, client_id')
    .eq('id', projectId)
    .single()

  if (fetchErr || !proj || proj.client_id !== user.id) {
    return { error: 'Project not found or access denied' }
  }

  // "Canceling" in this context means disabling auto-renew.
  // The subscription will remain active until subscription_ends_at.
  const { error } = await supabase
    .from('projects')
    .update({ auto_renew: false })
    .eq('id', projectId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
