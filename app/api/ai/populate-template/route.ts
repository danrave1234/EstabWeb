import { NextRequest, NextResponse } from "next/server";
import { GENRE_LABELS, GENRE_PRESETS } from "@/config/presets";
import { COLOR_THEME_SWATCHES, formatSectionLabel, sectionIdToKey, TYPOGRAPHY_OPTIONS } from "@/config/dashboard-config";
import { scrapeUrlWithApify, type ScrapedData } from "@/lib/utils/scraper";
import { SECTION_FIELD_SCHEMA } from "@/lib/ai/section-field-schema";
import { BLOCK_REGISTRY } from "@/lib/utils/block-registry";
import { rateLimit, getClientIp, RATE_LIMIT_PRESETS } from "@/lib/security/rate-limit";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TEMPLATE_AI_MODEL = process.env.GEMINI_TEMPLATE_MODEL?.trim() || "gemini-1.5-flash";
const TEMPLATE_AI_USE_SEARCH_DEFAULT = (process.env.GEMINI_TEMPLATE_USE_SEARCH ?? "true").toLowerCase() !== "false";
const BROWSER_LIKE_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

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
            }
        }
        
        // Final fallback: attempt to repair truncated JSON
        try {
            if (start >= 0) {
                let partial = cleaned.slice(start);
                // Remove trailing comma, or incomplete keys
                partial = partial.replace(/,\s*$/, '').replace(/,\s*\}/g, '}').replace(/,\s*\]/g, ']');
                
                // Count unclosed braces and brackets
                let openBraces = 0;
                let openBrackets = 0;
                let inString = false;
                let escapeNext = false;
                
                for (let i = 0; i < partial.length; i++) {
                    const char = partial[i];
                    if (escapeNext) {
                        escapeNext = false;
                        continue;
                    }
                    if (char === '\\') {
                        escapeNext = true;
                        continue;
                    }
                    if (char === '"') {
                        inString = !inString;
                        continue;
                    }
                    if (!inString) {
                        if (char === '{') openBraces++;
                        if (char === '}') openBraces--;
                        if (char === '[') openBrackets++;
                        if (char === ']') openBrackets--;
                    }
                }
                
                if (inString) partial += '"';
                while (openBrackets > 0) { partial += ']'; openBrackets--; }
                while (openBraces > 0) { partial += '}'; openBraces--; }
                
                return JSON.parse(partial);
            }
        } catch (e) {
            console.error("AI JSON repair failed:", e);
        }

        console.error("AI returned non-JSON text or malformed JSON.");
        console.error("Raw text preview (START):", rawText.slice(0, 300));
        console.error("Raw text preview (END):", rawText.slice(-300));
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

function mergeUniqueStrings(...groups: Array<string[] | undefined>): string[] {
    return unique(
        groups
            .flatMap((group) => group || [])
            .map((value) => normalizeWhitespace(value || ""))
            .filter(Boolean)
    );
}

function mergeRecentPosts(...groups: Array<ScrapedData["recentPosts"] | undefined>) {
    const seen = new Set<string>();
    const merged: Array<{ text: string; imageUrl: string }> = [];

    for (const group of groups) {
        for (const entry of group || []) {
            const text = normalizeWhitespace(entry?.text || "");
            const imageUrl = sanitizeHttpUrl(entry?.imageUrl) || "";
            if (!text && !imageUrl) continue;

            const key = `${text}__${imageUrl}`;
            if (seen.has(key)) continue;
            seen.add(key);
            merged.push({ text, imageUrl });
        }
    }

    return merged;
}

