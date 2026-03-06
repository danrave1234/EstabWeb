import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import RequestReviewClient from './RequestReviewClient'

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

  // Fetch request with project — profiles join is done separately to avoid
  // notFound() when the requesting user's profile has been deleted
  const { data: request, error } = await supabase
    .from('change_requests')
    .select(`
      *,
      projects (*)
    `)
    .eq('id', id)
    .single()

  if (error || !request) {
    console.error('Error fetching request:', error)
    return notFound()
  }

  // Optionally enrich with requester email — non-fatal if missing
  let requesterEmail: string | null = null
  if (request.requested_by) {
    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', request.requested_by)
      .maybeSingle()
    requesterEmail = requesterProfile?.email ?? null
  }

  const enrichedRequest = {
    ...request,
    profiles: requesterEmail ? { email: requesterEmail } : null,
  }

  return <RequestReviewClient request={enrichedRequest} />
}
