/**
 * BLOCK REGISTRY
 * Single source of truth for every section block in the system.
 *
 * Adding a new block:
 *  1. Add one entry here.
 *  2. Create the component in components/blocks/.
 *  3. Add a DEFAULT_* export in config/dashboard-config.ts if it has editable data.
 *
 * That's it — SiteBlockRenderer, dashboard preview, nav-building, and
 * section-picker all derive their behaviour from this registry automatically.
 */

export type PreviewKind =
  | "cards-3"
  | "cards-4"
  | "timeline"
  | "strip"
  | "logos"
  | "pricing"
  | "faq"
  | "gallery"
  | "map"
  | "cta"
  | "stats"
  | "generic";

export interface BlockDefinition {
  /** The section identifier string used in activeSections arrays. */
  id: string;
  /** The key inside the site-config data object that holds this block's data. */
  dataKey: string;
  /**
   * Nav entry to auto-generate in the header when this section is active.
   * null = section is not shown in the nav (e.g. hero, sticky widgets).
   * undefined = not registered in nav at all.
   */
  navEntry?: { name: string; href: string } | null;
  /** Minimal preview skeleton kind shown in the section picker. */
  previewKind: PreviewKind;
}

/**
 * All registered blocks. Order here does not matter — it's a lookup table.
 * Aliases (multiple IDs sharing the same dataKey) are separate entries.
 */
