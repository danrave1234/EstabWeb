import { NextRequest, NextResponse } from "next/server";
import { GENRE_LABELS } from "@/config/presets";
import { rateLimit, getClientIp, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent";

const VALID_INDUSTRIES = Object.keys(GENRE_LABELS);

const VALID_SECTIONS = [
  "hero", "services", "testimonials", "contact", "pricing", "faq--two-column",
  "team", "blog_preview", "certifications", "gallery", "service_area", "comparison",
  "stats", "case_study", "announcement_bar", "cta--sticky", "faq",
  "process", "trust_badges", "booking",
  "free_consultation", "service_detail", "lead_capture", "guarantee",
  "gym--programs", "gym--schedule", "gym--memberships", "gym--class-types", "gym--trainers", "gym--results", "gym--facility", "gym--faq",
];

// Sections that are only relevant when the business explicitly needs them.
// The AI must NOT suggest these unless the business description clearly implies them.
const GATED_SECTIONS: Record<string, string> = {
  "booking": "Only include if the business explicitly takes appointments or bookings (e.g. salon, clinic, dentist, photographer scheduling sessions).",
  "free_consultation": "Only include if the business explicitly offers free consultations (e.g. law firm, financial advisor, contractor).",
  "service_area": "Only include if the business serves a specific geographic area and coverage matters (e.g. pest control, HVAC, plumber).",
  "faq--two-column": "Only include if the business has medical or health-related clients.",
  "lead_capture": "Only include if the business relies on lead generation forms (e.g. real estate, insurance).",
  "case_study": "Only include if the business has project-based work to showcase (e.g. agency, contractor, law firm).",
  "gallery": "Only include if the business has visible transformation results (e.g. cleaning, detailing, renovation, aesthetics).",
  "guarantee": "Only include if the business explicitly offers warranties or satisfaction guarantees.",
};

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  // Rate limit: 10 req/min per IP
  const ip = getClientIp(req.headers);
  const rl = await rateLimit(ip, RATE_LIMIT_PRESETS.ai);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { description } = await req.json();
  if (!description || typeof description !== "string" || description.trim().length < 5) {
    return NextResponse.json({ error: "Description too short" }, { status: 400 });
  }

  const gatedRules = Object.entries(GATED_SECTIONS)
    .map(([id, rule]) => `  - "${id}": ${rule}`)
    .join("\n");

  const prompt = `You are a website builder assistant. A user described their business as:

"${description.trim()}"

Based ONLY on what the user described, respond with a JSON object (no markdown, no code fences, raw JSON only) with:
1. "industry" - the best matching industry key from this list: ${VALID_INDUSTRIES.join(", ")}
2. "sections" - an array of 4-7 section IDs from this list: ${VALID_SECTIONS.join(", ")}
3. "presetKey" - same value as "industry"
4. "reasoning" - one short sentence explaining your industry choice

Strict rules:
- Only use exact keys from the provided lists.
- Always include "hero", "features", "contact".
- Only suggest sections that are clearly relevant to what the user described. Do NOT assume or add sections just because they are common — only add them if the business description implies a need.
- The following sections are RESTRICTED and must only be included if the business description clearly justifies them:
${gatedRules}
- If the description does not mention appointments, bookings, consultations, geographic coverage, medical clients, or project work — do NOT include those gated sections.
- Prefer fewer, accurate sections over many guessed ones.

Example response:
{"industry":"pest_control","sections":["hero","services","testimonials","contact","process","trust_badges"],"presetKey":"pest_control","reasoning":"Pest control service businesses benefit from trust signals and a clear process overview."}`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ error: "Gemini request failed" }, { status: 502 });
    }

    const geminiData = await res.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip any accidental markdown fences
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Validate and sanitize
    const industry = VALID_INDUSTRIES.includes(parsed.industry)
      ? parsed.industry
      : VALID_INDUSTRIES[0];
    const sections = Array.isArray(parsed.sections)
      ? parsed.sections.filter((s: string) => VALID_SECTIONS.includes(s))
      : ["hero", "services", "contact"];
    const presetKey = VALID_INDUSTRIES.includes(parsed.presetKey)
      ? parsed.presetKey
      : industry;
    const reasoning = typeof parsed.reasoning === "string" ? parsed.reasoning : "";

    return NextResponse.json({ industry, sections, presetKey, reasoning });
  } catch (e) {
    console.error("AI suggest error:", e);
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
