import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const range     = searchParams.get('range') ?? 'all'

  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('client_id', user.id)
    .single()
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let query = supabase
    .from('project_leads')
    .select('id, type, status, notes, metadata, page_slug, section_key, source, first_touch_source, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (range !== 'all') {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const since = new Date(Date.now() - days * 86400_000).toISOString()
    query = query.gte('created_at', since)
  }

  const { data: leads } = await query
  if (!leads) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })

  const headers = ['Date', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Message', 'City', 'Country', 'Source', 'First Touch', 'Page', 'Section', 'Notes', 'ID']
  const rows = leads.map(l => {
    const m = (l.metadata as Record<string, any>) || {}
    return [
      new Date(l.created_at).toLocaleString('en-US'),
      l.type,
      l.status ?? 'new',
      m.name ?? '',
      m.email ?? '',
      m.phone ?? '',
      m.message ?? '',
      m.geo_city ?? '',
      m.geo_country ?? '',
      l.source ?? '',
      l.first_touch_source ?? '',
      l.page_slug ?? '',
      l.section_key ?? '',
      l.notes ?? '',
      l.id,
    ].map(escapeCSV).join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${projectId}-${range}.csv"`,
    },
  })
}
