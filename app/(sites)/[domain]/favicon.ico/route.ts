import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getCachedSiteConfig } from "@/lib/utils/site-config"

export const revalidate = 120

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params
  const heads = await headers()
  const { config } = await getCachedSiteConfig(domain, heads)
  const iconUrl = config?.brand?.favicon || config?.brand?.logoUrl

  if (typeof iconUrl === "string" && /^https?:\/\//i.test(iconUrl)) {
    try {
      const imageResponse = await fetch(iconUrl, {
        next: { revalidate: 120 },
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; EstabWebBot/1.0; +https://estabweb.com)",
        },
      })

      if (imageResponse.ok) {
        const contentType = imageResponse.headers.get("content-type") || "image/png"
        const body = await imageResponse.arrayBuffer()

        return new NextResponse(body, {
          headers: {
            "content-type": contentType,
            "cache-control": "public, max-age=0, s-maxage=120, stale-while-revalidate=86400",
          },
        })
      }
    } catch {
      // Fall through to local fallback icon.
    }
  }

  return NextResponse.redirect(new URL("/Logo.png", `https://${heads.get("host") || domain}`))
}