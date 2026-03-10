import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { buildHubLlmsPayload } from "@/lib/seo/hub-llms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const heads = await headers();
  const host = heads.get("host") || "www.estabweb.com";
  const payload = buildHubLlmsPayload(host);

  return new NextResponse(payload.llmsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
