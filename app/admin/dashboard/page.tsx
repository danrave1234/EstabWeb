import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardRequests from '@/components/admin/AdminDashboardRequests'
import AdminMetricsOverview from '@/components/admin/AdminMetricsOverview'
import { getAdminMetrics } from '@/lib/utils/admin-metrics'
import { Suspense } from 'react'

export default async function AdminRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // Admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return redirect('/dashboard')
  }

  // Only metrics block the main page render now (which is very fast due to caching)
  const metrics = await getAdminMetrics(supabase)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
            <p className="text-muted-foreground mt-2">
              Platform metrics and pending change requests.
            </p>
          </div>

          <AdminMetricsOverview metrics={metrics} />

          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Pending Approvals</h2>
            <Suspense fallback={<div className="h-48 border border-border rounded-2xl bg-muted/20 animate-pulse flex items-center justify-center text-sm text-muted-foreground">Loading pending requests...</div>}>
              <AdminDashboardRequests />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

