import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SupportRequestType } from '@/lib/support/support-meta'
import { SUPPORT_TYPE_LABELS } from '@/lib/support/support-meta'

const VALID_TYPES: SupportRequestType[] = ['bug', 'problem', 'template_request', 'help', 'other']

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const type = typeof body?.type === 'string' ? body.type : ''
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''
    const projectId = typeof body?.projectId === 'string' ? body.projectId : null
    const metadata = body?.metadata && typeof body.metadata === 'object' ? body.metadata : {}

    if (!VALID_TYPES.includes(type as SupportRequestType) || !message) {
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
        project_id: projectId,
        type,
        subject: subject || SUPPORT_TYPE_LABELS[type as SupportRequestType],
        message,
        metadata,
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
