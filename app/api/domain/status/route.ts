import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDomainStatus } from '@/lib/utils/vercel-domains'

/**
 * GET /api/domain/status?projectId=xxx
 *
 * Returns the Vercel verification status for the project's custom domain.
 */
export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

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
    if (!project.custom_domain) {
      return NextResponse.json({ error: 'No custom domain set' }, { status: 400 })
    }

    const result = await getDomainStatus(project.custom_domain)
    return NextResponse.json(result)
  } catch (e: any) {
    console.error('[domain/status] Error:', e)
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
