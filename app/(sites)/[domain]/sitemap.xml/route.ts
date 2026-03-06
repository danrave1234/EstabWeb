import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import { normalizePagesWithDefaults, canUseMultiPage, getMaxPagesForProject, getPlanLimits, isLegalPageSlug } from "@/lib/utils/site-pages";
import { isProPlan } from "@/lib/subscription";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const heads = await headers();
  const host = (heads.get("host") || domain).toLowerCase();
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();

  const { config, project } = await getSiteConfigWithProject(domain, heads);
  const preferredHost =
    project?.custom_domain && isProPlan(project)
      ? project.custom_domain.toLowerCase()
      : project?.subdomain
        ? `${project.subdomain}.${ROOT_DOMAIN}`.toLowerCase()
        : host;
  const origin = `https://${preferredHost}`;

  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pages = normalizePagesWithDefaults(config?.pages);

  // Always include home
  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: origin, priority: "1.0", changefreq: "weekly" },
  ];

  // Add sub-pages if plan allows
  if (canUseMultiPage(project)) {
    const planLimits = await getPlanLimits();
    const maxPages = getMaxPagesForProject(project, planLimits);
    const subPages = pages
      .filter((p) => p.slug && !isLegalPageSlug(p.slug) && !p?.seo?.robots?.noindex)
      .slice(0, maxPages);

    for (const page of subPages) {
      urls.push({
        loc: `${origin}/${page.slug}`,
        priority: "0.8",
        changefreq: "weekly",
      });
    }
  }

  // Always include legal pages
  for (const slug of ["privacy", "terms", "cookies"]) {
    urls.push({ loc: `${origin}/${slug}`, priority: "0.3", changefreq: "monthly" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
