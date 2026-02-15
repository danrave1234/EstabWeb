import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Globe } from 'lucide-react'
import SubscriptionManage from '@/components/admin/SubscriptionManage'

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

  // Admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return redirect('/dashboard')

  // Fetch clients (profiles) and all projects (may require admin RLS policies)
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id,email,role')
    .order('email', { ascending: true })

  const { data: projects, error: projectsErr } = await supabase
    .from('projects')
    .select('id,client_id,subdomain,created_at,subscription_status,trial_ends_at,publish_limit,publish_limit_daily,publish_count,publish_count_today,publish_date')
    .order('created_at', { ascending: false })

  // Group projects by owner
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients & Websites</h1>
            <p className="text-muted-foreground mt-2">
              View all client accounts and their websites. {hadRlsIssue && 'Some data may be hidden due to database policies.'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Websites</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(({ profile, projects }) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{profile.email || profile.id}</span>
                        <span className="text-xs text-muted-foreground">{profile.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{profile.role || 'user'}</TableCell>
                    <TableCell>{projects.length}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {projects.map((proj) => {
                          const domain = proj.subdomain || 'no-subdomain'
                          const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'
                          const href = proj.subdomain ? `https://${proj.subdomain}.${rootDomain}` : '#'
                          return (
                            <Link
                              key={proj.id}
                              href={href}
                              target={href.startsWith('http') ? '_blank' : undefined}
                              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${proj.subdomain ? 'hover:bg-muted' : 'opacity-50 pointer-events-none'}`}
                              title={proj.id}
                            >
                              <Globe className="w-3 h-3" />
                              {domain}
                            </Link>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-3">
                        {projects.map((proj) => (
                          <SubscriptionManage key={proj.id} project={proj as any} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Placeholder for future admin tools (impersonate, reset, etc.) */}
                        <span className="text-xs text-muted-foreground">{projects.length > 0 ? 'Open site links' : '—'}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {hadRlsIssue && (
          <p className="text-xs text-amber-600 mt-3">
            Note: To allow admins to view all clients and projects, add RLS policies granting select access to role = 'admin' on the profiles and projects tables.
          </p>
        )}
      </div>
    </div>
  )
}
