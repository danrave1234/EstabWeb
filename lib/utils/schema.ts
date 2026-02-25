export type SchemaType = "localbusiness" | "faq" | "article"

// Remove undefined/null/empty-string values so Google doesn't flag malformed schema
function cleanSchema(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(cleanSchema).filter((v) => v !== null && v !== undefined)
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cleaned = cleanSchema(v)
      if (cleaned !== null && cleaned !== undefined && cleaned !== "") {
        result[k] = cleaned
      }
    }
    return Object.keys(result).length > 0 ? result : undefined
  }
  return obj === "" ? undefined : obj
}

export function generateSchema(type: SchemaType | undefined, config: Record<string, any>): object | null {
  if (!type) return null

  const brand = config?.brand || {}
  const contact = config?.contact || {}

  switch (type) {
    case "localbusiness":
      return cleanSchema({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: brand.name || undefined,
        url: config?.siteUrl || undefined,
        image: brand.logoUrl || undefined,
        telephone: contact.phone || undefined,
        email: contact.email || undefined,
        address: contact.address ? {
          "@type": "PostalAddress",
          streetAddress: contact.address,
        } : undefined,
      }) as object

    case "faq": {
      const items = config?.faq?.items || config?.patientFaq?.items || []
      if (!Array.isArray(items) || items.length === 0) return null
      return cleanSchema({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item: any) => ({
          "@type": "Question",
          name: item.question || item.q || undefined,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer || item.a || undefined,
          },
        })),
      }) as object
    }

    case "article":
      return cleanSchema({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: brand.name || undefined,
        image: brand.logoUrl || undefined,
        author: brand.name ? {
          "@type": "Organization",
          name: brand.name,
        } : undefined,
      }) as object

    default:
      return null
  }
}
