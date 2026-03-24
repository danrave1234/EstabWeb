import { NextRequest, NextResponse } from "next/server";
import { GENRE_LABELS, GENRE_PRESETS } from "@/config/presets";
import { COLOR_THEME_SWATCHES, formatSectionLabel, sectionIdToKey, TYPOGRAPHY_OPTIONS } from "@/config/dashboard-config";
import { scrapeUrlWithApify } from "@/lib/utils/scraper";
import { SECTION_FIELD_SCHEMA } from "@/lib/ai/section-field-schema";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TEMPLATE_AI_MODEL = process.env.GEMINI_TEMPLATE_MODEL?.trim() || "gemini-1.5-flash";
const TEMPLATE_AI_USE_SEARCH_DEFAULT = (process.env.GEMINI_TEMPLATE_USE_SEARCH ?? "true").toLowerCase() !== "false";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TEMPLATE_AI_MODEL}:generateContent`;

interface PopulateTemplateRawResponse {
    brandName: string;
    heroTitle: string;
    heroSubtitle: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    theme?: string;
    colorTheme?: string;
    typographyStyle?: string;
    headerStyle?: string;
    footerStyle?: string;
    darkMode?: boolean;
    activeSections?: string[];
    logoUrl?: string;
    heroImageUrl?: string;
    sectionsData?: Record<string, any>;
}

interface PopulateTemplateResponse {
    brandName: string;
    heroTitle: string;
    heroSubtitle: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
    theme: string;
    colorTheme: string;
    typographyStyle: string;
    headerStyle: string;
    footerStyle: string;
    darkMode?: boolean;
    activeSections: string[];
    logoUrl: string;
    heroImageUrl: string;
    sectionsData: Record<string, any>;
}

interface InlineImageInput {
    mimeType: string;
    data: string;
}

interface OptionItem {
    id: string;
    label: string;
    [key: string]: unknown;
}

interface PresetHint {
    id: string;
    label: string;
    theme: string;
    colorTheme: string;
    typographyStyle: string;
    activeSections: string[];
}

function getModelText(geminiData: any): string {
    const parts = (geminiData?.candidates?.[0]?.content?.parts ?? []) as Array<{ text?: string }>;
    const joined = parts
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .filter((text) => text.length > 0)
        .join("\n")
        .trim();
    return joined;
}

function shouldRetryWithoutSearch(errorText: string): boolean {
    const lower = errorText.toLowerCase();
    return (
        lower.includes("tool use with a response mime type") ||
        lower.includes("tools are not supported") ||
        lower.includes("google_search") ||
        lower.includes("invalid_argument")
    );
}

function parseAiJson(rawText: string): PopulateTemplateRawResponse {
    // Remove Gemini search citations e.g., [cite: 1, 2] or 
    let cleaned = rawText.replace(/\[cite:[^\]]*\]/gi, "");
    cleaned = cleaned.replace(/\[\d+\]/g, ""); // Remove [1], [2] style citations
    cleaned = cleaned.replace(/```json|```/g, "").trim();

    try {
        return JSON.parse(cleaned);
    } catch (parseError) {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start) {
            try {
                return JSON.parse(cleaned.slice(start, end + 1));
            } catch (innerError) {
                console.error("AI JSON inner parse error:", innerError);
                console.error("Attempted to parse block:", cleaned.slice(start, end + 1));
            }
        }
        console.error("AI returned non-JSON text or malformed JSON. Raw text preview:", rawText.slice(0, 500));
        throw new Error("Model did not return JSON");
    }
}

function toStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
}

function unique(values: string[]): string[] {
    return Array.from(new Set(values));
}

function humanizeToken(value: string): string {
    return value
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toOptionItems(value: unknown): OptionItem[] {
    if (!Array.isArray(value)) return [];

    const out: OptionItem[] = [];
    for (const raw of value) {
        if (typeof raw === "string") {
            const id = raw.trim();
            if (!id) continue;
            out.push({ id, label: humanizeToken(id) });
            continue;
        }

        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
        const item = raw as Record<string, unknown>;
        const rawId = item.id ?? item.value ?? item.key ?? "";
        if (typeof rawId !== "string") continue;
        const id = rawId.trim();
        if (!id) continue;

        const rawLabel = item.label ?? item.name;
        const label = typeof rawLabel === "string" && rawLabel.trim() ? rawLabel.trim() : humanizeToken(id);
        out.push({ ...item, id, label });
    }

    const seen = new Set<string>();
    return out.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

function toOptionIds(items: OptionItem[]): string[] {
    return unique(items.map((item) => item.id));
}

function toLabelLookup(items: OptionItem[]): Map<string, string> {
    return new Map(items.map((item) => [item.id, item.label]));
}

function toPresetHints(value: unknown): PresetHint[] {
    if (!Array.isArray(value)) return [];

    const out: PresetHint[] = [];
    for (const raw of value) {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
        const item = raw as Record<string, unknown>;

        const rawId = item.id ?? item.key ?? item.presetKey ?? "";
        const rawTheme = item.theme ?? "";
        const rawColorTheme = item.colorTheme ?? "";
        if (typeof rawId !== "string" || typeof rawTheme !== "string" || typeof rawColorTheme !== "string") continue;

        const id = rawId.trim();
        const theme = rawTheme.trim();
        const colorTheme = rawColorTheme.trim();
        if (!id || !theme || !colorTheme) continue;

        const rawLabel = item.label ?? item.name;
        const label = typeof rawLabel === "string" && rawLabel.trim() ? rawLabel.trim() : humanizeToken(id);
        const typographyStyle =
            typeof item.typographyStyle === "string" && item.typographyStyle.trim()
                ? item.typographyStyle.trim()
                : "modern";

        out.push({
            id,
            label,
            theme,
            colorTheme,
            typographyStyle,
            activeSections: toStringArray(item.activeSections),
        });
    }

    const seen = new Set<string>();
    return out.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

function buildPresetHintsFromConfig(allowedSections: Set<string>): PresetHint[] {
    return Object.entries(GENRE_PRESETS).map(([id, preset]) => {
        const activeSections = Array.isArray(preset.activeSections)
            ? preset.activeSections.filter((sectionId): sectionId is string => typeof sectionId === "string")
            : [];
        const filteredSections = allowedSections.size > 0
            ? activeSections.filter((sectionId) => allowedSections.has(sectionId))
            : activeSections;

        return {
            id,
            label: GENRE_LABELS[id] || humanizeToken(id),
            theme: preset.theme,
            colorTheme: preset.colorTheme,
            typographyStyle: preset.typographyStyle || "modern",
            activeSections: filteredSections,
        };
    });
}

function hexToRgb(hex: string): [number, number, number] | null {
    const cleaned = hex.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
    const full = cleaned.length === 3 ? cleaned.split("").map((char) => char + char).join("") : cleaned;
    const intVal = parseInt(full, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return [r, g, b];
}

function relativeLuminance(r: number, g: number, b: number): number {
    const normalize = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const [R, G, B] = [normalize(r), normalize(g), normalize(b)];
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function recommendedModeForColorTheme(themeId: string): "dark" | "light" | "either" {
    const swatches = COLOR_THEME_SWATCHES[themeId];
    const fallbackId = themeId.toLowerCase();
    if (!swatches) {
        if (fallbackId.includes("dark") || fallbackId.includes("black") || fallbackId.includes("midnight")) return "dark";
        if (fallbackId.includes("light") || fallbackId.includes("white")) return "light";
        return "either";
    }

    const bgCandidate = swatches[2] || swatches[0];
    const rgb = hexToRgb(bgCandidate);
    if (!rgb) return "either";

    return relativeLuminance(rgb[0], rgb[1], rgb[2]) < 0.45 ? "dark" : "light";
}

function pickAllowed(value: unknown, allowedValues: string[]): string {
    if (typeof value !== "string") return "";
    const normalized = value.trim();
    if (!normalized) return "";
    return allowedValues.includes(normalized) ? normalized : "";
}

function sanitizeSections(value: unknown, allowedValues: string[], fallback: string[]): string[] {
    const allowedSet = new Set(allowedValues);
    const fromModel = unique(
        toStringArray(value).filter((sectionId) => allowedSet.has(sectionId))
    );

    if (fromModel.length > 0) return fromModel.slice(0, 24);
    return unique(fallback.filter((sectionId) => allowedSet.has(sectionId))).slice(0, 24);
}

function parseInlineImageDataUrl(value: unknown): InlineImageInput | null {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    const match = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) return null;

    const mimeType = match[1].toLowerCase();
    const data = match[2].replace(/\s+/g, "");

    if (!mimeType.startsWith("image/")) return null;
    if (!data || data.length < 120) return null;
    if (data.length > 5_500_000) return null;

    return { mimeType, data };
}

function sanitizeHttpUrl(value: unknown): string {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
        return parsed.toString();
    } catch {
        return "";
    }
}

function looksLikeImageUrl(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
        lower.includes(".png") ||
        lower.includes(".jpg") ||
        lower.includes(".jpeg") ||
        lower.includes(".webp") ||
        lower.includes(".svg") ||
        lower.includes("image") ||
        lower.includes("photo")
    );
}

function stripTags(value: string): string {
    return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function findFirst(text: string, regex: RegExp): string {
    const match = text.match(regex);
    return match?.[1]?.trim() || "";
}

function extractMetaMap(html: string): Record<string, string> {
    const map: Record<string, string> = {};

    const metaRegexA = /<meta\s+[^>]*?(?:property|name)\s*=\s*["']([^"']+)["'][^>]*?content\s*=\s*["']([^"']*)["'][^>]*?>/gi;
    const metaRegexB = /<meta\s+[^>]*?content\s*=\s*["']([^"']*)["'][^>]*?(?:property|name)\s*=\s*["']([^"']+)["'][^>]*?>/gi;

    let matchA: RegExpExecArray | null;
    while ((matchA = metaRegexA.exec(html)) !== null) {
        const key = matchA[1]?.toLowerCase().trim();
        const value = matchA[2]?.trim();
        if (key && value && !map[key]) map[key] = value;
    }

    let matchB: RegExpExecArray | null;
    while ((matchB = metaRegexB.exec(html)) !== null) {
        const key = matchB[2]?.toLowerCase().trim();
        const value = matchB[1]?.trim();
        if (key && value && !map[key]) map[key] = value;
    }

    return map;
}

interface PageSignals {
    sourceUrl: string;
    title: string;
    description: string;
    logoUrl: string;
    heroImageUrl: string;
    email: string;
    phone: string;
    location: string;
    recentPosts?: { text: string; imageUrl: string }[];
}

async function extractPageSignals(sourceUrl: string): Promise<PageSignals | null> {
    const url = sanitizeHttpUrl(sourceUrl);
    if (!url) return null;

    const isSocial = /facebook\.com|instagram\.com|linkedin\.com|x\.com|twitter\.com/i.test(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            },
            signal: controller.signal,
        });

        if (!res.ok) {
            // Social media sites often block direct fetch. We'll handle scraping via Apify higher up.
            if (isSocial) {
                return null;
            }
            return null;
        }

        const htmlRaw = await res.text();
        const html = htmlRaw.slice(0, 600_000);
        const meta = extractMetaMap(html);
        const text = normalizeWhitespace(stripTags(html));

        const title =
            meta["og:title"] ||
            meta["twitter:title"] ||
            findFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
        const description =
            meta["og:description"] ||
            meta["twitter:description"] ||
            meta["description"] ||
            "";

        const ogImage = sanitizeHttpUrl(meta["og:image"] || meta["twitter:image"] || "");
        const logoCandidate =
            sanitizeHttpUrl(meta["og:logo"] || "") ||
            sanitizeHttpUrl(meta["logo"] || "") ||
            (looksLikeImageUrl(ogImage) ? ogImage : "");
        const heroCandidate = sanitizeHttpUrl(meta["og:image:secure_url"] || "") || ogImage;

        const email =
            findFirst(html, /mailto:([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i) ||
            findFirst(text, /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i);

        const phone =
            findFirst(html, /tel:([+\d][\d\s\-()]{6,})/i) ||
            findFirst(text, /(\+?\d[\d\s\-()]{7,}\d)/i);

        const location =
            meta["business:contact_data:locality"] ||
            meta["place:location:locality"] ||
            findFirst(text, /\b([A-Z][a-zA-Z]+,\s*[A-Z][a-zA-Z]+)\b/);

        return {
            sourceUrl: url,
            title: normalizeWhitespace(title),
            description: normalizeWhitespace(description),
            logoUrl: logoCandidate,
            heroImageUrl: heroCandidate,
            email: normalizeWhitespace(email),
            phone: normalizeWhitespace(phone),
            location: normalizeWhitespace(location),
        };
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const userPrompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const useSearch = typeof body?.useSearch === "boolean" ? body.useSearch : TEMPLATE_AI_USE_SEARCH_DEFAULT;
    const businessPageUrl = sanitizeHttpUrl(body?.businessPageUrl);
    const inlineImage = parseInlineImageDataUrl(body?.businessImageDataUrl);
    const options = body?.options ?? {};
    const themeOptions = toOptionItems(options?.themes);
    const colorThemeOptions = toOptionItems(options?.colorThemes);
    const typographyStyleOptions = toOptionItems(options?.typographyStyles);
    const headerStyleOptions = toOptionItems(options?.headerStyles);
    const footerStyleOptions = toOptionItems(options?.footerStyles);
    const sectionOptions = toOptionItems(options?.sections);
    const sectionIdsFromLegacy = toStringArray(options?.sectionIds);
    const presetHintsFromRequest = toPresetHints(options?.presets);

    const themes = toOptionIds(themeOptions);
    const colorThemes = toOptionIds(colorThemeOptions);
    const typographyStyles = toOptionIds(typographyStyleOptions);
    const headerStyles = toOptionIds(headerStyleOptions);
    const footerStyles = toOptionIds(footerStyleOptions);
    const sectionIds = unique([...sectionIdsFromLegacy, ...toOptionIds(sectionOptions)]);
    const fallbackSections = unique(toStringArray(body?.currentConfig?.activeSections));

    const themeLabelLookup = toLabelLookup(themeOptions);
    const colorThemeLabelLookup = toLabelLookup(colorThemeOptions);
    const typographyLabelLookup = toLabelLookup(typographyStyleOptions);
    const sectionLabelLookup = toLabelLookup(sectionOptions);
    const typographyLookup = new Map(TYPOGRAPHY_OPTIONS.map((item) => [item.value, item]));
    const allowedSectionSet = new Set(sectionIds);

    const sectionContext = sectionIds.map((id) => ({
        id,
        label: sectionLabelLookup.get(id) || formatSectionLabel(id),
        configKey: sectionIdToKey(id),
    }));

    const colorThemeContext = colorThemes.map((id) => {
        const swatches = COLOR_THEME_SWATCHES[id];
        const mode = recommendedModeForColorTheme(id);
        return {
            id,
            label: colorThemeLabelLookup.get(id) || humanizeToken(id),
            primary: swatches?.[0] || "",
            accent: swatches?.[1] || "",
            background: swatches?.[2] || "",
            recommendedMode: mode,
        };
    });

    const typographyContext = typographyStyles.map((id) => ({
        id,
        label: typographyLabelLookup.get(id) || typographyLookup.get(id)?.label || humanizeToken(id),
        fontFamily: typographyLookup.get(id)?.fontFamily || "",
    }));

    const presetContextRaw = presetHintsFromRequest.length > 0
        ? presetHintsFromRequest
        : buildPresetHintsFromConfig(allowedSectionSet);

    const presetContext = presetContextRaw.map((preset) => ({
        ...preset,
        activeSections: allowedSectionSet.size > 0
            ? preset.activeSections.filter((sectionId) => allowedSectionSet.has(sectionId))
            : preset.activeSections,
    }));

    const themeContext = themes.map((id) => ({
        id,
        label: themeLabelLookup.get(id) || humanizeToken(id),
        relatedPresets: presetContext
            .filter((preset) => preset.theme === id)
            .map((preset) => ({ id: preset.id, label: preset.label }))
            .slice(0, 6),
    }));

    if (userPrompt.length < 5 && !businessPageUrl && !inlineImage) {
        return NextResponse.json({ error: "Provide at least a description, business URL, or screenshot." }, { status: 400 });
    }

    let pageSignals = businessPageUrl ? await extractPageSignals(businessPageUrl) : null;
    let scrapedText = "";

    const isSocial = businessPageUrl ? /facebook\.com|instagram\.com|linkedin\.com|x\.com|twitter\.com/i.test(businessPageUrl) : false;
    if (businessPageUrl && (!pageSignals || isSocial)) {
        console.log("Using Apify scraper to bypass blocks for:", businessPageUrl);
        const apifyData = await scrapeUrlWithApify(businessPageUrl);
        if (apifyData) {
            scrapedText = apifyData.text;
            if (!pageSignals) {
                pageSignals = {
                    sourceUrl: businessPageUrl,
                    title: apifyData.title || "",
                    description: apifyData.description || apifyData.text.slice(0, 200),
                    logoUrl: apifyData.logoUrl || "",
                    heroImageUrl: apifyData.heroImageUrl || "",
                    email: apifyData.email || "",
                    phone: apifyData.phone || "",
                    location: apifyData.location || "",
                    recentPosts: apifyData.recentPosts || [],
                };
            } else {
                pageSignals.logoUrl = apifyData.logoUrl || pageSignals.logoUrl;
                pageSignals.heroImageUrl = apifyData.heroImageUrl || pageSignals.heroImageUrl;
                pageSignals.email = apifyData.email || pageSignals.email;
                pageSignals.phone = apifyData.phone || pageSignals.phone;
                pageSignals.location = apifyData.location || pageSignals.location;
                pageSignals.recentPosts = apifyData.recentPosts || [];
            }
        }
    }

    const inlineImages: Array<{ mimeType: string; data: string }> = [];
    if (inlineImage) inlineImages.push(inlineImage);

    // Fetch scraped images, upload to our own bucket to prevent CDN expiration, and append to parts array.
    if (pageSignals?.logoUrl || pageSignals?.heroImageUrl) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );

        const uploadAndGetPublicUrl = async (imgUrl: string): Promise<string | null> => {
            if (!imgUrl) return null;
            try {
                const imgRes = await fetch(imgUrl);
                if (!imgRes.ok) return null;
                const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
                if (!contentType.startsWith('image/')) return null;
                const arrayBuffer = await imgRes.arrayBuffer();
                
                // Upload to site-assets bucket
                const ext = contentType.split('/').pop()?.replace(/x-/g, '') || 'jpg';
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
                
                const { error } = await supabaseAdmin.storage
                    .from('site-assets')
                    .upload(fileName, arrayBuffer, {
                        contentType: contentType,
                        upsert: false
                    });
                    
                if (error) {
                    console.error('Failed to upload scraped image to Supabase:', error);
                    return null; // Fallback to failing uploading but still inline image
                }

                const { data: { publicUrl } } = supabaseAdmin.storage.from('site-assets').getPublicUrl(fileName);
                
                // Add to inline_data for Gemini
                const base64Data = Buffer.from(arrayBuffer).toString('base64');
                if (base64Data.length < 5_500_000) {
                    inlineImages.push({ mimeType: contentType, data: base64Data });
                }
                
                return publicUrl;
            } catch (e) {
                console.error('Failed to process scraped image:', e);
                return null;
            }
        };

        const [newLogoUrl, newHeroUrl] = await Promise.all([
            uploadAndGetPublicUrl(pageSignals.logoUrl),
            uploadAndGetPublicUrl(pageSignals.heroImageUrl)
        ]);

        if (newLogoUrl) {
            pageSignals.logoUrl = newLogoUrl;
        }
        if (newHeroUrl) {
            pageSignals.heroImageUrl = newHeroUrl;
        }

        if (pageSignals.recentPosts && pageSignals.recentPosts.length > 0) {
            const uploadedPosts = await Promise.all(
                pageSignals.recentPosts.map(async (post: any) => {
                    if (!post.imageUrl) return post;
                    // For posts, we don't inline them to Gemini context window limit, just upload.
                    const newUrl = await uploadAndGetPublicUrl(post.imageUrl);
                    return { ...post, imageUrl: newUrl || post.imageUrl };
                })
            );
            pageSignals.recentPosts = uploadedPosts;
        }
    }

    const prompt = `You are a website content writer and template strategist for local business websites.
