import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Globe, Users, ExternalLink, Building2 } from 'lucide-react'
import SubscriptionManage from '@/components/admin/SubscriptionManage'
import DomainManage from '@/components/admin/DomainManage'

export const dynamic = 'force-dynamic'

interface ProfileRow {
  id: string
  email: string | null
  role: string | null
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

const STATUS_COLORS: Record<string, string> = {
  free: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  trial: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  admin_granted: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  free: 'Free',
  trial: 'Trial',
  active: 'Paid',
  admin_granted: 'Granted',
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
    .select('id,email,role')
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
  const activeProjects = (projects ?? []).filter((p: any) => p.subscription_status === 'active' || p.subscription_status === 'admin_granted').length

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Clients & Websites</h1>
          <p className="text-muted-foreground mt-1">
            Manage client accounts, domains, and subscriptions.
            {hadRlsIssue && <span className="text-amber-600 ml-1">Some data may be hidden due to database policies.</span>}
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

        {/* Client cards */}
        {rows.length === 0 ? (
          <div className="rounded-xl border border-border bg-card py-20 text-center text-muted-foreground">
            No clients found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map(({ profile, projects: clientProjects }) => (
              <div key={profile.id} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Client header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {(profile.email || profile.id)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{profile.email || profile.id}</p>
                      <p className="text-xs text-muted-foreground font-mono">{profile.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {clientProjects.length} {clientProjects.length === 1 ? 'website' : 'websites'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-background capitalize">
                      {profile.role || 'user'}
                    </span>
                  </div>
                </div>

                {/* Projects */}
                {clientProjects.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-muted-foreground italic">
                    No websites yet.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {clientProjects.map((proj, idx) => {
                      const href = proj.subdomain ? `https://${proj.subdomain}.${rootDomain}` : '#'
                      const status = proj.subscription_status || 'free'
                      const statusColor = STATUS_COLORS[status] || STATUS_COLORS.free
                      const statusLabel = STATUS_LABELS[status] || status

                      return (
                        <div key={proj.id} className="px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-start">
                          {/* Left: site info + domain manage */}
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                              <Link
                                href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-background ${proj.subdomain ? 'hover:bg-muted' : 'opacity-40 pointer-events-none'}`}
                              >
                                <Globe className="w-3 h-3" />
                                {proj.subdomain || 'no-subdomain'}
                                {proj.subdomain && <ExternalLink className="w-2.5 h-2.5 opacity-50" />}
                              </Link>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
                                {statusLabel}
                                {proj.trial_ends_at && status === 'trial' && (
                                  <span className="ml-1 opacity-70">· {new Date(proj.trial_ends_at).toLocaleDateString()}</span>
                                )}
                              </span>
                              {proj.custom_domain && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border border-blue-500/20 bg-blue-500/10 text-blue-600">
                                  <Globe className="w-2.5 h-2.5" />
                                  {proj.custom_domain}
                                </span>
                              )}
                            </div>
                            <div className="pl-1">
                              <DomainManage project={proj as any} />
                            </div>
                          </div>

                          {/* Right: subscription manage */}
                          <div className="min-w-[160px]">
                            <SubscriptionManage project={proj as any} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
