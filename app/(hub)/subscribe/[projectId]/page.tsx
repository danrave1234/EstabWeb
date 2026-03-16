import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import SubscribeCardForm from '@/components/dashboard/SubscribeCardForm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Subscription Checkout',
  robots: {
    index: false,
    follow: false,
  },
}

import PlanPicker from '@/components/dashboard/PlanPicker'

import { getPlansConfig } from '@/lib/plans-config-server'

interface Props {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ planId?: string; interval?: string }>
}

export default async function SubscribePage({ params, searchParams }: Props) {
  const { projectId } = await params
  const { planId, interval } = await searchParams


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

  const plansConfig = await getPlansConfig()
  const requestedPlan = planId ? ((plansConfig.PLANS as any)?.[planId] ?? null) : null
  const isComingSoonPlan = planId === "ecommerce" || Boolean(requestedPlan?.comingSoon)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {!planId || isComingSoonPlan ? (
        <PlanPicker
          projectId={projectId}
          initialPlansConfig={plansConfig}
          notice={isComingSoonPlan ? "E-commerce plan is marked as soon available and cannot be purchased yet." : undefined}
        />
      ) : (
        <SubscribeCardForm
          projectId={projectId}
          subdomain={proj.subdomain}
          isInitial={!proj.has_paid_initial}
          planId={planId}
          interval={interval}
          initialPlansConfig={plansConfig}
        />
      )}
    </div>
  )
}


