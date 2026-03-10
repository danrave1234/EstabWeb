import { buildAutoSeoDefaults, formatDomainAsBrand } from "@/lib/seo/autoSeo";
import { buildLlmsDocuments, LlmsPage } from "@/lib/seo/llms";
import {
  canUseMultiPage,
  getMaxPagesForProject,
  getPageBySlug,
  getPlanLimits,
  isLegalPageSlug,
  normalizePagesWithDefaults,
} from "@/lib/utils/site-pages";
import { isProPlan } from "@/lib/subscription";

type TenantProject = {
  subdomain?: string | null;
  custom_domain?: string | null;
  subscription_status?: string | null;
  trial_ends_at?: string | null;
  subscription_ends_at?: string | null;
};

function asText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function readArrayTitles(items: unknown, keys: string[] = ["title", "name", "label"]): string[] {
  if (!Array.isArray(items)) return [];
  const out: string[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    for (const key of keys) {
      const text = asText((item as Record<string, unknown>)[key]);
      if (text) {
        out.push(text);
        break;
      }
    }
  }
  return out;
}

function unique(values: string[], limit: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const item = asText(value);
    if (!item) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

function getLocation(config: Record<string, any>): string {
  const city = asText(config?.contact?.city ?? config?.city);
  const region = asText(config?.contact?.region ?? config?.region ?? config?.state);
  const country = asText(config?.contact?.country ?? config?.country);
  const byParts = [city, region, country].filter(Boolean).join(", ");
  if (byParts) return byParts;
  return asText(config?.contact?.address ?? config?.location);
}

function getServiceSignals(config: Record<string, any>): string[] {
  return unique(
    [
      ...readArrayTitles(config?.features?.features),
      ...readArrayTitles(config?.practiceAreas?.items),
      ...readArrayTitles(config?.services?.items),
      ...readArrayTitles(config?.products?.items),
      ...readArrayTitles(config?.serviceAreas?.items),
      asText(config?.features?.title),
      asText(config?.practiceAreas?.title),
      asText(config?.services?.title),
      asText(config?.products?.title),
    ],
    8
  );
}

function getPreferredHost(project: TenantProject | null | undefined, host: string): string {
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
  if (project?.custom_domain && isProPlan(project)) {
    return project.custom_domain.toLowerCase();
  }
  if (project?.subdomain) {
    return `${project.subdomain}.${ROOT_DOMAIN}`.toLowerCase();
  }
  return host.toLowerCase();
}

export async function buildTenantLlmsPayload(input: {
  config: Record<string, any>;
  project?: TenantProject | null;
  domain: string;
  host: string;
}): Promise<{
  origin: string;
  llmsTxt: string;
  llmsFullTxt: string;
}> {
  const config = input.config;
  const preferredHost = getPreferredHost(input.project, input.host.split(":")[0].toLowerCase());
  const origin = `https://${preferredHost}`;
  const pages = normalizePagesWithDefaults(config?.pages);
  const homePage = getPageBySlug(pages, "");
  const homeSeo = buildAutoSeoDefaults({
    config,
    page: homePage as Record<string, any> | undefined,
    pageSlug: "",
    pageLabel: homePage?.label || "Home",
    domain: input.domain,
  });

  const planLimits = await getPlanLimits();
  const maxPages = getMaxPagesForProject(input.project, planLimits);
  const extraPages = canUseMultiPage(input.project)
    ? pages
      .filter((page) => page.slug && !isLegalPageSlug(page.slug) && !page?.seo?.robots?.noindex)
      .slice(0, maxPages)
    : [];

  const pageEntries: LlmsPage[] = [
    {
      slug: "",
      label: homePage?.label || "Home",
      description: homeSeo.description,
    },
    ...extraPages.map((page) => {
      const pageSeo = buildAutoSeoDefaults({
        config,
        page: page as Record<string, any>,
        pageSlug: page.slug,
        pageLabel: page.label || page.slug,
        domain: input.domain,
      });
      return {
        slug: page.slug,
        label: page.label || page.slug,
        description: pageSeo.description,
      };
    }),
    {
      slug: "privacy",
      label: "Privacy Policy",
      description: "How this website collects, processes, and protects personal data.",
    },
    {
      slug: "terms",
      label: "Terms of Service",
      description: "Terms, conditions, and usage guidelines for this website and its services.",
    },
    {
      slug: "cookies",
      label: "Cookie Policy",
      description: "Cookie usage details and visitor choices for analytics and functionality.",
    },
  ];

  const rawBrandName = asText(config?.brand?.name);
  const siteName =
    rawBrandName && rawBrandName.toLowerCase() !== "your business name"
      ? rawBrandName
      : formatDomainAsBrand(input.domain);

  const result = buildLlmsDocuments({
    siteName,
    siteDescription: homeSeo.description,
    origin,
    pages: pageEntries,
    contact: {
      email: asText(config?.contact?.email),
      phone: asText(config?.contact?.phone),
      address: asText(config?.contact?.address),
    },
    services: getServiceSignals(config),
    location: getLocation(config),
    keyFacts: [
      asText(config?.theme) ? `Business Category: ${asText(config?.theme).replace(/-/g, " ")}` : "",
      asText(config?.brand?.tagline) ? `Brand Tagline: ${asText(config?.brand?.tagline)}` : "",
    ],
  });

  return {
    origin,
    llmsTxt: result.llmsTxt,
    llmsFullTxt: result.llmsFullTxt,
  };
}
