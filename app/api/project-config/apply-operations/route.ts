/**
 * POST /api/project-config/apply-operations
 *
 * Applies a validated list of operations to the project's draft_config.
 * Never mutates current_config directly.
 * Called only after user explicitly approves proposed changes.
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeConfig } from "@/lib/utils"
import { applyOperations } from "@/lib/utils/applyOperations"
import { validateOperations } from "@/lib/utils/validateOperations"
import { getPlanLimits, getMaxPagesForProject, normalizePagesWithDefaults, isLegalPageSlug } from "@/lib/utils/site-pages"
import type { Operation } from "@/lib/utils/applyOperations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { projectId, operations } = body as {
      projectId: string
      operations: Operation[]
    }

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 })
    }
    if (!Array.isArray(operations) || operations.length === 0) {
      return NextResponse.json({ error: "Missing or empty operations array" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Load project
    const { data: proj, error: projErr } = await supabase
      .from("projects")
      .select(
        "id, draft_config, current_config, subscription_status, trial_ends_at, subscription_ends_at"
      )
      .eq("id", projectId)
      .single()

    if (projErr || !proj) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const baseConfig: Record<string, any> =
      (proj.draft_config as Record<string, any>) ??
      (proj.current_config as Record<string, any>) ??
      {}

    const activeSections: string[] = Array.isArray(baseConfig.activeSections)
      ? baseConfig.activeSections
      : []
    const pages: any[] = Array.isArray(baseConfig.pages) ? baseConfig.pages : []
    const currentPageCount = pages.length || 1

    const planLimits = await getPlanLimits(supabase)
    const maxPages = getMaxPagesForProject(proj, planLimits)
    const isPro = proj.subscription_status === "active" || proj.subscription_status === "trialing"
    const maxSections = isPro ? 20 : 15
    // Re-validate operations server-side (never trust client)
    const validation = validateOperations(
      operations,
      activeSections,
      maxSections,
      maxPages,
      currentPageCount
    )

    if (validation.sanitizedOperations.length === 0) {
      return NextResponse.json(
        { error: "No valid operations to apply.", details: validation.errors },
        { status: 422 }
      )
    }

    // Apply operations to a clone of the base config
    const updated = applyOperations(baseConfig, validation.sanitizedOperations)

    // Normalize the result
    const next = normalizeConfig(updated)

    // Validate page limits after applying
    const normalizedPages = normalizePagesWithDefaults((next as any)?.pages)
    if (normalizedPages.length > 0) {
      const paidPages = normalizedPages.filter(
        (page) => page.slug && !isLegalPageSlug(page.slug)
      )
      if (paidPages.length > maxPages) {
        return NextResponse.json(
          { error: `Page limit exceeded (${paidPages.length}/${maxPages}). Upgrade your plan.` },
          { status: 400 }
        )
      }
      ;(next as any).pages = normalizedPages
    }

    // Write to draft_config only — never current_config
    const { error: upErr } = await supabase
      .from("projects")
      .update({ draft_config: next })
      .eq("id", projectId)

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      draft: next,
      warnings: validation.errors.length > 0 ? validation.errors : undefined,
    })
  } catch (e: any) {
    console.error("apply-operations error:", e)
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
