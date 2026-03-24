import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientsWorkspaceV2 from '@/components/admin/ClientsWorkspaceV2'
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
  ai_usage_count?: number | null
  ai_usage_limit?: number | null
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

  if (profile?.role !== 'admin' && profile?.role !== 'sub_admin') return redirect('/dashboard')

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
      .select('id,client_id,subdomain,custom_domain,created_at,subscription_status,subscription_plan_id,subscription_ends_at,trial_ends_at,publish_limit,publish_limit_daily,publish_count,publish_count_today,publish_date,site_status,site_status_reason,ai_usage_count,ai_usage_limit')
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

  const rows = (profiles ?? []).map((row) => ({
    profile: row as ProfileRow,
    projects: byOwner.get((row as ProfileRow).id) ?? []
  }))

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'
  return <ClientsWorkspaceV2 rows={rows} rootDomain={rootDomain} />
}
