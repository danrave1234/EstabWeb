/**
 * One-time migration: normalize all draft_config entries to full snapshots.
 *
 * For each project where draft_config exists and is partial (missing keys
 * that current_config has), merge current_config + draft_config so the
 * draft becomes a complete snapshot. After this runs, all drafts are full
 * snapshots and deep merging on publish is no longer needed.
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register scripts/migrate-draft-snapshots.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function deepMerge(a: Record<string, any>, b: Record<string, any>): Record<string, any> {
  const out: any = { ...a }
  if (!b || typeof b !== 'object') return out
  for (const k of Object.keys(b)) {
    const av = a?.[k]
    const bv = b[k]
    if (
      av && bv &&
      typeof av === 'object' && typeof bv === 'object' &&
      !Array.isArray(av) && !Array.isArray(bv)
    ) {
      out[k] = deepMerge(av, bv)
    } else {
      out[k] = bv
    }
  }
  return out
}

function isPartialDraft(current: Record<string, any>, draft: Record<string, any>): boolean {
  // A draft is considered partial if it is missing top-level keys that current has
  const currentKeys = Object.keys(current)
  const draftKeys = new Set(Object.keys(draft))
  return currentKeys.some((k) => !draftKeys.has(k))
}

async function run() {
  console.log('Fetching projects with draft_config...')

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, current_config, draft_config')
    .not('draft_config', 'is', null)

  if (error) {
    console.error('Failed to fetch projects:', error.message)
    process.exit(1)
  }

  console.log(`Found ${projects.length} projects with a draft_config.`)

  let migrated = 0
  let skipped = 0

  for (const proj of projects) {
    const current = (proj.current_config ?? {}) as Record<string, any>
    const draft = (proj.draft_config ?? {}) as Record<string, any>

    if (Object.keys(draft).length === 0) {
      // Empty draft — clear it to null
      await supabase.from('projects').update({ draft_config: null }).eq('id', proj.id)
      console.log(`  [${proj.id}] Empty draft cleared to null.`)
      migrated++
      continue
    }

    if (isPartialDraft(current, draft)) {
      const fullDraft = deepMerge(current, draft)
      const { error: upErr } = await supabase
        .from('projects')
        .update({ draft_config: fullDraft })
        .eq('id', proj.id)

      if (upErr) {
        console.error(`  [${proj.id}] Failed to update:`, upErr.message)
      } else {
        console.log(`  [${proj.id}] Partial draft normalized to full snapshot.`)
        migrated++
      }
    } else {
      console.log(`  [${proj.id}] Draft already a full snapshot — skipped.`)
      skipped++
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}`)
}

run()
