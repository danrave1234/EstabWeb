import { resolveTenantRoute } from "@/lib/routing/resolve-tenant-route"

describe("resolveTenantRoute", () => {
  it("redirects root-domain path segment to subdomain on production", () => {
    const decision = resolveTenantRoute({
      requestUrl: "https://estabweb.com/acme/services?x=1",
      hostHeader: "estabweb.com",
      rootDomain: "estabweb.com",
      forwardedProto: "https",
    })

    expect(decision.kind).toBe("redirect")
    if (decision.kind === "redirect") {
      expect(decision.destination).toBe("https://acme.estabweb.com/services?x=1")
    }
  })

  it("rewrites admin host to /admin route group", () => {
    const decision = resolveTenantRoute({
      requestUrl: "https://admin.estabweb.com/settings",
      hostHeader: "admin.estabweb.com",
      rootDomain: "estabweb.com",
    })

    expect(decision.kind).toBe("rewrite-admin")
    if (decision.kind === "rewrite-admin") {
      expect(decision.destination).toBe("/admin/settings")
    }
  })

  it("rewrites subdomain host to domain-scoped site route", () => {
    const decision = resolveTenantRoute({
      requestUrl: "https://acme.estabweb.com/pricing",
      hostHeader: "acme.estabweb.com",
      rootDomain: "estabweb.com",
    })

    expect(decision.kind).toBe("rewrite-site")
    if (decision.kind === "rewrite-site") {
      expect(decision.destination).toBe("/acme/pricing")
    }
  })

  it("supports localhost path-based domains", () => {
    const decision = resolveTenantRoute({
      requestUrl: "http://localhost:3000/acme/about",
      hostHeader: "localhost:3000",
      rootDomain: "estabweb.com",
    })

    expect(decision.kind).toBe("rewrite-site")
    if (decision.kind === "rewrite-site") {
      expect(decision.destination).toBe("/acme/about")
    }
  })

  it("passes preview/projectId/query headers through", () => {
    const decision = resolveTenantRoute({
      requestUrl: "http://localhost:3000/dashboard?preview=true&projectId=p1&requestId=r1",
      hostHeader: "localhost:3000",
      rootDomain: "estabweb.com",
    })

    expect(decision.headers["x-preview-mode"]).toBe("true")
    expect(decision.headers["x-project-id"]).toBe("p1")
    expect(decision.headers["x-request-id"]).toBe("r1")
    expect(decision.headers["x-invoke-path"]).toBe("/dashboard")
  })
})
