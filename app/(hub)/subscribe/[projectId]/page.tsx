import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import SubscribeCardForm from '@/components/dashboard/SubscribeCardForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function SubscribePage({ params }: Props) {
  const { projectId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const service = createServiceClient()
  const { data: proj } = await service
    .from('projects')
    .select('id, client_id, subdomain, subscription_status, has_paid_initial')
    .eq('id', projectId)
    .single()

  if (!proj || proj.client_id !== user.id) redirect('/dashboard')
  if (proj.subscription_status === 'active') redirect(`/dashboard?projectId=${projectId}`)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SubscribeCardForm
        projectId={projectId}
        subdomain={proj.subdomain}
        isInitial={!proj.has_paid_initial}
      />
    </div>
  )
}
