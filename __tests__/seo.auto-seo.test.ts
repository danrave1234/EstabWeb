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

  it("strips placeholder brand, city, and contact defaults from generated seo", () => {
    const result = buildAutoSeoDefaults({
      domain: "lawthings.online",
      config: {
        brand: { name: "Your Business Name" },
        hero: {
          title: "Dedicated Legal Defense You Can Trust | Your Business Name",
          subtitle: "Facing legal challenges in Your City? Contact contact@yourbusiness.com today.",
        },
        contact: {
          city: "Your City",
          address: "123 Main St, Your City",
        },
      },
      page: {
        slug: "",
        label: "Home",
        activeSections: ["hero", "contact"],
        seo: {
          title: "Dedicated Legal Defense You Can Trust | Your Business Name",
          description: "Facing legal challenges in Your City? Contact contact@yourbusiness.com today.",
        },
      },
    })

    expect(result.title).not.toMatch(/your business name/i)
    expect(result.title).toContain("Lawthings")
    expect(result.description).not.toMatch(/your city|contact@yourbusiness\.com/i)
    expect(result.keywords.join(" ")).not.toMatch(/your city|your business name/i)
  })

  it("uses active modern section content when explicit seo is missing", () => {
    const result = buildAutoSeoDefaults({
      domain: "elevatefitness.ph",
      config: {
        brand: { name: "Elevate Fitness" },
        contact: { city: "Makati", country: "Philippines" },
        hero: { title: "", subtitle: "" },
        featureSteps: {
          title: "Simple coaching system",
          subtitle: "Three guided steps that help busy professionals train consistently and see progress.",
          items: [
            { title: "Book your assessment", description: "Meet a coach who builds your plan around your schedule and goals." },
            { title: "Follow your weekly training plan" },
          ],
        },
        pricingComparisonTable: {
          title: "Membership options for every goal",
          subtitle: "Compare personal training, class access, and recovery inclusions before you join.",
          plans: [
            { name: "Strength Membership", description: "Full gym access with progressive programming." },
          ],
        },
        testimonialsCommunity: {
          title: "Results our members talk about",
          testimonials: [
            { name: "Aly", quote: "I lost 8kg and finally stayed consistent because the program was easy to follow." },
          ],
        },
      },
      page: {
        slug: "",
        label: "Home",
        activeSections: ["features--steps", "pricing--comparison", "testimonials--community"],
      },
    })

    expect(result.title).toContain("Elevate Fitness")
    expect(result.title).toMatch(/Simple coaching system|Membership options for every goal/i)
    expect(result.description).toMatch(/Three guided steps|Compare personal training|I lost 8kg/i)
    expect(result.keywords.join(" ")).toMatch(/Simple coaching system|Membership options for every goal|Results our members talk about/i)
  })

  it("prefers subpage content over generic site-wide seo defaults", () => {
    const result = buildAutoSeoDefaults({
      domain: "acmelaw.ph",
      config: {
        brand: { name: "Acme Law" },
        seo: {
          title: "Acme Law | Trusted Legal Services",
          description: "Generic firm-wide SEO copy for the whole site.",
          keywords: ["law firm", "legal services", "attorney"],
        },
        serviceAreas: {
          title: "Business formation in Makati",
          subtitle: "Helping founders register corporations, partnerships, and compliance requirements in the Philippines.",
          items: [
            { title: "SEC registration assistance" },
            { title: "Corporate compliance support" },
          ],
        },
      },
      page: {
        slug: "business-formation",
        label: "Business Formation",
        activeSections: ["serviceAreas"],
      },
      pageSlug: "business-formation",
      pageLabel: "Business Formation",
    })

    expect(result.title).toContain("Acme Law")
    expect(result.title).toMatch(/Business Formation|Business formation in Makati/i)
    expect(result.title).not.toBe("Acme Law | Trusted Legal Services")
    expect(result.description).toMatch(/Helping founders register corporations|SEC registration assistance/i)
    expect(result.description).not.toBe("Generic firm-wide SEO copy for the whole site.")
    expect(result.keywords.join(" ")).toMatch(/Business Formation|Business formation in Makati|SEC registration assistance/i)
    expect(result.keywords.join(" ")).not.toMatch(/attorney/i)
  })
})