A user provided the following information about their business:

"${userPrompt || "No free-text description provided. Infer from provided business URL/screenshot when available."}"

Public business page URL (optional): ${businessPageUrl || "none"}
Public page extracted signals (if available): ${pageSignals ? JSON.stringify(pageSignals) : "none"}
Directly scraped webpage text: ${scrapedText ? scrapedText.slice(0, 4000) : "none"}
Business screenshot/logo image provided explicitly: ${inlineImage ? "yes" : "no"}
Search enabled for this request: ${useSearch ? "yes" : "no"}

TEMPLATE DESIGN-SYSTEM CONTEXT (JSON):
${JSON.stringify(
        {
            heroThemes: themeContext,
            colorThemes: colorThemeContext,
            typographyStyles: typographyContext,
            headerStyles,
            footerStyles,
            sections: sectionContext,
            presetBlueprints: presetContext,
            sectionFieldSchema: SECTION_FIELD_SCHEMA,
        },
        null,
        2
    )}

If search tools are enabled, MANDATORY: Use web search to ground answers to the latest publicly available business information.
Specifically search for:
1. The exact official business name (do NOT invent names).
2. Official brand colors (look for logo colors, website theme, and social media branding).
3. Official logo URL and high-quality hero/background images.
4. Real contact details (email, phone, address) - leave empty if not found, do NOT create fake ones.
5. Actual services, programs, or products offered.

