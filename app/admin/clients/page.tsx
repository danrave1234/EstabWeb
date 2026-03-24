import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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
    { data: profiles },
    { data: projects },
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

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'
  const allProjects = (projects ?? []) as ProjectRow[]

  const stats = {
    clients: rows.length,
    sites: allProjects.length,
    active: allProjects.filter(p => p.subscription_status === 'active' || p.subscription_status === 'admin_granted').length,
    trial: allProjects.filter(p => p.subscription_status === 'trial').length,
    free: allProjects.filter(p => !p.subscription_status || p.subscription_status === 'free').length,
    promoUsed: promoByProject.size,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Page title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">All registered client accounts and their websites.</p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "Clients",    value: stats.clients,   accent: "text-foreground" },
            { label: "Sites",      value: stats.sites,     accent: "text-foreground" },
            { label: "Active",     value: stats.active,    accent: "text-emerald-600" },
            { label: "Trial",      value: stats.trial,     accent: "text-sky-600" },
            { label: "Free",       value: stats.free,      accent: "text-zinc-500" },
            { label: "Promo Used", value: stats.promoUsed, accent: "text-violet-600" },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-3 flex flex-col gap-0.5">
              <span className={`text-xl font-bold tabular-nums ${s.accent}`}>{s.value}</span>
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <ClientsTable rows={rows} rootDomain={rootDomain} />

      </div>
    </div>
  )
}
