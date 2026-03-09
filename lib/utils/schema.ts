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

function asText(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.trim()
}

function splitAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean)
  return {
    streetAddress: parts[0] || undefined,
    addressLocality: parts[1] || undefined,
    addressRegion: parts[2] || undefined,
    postalCode: parts[3] || undefined,
  }
}

function parseLatLngFromEmbedUrl(url: string): { latitude?: number; longitude?: number } {
  // Supports formats like "...!2d121.03!3d14.59..." or "q=14.59,121.03"
  const d3 = url.match(/!3d(-?\d+(?:\.\d+)?)/)
  const d2 = url.match(/!2d(-?\d+(?:\.\d+)?)/)
  if (d3 && d2) {
    return {
      latitude: Number(d3[1]),
      longitude: Number(d2[1]),
    }
  }
  const q = url.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (q) {
    return {
      latitude: Number(q[1]),
      longitude: Number(q[2]),
    }
  }
  return {}
}

export function generateSchema(type: SchemaType | undefined, config: Record<string, any>): object | null {
  if (!type) return null

  const brand = config?.brand || {}
  const rawBrandName = asText(brand.name)
  const brandName = rawBrandName.toLowerCase() === "your business name" ? undefined : (rawBrandName || undefined)
  const contact = config?.contact || {}
  const safeContact = {
    ...contact,
    email: asText(contact.email).toLowerCase().includes("example") ? undefined : contact.email,
    phone: asText(contact.phone).includes("555-0100") ? undefined : contact.phone,
    address: asText(contact.address).includes("CityName") || asText(contact.address).includes("123 Main") ? undefined : contact.address,
  }
  const social = config?.footer?.social || {}
  const addressText = asText(safeContact.address)
  const parsedAddress = addressText ? splitAddress(addressText) : {}
  const mapEmbedUrl = asText(config?.contactWithMap?.mapEmbedUrl || config?.serviceAreaMap?.mapEmbedUrl)
  const latLng = mapEmbedUrl ? parseLatLngFromEmbedUrl(mapEmbedUrl) : {}
  const areaCities = Array.isArray(config?.serviceAreaMap?.cities)
    ? config.serviceAreaMap.cities.filter((city: unknown) => typeof city === "string" && city.trim().length > 0)
    : []
  const areaList = Array.isArray(config?.deliveryCoverage?.areas)
    ? config.deliveryCoverage.areas.filter((area: unknown) => typeof area === "string" && area.trim().length > 0)
    : []
  const sameAs = [social.facebook, social.instagram, social.linkedin, social.twitter]
    .filter((url: unknown): url is string => typeof url === "string" && url.trim().length > 0)

  switch (type) {
    case "localbusiness":
      return cleanSchema({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: brandName,
        url: config?.siteUrl || undefined,
        image: brand.logoUrl || undefined,
        telephone: safeContact.phone || undefined,
        email: safeContact.email || undefined,
        sameAs: sameAs.length > 0 ? sameAs : undefined,
        hasMap: mapEmbedUrl || undefined,
        geo: latLng.latitude && latLng.longitude ? {
          "@type": "GeoCoordinates",
          latitude: latLng.latitude,
          longitude: latLng.longitude,
        } : undefined,
        areaServed: [...areaCities, ...areaList].length > 0 ? [...areaCities, ...areaList].slice(0, 12) : undefined,
        address: addressText ? {
          "@type": "PostalAddress",
          ...parsedAddress,
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
        headline: brandName,
        image: brand.logoUrl || undefined,
        author: brandName ? {
          "@type": "Organization",
          name: brandName,
        } : undefined,
      }) as object

    default:
      return null
  }
}
