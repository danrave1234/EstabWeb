import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { buildGeoRobotsTxt } from "@/lib/seo/ai-crawlers";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import { isProPlan } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const heads = await headers();
  const host = (heads.get("host") || domain).toLowerCase();
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
  const { project } = await getSiteConfigWithProject(domain, heads);
  const preferredHost =
    project?.custom_domain && isProPlan(project)
      ? project.custom_domain.toLowerCase()
      : project?.subdomain
        ? `${project.subdomain}.${ROOT_DOMAIN}`.toLowerCase()
        : host;
  const origin = `https://${preferredHost}`;

  const body = buildGeoRobotsTxt({
    wildcardAllow: "/",
    wildcardDisallow: ["/api/"],
    sitemapUrl: `${origin}/sitemap.xml`,
  });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
