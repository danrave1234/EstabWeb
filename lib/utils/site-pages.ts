import { createClient } from "@/lib/supabase/server";
import { canPublishDirectly, ProjectSubscription } from "@/lib/subscription";

export interface SitePageConfig {
  slug: string;
  label?: string;
  activeSections?: string[];
  seo?: Record<string, any>;
}

export interface PlanLimits {
  free?: { maxPages?: number };
  pro?: { maxPages?: number };
}

const PAGE_CATEGORY_LABELS: Record<string, string> = {
  "hero": "Home",
  "hero--emergency": "Home",
  "hero--video": "Home",
  "hero--split": "Home",
  "review-trust-bar": "Reviews",
  "reviews-grid": "Reviews",
  "facebook-review-embed": "Reviews",
  "testimonials": "Reviews",
  "trust-badges-grid": "Trust",
  "awards": "Credentials",
  "pricing": "Pricing",
  "pricing-table": "Pricing",
  "packages-pricing": "Pricing",
  "practice-areas": "Services",
  "features": "Services",
  "features-modern": "Services",
  "services-grid": "Services",
  "feature-highlight": "Highlights",
  "how-it-works": "How It Works",
  "treatment-process": "Process",
  "patient-faq": "FAQ",
  "faq-accordion": "FAQ",
  "faq-two-column": "FAQ",
  "team-carousel": "Team",
  "team-grid": "Team",
  "attorney-profile": "About",
  "contact": "Contact",
  "contact-minimal": "Contact",
  "contact-visual": "Contact",
  "contact-with-map": "Contact",
  "contact-columns": "Contact",
};

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-");

const categoryLabelForSection = (sectionId: string) => PAGE_CATEGORY_LABELS[sectionId] || "";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

const DEFAULT_PRO_MAX_PAGES = Number(
  process.env.MAX_PAGES_PRO ?? process.env.NEXT_PUBLIC_MAX_PAGES_PRO ?? 5
);

export function normalizePages(pages: unknown): SitePageConfig[] {
  if (!Array.isArray(pages)) return [];
  return pages
    .map((page) => {
      const raw = (page || {}) as Record<string, any>;
      const rawSlug = typeof raw.slug === "string" ? raw.slug : "";
      const slug = rawSlug.replace(/^\/+|\/+$/g, "").toLowerCase();
      return {
        slug,
        label: typeof raw.label === "string" ? raw.label : undefined,
        activeSections: Array.isArray(raw.activeSections) ? raw.activeSections : undefined,
        seo: raw.seo && typeof raw.seo === "object" ? raw.seo : undefined,
      };
    })
    .filter((page) => page.slug !== undefined);
}

export function normalizePagesWithDefaults(pages: unknown): SitePageConfig[] {
  return applyPageDefaults(normalizePages(pages));
}

export function applyPageDefaults(pages: SitePageConfig[]): SitePageConfig[] {
  return pages.map((page, index) => {
    const rawSlug = typeof page.slug === "string" ? page.slug : "";
    const slug = rawSlug.replace(/^\/+|\/+$/g, "").toLowerCase();
    const rawLabel = typeof page.label === "string" ? page.label : "";
    const rawSections = Array.isArray(page.activeSections) ? page.activeSections : [];
    const firstSection = typeof rawSections[0] === "string" ? rawSections[0] : "";
    const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : "";
    const isGenericLabel = !rawLabel || /^page\s+\d+$/i.test(rawLabel.trim());
    const fallbackLabel = categoryLabel || (slug ? slug.replace(/-/g, " ") : `Page ${index + 1}`);
    const label = categoryLabel || (isGenericLabel ? fallbackLabel : rawLabel);
    const nextSlug = label.toLowerCase() === "home" ? "" : (slug || slugify(label));
    return {
      ...page,
      slug: nextSlug,
      label,
      activeSections: rawSections,
    };
  });
}

export function getPageBySlug(pages: SitePageConfig[], slug: string): SitePageConfig | undefined {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "").toLowerCase();
  return pages.find((page) => page.slug === cleanSlug);
}

export function isLegalPageSlug(slug: string): boolean {
  return ["privacy", "terms", "cookies"].includes(
    slug.replace(/^\/+|\/+$/g, "").toLowerCase()
  );
}

export function canUseMultiPage(project: ProjectSubscription | null | undefined): boolean {
  if (!project) return false;
  return canPublishDirectly(project);
}

export function getMaxPagesForProject(
  project: ProjectSubscription | null | undefined,
  planLimits?: PlanLimits
): number {
  const status = (project?.subscription_status || "free").toLowerCase();
  if (status === "free") {
    return planLimits?.free?.maxPages ?? 1;
  }
  return planLimits?.pro?.maxPages ?? DEFAULT_PRO_MAX_PAGES;
}

export async function getPlanLimits(supabase?: SupabaseClient): Promise<PlanLimits> {
  const client = supabase ?? (await createClient());
  try {
    const { data } = await client
      .from("site_config")
      .select("payload")
      .eq("key", "plan_limits")
      .single();

    const payload = (data?.payload || {}) as PlanLimits;
    return {
      free: {
        maxPages: payload.free?.maxPages ?? 1,
      },
      pro: {
        maxPages: payload.pro?.maxPages ?? DEFAULT_PRO_MAX_PAGES,
      },
    };
  } catch {
    return {
      free: { maxPages: 1 },
      pro: { maxPages: DEFAULT_PRO_MAX_PAGES },
    };
  }
}