export const BLOCK_REGISTRY: BlockDefinition[] = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  { id: "hero",            dataKey: "hero",          navEntry: null,                                        previewKind: "generic" },
  { id: "hero-emergency",  dataKey: "heroEmergency", navEntry: { name: "Emergency", href: "#hero-emergency" }, previewKind: "cta" },

  // ── Trust & Social Proof ──────────────────────────────────────────────────
  { id: "awards",                dataKey: "awardsStrip",         navEntry: { name: "Credentials", href: "#credentials" }, previewKind: "strip" },
  { id: "certifications",        dataKey: "awardsStrip",         navEntry: { name: "Credentials", href: "#credentials" }, previewKind: "strip" },
  { id: "review-trust-bar",      dataKey: "reviewTrustBar",      navEntry: { name: "Reviews", href: "#reviews" },         previewKind: "strip" },
  { id: "reviews-grid",          dataKey: "reviewTrustBar",      navEntry: undefined,                                     previewKind: "cards-3" },
  { id: "testimonials",          dataKey: "testimonials",        navEntry: { name: "Testimonials", href: "#testimonials" }, previewKind: "cards-3" },
  { id: "trust-badges-grid",     dataKey: "trustBadgesGrid",     navEntry: undefined,                                     previewKind: "cards-4" },
  { id: "facebook-review-embed", dataKey: "facebookReviewEmbed", navEntry: undefined,                                     previewKind: "cards-3" },
  { id: "logo-cloud",            dataKey: "logoCloud",           navEntry: undefined,                                     previewKind: "logos" },

  // ── Services & Features ───────────────────────────────────────────────────
  { id: "features",               dataKey: "features",         navEntry: { name: "Services", href: "#services" },   previewKind: "cards-3" },
  { id: "features-modern",        dataKey: "features",         navEntry: { name: "Services", href: "#services" },   previewKind: "cards-3" },
  { id: "services-grid",          dataKey: "features",         navEntry: { name: "Services", href: "#services" },   previewKind: "cards-3" },
  { id: "project-gallery",        dataKey: "features",         navEntry: undefined,                                 previewKind: "cards-3" },
  { id: "programs-grid",          dataKey: "features",         navEntry: undefined,                                 previewKind: "cards-3" },
  { id: "faculty-grid",           dataKey: "features",         navEntry: undefined,                                 previewKind: "cards-3" },
  { id: "practice-areas",         dataKey: "practiceAreas",    navEntry: { name: "Practice Areas", href: "#services" }, previewKind: "cards-3" },
  { id: "feature-highlight",      dataKey: "featureHighlight", navEntry: { name: "Highlights", href: "#highlights" },   previewKind: "cards-3" },
  { id: "why-choose-us",          dataKey: "featureHighlight", navEntry: undefined,                                     previewKind: "cards-3" },
  { id: "ac-types-grid",          dataKey: "acTypes",          navEntry: undefined,                                     previewKind: "cards-3" },
  { id: "financing-section",      dataKey: "financing",        navEntry: undefined,                                     previewKind: "cards-3" },
  { id: "developer-partners",     dataKey: "developerPartners",navEntry: undefined,                                     previewKind: "logos" },
  { id: "featured-properties-grid", dataKey: "featuredListings", navEntry: undefined,                                   previewKind: "cards-3" },
  { id: "warranty-block",         dataKey: "warranty",         navEntry: undefined,                                     previewKind: "cta" },
  { id: "why-choose-me",          dataKey: "whyChooseMe",      navEntry: undefined,                                     previewKind: "cards-3" },

  // ── Process & Info ────────────────────────────────────────────────────────
  { id: "how-it-works",       dataKey: "howItWorks",      navEntry: { name: "How It Works", href: "#how-it-works" }, previewKind: "timeline" },
  { id: "delivery-coverage",  dataKey: "deliveryCoverage",navEntry: undefined,                                       previewKind: "stats" },
  { id: "treatment-process",  dataKey: "treatmentProcess",navEntry: undefined,                                       previewKind: "timeline" },
  { id: "patient-faq",        dataKey: "patientFaq",      navEntry: { name: "FAQ", href: "#faq" },                   previewKind: "faq" },
  { id: "faq-two-column",     dataKey: "patientFaq",      navEntry: { name: "FAQ", href: "#faq" },                   previewKind: "faq" },
  { id: "faq-accordion",      dataKey: "faqAccordion",    navEntry: { name: "FAQ", href: "#faq" },                   previewKind: "faq" },
  { id: "blog",               dataKey: "blog",            navEntry: { name: "Insights", href: "#blog" },             previewKind: "cards-3" },
  { id: "stats-section",      dataKey: "statsSection",    navEntry: undefined,                                       previewKind: "stats" },

  // ── Team & Profiles ───────────────────────────────────────────────────────
  { id: "team-carousel",   dataKey: "teamCarousel",   navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3" },
  { id: "team-grid",       dataKey: "teamCarousel",   navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3" },
  { id: "attorney-profile",dataKey: "attorneyProfile",navEntry: { name: "About", href: "#about" }, previewKind: "generic" },

  // ── Contact & Conversion ──────────────────────────────────────────────────
  { id: "contact",              dataKey: "contact",         navEntry: { name: "Contact", href: "#contact" },          previewKind: "generic" },
  { id: "contact-minimal",      dataKey: "contact",         navEntry: { name: "Contact", href: "#contact" },          previewKind: "generic" },
  { id: "contact-visual",       dataKey: "contact",         navEntry: { name: "Contact", href: "#contact" },          previewKind: "generic" },
  { id: "contact-with-map",     dataKey: "contact",         navEntry: { name: "Contact", href: "#contact" },          previewKind: "map" },
  { id: "contact-columns",      dataKey: "contact",         navEntry: { name: "Contact", href: "#contact" },          previewKind: "generic" },
  { id: "free-consultation",    dataKey: "freeConsultation",navEntry: { name: "Free Consultation", href: "#contact" }, previewKind: "cta" },
  { id: "booking-cta",          dataKey: "bookingCTA",      navEntry: undefined,                                       previewKind: "cta" },
  { id: "pricing",              dataKey: "pricingTable",    navEntry: { name: "Pricing", href: "/pricing" },           previewKind: "pricing" },
  { id: "packages-pricing",     dataKey: "pricingTable",    navEntry: { name: "Pricing", href: "#pricing" },           previewKind: "pricing" },
  { id: "maintenance-plans",    dataKey: "maintenancePlans",navEntry: undefined,                                       previewKind: "pricing" },
  { id: "price-preview-strip",  dataKey: "pricePreview",    navEntry: undefined,                                       previewKind: "cta" },
  { id: "emergency-cta-strip",  dataKey: "emergencyCTA",    navEntry: undefined,                                       previewKind: "cta" },
  { id: "promo-cta-section",    dataKey: "promoCTA",        navEntry: undefined,                                       previewKind: "cta" },
  { id: "promo-banner-strip",   dataKey: "promoBannerStrip",navEntry: undefined,                                       previewKind: "strip" },
  { id: "payment-options-strip",dataKey: "paymentOptionsStrip", navEntry: undefined,                                   previewKind: "strip" },
  { id: "service-area-map",     dataKey: "serviceAreaMap",  navEntry: undefined,                                       previewKind: "map" },
  { id: "coverage-radius-block",dataKey: "coverageRadiusBlock", navEntry: undefined,                                   previewKind: "map" },
  { id: "messenger-sticky-cta", dataKey: "messengerStickyCTA",  navEntry: null,                                        previewKind: "cta" },

  // ── Visuals & Galleries ───────────────────────────────────────────────────
  { id: "before-after-gallery-grid", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery" },
  { id: "before-after-gallery",      dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery" },
  { id: "before-after-slider",       dataKey: "beforeAfterSlider",  navEntry: undefined, previewKind: "gallery" },
  { id: "common-pests",              dataKey: "commonPests",        navEntry: undefined, previewKind: "cards-3" },
  { id: "safety-section",            dataKey: "safety",             navEntry: undefined, previewKind: "cards-3" },

];

/** Fast lookup map: section ID → BlockDefinition */
export const BLOCK_MAP: Record<string, BlockDefinition> = Object.fromEntries(
  BLOCK_REGISTRY.map((b) => [b.id, b])
);

/** Returns the data key for a section ID, falling back to the ID itself. */
export function getDataKey(sectionId: string): string {
  return BLOCK_MAP[sectionId]?.dataKey ?? sectionId;
}

/** Returns the preview kind for a section ID. */
export function getPreviewKind(sectionId: string): PreviewKind {
  return BLOCK_MAP[sectionId]?.previewKind ?? "generic";
}

/** Returns the nav entry for a section ID (undefined = not in registry). */
export function getNavEntry(sectionId: string): { name: string; href: string } | null | undefined {
  return BLOCK_MAP[sectionId]?.navEntry;
}

/**
 * Default data map: section ID → default data object.
 * Used when adding a new section that has no existing data in the config.
 * Import DEFAULT_* values lazily to avoid circular deps — keep this file server+client safe.
 */
export type DefaultSectionDataMap = Record<string, unknown>

/**
 * Section picker categories shown in the "Add Section" modal.
 * Each entry groups related section IDs under a human-readable label.
 */
export const SECTION_CATEGORIES: { label: string; ids: string[] }[] = [
  { label: "Hero & Identity", ids: ["hero"] },
  { label: "Trust & Social Proof", ids: ["awards", "review-trust-bar", "trust-badges-grid", "facebook-review-embed", "reviews-grid", "testimonials"] },
  { label: "Services & Features", ids: ["features", "practice-areas", "feature-highlight", "ac-types-grid", "financing-section", "developer-partners", "featured-properties-grid", "features-modern", "services-grid", "project-gallery", "programs-grid", "warranty-block"] },
  { label: "Process & Info", ids: ["how-it-works", "treatment-process", "patient-faq", "faq-accordion", "faq-two-column", "blog", "delivery-coverage", "stats-section"] },
  { label: "Team & Profiles", ids: ["team-carousel", "team-grid", "attorney-profile", "faculty-grid", "why-choose-me"] },
  { label: "Contact & Conversion", ids: ["contact", "contact-minimal", "contact-visual", "contact-with-map", "contact-columns", "free-consultation", "booking-cta", "messenger-sticky-cta", "pricing", "promo-cta-section", "promo-banner-strip", "payment-options-strip", "service-area-map", "coverage-radius-block", "emergency-cta-strip", "price-preview-strip", "maintenance-plans"] },
  { label: "Visuals & Galleries", ids: ["before-after-gallery-grid", "before-after-slider", "common-pests", "safety-section", "logo-cloud"] },
];