If details are missing after search, infer professional defaults only for marketing copy, never for identity/contact data.

Selection strategy (must follow):
1. Infer the business type and positioning from prompt + signals + search.
2. MATCH BRAND COLORS: Analyze search results AND any provided images/photos to determine the dominant brand color. Look specifically at the logo picture if available. Match the color to the closest "colorTheme" from the provided list.
   CRITICAL: If the brand is well-known (e.g., "Anytime Fitness"), you MUST use its iconic colors (e.g., Purple).
3. Choose the closest preset from "presetBlueprints" as baseline, but OVERRIDE its theme/color/typography/sections if business evidence requires a better match.
4. Ensure darkMode aligns with the chosen color theme's "recommendedMode" unless there is strong style evidence to override.
5. FULLY UTILIZE PAGE SECTIONS: Do not rely solely on basic generic sections. STRONGLY PREFER modern, premium variations (e.g. 'services--bento', 'hero--v6', 'hero--elegant-carousel', 'testimonials--community', 'features--steps', 'gallery--grid') over generic ones to make the design stand out.
6. LEGITIMATE PRICING: If the business has clear pricing signals or needs packages, prefer detailed tables like 'pricing--comparison' or 'pricing--feature-comparison' over basic ones.
7. DO NOT include citations (like [1], [cite: 1]) in your output strings. Return clean text.

