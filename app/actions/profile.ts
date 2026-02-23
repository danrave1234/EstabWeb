'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  full_name: z.string().max(100, 'Name must be 100 characters or less').optional(),
  phone: z.string().max(30, 'Phone must be 30 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
})

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated' }

  const raw = {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    bio: formData.get('bio') as string,
  }

  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.full_name || null,
      phone: parsed.data.phone || null,
      bio: parsed.data.bio || null,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/profile')
  return { success: 'Profile updated successfully.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated' }

  const raw = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = passwordSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { error: error.message }

  return { success: 'Password updated successfully.' }
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null

  const { data } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, phone, bio, created_at')
    .eq('id', user.id)
    .single()

  return data
}
