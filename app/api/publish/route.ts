import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { generateSubdomain } from '@/lib/codes'
import { normalizeConfig } from '@/lib/utils'
import { canPublishDirectly, canPublishNow, getPublishStats, DEFAULT_PUBLISH_LIMIT, DEFAULT_PUBLISH_LIMIT_DAILY } from '@/lib/subscription'
import { getMaxPagesForProject, getPlanLimits, isLegalPageSlug, normalizePagesWithDefaults } from '@/lib/utils/site-pages'
import { logAudit } from '@/lib/audit'
import { onProjectPublished } from '@/lib/cache/invalidation'

const PERIOD_DAYS = 30

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json()
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: proj, error: projErr } = await supabase
      .from('projects')
      .select('id, client_id, current_config, draft_config, config_version, subdomain, custom_domain, subscription_status, trial_ends_at, subscription_ends_at, publish_limit, publish_limit_daily, publish_count, publish_count_today, publish_date, publish_period_start')
      .eq('id', projectId)
      .single()

    if (projErr || !proj) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    if (proj.client_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (!canPublishDirectly(proj)) {
      return NextResponse.json(
        { error: 'Direct publish requires an active subscription or trial. Submit for approval instead.' },
        { status: 403 }
      )
    }

    if (!canPublishNow(proj)) {
      const { limit, used, remaining, limitDaily, usedToday, remainingToday } = getPublishStats(proj)
      if (remaining <= 0) {
        return NextResponse.json(
          { error: `Period limit reached (${used}/${limit}). Resets in the next period.` },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: `Daily limit reached (${usedToday}/${limitDaily} today). Try again tomorrow.` },
        { status: 403 }
      )
    }

    const draft = proj.draft_config as Record<string, unknown> | null
    if (!draft || Object.keys(draft).length === 0) {
      return NextResponse.json({ error: 'No draft changes to publish' }, { status: 400 })
    }

    const newConfig = normalizeConfig(draft) as Record<string, unknown>
    const pages = normalizePagesWithDefaults((newConfig as any)?.pages)
    if (pages.length > 0) {
      const planLimits = await getPlanLimits(supabase)
      const maxPages = getMaxPagesForProject(proj, planLimits)
      const paidPages = pages.filter((page) => page.slug && !isLegalPageSlug(page.slug))
      if (paidPages.length > maxPages) {
        return NextResponse.json(
          { error: `Page limit exceeded (${paidPages.length}/${maxPages}).` },
          { status: 400 }
        )
      }
    }
    if (pages.length > 0) {
      (newConfig as any).pages = pages
    }
    const nextVersion = (proj.config_version ?? 0) + 1

    const updatePayload: Record<string, unknown> = {
      current_config: newConfig,
      draft_config: null,
      config_version: nextVersion,
    }

    const oldBrandName = (proj.current_config as any)?.brand?.name
    const newBrandName = (newConfig as any)?.brand?.name
    if (newBrandName && newBrandName !== oldBrandName) {
      ;(updatePayload as any).subdomain = generateSubdomain(newBrandName)
    }

    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)
    const periodStart = proj.publish_period_start ? new Date(proj.publish_period_start) : new Date()
    const daysSinceStart = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    const limit = proj.publish_limit ?? DEFAULT_PUBLISH_LIMIT
    const limitDaily = proj.publish_limit_daily ?? DEFAULT_PUBLISH_LIMIT_DAILY
    const count = proj.publish_count ?? 0
    const publishDate = proj.publish_date
    const countToday = publishDate === todayStr ? (proj.publish_count_today ?? 0) : 0

    if (daysSinceStart >= PERIOD_DAYS) {
      ;(updatePayload as any).publish_count = 1
      ;(updatePayload as any).publish_period_start = now.toISOString()
    } else {
      ;(updatePayload as any).publish_count = count + 1
    }
    ;(updatePayload as any).publish_count_today = countToday + 1
    ;(updatePayload as any).publish_date = todayStr

    const { error: upErr } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', projectId)

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    await supabase.from('project_versions').insert({
      project_id: projectId,
      version: nextVersion,
      snapshot: newConfig,
    })

    if (proj.subdomain) revalidateTag(`site:${proj.subdomain}`, 'max')
    if (proj.custom_domain) revalidateTag(`site:${proj.custom_domain}`, 'max')
    await onProjectPublished({ projectId, subdomain: proj.subdomain, customDomain: proj.custom_domain })

    // revalidatePath uses Next.js route segment patterns, not domain URLs.
    // The sites group is at app/(sites)/[domain]/... so we target those segments.
    revalidatePath('/(sites)/[domain]', 'page')
    revalidatePath('/(sites)/[domain]/[slug]', 'page')
    ;['privacy', 'terms', 'cookies'].forEach((slug) => {
      revalidatePath(`/(sites)/[domain]/${slug}`, 'page')
    })

    // Also revalidate using the actual subdomain/custom_domain values so Vercel's
    // edge cache is busted for the specific domain paths.
    const domains = [proj.subdomain, proj.custom_domain].filter(Boolean) as string[]
    for (const d of domains) {
      revalidatePath(`/${d}`, 'page')
      revalidatePath(`/${d}/[slug]`, 'page')
    }

    const newCount = (updatePayload as any).publish_count as number
    const newCountToday = (updatePayload as any).publish_count_today as number
    await logAudit(supabase, 'publish', user.id, projectId, { version: nextVersion })
    return NextResponse.json({
      success: true,
      version: nextVersion,
      publishCount: newCount,
      remaining: limit - newCount,
      remainingToday: limitDaily - newCountToday,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to publish' }, { status: 500 })
  }
}