Respond with a JSON object (no markdown, no code fences, raw JSON only) with exactly these fields:
1. "brandName" - the exact name of the business (string)
2. "heroTitle" - a short, catchy main headline for the website (string)
3. "heroSubtitle" - a brief 1-2 sentence description or slogan (string)
4. "contactEmail" - their real email address, otherwise empty string (string)
5. "contactPhone" - their real phone number, otherwise empty string (string)
6. "location" - their real city/state/service area, otherwise empty string (string)
7. "theme" - choose one from this exact list: ${themes.join(", ") || "none"}
8. "colorTheme" - choose one from this exact list: ${colorThemes.join(", ") || "none"}
9. "typographyStyle" - choose one from this exact list: ${typographyStyles.join(", ") || "none"}
10. "headerStyle" - choose one from this exact list: ${headerStyles.join(", ") || "none"}
11. "footerStyle" - choose one from this exact list: ${footerStyles.join(", ") || "none"}
12. "darkMode" - boolean, pick true if that business style fits better, else false
13. "activeSections" - array of section IDs chosen from this exact list: ${sectionIds.join(", ") || "none"}
14. "logoUrl" - absolute image URL of the official logo found via signals or search (e.g. from Facebook profile pic or official site)
15. "heroImageUrl" - absolute high-quality image URL for the background (e.g. facility photo, team, or matching high-quality stock)
16. "sectionsData" - an object where keys are the valid configKeys from the sections you chose in "activeSections", and values are objects populated with ACTUAL REAL DATA, according to the "sectionFieldSchema". Do NOT return placeholders! Use the provided scraped text and 'recentPosts' to fully write the content.

