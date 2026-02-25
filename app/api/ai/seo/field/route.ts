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
  const { projectId, pageIndex = 0, businessType, currentContent, field } = body

  if (!field || !["title", "description", "keywords", "og_title", "og_description"].includes(field)) {
    return NextResponse.json({ error: "Invalid field. Must be title, description, keywords, og_title, or og_description." }, { status: 400 })
  }

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
    if (
      !businessType &&
      !currentContent?.title &&
      !currentContent?.description &&
      !currentContent?.og_title &&
      !currentContent?.og_description
    ) {
      return NextResponse.json({ error: "Insufficient context" }, { status: 400 })
    }
    const parts: string[] = [`Business type: ${businessType || "local business"}`]
    if (currentContent?.title) parts.push(`SEO title: ${currentContent.title}`)
    if (currentContent?.description) parts.push(`SEO description: ${currentContent.description}`)
    if (currentContent?.og_title) parts.push(`OG title: ${currentContent.og_title}`)
    if (currentContent?.og_description) parts.push(`OG description: ${currentContent.og_description}`)
    pageContext = parts.join("\n")
  }

  let prompt = ""

  if (field === "title") {
    prompt = `You are an expert SEO copywriter. Generate a single optimized SEO page title based on the website content below.

WEBSITE CONTENT:
${pageContext}

Current SEO title: "${currentContent?.title || "(none)"}"
Current SEO description: "${currentContent?.description || "(none)"}"

Rules:
- MUST be between 30 and 60 characters. Count every character carefully.
- Do NOT use generic filler like "Welcome to" or "Built with"
- Do NOT invent services or claims not present in the content
- Return raw JSON only, no markdown, no code fences

Format: {"title":"..."}`
  } else if (field === "description") {
    prompt = `You are an expert SEO copywriter. Generate a single optimized meta description based on the website content below.

WEBSITE CONTENT:
${pageContext}

Current SEO title: "${currentContent?.title || "(none)"}"
Current SEO description: "${currentContent?.description || "(none)"}"

Rules:
- MUST be between 70 and 155 characters. Count every character carefully.
- Should be compelling and include a call to action
- Do NOT use generic filler like "Welcome to" or "Built with"
- Do NOT invent services or claims not present in the content
- Return raw JSON only, no markdown, no code fences

Format: {"description":"..."}`
  } else if (field === "og_title") {
    prompt = `You are an expert SEO copywriter. Generate a single Open Graph (og:title) for social media sharing based on the website content below.

WEBSITE CONTENT:
${pageContext}

Current SEO title: "${currentContent?.title || "(none)"}"
Current OG title: "${currentContent?.og_title || "(none)"}"

Rules:
- MUST be between 30 and 60 characters. Count every character carefully.
- Should be engaging and click-worthy for social media (Facebook, Twitter, LinkedIn)
- Do NOT use generic filler like "Welcome to" or "Built with"
- Do NOT invent services or claims not present in the content
- Return raw JSON only, no markdown, no code fences

Format: {"og_title":"..."}`
  } else if (field === "og_description") {
    prompt = `You are an expert SEO copywriter. Generate a single Open Graph (og:description) for social media sharing based on the website content below.

WEBSITE CONTENT:
${pageContext}

Current SEO description: "${currentContent?.description || "(none)"}"
Current OG description: "${currentContent?.og_description || "(none)"}"

Rules:
- MUST be between 60 and 155 characters. Count every character carefully.
- Should be compelling and entice users to click when shared on social media
- Do NOT use generic filler like "Welcome to" or "Built with"
- Do NOT invent services or claims not present in the content
- Return raw JSON only, no markdown, no code fences

Format: {"og_description":"..."}`
  } else {
    prompt = `You are an expert SEO copywriter. Generate 4 to 6 relevant SEO keyword phrases based on the website content below.

WEBSITE CONTENT:
${pageContext}

Current SEO title: "${currentContent?.title || "(none)"}"

Rules:
- 4 to 6 short keyword phrases (2–4 words each)
- Use keywords that appear naturally in the page content
- If location info is present, include at least one location-based keyword
- Do NOT invent services or claims not present in the content
- Return raw JSON only, no markdown, no code fences

Format: {"keywords":["...","...","...","..."]}`
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 256 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Gemini SEO field error:", err)
      return NextResponse.json({ error: "Gemini request failed" }, { status: 502 })
    }

    const geminiData = await res.json()
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const cleaned = rawText.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(cleaned)

    if (field === "title") {
      const title = typeof parsed.title === "string" ? parsed.title.trim().slice(0, 60) : ""
      if (!title) return NextResponse.json({ error: "No title generated." }, { status: 500 })
      return NextResponse.json({ title })
    } else if (field === "description") {
      const description = typeof parsed.description === "string" ? parsed.description.trim().slice(0, 155) : ""
      if (!description) return NextResponse.json({ error: "No description generated." }, { status: 500 })
      return NextResponse.json({ description })
    } else if (field === "og_title") {
      const og_title = typeof parsed.og_title === "string" ? parsed.og_title.trim().slice(0, 60) : ""
      if (!og_title) return NextResponse.json({ error: "No OG title generated." }, { status: 500 })
      return NextResponse.json({ og_title })
    } else if (field === "og_description") {
      const og_description = typeof parsed.og_description === "string" ? parsed.og_description.trim().slice(0, 155) : ""
      if (!og_description) return NextResponse.json({ error: "No OG description generated." }, { status: 500 })
      return NextResponse.json({ og_description })
    } else {
      const keywords = Array.isArray(parsed.keywords)
        ? parsed.keywords.filter((k: any) => typeof k === "string").slice(0, 6)
        : []
      if (keywords.length === 0) return NextResponse.json({ error: "No keywords generated." }, { status: 500 })
      return NextResponse.json({ keywords })
    }
  } catch (e) {
    console.error("AI SEO field error:", e)
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
  }
}
