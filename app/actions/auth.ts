'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function login(formData: FormData) {
  const validatedFields = authSchema.safeParse(Object.fromEntries(formData.entries()))
  
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  revalidatePath('/', 'layout')
  
  if (profile?.role === 'admin') {
    redirect('/admin')
  }
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const validatedFields = authSchema.safeParse(Object.fromEntries(formData.entries()))
  
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }

  if (user) {
    await supabase.from('profiles').insert({ id: user.id, email: user.email, role: 'client' })
  }

  return { success: 'Check your email for the confirmation link.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
