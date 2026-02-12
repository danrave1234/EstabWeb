import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ReviewRequestClient from './ReviewRequestClient'

export const dynamic = 'force-dynamic'

export default async function RequestReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return redirect('/dashboard')

  // Fetch request with project and profiles
  const { data: request, error } = await supabase
    .from('change_requests')
    .select(`
      *,
      projects (
        *,
        profiles:client_id (
          email
        )
      ),
      profiles:requested_by (
        email
      )
    `)
    .eq('id', id)
    .single()

  if (error || !request) {
    console.error('Error fetching request:', error)
    return notFound()
  }

  return <ReviewRequestClient request={request} />
}
