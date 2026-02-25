/**
 * Operation Executor
 * Applies a list of structured AI operations to a config snapshot.
 * Always operates on a deep clone — never mutates the original config.
 */

export type Operation =
  | {
      type: "add_section"
      sectionKey: string
      position?: number
      data?: Record<string, any>
    }
  | {
      type: "remove_section"
      sectionKey: string
    }
  | {
      type: "update_section"
      sectionKey: string
      changes: Record<string, any>
    }
  | {
      type: "reorder_sections"
      newOrder: string[]
    }
  | {
      type: "update_global"
      changes: Record<string, any>
    }
  | {
      type: "add_page"
      slug: string
      label: string
      sections?: string[]
    }

export interface AICommandResult {
  summary: string
  operations: Operation[]
}

/**
 * Maps section keys (as used in activeSections / block registry) to the config property
 * name that SiteBlockRenderer actually reads from. When AI writes update_section or
 * add_section with data, we must write to the correct config key.
 */
export const SECTION_KEY_TO_CONFIG_PROP: Record<string, string> = {
  // hero variants
  "hero": "hero",
  "hero-emergency": "heroEmergency",
  "hero--emergency": "heroEmergency",
  // pricing
  "pricing": "pricingTable",
  "pricing--cards": "pricingTable",
  "packages-pricing": "pricingTable",
  "pricing--subscription": "maintenancePlans",
  "maintenance-plans": "maintenancePlans",
  // features / services
  "features-modern": "features",
  "features": "features",
  "services": "features",
  "services--modern": "features",
  "services--highlight": "features",
  "services-grid": "features",
  "specialty_listings": "features",
  "comparison": "features",
  "project-gallery": "features",
  "before-after-gallery": "features",
  "programs-grid": "features",
  "faculty-grid": "features",
  // certifications / awards
  "certifications": "awardsStrip",
  "awards": "awardsStrip",
  // process / how-it-works
  "process": "howItWorks",
  "process--timeline": "howItWorks",
  "how-it-works": "howItWorks",
  "delivery-coverage": "howItWorks",
  "enrollment-process": "howItWorks",
  // testimonials
  "testimonials--bar": "testimonials",
  "testimonials": "testimonials",
  "review-trust-bar": "reviewTrustBar",
  "testimonials--grid": "reviewTrustBar",
  "reviews-grid": "reviewTrustBar",
  // team
  "team": "teamCarousel",
  "team--carousel": "teamCarousel",
  "team-carousel": "teamCarousel",
  "team--grid": "teamCarousel",
  "team-grid": "teamCarousel",
  "team--profile": "attorneyProfile",
  "attorney-profile": "attorneyProfile",
  "practice-areas": "practiceAreas",
  // booking / consultation
  "free_consultation": "freeConsultation",
  "booking": "freeConsultation",
  "lead_capture": "freeConsultation",
  "lead_capture--multi-step": "freeConsultation",
  "free-consultation": "freeConsultation",
  "booking-cta": "freeConsultation",
  // contact variants — all read from config.contact
  "contact": "contact",
  "contact--standard": "contact",
  "contact--minimal": "contact",
  "contact-minimal": "contact",
  "contact--visual": "contact",
  "contact-visual": "contact",
  "contact--with-map": "contact",
  "contact-with-map": "contact",
  "contact--split": "contact",
  "contact-split": "contact",
  "contact--columns": "contact",
  "contact-columns": "contact",
  // faq
  "faq": "faqAccordion",
  "faq-accordion": "faqAccordion",
  "faq--two-column": "patientFaq",
  "patient-faq": "patientFaq",
  "faq-two-column": "patientFaq",
  // blog
  "blog_preview": "blog",
  "blog": "blog",
  // pest control specific
  "common-pests": "commonPests",
  "treatment-process": "treatmentProcess",
  "safety-section": "safety",
  "guarantee": "warranty",
  "guarantee--badge": "warranty",
  "guarantee--safety": "warranty",
  "warranty-block": "warranty",
  "comparison--table": "acTypes",
  "comparison--vs": "acTypes",
  "ac-types-grid": "acTypes",
  "price_preview": "pricePreview",
  "price-preview-strip": "pricePreview",
  "cta--emergency": "emergencyCTA",
  "emergency-cta-strip": "emergencyCTA",
  // gallery
  "gallery": "beforeAfterGallery",
  "gallery--grid": "beforeAfterGallery",
  "case_study": "beforeAfterGallery",
  "case_study--detail": "beforeAfterGallery",
  "before-after-gallery-grid": "beforeAfterGallery",
  "gallery--slider": "beforeAfterSlider",
  "before-after-slider": "beforeAfterSlider",
  // cta
  "cta": "promoCTA",
  "cta--banner": "promoCTA",
  "promo-cta-section": "promoCTA",
  "cta--sticky": "messengerStickyCTA",
  "messenger-sticky-cta": "messengerStickyCTA",
  // service area
  "service_area": "serviceAreaMap",
  "service-area-map": "serviceAreaMap",
  "service_area--radius": "coverageRadiusBlock",
  "coverage-radius-block": "coverageRadiusBlock",
  // announcement bar
  "announcement_bar": "promoBannerStrip",
  "announcement_bar--promo": "promoBannerStrip",
  "announcement_bar--emergency": "promoBannerStrip",
  "announcement_bar--offer": "promoBannerStrip",
  "cta--promo-strip": "promoBannerStrip",
  "promo-banner-strip": "promoBannerStrip",
  // payment
  "payment_options": "paymentOptionsStrip",
  "payment-options-strip": "paymentOptionsStrip",
  // social proof
  "testimonials--facebook": "facebookReviewEmbed",
  "facebook-review-embed": "facebookReviewEmbed",
  // stats
  "stats": "statsSection",
  "stats-section": "statsSection",
  // logo / trust
  "logo_cloud": "logoCloud",
  "logo-cloud": "logoCloud",
  "trust_badges": "trustBadgesGrid",
  "trust-badges-grid": "trustBadgesGrid",
  // feature highlight / why choose us
  "service_detail": "featureHighlight",
  "service_detail--split": "featureHighlight",
  "feature-highlight": "featureHighlight",
  "why-choose-us": "featureHighlight",
  "team--spotlight": "whyChooseMe",
  "why-choose-me": "whyChooseMe",
  // real estate
  "featured-properties-grid": "featuredListings",
  "financing-section": "financing",
  "developer-partners": "developerPartners",
}

