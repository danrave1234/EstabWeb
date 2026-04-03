import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeConfig } from "@/lib/utils"
import { applyOperations, type Operation } from "@/lib/utils/applyOperations"
import { validateOperations } from "@/lib/utils/validateOperations"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { currentConfig, operations } = body as {
      currentConfig?: Record<string, any>
      operations: Operation[]
    }

    if (!Array.isArray(operations) || operations.length === 0) {
      return NextResponse.json({ error: "Missing or empty operations array" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    const isAdmin = profile?.role === "admin" || profile?.role === "sub_admin"
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const normalizedBase = normalizeConfig((currentConfig as Record<string, any>) ?? {})
    const pages: any[] = Array.isArray(normalizedBase.pages) ? normalizedBase.pages : []
    const homePage = pages.find((page) => {
      const slug = typeof page?.slug === "string" ? page.slug.trim() : ""
      return slug.length === 0
    })
    const activeSections: string[] = Array.isArray(homePage?.activeSections)
      ? homePage.activeSections.filter((id: unknown): id is string => typeof id === "string")
      : Array.isArray(normalizedBase.activeSections)
        ? normalizedBase.activeSections.filter((id: unknown): id is string => typeof id === "string")
        : []

    const currentPageCount = pages.length || 1
    const maxPages = 10
    const maxSections = 20
    const validation = validateOperations(operations, activeSections, maxSections, maxPages, currentPageCount)

    if (validation.sanitizedOperations.length === 0) {
      return NextResponse.json(
        { error: "No valid operations to apply.", details: validation.errors },
        { status: 422 }
      )
    }

    const next = normalizeConfig(applyOperations(normalizedBase, validation.sanitizedOperations))

    const { data: config } = await supabase
      .from("site_config")
      .select("id")
      .eq("key", "template_master")
      .single()

    if (config?.id) {
      const { error } = await supabase
        .from("site_config")
        .update({ payload: next, updated_at: new Date().toISOString() })
        .eq("id", config.id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    } else {
      const { error } = await supabase.from("site_config").insert({ key: "template_master", payload: next })
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      draft: next,
      warnings: validation.errors.length > 0 ? validation.errors : undefined,
    })
  } catch (e: any) {
    console.error("template apply-operations error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}