import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addDomainToVercel } from '@/lib/utils/vercel-domains'

/**
 * POST /api/domain/request
 *
 * Allows an authenticated client to set a custom domain for their project.
 * Immediately updates the project and registers the domain with Vercel.
 *
 * Body: { projectId: string, customDomain: string }
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { projectId, customDomain } = body

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }
    if (!customDomain || typeof customDomain !== 'string') {
      return NextResponse.json({ error: 'customDomain is required' }, { status: 400 })
    }

    // Sanitise: strip protocol, lowercase, trim
    const domain = customDomain.trim().toLowerCase().replace(/^https?:\/\//, '')

    // Basic format validation
    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
    }

    // Verify the project belongs to this user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, client_id, custom_domain')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    if (project.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check domain is not already taken by another project
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('custom_domain', domain)
      .neq('id', projectId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Domain is already in use by another project' }, { status: 409 })
    }

    // Immediately update the project's custom_domain
    const { error: updateError } = await supabase
      .from('projects')
      .update({ custom_domain: domain })
      .eq('id', projectId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Register the domain with Vercel (non-blocking on failure)
    const vercelResult = await addDomainToVercel(domain)
    if (!vercelResult.ok) {
      console.warn(`[domain/request] Vercel registration failed for "${domain}": ${vercelResult.error}`)
    }

    return NextResponse.json({ success: true, domain })
  } catch (e: any) {
    console.error('[domain/request] Error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
