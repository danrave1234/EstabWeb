import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent";

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const { prompt: userPrompt } = await req.json();
    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim().length < 5) {
        return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
    }

    const prompt = `You are a website content writer. A user provided the following information about their business:

"${userPrompt.trim()}"

Based ONLY on this information (or inferring reasonable defaults if missing, like a generic title), respond with a JSON object (no markdown, no code fences, raw JSON only) with exactly these fields:
1. "brandName" - the name of the business (string)
2. "heroTitle" - a short, catchy main headline for the website (string)
3. "heroSubtitle" - a brief 1-2 sentence description or slogan (string)
4. "contactEmail" - their email address, if provided, otherwise empty string (string)
5. "contactPhone" - their phone number, if provided, otherwise empty string (string)
6. "location" - their city/state/service area, if provided, otherwise empty string (string)

Ensure the output is raw valid JSON.
Example response:
{"brandName":"RainCity Plumbers","heroTitle":"Reliable Plumbing in Seattle","heroSubtitle":"Available 24/7 for all your plumbing emergencies and installations.","contactEmail":"contact@raincity.com","contactPhone":"123-456-7890","location":"Seattle, WA"}`;

    try {
        const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("Gemini error:", err);
            return NextResponse.json({ error: "Gemini request failed" }, { status: 502 });
        }

        const geminiData = await res.json();
        const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        // Strip any accidental markdown fences
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return NextResponse.json(parsed);
    } catch (e) {
        console.error("AI populate error:", e);
        return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
}
