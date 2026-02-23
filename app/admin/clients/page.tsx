import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Globe, Users, Building2 } from 'lucide-react'
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
  trial_ends_at?: string | null
  publish_limit?: number | null
  publish_count?: number | null
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

  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id,email,role,avatar_url')
    .order('email', { ascending: true })

  const { data: projects, error: projectsErr } = await supabase
    .from('projects')
    .select('id,client_id,subdomain,custom_domain,created_at,subscription_status,trial_ends_at,publish_limit,publish_limit_daily,publish_count,publish_count_today,publish_date')
    .order('created_at', { ascending: false })

  const byOwner = new Map<string, ProjectRow[]>()
  for (const p of (projects ?? []) as ProjectRow[]) {
    if (!p.client_id) continue
    const arr = byOwner.get(p.client_id) || []
    arr.push(p)
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Clients & Websites</h1>
          <p className="text-muted-foreground mt-1">
            Manage client accounts, domains, and subscriptions.
            {hadRlsIssue && (
              <span className="text-amber-600 ml-1">
                Some data may be hidden due to database policies.
              </span>
            )}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalClients}</p>
              <p className="text-xs text-muted-foreground">Total Clients</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-xs text-muted-foreground">Total Websites</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Building2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProjects}</p>
              <p className="text-xs text-muted-foreground">Active / Granted</p>
            </div>
          </div>
        </div>

        {/* Client table with search + filter */}
        <ClientsTable rows={rows} rootDomain={rootDomain} />

      </div>
    </div>
  )
}
