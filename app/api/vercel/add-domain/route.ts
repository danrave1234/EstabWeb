import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addDomainToVercel, addSubdomainToVercel } from '@/lib/utils/vercel-domains'

/**
 * POST /api/vercel/add-domain
 *
 * Manually registers a domain or subdomain with the Vercel project.
 * Admin-only endpoint.
 *
 * Body (one of):
 *   { subdomain: "acme" }           → registers "acme.estabweb.com"
 *   { customDomain: "acmecorp.com" } → registers "acmecorp.com"
 *   { projectId: "<uuid>" }          → registers both subdomain + custom_domain from the project row
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { subdomain, customDomain, projectId } = body

    const results: Record<string, any> = {}

    if (projectId) {
      // Register both fields from the project row
      const { data: project } = await supabase
        .from('projects')
        .select('subdomain,custom_domain')
        .eq('id', projectId)
        .single()

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      if (project.subdomain) {
        results.subdomain = await addSubdomainToVercel(project.subdomain)
      }
      if (project.custom_domain) {
        results.customDomain = await addDomainToVercel(project.custom_domain)
      }
      if (!project.subdomain && !project.custom_domain) {
        return NextResponse.json({ error: 'Project has no subdomain or custom_domain set' }, { status: 400 })
      }
    } else if (subdomain) {
      results.subdomain = await addSubdomainToVercel(subdomain)
    } else if (customDomain) {
      results.customDomain = await addDomainToVercel(customDomain)
    } else {
      return NextResponse.json(
        { error: 'Provide one of: subdomain, customDomain, or projectId' },
        { status: 400 }
      )
    }

    const allOk = Object.values(results).every((r: any) => r.ok)
    return NextResponse.json({ success: allOk, results }, { status: allOk ? 200 : 207 })
  } catch (e: any) {
    console.error('[vercel/add-domain] Error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