function mergeScrapedDataIntoPageSignals(
    currentSignals: PageSignals | null,
    scraped: ScrapedData,
    sourceUrl: string
): PageSignals {
    return {
        sourceUrl: currentSignals?.sourceUrl || sourceUrl,
        title: scraped.title || currentSignals?.title || "",
        description: scraped.description || currentSignals?.description || scraped.text.slice(0, 200),
        logoUrl: sanitizeHttpUrl(scraped.logoUrl) || currentSignals?.logoUrl || "",
        heroImageUrl: sanitizeHttpUrl(scraped.heroImageUrl) || currentSignals?.heroImageUrl || "",
        email: scraped.email || currentSignals?.email || "",
        phone: scraped.phone || currentSignals?.phone || "",
        location: scraped.location || currentSignals?.location || "",
        about: scraped.about || currentSignals?.about || "",
        categories: mergeUniqueStrings(scraped.categories, currentSignals?.categories),
        website: scraped.website || currentSignals?.website || "",
        recentPosts: mergeRecentPosts(currentSignals?.recentPosts, scraped.recentPosts),
        pagePhotos: mergeUniqueStrings(currentSignals?.pagePhotos, scraped.pagePhotos),
    };
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

function isImageFieldPath(fieldPath: string): boolean {
    const segments = fieldPath.split(".");
    const leaf = segments[segments.length - 1]?.replace(/\[\]$/g, "").toLowerCase() || "";
    if (
        [
            "image",
            "imageurl",
            "backgroundimage",
            "beforeimage",
            "afterimage",
            "beforeimageurl",
            "afterimageurl",
            "singleimageurl",
            "avatar",
            "image1",
            "image2",
            "image3",
            "imagedark",
            "imagelight",
        ].includes(leaf)
    ) {
        return true;
    }

    if (leaf === "src") {
        return segments.some((segment) => {
            const normalized = segment.replace(/\[\]$/g, "").toLowerCase();
            return normalized.includes("avatar") || normalized.includes("testimonial") || normalized.includes("team");
        });
    }

    if (leaf === "url") {
        return segments.some((segment) => segment.replace(/\[\]$/g, "").toLowerCase() === "images");
    }

    return false;
}

function buildRotatingImagePicker(imageUrls: string[]): () => string {
    const pool = unique(imageUrls.map((url) => sanitizeHttpUrl(url)).filter(Boolean));
    let index = 0;

    return () => {
        if (pool.length === 0) return "";
        const selected = pool[index % pool.length];
        index += 1;
        return selected;
    };
}

async function hostImageAtPath(
    target: Record<string, any>,
    fieldPath: string,
    ensureHostedImageUrl: (url: string) => Promise<string>
): Promise<void> {
    const segments = fieldPath.split(".");

    const visit = async (container: any, segmentIndex: number): Promise<void> => {
        if (!container || typeof container !== "object") return;

        const rawSegment = segments[segmentIndex];
        const isArraySegment = rawSegment.endsWith("[]");
        const key = isArraySegment ? rawSegment.slice(0, -2) : rawSegment;
        const isLastSegment = segmentIndex === segments.length - 1;

        if (isArraySegment) {
            const arrayValue = Array.isArray(container[key]) ? container[key] : [];
            if (arrayValue.length === 0) return;
            await Promise.all(arrayValue.map((entry) => visit(entry, segmentIndex + 1)));
            return;
        }

        if (isLastSegment) {
            const existing = sanitizeHttpUrl(container[key]);
            if (!existing) return;
            container[key] = await ensureHostedImageUrl(existing);
            return;
        }

        await visit(container[key], segmentIndex + 1);
    };

    await visit(target, 0);
}

function setMissingImageAtPath(
    target: Record<string, any>,
    fieldPath: string,
    nextImage: () => string,
    fallbackImage: string,
    replaceableImages: Set<string> = new Set(),
    isHeroLogo: boolean = false
): void {
    const segments = fieldPath.split(".");

    const visit = (container: any, segmentIndex: number): void => {
        if (!container || typeof container !== "object") return;

        const rawSegment = segments[segmentIndex];
        const isArraySegment = rawSegment.endsWith("[]");
        const key = isArraySegment ? rawSegment.slice(0, -2) : rawSegment;
        const isLastSegment = segmentIndex === segments.length - 1;

        if (isArraySegment) {
            const arrayValue = Array.isArray(container[key]) ? container[key] : [];
            if (arrayValue.length === 0) return;
            arrayValue.forEach((entry) => visit(entry, segmentIndex + 1));
            return;
        }

        if (isLastSegment) {
            const existing = sanitizeHttpUrl(container[key]);
            
            // Re-evaluate what is considered a placeholder
            const isPlaceholder = !existing || 
                (existing && (
                    replaceableImages.has(existing) || 
                    existing.includes('example.com') || 
                    existing.includes('placeholder') ||
                    existing.includes('dummyimage') ||
                    existing.includes('unsplash') // common AI hallucinations
                ));
            
            if (existing && !isPlaceholder) {
                container[key] = existing;
                return;
            }

            const replacement = nextImage();
            if (replacement) {
                container[key] = replacement;
            } else if (fallbackImage && (isPlaceholder || isHeroLogo)) {
                // if we are explicitly replacing a hero or logo, or we literally have no images left
                container[key] = fallbackImage;
            } else if (!existing) {
               container[key] = fallbackImage;
            }
            return;
        }

        if (!container[key] || typeof container[key] !== "object") {
            container[key] = {};
        }

        visit(container[key], segmentIndex + 1);
    };

    visit(target, 0);
}

function normalizeGalleryGridData(sectionData: Record<string, any>, photoUrls: string[], postTexts: string[]): Record<string, any> {
    const existingImages = Array.isArray(sectionData.images) && sectionData.images.length > 0
        ? sectionData.images
        : Array.isArray(sectionData.items) && sectionData.items.length > 0
            ? sectionData.items.map((item: any, index: number) => ({
                id: item?.id ?? String(index + 1),
                url: sanitizeHttpUrl(item?.url) || sanitizeHttpUrl(item?.src) || sanitizeHttpUrl(item?.image),
                title:
                    typeof item?.title === "string" && item.title.trim()
                        ? item.title
                        : typeof item?.alt === "string" && item.alt.trim()
                            ? item.alt
                            : postTexts[index]?.slice(0, 80) || `Photo ${index + 1}`,
                category:
                    typeof item?.category === "string" && item.category.trim()
                        ? item.category
                        : "All",
            }))
            : [];

    if (photoUrls.length === 0) {
        if (existingImages.length > 0) {
            sectionData.images = existingImages;
            delete sectionData.items;
        }
        return sectionData;
    }

    // Always prefer the actual scraped photos over whatever placeholders the AI/preset generated
    sectionData.title = typeof sectionData.title === "string" && sectionData.title.trim() ? sectionData.title : "Our Gallery";
    sectionData.images = photoUrls.slice(0, 9).map((url, index) => ({
        id: String(index + 1),
        url,
        title: postTexts[index]?.slice(0, 80) || `Photo ${index + 1}`,
        category: "All",
    }));
    delete sectionData.items;
    return sectionData;
}

function normalizeGalleryCarouselData(sectionData: Record<string, any>, photoUrls: string[], postTexts: string[]): Record<string, any> {
    const existingItems = Array.isArray(sectionData.items) && sectionData.items.length > 0
        ? sectionData.items.map((item: any, index: number) => ({
            ...item,
            id: item?.id ?? String(index + 1),
            image: sanitizeHttpUrl(item?.image) || sanitizeHttpUrl(item?.src) || sanitizeHttpUrl(item?.url),
            title:
                typeof item?.title === "string" && item.title.trim()
                    ? item.title
                    : postTexts[index]?.slice(0, 60) || `Project ${index + 1}`,
            description:
                typeof item?.description === "string"
                    ? item.description
                    : postTexts[index]?.slice(0, 120) || "",
        }))
        : [];

    if (photoUrls.length === 0) {
        if (existingItems.length > 0) {
            sectionData.items = existingItems;
        }
        return sectionData;
    }

    // Always prefer the actual scraped photos over whatever placeholders the AI/preset generated
    sectionData.title = typeof sectionData.title === "string" && sectionData.title.trim() ? sectionData.title : "Our Work";
    sectionData.items = photoUrls.slice(0, 6).map((url, index) => ({
        id: String(index + 1),
        image: url,
        title: postTexts[index]?.slice(0, 60) || `Project ${index + 1}`,
        description: postTexts[index]?.slice(0, 120) || "",
    }));
    return sectionData;
}

function hydrateSectionImages(
    sectionId: string,
    sectionData: unknown,
    photoUrls: string[],
    fallbackImages: string[],
    postTexts: string[]
): Record<string, any> {
    let hydrated = typeof sectionData === "object" && sectionData !== null ? { ...(sectionData as Record<string, any>) } : {};
    const fallbackImageSet = new Set(fallbackImages.map((url) => sanitizeHttpUrl(url)).filter(Boolean));
    const preferredPhotoUrls = unique(
        photoUrls
            .map((url) => sanitizeHttpUrl(url))
            .filter((url) => Boolean(url) && !fallbackImageSet.has(url))
    );

    if (sectionId === "gallery--grid") {
        hydrated = normalizeGalleryGridData(hydrated, preferredPhotoUrls, postTexts);
    } else if (sectionId === "gallery--carousel") {
        hydrated = normalizeGalleryCarouselData(hydrated, preferredPhotoUrls, postTexts);
    }

    const nextImage = buildRotatingImagePicker(preferredPhotoUrls);
    const fallbackImage = sanitizeHttpUrl(fallbackImages[0]) || "";
    const imageFieldPaths = (SECTION_FIELD_SCHEMA[sectionId] || []).filter((fieldPath) => isImageFieldPath(fieldPath));
    
        const isHeroOrLogo = sectionId.startsWith("hero") || sectionId === "navigation";
        
        // Pass the ENTIRE fallback image set (including hero/logo) as replaceable IF it's not a hero/logo section.
        // This stops the cover photo from being used in random services blocks.
        const replaceableImages = !isHeroOrLogo ? fallbackImageSet : new Set<string>();

        for (const fieldPath of imageFieldPaths) {
            setMissingImageAtPath(hydrated, fieldPath, nextImage, fallbackImage, replaceableImages, isHeroOrLogo);
        }

    return hydrated;
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

function buildRemoteImageFetchHeaders(imageUrl: string, sourceUrl?: string): HeadersInit {
    const sanitizedImageUrl = sanitizeHttpUrl(imageUrl);
    const sanitizedSourceUrl = sanitizeHttpUrl(sourceUrl);
    const isFacebookHostedImage = /(?:^|\/\/)(?:[^./]+\.)?(?:fbcdn|facebook)\./i.test(sanitizedImageUrl);

    const headers: Record<string, string> = {
        "User-Agent": BROWSER_LIKE_USER_AGENT,
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
    };

    if (isFacebookHostedImage) {
        headers["Sec-Fetch-Dest"] = "image";
        headers["Sec-Fetch-Mode"] = "no-cors";
        headers["Sec-Fetch-Site"] = "cross-site";
        headers["Referer"] = sanitizedSourceUrl && /facebook\.com/i.test(sanitizedSourceUrl)
            ? sanitizedSourceUrl
            : "https://www.facebook.com/";
    }

    return headers;
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
    about?: string;
    categories?: string[];
    website?: string;
    recentPosts?: { text: string; imageUrl: string }[];
    pagePhotos?: string[];
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
                "User-Agent": BROWSER_LIKE_USER_AGENT,
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

    // Rate limit: 10 req/min per IP
    const ip = getClientIp(req.headers);
    const rl = await rateLimit(ip, RATE_LIMIT_PRESETS.ai);
    if (!rl.allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
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

    const blockRegistryMap = new Map(BLOCK_REGISTRY.filter(b => !b.legacy).map(b => [b.id, b]));

    const sectionContext = sectionIds.map((id) => {
        const block = blockRegistryMap.get(id);
        return {
            id,
            label: sectionLabelLookup.get(id) || block?.label || formatSectionLabel(id),
            configKey: sectionIdToKey(id),
            purpose: block?.purpose || "",
            sectionType: block?.sectionType || id.split("--")[0],
            visualDescription: block?.visualDescription || "",
        };
    });

    // Group sections by sectionType for clearer AI decision-making.
    // Each group shows the AI: "for this slot, pick ONE of these variants."
    const sectionsByType: Record<string, { id: string; label: string; purpose: string; visualDescription: string; configKey: string }[]> = {};
    for (const s of sectionContext) {
        const type = s.sectionType;
        if (!sectionsByType[type]) sectionsByType[type] = [];
        sectionsByType[type].push({ id: s.id, label: s.label, purpose: s.purpose, visualDescription: s.visualDescription, configKey: s.configKey });
    }

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
            pageSignals = mergeScrapedDataIntoPageSignals(pageSignals, apifyData, businessPageUrl);
        }
    }

    const inlineImages: Array<{ mimeType: string; data: string }> = [];
    if (inlineImage) inlineImages.push(inlineImage);

    const assetUploadCache = new Map<string, Promise<string>>();
    const hostedImageUrls = new Set<string>();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

    let uploadAndGetPublicUrl: ((imgUrl: string, includeInline?: boolean) => Promise<string>) | null = null;

    if (supabaseUrl && supabaseServiceRoleKey) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

        uploadAndGetPublicUrl = async (imgUrl: string, includeInline = true): Promise<string> => {
            const sanitizedUrl = sanitizeHttpUrl(imgUrl);
            if (!sanitizedUrl) return '';
            if (hostedImageUrls.has(sanitizedUrl)) return sanitizedUrl;

            const cachedUpload = assetUploadCache.get(sanitizedUrl);
            if (cachedUpload) {
                return cachedUpload;
            }

            const uploadPromise = (async () => {
                try {
                    const imgRes = await fetch(sanitizedUrl, {
                        headers: buildRemoteImageFetchHeaders(sanitizedUrl, businessPageUrl),
                    });
                    if (!imgRes.ok) return sanitizedUrl;
                    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
                    if (!contentType.startsWith('image/')) return sanitizedUrl;
                    const arrayBuffer = await imgRes.arrayBuffer();

                    // Upload to site-assets bucket
                    const ext = contentType.split('/').pop()?.replace(/x-/g, '') || 'jpg';
                    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;

                    const { error } = await supabaseAdmin.storage
                        .from('site-assets')
                        .upload(fileName, arrayBuffer, {
                            contentType,
                            upsert: false,
                        });

                    if (error) {
                        console.error('Failed to upload scraped image to Supabase:', error);
                        return sanitizedUrl;
                    }

                    const { data: { publicUrl } } = supabaseAdmin.storage.from('site-assets').getPublicUrl(fileName);
                    const hostedUrl = sanitizeHttpUrl(publicUrl) || sanitizedUrl;
                    hostedImageUrls.add(hostedUrl);

                    if (includeInline) {
                        const base64Data = Buffer.from(arrayBuffer).toString('base64');
                        if (base64Data.length < 5_500_000) {
                            inlineImages.push({ mimeType: contentType, data: base64Data });
                        }
                    }

                    return hostedUrl;
                } catch (e) {
                    console.error('Failed to process scraped image:', e);
                    return sanitizedUrl;
                }
            })();

            assetUploadCache.set(sanitizedUrl, uploadPromise);
            return uploadPromise;
        };
    }

    const ensureHostedImageUrl = async (imgUrl: string, includeInline = false): Promise<string> => {
        const sanitizedUrl = sanitizeHttpUrl(imgUrl);
        if (!sanitizedUrl) return '';
        if (hostedImageUrls.has(sanitizedUrl)) return sanitizedUrl;
        if (!uploadAndGetPublicUrl) return sanitizedUrl;
        return uploadAndGetPublicUrl(sanitizedUrl, includeInline);
    };

    // Fetch scraped images, upload to our own bucket to prevent CDN expiration, and append to parts array.
    if (uploadAndGetPublicUrl && (pageSignals?.logoUrl || pageSignals?.heroImageUrl)) {

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
                    const newUrl = await uploadAndGetPublicUrl(post.imageUrl);
                    return { ...post, imageUrl: newUrl || post.imageUrl };
                })
            );
            pageSignals.recentPosts = uploadedPosts;
        }

        // Inline the first 5 post/page photos into Gemini vision context so it can
        // visually analyze them for gallery, services, and team sections.
        const photoUrlsToInline = [
            ...(pageSignals.recentPosts || []).filter((p: any) => p.imageUrl).map((p: any) => p.imageUrl),
            ...(pageSignals.pagePhotos || []),
        ].filter(Boolean);

        const uniquePhotoUrls = Array.from(new Set(photoUrlsToInline)).slice(0, 5);
        for (const photoUrl of uniquePhotoUrls) {
            try {
                const imgRes = await fetch(photoUrl, {
                    headers: buildRemoteImageFetchHeaders(photoUrl, businessPageUrl),
                });
                if (!imgRes.ok) continue;
                const ct = imgRes.headers.get('content-type') || 'image/jpeg';
                if (!ct.startsWith('image/')) continue;
                const buf = await imgRes.arrayBuffer();
                const b64 = Buffer.from(buf).toString('base64');
                if (b64.length < 5_500_000) {
                    inlineImages.push({ mimeType: ct, data: b64 });
                }
            } catch {
                // skip failed photo
            }
        }

        // Upload pagePhotos to Supabase for stable URLs
        if (pageSignals.pagePhotos && pageSignals.pagePhotos.length > 0) {
            const uploadedPhotos = await Promise.all(
                pageSignals.pagePhotos.map(async (photoUrl: string) => {
                    const newUrl = await uploadAndGetPublicUrl(photoUrl);
                    return newUrl || photoUrl;
                })
            );
            pageSignals.pagePhotos = uploadedPhotos.filter(Boolean);
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
            sectionsByType,
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
2. MATCH BRAND COLORS (MANDATORY OVERRIDE): Analyze ALL provided images (logo, cover photo, post photos) AND search results to determine the dominant brand color. Check the "colorThemes" list — each entry has "primary", "accent", and "background" hex values. Pick the colorTheme whose "primary" hex is closest to the brand's dominant color.
   - CRITICAL: If the brand is well-known (e.g., "Anytime Fitness" → Purple, "McDonald's" → Red/Yellow, "Starbucks" → Green), you MUST use its iconic colors.
   - CRITICAL: Do NOT default to the preset's colorTheme. Always independently evaluate brand colors and pick the best match from the list.
   - If the logo/cover photo is provided as an image, visually analyze it and extract the dominant hex color, then match it to the closest colorTheme entry.
3. MATCH TYPOGRAPHY TO BRAND PERSONALITY (MANDATORY OVERRIDE): Choose "typographyStyle" based on the brand's personality — do NOT inherit from the preset:
   - Luxury / high-end / fashion / spa → serif or elegant styles
   - Tech / SaaS / startup / modern → modern or clean sans-serif
   - Fitness / sports / energy → bold or strong styles
   - Professional / corporate / legal / medical → clean or professional styles
   - Creative / agency / portfolio → expressive or playful styles
   - Use the "fontFamily" field in "typographyStyles" to confirm the font matches the brand feel.
   - CRITICAL: DO NOT use the "display" typographyStyle as it causes rendering issues.
4. MATCH DARK MODE TO BRAND: Set "darkMode" based on brand evidence, NOT the preset default:
   - Use the chosen colorTheme's "recommendedMode" as the primary signal.
   - Override to darkMode=true if: the brand uses dark backgrounds, is in nightlife/entertainment/luxury/tech, or the logo is light-colored on dark.
   - Override to darkMode=false if: the brand is in healthcare/wellness/food/family/education, or uses bright/pastel colors.
5. CHOOSE THEME INDEPENDENTLY: Pick "theme" based on the business industry — do NOT just copy the preset's theme. The theme controls the overall site personality.
6. FULLY UTILIZE PAGE SECTIONS: The "sectionsByType" map groups all variants by type. For each type you want to include, READ both the "purpose" field AND the "visualDescription" field of each variant. The "purpose" tells you WHEN to use it; the "visualDescription" tells you HOW IT LOOKS on screen — use both to pick the best-matching variant for the business. 
   - CRITICAL OVERRIDE: If the brand is highly visual, dynamic, or "cool" (e.g., motorcycles, high-end cars, premium lifestyle, sports), you MUST strongly bias toward premium, image-forward sections like "hero--elegant-carousel", "hero--group-images", "services--bento", and "gallery--grid".
   - Use industry-specific hero variants (hero--gym, hero--dentist, hero--clinic, etc.) when the business type matches.
   - Use hero--elegant-carousel for premium/lifestyle/visual businesses (motorcycles, fashion, high-end automotive, luxury, collections). THIS IS HIGHLY RECOMMENDED for brands with striking visual assets like vehicle shots.
   - Use hero--group-images for dynamic visual brands (sports, powersports, motorcycles, dynamic tech) to show multiple angles or products at once.
   - Use hero--modern or hero--showcase for service businesses needing trust signals.
   - Use hero--v6 for tech/SaaS/app businesses.
   - Use services--bento for businesses with 4–6 distinct service offerings or product categories (e.g., motorcycle segments).
   - Use features--steps for businesses with a clear process or onboarding flow.
   - Use gallery--grid or gallery--carousel when the business has visual work to show (motorcycles, vehicles, salons, gyms, restaurants).
   - Use testimonials--community or testimonials--animated for businesses with strong social proof.
   - Use team--showcase when the business is people/expertise-driven (clinics, law firms, agencies).
   STRONGLY PREFER modern, premium variants over generic ones.
7. LEGITIMATE PRICING: If the business has clear pricing signals or needs packages, prefer detailed tables like 'pricing--comparison' or 'pricing--feature-comparison' over basic ones.
8. SECTION TYPE UNIQUENESS: Only pick ONE section per sectionType (e.g. one hero, one testimonials, one gallery). Do NOT include two hero variants or two gallery variants.

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
13. "activeSections" - array of section IDs. Use the "sectionsByType" map above — each key is a section type (e.g. "hero", "services", "testimonials") and its value is an array of variant options. Pick AT MOST ONE variant per type. Only use IDs that appear in "sectionsByType". Valid IDs: ${sectionIds.join(", ") || "none"}
14. "logoUrl" - absolute image URL of the official logo found via signals or search (e.g. from Facebook profile pic or official site)
15. "heroImageUrl" - absolute high-quality image URL for the background (e.g. facility photo, team, or matching high-quality stock)
16. "sectionsData" - an object where keys are the valid configKeys from the sections you chose in "activeSections", and values are objects populated with ACTUAL REAL DATA, according to the "sectionFieldSchema". Do NOT return placeholders! Use the provided scraped text, 'about', 'categories', 'recentPosts', and 'pagePhotos' to fully write the content.

CRITICAL rules for "sectionsData" image and content population:
- KEEP CONTENT EXTREMELY CONCISE: You MUST limit the number of items generated in lists (like services, galleries, features, pricing) to a MAXIMUM of 3 items per section. The model WILL TRUNCATE and FAIL if you generate too much data.
- SHORT DESCRIPTIONS: Keep all section descriptions, subtitles, and item descriptions to 1 sentence maximum.
- ABOUT/VALUE PROP sections: Use the "about" field from pageSignals as the primary source for the business description, mission, and story. Extract key selling points from it.
- GALLERY sections (gallery--grid, gallery--carousel): You MUST populate these with real images. Use "pagePhotos" and "recentPosts[].imageUrl" as the image sources. Map post text as captions/alt text. Do NOT leave gallery items empty if images are available. Limit to 3 items.
- SERVICES/FEATURES sections: If recentPost images look like product or service photos (based on the inlined images you can see), use those imageUrls for service item images. Extract service names from post text and the "about" field. Limit to 3 items.
- TESTIMONIALS sections: If recentPosts contain customer reviews, quotes, or feedback text, extract them as testimonial items with the post text as the quote. Limit to 3 items.
- TEAM sections: If any posts or about text mention staff names or roles, use them to populate team member entries. Limit to 3 items.
- For any section requiring images where no real image is available, use the heroImageUrl or logoUrl as a fallback rather than leaving it empty.

Rules for "activeSections":
- Use "sectionsByType" as your menu: each type is a slot, each variant is an option. Pick AT MOST ONE variant per type slot.
- Balance sections to create a complete, professional website.
- SEQUENCE: Hero -> Value Prop/About -> Services/Products (e.g. services--bento) -> Social Proof (Testimonials) -> Visuals (Gallery) -> FAQ/Trust -> Pricing -> Contact.
- INCLUDE CRITICAL SECTIONS: Always try to include a hero section, an "about" or "features" section, and a "contact" section. YOU MUST LIMIT THE TOTAL NUMBER OF SECTIONS TO EXACTLY 5 TO 7 SECTIONS. If you exceed 7 sections, the output will truncate and fail.
- Include at least one contact/conversion section.
- Use only IDs that appear in "sectionsByType".
- NEVER include two sections of the same sectionType (e.g. two heroes, two testimonials variants, two gallery variants).

Ensure the output is strictly valid JSON without any markdown formatting or code blocks.
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

        const generationConfig: Record<string, unknown> = {
            temperature: 0.5,
            maxOutputTokens: 8192,
        };

        const requestBody: Record<string, unknown> = {
            contents: [{ parts }],
            generationConfig,
        };

        // Even with search enabled, we MUST force valid JSON response structure or Gemini might cut it off.
        // If we set response_mime_type to application/json, it enforces JSON output. 
        // We will try setting it to application/json EVEN IF search is enabled, as newer Gemini versions support it.
        requestBody.generationConfig = {
            ...generationConfig,
            response_mime_type: "application/json",
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

        normalized.logoUrl = await ensureHostedImageUrl(normalized.logoUrl);
        normalized.heroImageUrl = await ensureHostedImageUrl(normalized.heroImageUrl);

        // Server-side fallback: hydrate image-bearing sections from scraped page photos/posts so
        // the editor overrides preset placeholders with real business photos.
        if (pageSignals) {
            const allPhotoUrls = unique([
                ...(pageSignals.pagePhotos || []),
                ...(pageSignals.recentPosts || []).filter((p: any) => p.imageUrl).map((p: any) => p.imageUrl),
            ]
                .map((url: string) => sanitizeHttpUrl(url))
                .filter(Boolean));
            const allPostTexts = (pageSignals.recentPosts || []).map((p: any) => p.text || '').filter(Boolean);
            const fallbackImages = unique([
                normalized.heroImageUrl,
                normalized.logoUrl,
                sanitizeHttpUrl(parsed.heroImageUrl),
                sanitizeHttpUrl(parsed.logoUrl),
            ].filter(Boolean));

            for (const sectionId of normalized.activeSections) {
                const configKey = sectionIdToKey(sectionId);
                if (!configKey) continue;
                
                // Keep the original AI data intact before hydration so we don't accidentally wipe out titles
                const originalSectionData = normalized.sectionsData[configKey] || {};
                
                normalized.sectionsData[configKey] = hydrateSectionImages(
                    sectionId,
                    originalSectionData,
                    allPhotoUrls,
                    fallbackImages,
                    allPostTexts
                );
            }

            // Fallback: about/value-prop sections — use the Facebook About text
            const aboutText = pageSignals.about || pageSignals.description || '';
            if (aboutText) {
                for (const sectionId of normalized.activeSections) {
                    const configKey = sectionIdToKey(sectionId);
                    if (
                        (sectionId.includes('about') || sectionId.includes('value') || sectionId.includes('features--steps')) &&
                        configKey &&
                        !normalized.sectionsData[configKey]?.description
                    ) {
                        normalized.sectionsData[configKey] = {
                            ...(normalized.sectionsData[configKey] || {}),
                            description: aboutText.slice(0, 400),
                        };
                    }
                }
            }
        }

        for (const sectionId of normalized.activeSections) {
            const configKey = sectionIdToKey(sectionId);
            if (!configKey) continue;

            const sectionPayload =
                typeof normalized.sectionsData[configKey] === "object" && normalized.sectionsData[configKey] !== null
                    ? (normalized.sectionsData[configKey] as Record<string, any>)
                    : {};
            normalized.sectionsData[configKey] = sectionPayload;

            const imageFieldPaths = (SECTION_FIELD_SCHEMA[sectionId] || []).filter((fieldPath) => isImageFieldPath(fieldPath));
            for (const fieldPath of imageFieldPaths) {
                await hostImageAtPath(sectionPayload, fieldPath, ensureHostedImageUrl);
            }
        }

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
