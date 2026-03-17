import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";
import { buildTenantLlmsPayload } from "@/lib/seo/tenant-llms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const heads = await headers();
  const host = (heads.get("host") || domain).toLowerCase();
  const { config, project } = await getSiteConfigWithProject(domain, heads);

  if (!config) {
    return new NextResponse("Not found", { status: 404 });
  }

  const payload = await buildTenantLlmsPayload({
    config,
    project,
    domain,
    host,
  });

  return new NextResponse(payload.llmsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
