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

  // We look back 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const cutoff = sevenDaysAgo.toISOString()

  // 1. Fetch active projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, user_id, subdomain, custom_domain')
    .eq('subscription_status', 'active')
    .not('user_id', 'is', null)

  if (projectsError || !projects) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }

  const insightsGenerated: any[] = []

  for (const proj of projects) {
    if (!proj.user_id) continue

    // Fetch events for this project in the last 7 days
    const { data: events } = await supabase
      .from('project_events')
      .select('type, section_key')
      .eq('project_id', proj.id)
      .gte('created_at', cutoff)

    // Fetch leads generated in the last 7 days
    const { count: leadsCount } = await supabase
      .from('project_leads')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', proj.id)
      .gte('created_at', cutoff)

    if (!events) continue

    const pageViews = events.filter(e => e.type === 'page_view').length
    const ctaClicks = events.filter(e => e.type === 'cta_click' || e.type === 'click_cta').length
    const sectionViews = events.filter(e => e.type === 'section_view' || e.type === 'view_section')

    // Rule 1: High Traffic, Low Leads
    if (pageViews > 100 && (leadsCount || 0) === 0) {
      // Check if we already notified them recently to avoid spam (can optimize later)
      await supabase.from('notifications').insert({
        user_id: proj.user_id,
        project_id: proj.id,
        type: 'insight',
        title: 'Conversion Alert',
        message: `Your site had ${pageViews} visits this week but 0 leads. Try revising your main offer or contact form.`,
        action_url: `/dashboard/analytics?project=${proj.id}`
      })
      insightsGenerated.push({ project: proj.id, type: 'low_leads' })
    }

    // Rule 2: Section Performance (Hero getting views but no clicks)
    // Find hero section views
    const heroViewsCount = sectionViews.filter(e => e.section_key && e.section_key.includes('hero')).length
    const heroCtaClicks = events.filter(e => e.section_key && e.section_key.includes('hero') && (e.type === 'cta_click' || e.type === 'click_cta')).length

    if (heroViewsCount > 50 && heroCtaClicks === 0) {
      await supabase.from('notifications').insert({
        user_id: proj.user_id,
        project_id: proj.id,
        type: 'insight',
        title: 'Hero Section Analytics',
        message: `Your Hero section had ${heroViewsCount} views this week but 0 button clicks. Try using a stronger CTA!`,
        action_url: `/dashboard/editor`
      })
      insightsGenerated.push({ project: proj.id, type: 'low_hero_clicks' })
    }
  }

  return NextResponse.json({
    message: 'Auto Insights routine completed.',
    insightsGenerated
  })
}
