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
  const { projectId, pageIndex = 0, businessType, currentSeo, ruleScore, issues } = body

  let pageContext = ""
  let heroTitle = ""

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

        // Hero title renders as <h1> on the page
        heroTitle = activePage?.hero?.title ?? config.hero?.title ?? ""

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
    if (!businessType && !currentSeo?.title && !currentSeo?.description) {
      return NextResponse.json({ error: "Insufficient context" }, { status: 400 })
    }
    const parts: string[] = [`Business type: ${businessType || "local business"}`]
    if (currentSeo?.title) parts.push(`SEO title: ${currentSeo.title}`)
    if (currentSeo?.description) parts.push(`SEO description: ${currentSeo.description}`)
    if (currentSeo?.keywords?.length) parts.push(`Keywords: ${currentSeo.keywords.join(", ")}`)
    pageContext = parts.join("\n")
  }

  const issuesSummary = Array.isArray(issues) && issues.length > 0
    ? `\nDetected rule-based issues:\n${issues.map((i: any) => `- [${i.severity}] ${i.message}`).join("\n")}`
    : ""

  const prompt = `You are an expert SEO consultant. Analyze the following website content and SEO data, then provide a concise, actionable AI-powered SEO analysis.

IMPORTANT CONTEXT:
- The hero section title IS the H1 tag rendered on the page. Do NOT suggest adding an H1 if a hero title exists.
- Hero title (H1 on page): "${heroTitle || "(none)"}"

WEBSITE CONTENT:
${pageContext}

Current SEO title: "${currentSeo?.title || "(none)"}"
Current SEO description: "${currentSeo?.description || "(none)"}"
Current keywords: ${currentSeo?.keywords?.length ? currentSeo.keywords.join(", ") : "(none)"}
Rule-based SEO score: ${ruleScore ?? "unknown"}/100${issuesSummary}

Provide your analysis as JSON with exactly this structure:
{
  "summary": "2-3 sentence overall assessment of the SEO health",
  "strengths": ["up to 3 specific things done well"],
  "improvements": [
    { "priority": "high|medium|low", "action": "specific actionable fix", "impact": "why this matters" }
  ],
  "quickWins": ["up to 3 quick things to do right now for immediate improvement"]
}

Rules:
- Be specific to the actual content — no generic advice
- The hero title is already the H1 — never suggest adding one if it exists
- Use exact counts and specific section/page names whenever possible
- Avoid vague qualifiers like "most", "some", or "many" without numbers
- improvements array: 2 to 4 items max, ordered by priority
- quickWins: 1 to 3 items, each under 15 words
- strengths: only include if genuinely present, can be empty array
- Return raw JSON only, no markdown, no code fences`

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Gemini SEO audit error:", err)
      return NextResponse.json({ error: "Gemini request failed" }, { status: 502 })
    }

    const geminiData = await res.json()
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.filter((s: any) => typeof s === "string").slice(0, 3) : [],
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
            .filter((i: any) => i && typeof i.action === "string")
            .slice(0, 4)
            .map((i: any) => ({
              priority: ["high", "medium", "low"].includes(i.priority) ? i.priority : "medium",
              action: String(i.action),
              impact: typeof i.impact === "string" ? i.impact : "",
            }))
        : [],
      quickWins: Array.isArray(parsed.quickWins) ? parsed.quickWins.filter((q: any) => typeof q === "string").slice(0, 3) : [],
    })
  } catch (e) {
    console.error("AI SEO audit error:", e)
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
  }
}
