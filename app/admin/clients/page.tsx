import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Globe, Users, Building2, TrendingUp } from 'lucide-react'
import ClientsTable from '@/components/admin/ClientsTable'
export const dynamic = 'force-dynamic'

interface ProfileRow {
  id: string
  email: string | null
  role: string | null
  avatar_url?: string | null
}

interface ProjectRow {
  id: string
  client_id: string | null
  subdomain: string | null
  custom_domain?: string | null
  created_at?: string | null
  subscription_status?: string | null
  subscription_plan_id?: string | null
  subscription_ends_at?: string | null
  trial_ends_at?: string | null
  publish_limit?: number | null
  publish_limit_daily?: number | null
  publish_count?: number | null
  publish_count_today?: number | null
  publish_date?: string | null
  site_status?: string | null
  site_status_reason?: string | null
  promo_code_used?: string | null
}

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return redirect('/dashboard')

  const [
    { data: profiles, error: profilesErr },
    { data: projects, error: projectsErr },
    { data: redemptions },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id,email,role,avatar_url')
      .neq('role', 'admin')
      .order('email', { ascending: true }),
    supabase
      .from('projects')
      .select('id,client_id,subdomain,custom_domain,created_at,subscription_status,subscription_plan_id,subscription_ends_at,trial_ends_at,publish_limit,publish_limit_daily,publish_count,publish_count_today,publish_date,site_status,site_status_reason')
      .order('created_at', { ascending: false }),
    supabase
      .from('promo_redemptions')
      .select('project_id,promo_codes(code)'),
  ])

  // Build promo code map: project_id -> code string
  const promoByProject = new Map<string, string>()
  for (const r of (redemptions ?? []) as any[]) {
    if (r.project_id && r.promo_codes?.code) {
      promoByProject.set(r.project_id, r.promo_codes.code)
    }
  }

  const byOwner = new Map<string, ProjectRow[]>()
  for (const p of (projects ?? []) as ProjectRow[]) {
    if (!p.client_id) continue
    const enriched = { ...p, promo_code_used: promoByProject.get(p.id) ?? null }
    const arr = byOwner.get(p.client_id) || []
    arr.push(enriched)
    byOwner.set(p.client_id, arr)
  }

  const rows = (profiles ?? []).map((p) => ({
    profile: p as ProfileRow,
    projects: byOwner.get((p as any).id) ?? []
  }))

  const hadRlsIssue = !!projectsErr || !!profilesErr
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'

  const totalClients = rows.length
  const totalProjects = (projects ?? []).length
  const activeProjects = (projects ?? []).filter(
    (p: any) => p.subscription_status === 'active' || p.subscription_status === 'admin_granted'
  ).length
  const trialProjects = (projects ?? []).filter((p: any) => p.subscription_status === 'trial').length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Clients & Websites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client accounts, domains, and subscriptions.
            {hadRlsIssue && (
              <span className="text-amber-600 ml-1">
                Some data may be hidden due to database policies.
              </span>
            )}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalClients}</p>
              <p className="text-xs text-muted-foreground">Total Clients</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-xs text-muted-foreground">Total Websites</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
              <Building2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProjects}</p>
              <p className="text-xs text-muted-foreground">Active / Granted</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{trialProjects}</p>
              <p className="text-xs text-muted-foreground">On Trial</p>
            </div>
          </div>
        </div>

        {/* Client table with search + filter */}
        <ClientsTable rows={rows} rootDomain={rootDomain} />

      </div>
    </div>
  )
}
