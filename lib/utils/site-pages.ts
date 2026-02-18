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