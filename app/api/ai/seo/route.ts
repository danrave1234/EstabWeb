import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildConfigSummary } from "@/lib/ai/buildConfigSummary"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent"

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
  }

  const body = await req.json()
  const { projectId, pageIndex = 0, businessType, currentContent } = body

  let pageContext = ""

  if (projectId && typeof projectId === "string") {
    try {
      const supabase = await createClient()
      const { data: proj } = await supabase
        .from("projects")
        .select("draft_config, current_config")
        .eq("id", projectId)
        .single()

      if (proj) {
        const config: Record<string, any> =
          (proj.draft_config as Record<string, any>) ??
          (proj.current_config as Record<string, any>) ??
          {}

        const pages: any[] = Array.isArray(config.pages) ? config.pages : []
        const activePage = pages[pageIndex] ?? pages[0]
        const activeSections: string[] = Array.isArray(activePage?.activeSections)
          ? activePage.activeSections
          : Array.isArray(config.activeSections)
          ? config.activeSections
          : []

        const colorTheme = typeof config.colorTheme === "string" ? config.colorTheme : "partner"
        const typographyStyle = typeof config.typographyStyle === "string" ? config.typographyStyle : "elegant"

        pageContext = buildConfigSummary(
          activeSections,
          config,
          colorTheme,
          typographyStyle,
          activePage?.label ?? "Home",
          activePage?.slug ?? "",
          pages
        )
      }
    } catch {
      // Non-fatal — fall through to minimal context
    }
  }

  if (!pageContext) {
    if (!businessType && !currentContent?.title && !currentContent?.description) {
      return NextResponse.json({ error: "Insufficient context" }, { status: 400 })
    }
    pageContext = `Business type: ${businessType || "local business"}`
  }

  const prompt = `You are an expert SEO copywriter. Generate 3 different SEO variants based on the actual website content below. Each variant should take a different angle (e.g., benefit-focused, location-focused, service-focused).

WEBSITE CONTENT:
${pageContext}

Current SEO title: "${currentContent?.title || "(none)"}"
Current SEO description: "${currentContent?.description || "(none)"}"

Rules:
- title: MUST be between 30 and 60 characters. Count every character. If it exceeds 60, shorten it before outputting.
- description: MUST be between 70 and 155 characters. Count every character. If it exceeds 155, shorten it before outputting.
- keywords: 3 to 6 short keyword phrases relevant to the page content
- Use keywords that appear naturally in the page content above
- If location info is present, at least one variant should include it
- If brand name is present, at least one variant should include it
- Do NOT use generic filler like "Welcome to" or "Built with"
- Do NOT invent services or claims not present in the content
- Return raw JSON only, no markdown, no code fences

Format (return exactly this structure):
{"variants":[{"title":"...","description":"...","keywords":["...","...","..."]},{"title":"...","description":"...","keywords":["...","...","..."]},{"title":"...","description":"...","keywords":["...","...","..."]}]}`

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Gemini SEO error:", err)
      return NextResponse.json({ error: "Gemini request failed" }, { status: 502 })
    }

    const geminiData = await res.json()
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    // Support both old single-result and new variants format
    if (Array.isArray(parsed.variants)) {
      const variants = parsed.variants
        .slice(0, 3)
        .map((v: any) => ({
          title: typeof v.title === "string" ? v.title.trim().slice(0, 60) : "",
          description: typeof v.description === "string" ? v.description.trim().slice(0, 155) : "",
          keywords: Array.isArray(v.keywords)
            ? v.keywords.filter((k: any) => typeof k === "string").slice(0, 6)
            : [],
        }))
        .filter((v: { title: string; description: string }) => v.title && v.description)

      return NextResponse.json({ variants })
    }

    // Fallback: old single format
    const title = typeof parsed.title === "string" ? parsed.title.trim().slice(0, 60) : ""
    const description = typeof parsed.description === "string" ? parsed.description.trim().slice(0, 155) : ""
    const keywords = Array.isArray(parsed.keywords)
      ? parsed.keywords.filter((k: any) => typeof k === "string").slice(0, 6)
      : []
    return NextResponse.json({ variants: [{ title, description, keywords }] })
  } catch (e) {
    console.error("AI SEO error:", e)
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
  }
}
