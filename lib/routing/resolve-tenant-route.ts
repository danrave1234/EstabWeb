const RESERVED_ROOT_PATHS = [
  "api",
  "admin",
  "login",
  "dashboard",
  "onboarding",
  "auth",
  "preview",
  "pricing",
  "terms",
  "privacy",
  "cookies",
  "contact",
  "success",
]

function isCommonPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth")
  )
}

export type TenantRouteDecision =
  | { kind: "redirect"; destination: string; headers: Record<string, string> }
  | { kind: "rewrite-admin"; destination: string; headers: Record<string, string> }
  | { kind: "rewrite-site"; destination: string; headers: Record<string, string> }
  | { kind: "next"; headers: Record<string, string> }

type ResolveTenantRouteInput = {
  requestUrl: string
  hostHeader: string | null
  rootDomain?: string
  forwardedProto?: string | null
}

export function resolveTenantRoute(input: ResolveTenantRouteInput): TenantRouteDecision {
  const url = new URL(input.requestUrl)
  const hostHeader = (input.hostHeader || url.host).toLowerCase()
  const hostname = hostHeader.split(":")[0]
  const ROOT_DOMAIN = (input.rootDomain || "estabweb.com").toLowerCase()
  const isDevHost = hostname === "localhost" || hostname === "127.0.0.1"
  const isStagingHost = hostname === `staging.${ROOT_DOMAIN}`
  const isVercelPreview = hostname.endsWith(".vercel.app")
  const isRoot =
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    isDevHost ||
    isStagingHost ||
    isVercelPreview
  const isAdmin = hostname === `admin.${ROOT_DOMAIN}` || hostname.startsWith("admin.")

  const headers: Record<string, string> = {}
  if (url.searchParams.has("preview")) {
    headers["x-preview-mode"] = url.searchParams.get("preview") || "false"
  }
  if (url.searchParams.has("projectId")) {
    headers["x-project-id"] = url.searchParams.get("projectId") || ""
  }
  if (url.searchParams.has("requestId")) {
    headers["x-request-id"] = url.searchParams.get("requestId") || ""
  }

  if (!isDevHost && !isStagingHost && !isVercelPreview && isRoot && url.pathname !== "/") {
    const segment = url.pathname.replace(/^\/|\/$/g, "").split("/")[0]?.toLowerCase()
    if (segment && !RESERVED_ROOT_PATHS.includes(segment) && !segment.includes(".")) {
      const protocol =
        input.forwardedProto === "https" || url.protocol === "https:" ? "https" : "http"
      const tail = url.pathname.slice(segment.length + 1) || "/"
      return {
        kind: "redirect",
        destination: `${protocol}://${segment}.${ROOT_DOMAIN}${tail}${url.search}`,
        headers,
      }
    }
  }

  if (isAdmin) {
    const adminPath = url.pathname === "/" ? "" : url.pathname
    return {
      kind: "rewrite-admin",
      destination: `/admin${adminPath}${url.search}`,
      headers,
    }
  }

  const commonPath = isCommonPath(url.pathname)
  if (isRoot || commonPath) {
    headers["x-invoke-path"] = url.pathname
  }

  const isPathBasedDomain = isDevHost && url.pathname !== "/" && !commonPath
  if ((!isRoot || isPathBasedDomain) && !commonPath) {
    let domainParam = ""
    if (isPathBasedDomain) {
      domainParam = url.pathname.split("/")[1]
    } else if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
      domainParam = hostname.slice(0, -(ROOT_DOMAIN.length + 1)).toLowerCase()
    } else {
      domainParam = hostname.toLowerCase()
    }

    const passthroughPath = isPathBasedDomain
      ? url.pathname.replace(`/${domainParam}`, "") || ""
      : url.pathname === "/"
        ? ""
        : url.pathname

    return {
      kind: "rewrite-site",
      destination: `/${domainParam}${passthroughPath}${url.search}`,
      headers,
    }
  }

  return { kind: "next", headers }
}