/** Resolve the config property name for a given section key. Falls back to the key itself. */
export function resolveConfigProp(sectionKey: string): string {
  return SECTION_KEY_TO_CONFIG_PROP[sectionKey] ?? sectionKey
}

/**
 * Keys that must never be written into a section object via update_section.
 * These are top-level config structural fields — AI cannot inject them via section updates.
 */
const BLOCKED_SECTION_KEYS = new Set([
  "activeSections",
  "pages",
  "colorTheme",
  "typographyStyle",
  "darkMode",
  "domain",
  "subdomain",
  "subscription_status",
  "subscription_ends_at",
  "trial_ends_at",
  "plan",
  "publish_count",
  "publish_count_daily",
  "last_published_at",
])

export function applyOperations(
  config: Record<string, any>,
  operations: Operation[]
): Record<string, any> {
  let newConfig = structuredClone(config)

  for (const op of operations) {
    switch (op.type) {
      case "add_section": {
        if (!Array.isArray(newConfig.activeSections)) {
          newConfig.activeSections = []
        }
        if (!newConfig.activeSections.includes(op.sectionKey)) {
          // Clamp position to valid range
          const rawPos = op.position ?? newConfig.activeSections.length
          const safePos = Math.min(Math.max(rawPos, 0), newConfig.activeSections.length)
          newConfig.activeSections.splice(safePos, 0, op.sectionKey)
        }
        if (op.data && typeof op.data === "object") {
          const configProp = resolveConfigProp(op.sectionKey)
          newConfig[configProp] = {
            ...(newConfig[configProp] ?? {}),
            ...op.data,
          }
        }
        break
      }

      case "remove_section": {
        // Hero cannot be removed
        if (op.sectionKey === "hero") break
        if (Array.isArray(newConfig.activeSections)) {
          newConfig.activeSections = newConfig.activeSections.filter(
            (s: string) => s !== op.sectionKey
          )
        }
        break
      }

      case "update_section": {
        // Filter out any blocked structural keys before merging
        const safeChanges: Record<string, any> = {}
        for (const [k, v] of Object.entries(op.changes)) {
          if (!BLOCKED_SECTION_KEYS.has(k)) {
            safeChanges[k] = v
          }
        }
        const configProp = resolveConfigProp(op.sectionKey)
        newConfig[configProp] = {
          ...(newConfig[configProp] ?? {}),
          ...safeChanges,
        }
        break
      }

      case "reorder_sections": {
        newConfig.activeSections = op.newOrder
        break
      }

      case "update_global": {
        // Scalar fields — direct assignment
        const ALLOWED_SCALAR = ["colorTheme", "typographyStyle", "darkMode", "footerStyle", "headerStyle"]
        for (const key of ALLOWED_SCALAR) {
          if (key in op.changes) {
            newConfig[key] = op.changes[key]
          }
        }
        // footer — deep merge so AI can update individual sub-fields without wiping the rest
        if ("footer" in op.changes && op.changes.footer && typeof op.changes.footer === "object") {
          newConfig.footer = {
            ...(newConfig.footer ?? {}),
            ...op.changes.footer,
            ...(op.changes.footer.contact
              ? { contact: { ...(newConfig.footer?.contact ?? {}), ...op.changes.footer.contact } }
              : {}),
            ...(op.changes.footer.social
              ? { social: { ...(newConfig.footer?.social ?? {}), ...op.changes.footer.social } }
              : {}),
          }
        }
        // brand — deep merge so AI can update name/logoUrl/ctaHref individually
        if ("brand" in op.changes && op.changes.brand && typeof op.changes.brand === "object") {
          newConfig.brand = {
            ...(newConfig.brand ?? {}),
            ...op.changes.brand,
          }
        }
        // navigation — full replacement (AI provides the new nav array)
        if ("navigation" in op.changes && Array.isArray(op.changes.navigation)) {
          newConfig.navigation = op.changes.navigation
        }
        break
      }
      case "add_page": {
        if (!Array.isArray(newConfig.pages)) newConfig.pages = []
        const slugExists = newConfig.pages.some((p: any) => p.slug === op.slug)
        if (!slugExists) {
          newConfig.pages.push({
            slug: op.slug,
            label: op.label,
            activeSections: op.sections ?? ["hero"],
          })
        }
        break
      }
    }
  }

  return newConfig
}