Rules for "activeSections":
- Balance sections to create a complete, professional website.
- Sequence: Hero -> Value Prop/About -> Services/Features -> Social Proof (Testimonials/Gallery) -> FAQ/Trust -> Pricing/Packages -> Contact.
- Include between 8 and 14 sections if enough options exist.
- Include at least one contact/conversion section.
- Use only IDs from the allowed list.

Ensure the output is raw valid JSON.
Example response:
{"brandName":"RainCity Plumbers","heroTitle":"Reliable Plumbing in Seattle","heroSubtitle":"Available 24/7 for all your plumbing emergencies and installations.","contactEmail":"contact@raincity.com","contactPhone":"123-456-7890","location":"Seattle, WA","theme":"hvac-urgent","colorTheme":"reliable","typographyStyle":"modern","headerStyle":"floating","footerStyle":"lead-magnet","darkMode":false,"activeSections":["hero-emergency","features","testimonials","pricing","contact"],"logoUrl":"https://example.com/logo.png","heroImageUrl":"https://example.com/cover.jpg","sectionsData":{"features":{"title":"Our Plumbing Services","items":[{"title":"Emergency Repair","description":"24/7 support."}]}}}`;

    try {
        const parts: Array<Record<string, unknown>> = [{ text: prompt }];

        inlineImages.forEach((img) => {
            parts.push({
                inline_data: {
                    mime_type: img.mimeType,
                    data: img.data,
                },
            });
        });

        const requestBody: Record<string, unknown> = {
            contents: [{ parts }],
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 8192,
                response_mime_type: useSearch ? "text/plain" : "application/json",
            },
        };

        if (useSearch) {
            requestBody.tools = [{ google_search: {} }];
        }

        const callGemini = async (body: Record<string, unknown>) =>
            fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

        let res = await callGemini(requestBody);
        let searchFallbackUsed = false;

        if (!res.ok) {
            const err = await res.text();
            if (useSearch && shouldRetryWithoutSearch(err)) {
                console.warn("Gemini search request failed; retrying without search tool.");
                const retryBody: Record<string, unknown> = {
                    contents: requestBody.contents,
                    generationConfig: requestBody.generationConfig,
                };
                res = await callGemini(retryBody);
                searchFallbackUsed = true;
            } else {
                console.error("Gemini error:", err);
                return NextResponse.json({ error: "Gemini request failed" }, { status: 502 });
            }
        }

        if (!res.ok) {
            const retryErr = await res.text();
            console.error("Gemini retry error:", retryErr);
            return NextResponse.json({ error: "Gemini request failed" }, { status: 502 });
        }

        const geminiData = await res.json() as any;
        const rawText = getModelText(geminiData);
        const parsed = parseAiJson(rawText);

        const sources = Array.from(
            new Set(
                ((geminiData?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []) as Array<any>)
                    .map((chunk) => chunk?.web?.uri)
                    .filter((uri): uri is string => typeof uri === "string" && uri.length > 0)
            )
        );

        const normalized: PopulateTemplateResponse = {
            brandName: typeof parsed.brandName === "string" ? parsed.brandName : "",
            heroTitle: typeof parsed.heroTitle === "string" ? parsed.heroTitle : "",
            heroSubtitle: typeof parsed.heroSubtitle === "string" ? parsed.heroSubtitle : "",
            contactEmail: typeof parsed.contactEmail === "string" ? parsed.contactEmail : pageSignals?.email || "",
            contactPhone: typeof parsed.contactPhone === "string" ? parsed.contactPhone : pageSignals?.phone || "",
            location: typeof parsed.location === "string" ? parsed.location : pageSignals?.location || "",
            theme: pickAllowed(parsed.theme, themes),
            colorTheme: pickAllowed(parsed.colorTheme, colorThemes),
            typographyStyle: pickAllowed(parsed.typographyStyle, typographyStyles),
            headerStyle: pickAllowed(parsed.headerStyle, headerStyles),
            footerStyle: pickAllowed(parsed.footerStyle, footerStyles),
            darkMode: typeof parsed.darkMode === "boolean" ? parsed.darkMode : undefined,
            activeSections: sanitizeSections(parsed.activeSections, sectionIds, fallbackSections),
            logoUrl:
                sanitizeHttpUrl(parsed.logoUrl) ||
                pageSignals?.logoUrl ||
                "",
            heroImageUrl:
                sanitizeHttpUrl(parsed.heroImageUrl) ||
                pageSignals?.heroImageUrl ||
                "",
            sectionsData: typeof parsed.sectionsData === "object" && parsed.sectionsData !== null ? parsed.sectionsData : {},
        };

        const selectedColorTheme = normalized.colorTheme;
        if (typeof normalized.darkMode !== "boolean" && selectedColorTheme) {
            const recommendedMode = recommendedModeForColorTheme(selectedColorTheme);
            if (recommendedMode === "dark") normalized.darkMode = true;
            if (recommendedMode === "light") normalized.darkMode = false;
        }

        if (!normalized.brandName && pageSignals?.title) normalized.brandName = pageSignals.title;

        return NextResponse.json({
            ...normalized,
            sources,
            model: TEMPLATE_AI_MODEL,
            searchEnabled: useSearch,
            searchFallbackUsed,
            businessPageUrl,
            usedInlineImage: Boolean(inlineImage),
            pageSignals,
        });
    } catch (e) {
        console.error("AI populate error:", e);
        return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
}
