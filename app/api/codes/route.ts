import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateTemplateCode } from '@/lib/codes';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'sub_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { label, payload, prefix, expires_at, max_uses = 1 } = body;

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const code = generateTemplateCode(prefix);

    const { error } = await supabase.from('template_codes').insert({
      code,
      label: label || (prefix ? `${prefix} Template` : 'Template'),
      payload,
      preset_key: payload.theme,
      created_by: user.id,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
      max_uses,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ code });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'sub_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('template_codes')
    .select('*, code_redemptions(redeemed_at, redeemed_by, projects(subdomain))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[API Codes GET] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Fetch profiles for all redeemers to get emails
  const redeemerIds = Array.from(new Set(
    data.flatMap(code => code.code_redemptions?.map((r: any) => r.redeemed_by) || [])
  )).filter(Boolean);

  let profilesMap: Record<string, string> = {};
  if (redeemerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', redeemerIds);
    
    profilesMap = (profiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.email }), {});
  }

  // Map emails back to redemptions
  const enrichedData = data.map(code => ({
    ...code,
    code_redemptions: code.code_redemptions?.map((r: any) => ({
      ...r,
      user_email: profilesMap[r.redeemed_by] || r.redeemed_by
    }))
  }));

  return NextResponse.json(enrichedData);
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'sub_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, expires_at, max_uses, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const updateData: any = {};
    if (expires_at !== undefined) updateData.expires_at = expires_at;
    if (max_uses !== undefined) updateData.max_uses = max_uses;
    if (status !== undefined) updateData.status = status;

    const { error } = await supabase
      .from('template_codes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'sub_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('template_codes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
