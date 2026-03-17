import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSiteConfigWithProject } from "@/lib/utils/site-config";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ domain: string }> }
) {
    try {
        const { domain } = await params;
        const heads = await headers();
        const { config } = await getSiteConfigWithProject(domain, heads);

        const bingAuthId = config?.seo?.bingAuthId;

        if (!bingAuthId) {
            return new NextResponse("Not Found: Missing bingAuthId in SEO config.", { status: 404 });
        }

        const xml = `<?xml version="1.0"?>
<users>
	<user>${bingAuthId}</user>
</users>`;

        return new NextResponse(xml, {
            headers: {
                "Content-Type": "text/xml",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (e) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
