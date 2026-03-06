import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo"

describe("buildAutoSeoDefaults", () => {
  it("builds useful defaults when seo fields are missing", () => {
    const result = buildAutoSeoDefaults({
      domain: "acme",
      config: {
        brand: { name: "Acme Pest Control" },
        hero: { title: "Termite and rodent removal", subtitle: "Fast same-day response for homes and businesses." },
        contact: { city: "Austin", country: "USA" },
      },
      page: {
        slug: "",
        label: "Home",
        activeSections: ["hero", "contact"],
      },
    })

    expect(result.title).toContain("Acme Pest Control")
    expect(result.description.length).toBeGreaterThanOrEqual(60)
    expect(result.keywords.length).toBeGreaterThanOrEqual(3)
    expect(result.canonical).toBe("/")
  })

  it("normalizes canonical path to a safe in-domain path", () => {
    const result = buildAutoSeoDefaults({
      domain: "acme",
      config: {
        brand: { name: "Acme" },
      },
      page: {
        slug: "about",
        label: "About",
        seo: {
          canonical: "https://malicious.example.com/phish",
        },
      },
      pageSlug: "about",
    })

    expect(result.canonical).toBe("/about")
  })

  it("infers faq structured data when faq sections are active", () => {
    const result = buildAutoSeoDefaults({
      domain: "acme",
      config: {
        brand: { name: "Acme HVAC" },
      },
      page: {
        slug: "faq",
        label: "FAQ",
        activeSections: ["faq", "contact"],
      },
    })

    expect(result.structuredData.type).toBe("faq")
  })
})
