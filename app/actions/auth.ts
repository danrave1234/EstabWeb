'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendNewUserAdminNotification } from '@/lib/email/admin-notification'
import { verifyRecaptchaToken } from '@/lib/security/recaptcha'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function login(formData: FormData) {
  const recaptchaToken = formData.get('recaptchaToken') as string | null
  if (recaptchaToken) {
    const recaptcha = await verifyRecaptchaToken(recaptchaToken, 'login')
    if (!recaptcha.success) {
      return { error: 'Bot check failed. Please try again.' }
    }
  }

  const validatedFields = authSchema.safeParse(Object.fromEntries(formData.entries()))
  
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()

  // Clear any existing session before signing in with new credentials
  await supabase.auth.signOut()

  const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()

  revalidatePath('/', 'layout')
  
  if (profile?.role === 'admin' || profile?.role === 'sub_admin') {
    redirect('/admin')
  }
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const recaptchaToken = formData.get('recaptchaToken') as string | null
  if (recaptchaToken) {
    const recaptcha = await verifyRecaptchaToken(recaptchaToken, 'signup')
    if (!recaptcha.success) {
      return { error: 'Bot check failed. Please try again.' }
    }
  }

  const validatedFields = authSchema.safeParse(Object.fromEntries(formData.entries()))
  
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const { email, password } = validatedFields.data
  const supabase = await createClient()

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback`,
    },
  })
  if (error) {
    if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
      return { error: 'An account with this email already exists. Try logging in instead.' }
    }
    return { error: error.message }
  }

  // Supabase silently returns a fake user with empty identities for duplicate emails
  // (to prevent email enumeration). Detect and surface it as a proper error.
  if (user && (!user.identities || user.identities.length === 0)) {
    return { error: 'An account with this email already exists. Try logging in instead.' }
  }

  if (user) {
    // We attempt to create the profile here as a backup to the DB trigger.
    // If the trigger worked, this upsert will just update the same data.
    // If the trigger failed or isn't set up, this will create the profile.
    const { error: profileError } = await supabase.from('profiles').upsert({ 
      id: user.id, 
      email: user.email, 
      role: 'client' 
    })
    if (profileError) {
      console.error('Error creating/updating profile:', profileError)
    }
  }

  return { success: 'Check your email for the confirmation link.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
