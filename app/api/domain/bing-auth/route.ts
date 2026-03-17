import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const { projectId, bingAuthId } = await req.json()
        if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: proj } = await supabase.from('projects').select('id, client_id, current_config, draft_config').eq('id', projectId).single()
        if (!proj || proj.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const draft = (proj.draft_config as any) || {}
        const current = (proj.current_config as any) || {}

        // Update both draft and current config for SEO
        if (!draft.seo) draft.seo = {}
        draft.seo.bingAuthId = bingAuthId

        if (!current.seo) current.seo = {}
        current.seo.bingAuthId = bingAuthId

        const { error: upErr } = await supabase.from('projects').update({ draft_config: draft, current_config: current }).eq('id', projectId)

        if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

        return NextResponse.json({ success: true, bingAuthId })
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Failed to update Bing Auth ID' }, { status: 500 })
    }
}
