import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, subject, message, projectId, metadata } = body

    if (!type || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('support_requests')
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        type,
        subject: subject || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
        message,
        metadata: metadata || {},
        status: 'open'
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating support request:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (e: any) {
    console.error('Support API error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to submit support request' }, { status: 500 })
  }
}
