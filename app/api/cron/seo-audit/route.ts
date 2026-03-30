import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, user_id, current_config, subdomain')
    .eq('subscription_status', 'active')
    .not('user_id', 'is', null)

  if (projectsError || !projects) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }

  const alertsGenerated = []

  for (const proj of projects) {
    if (!proj.user_id || !proj.current_config) continue

    const config = proj.current_config as any
    const pages = config.pages || []

    for (const page of pages) {
      if (!page.seoTitle || !page.seoDescription) {
        await supabase.from('notifications').insert({
          user_id: proj.user_id,
          project_id: proj.id,
          type: 'insight',
          title: 'SEO Health Warning',
          message: `Your page "${page.name || page.slug}" is missing a Meta Title or Description! Add them to rank better on Google.`,
          action_url: `/dashboard/editor?page=${page.slug || 'home'}`
        })
        alertsGenerated.push({ project: proj.id, issue: 'missing_meta' })
        // Only fire one missing meta alert per project to avoid spam
        break
      }
    }
  }

  return NextResponse.json({
    message: 'SEO Audit completed',
    alertsGenerated
  })
}
