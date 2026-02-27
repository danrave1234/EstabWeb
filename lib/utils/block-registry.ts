/**
 * BLOCK REGISTRY
 * Single source of truth for every section block in the system.
 *
 * Architecture: Section Type + Variant
 * ─────────────────────────────────────
 * Each block ID follows the pattern: `<type>` or `<type>--<variant>`
 * All configuration beyond type/variant lives inside the JSON data object.
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
  /**
   * If true, this entry is a legacy alias kept for backward-compatibility only.
   * It will NOT appear in the section picker — only the canonical ID does.
   */
  legacy?: boolean;
  /** Human-readable label shown in the section picker variant card. */
  label?: string;
  /** Variant slug (e.g. "standard", "grid", "emergency"). Derived from id when absent. */
  variant?: string;
  /** The core section type this block belongs to (e.g. "hero", "testimonials"). */
  sectionType?: string;
  /**
   * Short guidance label shown in the section picker to help users choose.
   * Example: "Best for high-conversion service sites"
   */
  purpose?: string;
}

/**
 * All registered blocks. Order here does not matter — it's a lookup table.
 *
 * Canonical IDs use the pattern: `<type>` or `<type>--<variant>`
 * Legacy aliases are marked `legacy: true` and hidden from the picker.
 */
export const BLOCK_REGISTRY: BlockDefinition[] = [

  // ── HERO ──────────────────────────────────────────────────────────────────
  // type: hero  |  variants: standard (default), emergency
  { id: "hero", dataKey: "hero", navEntry: null, previewKind: "generic", sectionType: "hero", variant: "standard", label: "Hero", purpose: "Best for all service businesses" },
  { id: "hero--emergency", dataKey: "heroEmergency", navEntry: { name: "Emergency", href: "#hero-emergency" }, previewKind: "cta", sectionType: "hero", variant: "emergency", label: "Emergency Hero", purpose: "Best for 24/7 emergency services" },
  // legacy aliases
  { id: "hero-emergency", dataKey: "heroEmergency", navEntry: { name: "Emergency", href: "#hero-emergency" }, previewKind: "cta", legacy: true },

  // ── TRUST ─────────────────────────────────────────────────────────────────
  // type: trust_badges
  { id: "trust_badges", dataKey: "trustBadgesGrid", navEntry: undefined, previewKind: "cards-4", sectionType: "trust_badges", variant: "standard", label: "Trust Badges", purpose: "Quick authority reinforcement above the fold" },
  // type: testimonials  |  variants: bar (default), grid, facebook
  { id: "testimonials", dataKey: "testimonials", navEntry: { name: "Testimonials", href: "#testimonials" }, previewKind: "strip", sectionType: "testimonials", variant: "bar", label: "Testimonials Bar", purpose: "Compact social proof strip" },
  { id: "testimonials--grid", dataKey: "reviewTrustBar", navEntry: { name: "Reviews", href: "#reviews" }, previewKind: "cards-3", sectionType: "testimonials", variant: "grid", label: "Testimonials Grid", purpose: "Best for showcasing multiple reviews" },
  { id: "testimonials--facebook", dataKey: "facebookReviewEmbed", navEntry: undefined, previewKind: "cards-3", sectionType: "testimonials", variant: "facebook", label: "Facebook Reviews", purpose: "Best for Facebook-heavy audiences" },
  // type: certifications  (awards strip / credentials)
  { id: "certifications", dataKey: "awardsStrip", navEntry: { name: "Credentials", href: "#credentials" }, previewKind: "strip", sectionType: "certifications", variant: "standard", label: "Certifications", purpose: "Licenses, awards, and industry credentials" },
  // type: logo_cloud
  { id: "logo_cloud", dataKey: "logoCloud", navEntry: undefined, previewKind: "logos", sectionType: "logo_cloud", variant: "standard", label: "Logo Cloud", purpose: "Partner and client brand logos" },
  // legacy aliases
  { id: "awards", dataKey: "awardsStrip", navEntry: { name: "Credentials", href: "#credentials" }, previewKind: "strip", legacy: true },
  { id: "review-trust-bar", dataKey: "reviewTrustBar", navEntry: { name: "Reviews", href: "#reviews" }, previewKind: "strip", legacy: true },
  { id: "reviews-grid", dataKey: "reviewTrustBar", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "trust-badges-grid", dataKey: "trustBadgesGrid", navEntry: undefined, previewKind: "cards-4", legacy: true },
  { id: "facebook-review-embed", dataKey: "facebookReviewEmbed", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "logo-cloud", dataKey: "logoCloud", navEntry: undefined, previewKind: "logos", legacy: true },

  // ── SERVICES ──────────────────────────────────────────────────────────────
  // type: services  |  variants: grid (default), list, highlight
  { id: "services", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", sectionType: "services", variant: "grid", label: "Services Grid", purpose: "Best for listing multiple services" },
  { id: "services--modern", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", sectionType: "services", variant: "modern", label: "Services Modern", purpose: "Best for premium brands" },
  { id: "services--highlight", dataKey: "featureHighlight", navEntry: { name: "Highlights", href: "#highlights" }, previewKind: "cards-3", sectionType: "services", variant: "highlight", label: "Feature Highlight", purpose: "Best for a single key service or offer" },
  // type: service_detail  |  variants: standard (default), split
  { id: "service_detail", dataKey: "featureHighlight", navEntry: undefined, previewKind: "cards-3", sectionType: "service_detail", variant: "standard", label: "Service Detail", purpose: "Deep dive into one service with image + CTA" },
  { id: "service_detail--split", dataKey: "featureHighlight", navEntry: undefined, previewKind: "cards-3", sectionType: "service_detail", variant: "split", label: "Service Detail Split", purpose: "Image left, explanation right layout" },
  // type: comparison  (financing, AC types, specialty grids)
  { id: "comparison", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", sectionType: "comparison", variant: "standard", label: "Comparison", purpose: "Compare options side by side" },
  { id: "comparison--table", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", sectionType: "comparison", variant: "table", label: "Comparison Table", purpose: "Feature checklist vs competitor" },
  { id: "comparison--vs", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", sectionType: "comparison", variant: "vs", label: "Us vs Others", purpose: "High-conversion why-choose-us layout" },
  // type: specialty_listings  (real-estate featured properties)
  { id: "specialty_listings", dataKey: "featuredListings", navEntry: undefined, previewKind: "cards-3", sectionType: "specialty_listings", variant: "standard", label: "Featured Listings", purpose: "Best for real estate and portfolio sites" },
  // legacy aliases
  { id: "features", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
  { id: "features-modern", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
  { id: "services-grid", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
  { id: "project-gallery", dataKey: "features", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "programs-grid", dataKey: "features", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "faculty-grid", dataKey: "features", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "practice-areas", dataKey: "practiceAreas", navEntry: { name: "Practice Areas", href: "#services" }, previewKind: "cards-3", legacy: true, label: "Practice Areas" },
  { id: "feature-highlight", dataKey: "featureHighlight", navEntry: { name: "Highlights", href: "#highlights" }, previewKind: "cards-3", legacy: true },
  { id: "why-choose-us", dataKey: "featureHighlight", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "ac-types-grid", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "financing-section", dataKey: "financing", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "developer-partners", dataKey: "developerPartners", navEntry: undefined, previewKind: "logos", legacy: true },
  { id: "featured-properties-grid", dataKey: "featuredListings", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "warranty-block", dataKey: "warranty", navEntry: undefined, previewKind: "cta", legacy: true },
  { id: "why-choose-me", dataKey: "whyChooseMe", navEntry: undefined, previewKind: "cards-3", legacy: true },

  // ── PROCESS ───────────────────────────────────────────────────────────────
  // type: process  |  variants: steps (default), timeline
  { id: "process", dataKey: "howItWorks", navEntry: { name: "How It Works", href: "#how-it-works" }, previewKind: "timeline", sectionType: "process", variant: "steps", label: "Process Steps", purpose: "Numbered icon steps — best for service flow" },
  { id: "process--timeline", dataKey: "treatmentProcess", navEntry: undefined, previewKind: "timeline", sectionType: "process", variant: "timeline", label: "Process Timeline", purpose: "Horizontal visual timeline layout" },
  // type: faq  |  variants: accordion (default), two-column
  { id: "faq", dataKey: "faqAccordion", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", sectionType: "faq", variant: "accordion", label: "FAQ Accordion", purpose: "Best for long Q&A lists" },
  { id: "faq--two-column", dataKey: "patientFaq", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", sectionType: "faq", variant: "two-column", label: "FAQ Two Column", purpose: "Best for dense FAQ content" },
  // type: blog_preview
  { id: "blog_preview", dataKey: "blog", navEntry: { name: "Insights", href: "#blog" }, previewKind: "cards-3", sectionType: "blog_preview", variant: "standard", label: "Blog Preview", purpose: "Show latest articles to build authority" },
  // type: stats
  { id: "stats", dataKey: "statsSection", navEntry: undefined, previewKind: "stats", sectionType: "stats", variant: "standard", label: "Stats & Metrics", purpose: "Numbers that build instant credibility" },
  // legacy aliases
  { id: "how-it-works", dataKey: "howItWorks", navEntry: { name: "How It Works", href: "#how-it-works" }, previewKind: "timeline", legacy: true },
  { id: "delivery-coverage", dataKey: "deliveryCoverage", navEntry: undefined, previewKind: "stats", legacy: true },
  { id: "treatment-process", dataKey: "treatmentProcess", navEntry: undefined, previewKind: "timeline", legacy: true },
  { id: "patient-faq", dataKey: "patientFaq", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", legacy: true },
  { id: "faq-two-column", dataKey: "patientFaq", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", legacy: true },
  { id: "faq-accordion", dataKey: "faqAccordion", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", legacy: true },
  { id: "blog", dataKey: "blog", navEntry: { name: "Insights", href: "#blog" }, previewKind: "cards-3", legacy: true },
  { id: "stats-section", dataKey: "statsSection", navEntry: undefined, previewKind: "stats", legacy: true },

  // ── TEAM ──────────────────────────────────────────────────────────────────
  // type: team  |  variants: grid (default), carousel, profile, spotlight
  { id: "team", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", sectionType: "team", variant: "grid", label: "Team Grid", purpose: "Best for agencies and multi-staff businesses" },
  { id: "team--carousel", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", sectionType: "team", variant: "carousel", label: "Team Carousel", purpose: "Best for large teams" },
  { id: "team--profile", dataKey: "attorneyProfile", navEntry: { name: "About", href: "#about" }, previewKind: "generic", sectionType: "team", variant: "profile", label: "Team Profile", purpose: "Best for solo professionals and consultants" },
  { id: "team--spotlight", dataKey: "whyChooseMe", navEntry: undefined, previewKind: "cards-3", sectionType: "team", variant: "spotlight", label: "Team Spotlight", purpose: "Best for real estate agents and coaches" },
  // legacy aliases
  { id: "team-carousel", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", legacy: true },
  { id: "team-grid", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", legacy: true },
  { id: "attorney-profile", dataKey: "attorneyProfile", navEntry: { name: "About", href: "#about" }, previewKind: "generic", legacy: true },

  // ── PRICING ───────────────────────────────────────────────────────────────
  // type: pricing  |  variants: cards (default), subscription
  { id: "pricing", dataKey: "pricingTable", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", sectionType: "pricing", variant: "cards", label: "Pricing Cards", purpose: "Best for service packages and tiers" },
  { id: "pricing--subscription", dataKey: "maintenancePlans", navEntry: undefined, previewKind: "pricing", sectionType: "pricing", variant: "subscription", label: "Subscription Plans", purpose: "Best for recurring maintenance or SaaS" },
  // type: price_preview
  { id: "price_preview", dataKey: "pricePreview", navEntry: undefined, previewKind: "cta", sectionType: "price_preview", variant: "standard", label: "Price Preview", purpose: "Transparent pricing strip to reduce friction" },
  // legacy aliases
  { id: "packages-pricing", dataKey: "pricingTable", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", legacy: true },
  { id: "maintenance-plans", dataKey: "maintenancePlans", navEntry: undefined, previewKind: "pricing", legacy: true },
  { id: "price-preview-strip", dataKey: "pricePreview", navEntry: undefined, previewKind: "cta", legacy: true },

  // ── COVERAGE ──────────────────────────────────────────────────────────────
  // type: service_area  |  variants: map (default), radius, list
  { id: "service_area", dataKey: "serviceAreaMap", navEntry: undefined, previewKind: "map", sectionType: "service_area", variant: "map", label: "Service Area Map", purpose: "Best for local service businesses" },
  { id: "service_area--radius", dataKey: "coverageRadiusBlock", navEntry: undefined, previewKind: "map", sectionType: "service_area", variant: "radius", label: "Coverage Radius", purpose: "Show km radius from a central location" },
  // legacy aliases
  { id: "service-area-map", dataKey: "serviceAreaMap", navEntry: undefined, previewKind: "map", legacy: true },
  { id: "coverage-radius-block", dataKey: "coverageRadiusBlock", navEntry: undefined, previewKind: "map", legacy: true },

  // ── MEDIA / GALLERY ───────────────────────────────────────────────────────
  // type: gallery  |  variants: grid (default), slider, before_after
  { id: "gallery", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", sectionType: "gallery", variant: "grid", label: "Gallery Grid", purpose: "Best for contractors and cleaning services" },
  { id: "gallery--slider", dataKey: "beforeAfterSlider", navEntry: undefined, previewKind: "gallery", sectionType: "gallery", variant: "slider", label: "Gallery Slider", purpose: "Before/after comparison slider" },
  // type: case_study  |  variants: standard (default), detail
  { id: "case_study", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", sectionType: "case_study", variant: "standard", label: "Case Study", purpose: "Problem → Solution → Results layout" },
  { id: "case_study--detail", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", sectionType: "case_study", variant: "detail", label: "Case Study Detail", purpose: "Best for agencies, contractors, law firms" },
  // legacy aliases
  { id: "before-after-gallery-grid", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", legacy: true },
  { id: "before-after-gallery", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", legacy: true },
  { id: "before-after-slider", dataKey: "beforeAfterSlider", navEntry: undefined, previewKind: "gallery", legacy: true },
  { id: "common-pests", dataKey: "commonPests", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "safety-section", dataKey: "safety", navEntry: undefined, previewKind: "cards-3", legacy: true },

  // ── CTA ───────────────────────────────────────────────────────────────────
  // type: cta  |  variants: banner (default), emergency, promo, sticky
  { id: "cta", dataKey: "promoCTA", navEntry: undefined, previewKind: "cta", sectionType: "cta", variant: "banner", label: "CTA Banner", purpose: "Best for high-conversion service sites" },
  { id: "cta--emergency", dataKey: "emergencyCTA", navEntry: undefined, previewKind: "cta", sectionType: "cta", variant: "emergency", label: "Emergency CTA", purpose: "Best for emergency businesses" },
  { id: "cta--promo-strip", dataKey: "promoBannerStrip", navEntry: undefined, previewKind: "strip", sectionType: "cta", variant: "promo-strip", label: "Promo Strip", purpose: "Limited-time offer or announcement" },
  { id: "cta--sticky", dataKey: "messengerStickyCTA", navEntry: null, previewKind: "cta", sectionType: "cta", variant: "sticky", label: "Sticky CTA", purpose: "Floating call/chat button — always visible" },
  // type: announcement_bar  |  variants: standard (default), promo, emergency, offer
  { id: "announcement_bar", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "standard", label: "Announcement Bar", purpose: "Sits above hero — best for urgent messages" },
  { id: "announcement_bar--promo", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "promo", label: "Promo Bar", purpose: "Limited offer or discount strip" },
  { id: "announcement_bar--emergency", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "emergency", label: "Emergency Hotline Bar", purpose: "Best for emergency and 24/7 services" },
  { id: "announcement_bar--offer", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "offer", label: "Free Inspection Bar", purpose: "Free inspection or consultation offer" },
  // type: booking
  { id: "booking", dataKey: "bookingCTA", navEntry: undefined, previewKind: "cta", sectionType: "booking", variant: "standard", label: "Booking", purpose: "Best for appointment-based businesses" },
  // type: lead_capture  |  variants: standard (default), multi-step
  { id: "lead_capture", dataKey: "freeConsultation", navEntry: undefined, previewKind: "cta", sectionType: "lead_capture", variant: "standard", label: "Lead Capture", purpose: "Simple lead form — service type + contact" },
  { id: "lead_capture--multi-step", dataKey: "freeConsultation", navEntry: undefined, previewKind: "cta", sectionType: "lead_capture", variant: "multi-step", label: "Multi-Step Lead Form", purpose: "Step 1: Service → Step 2: Location → Step 3: Contact" },
  // type: free_consultation
  { id: "free_consultation", dataKey: "freeConsultation", navEntry: { name: "Free Consultation", href: "#contact" }, previewKind: "cta", sectionType: "free_consultation", variant: "standard", label: "Free Consultation", purpose: "Best for law firms, clinics, and consultants" },
  // type: payment_options
  { id: "payment_options", dataKey: "paymentOptionsStrip", navEntry: undefined, previewKind: "strip", sectionType: "payment_options", variant: "standard", label: "Payment Options", purpose: "Accepted payment methods strip" },
  // legacy aliases
  { id: "emergency-cta-strip", dataKey: "emergencyCTA", navEntry: undefined, previewKind: "cta", legacy: true },
  { id: "promo-cta-section", dataKey: "promoCTA", navEntry: undefined, previewKind: "cta", legacy: true },
  { id: "promo-banner-strip", dataKey: "promoBannerStrip", navEntry: undefined, previewKind: "strip", legacy: true },
  { id: "messenger-sticky-cta", dataKey: "messengerStickyCTA", navEntry: null, previewKind: "cta", legacy: true },
  { id: "booking-cta", dataKey: "bookingCTA", navEntry: undefined, previewKind: "cta", legacy: true },
  { id: "free-consultation", dataKey: "freeConsultation", navEntry: { name: "Free Consultation", href: "#contact" }, previewKind: "cta", legacy: true },
  { id: "payment-options-strip", dataKey: "paymentOptionsStrip", navEntry: undefined, previewKind: "strip", legacy: true },

  // ── GUARANTEE ─────────────────────────────────────────────────────────────
  // type: guarantee  |  variants: standard (default), badge, safety
  { id: "guarantee", dataKey: "warranty", navEntry: undefined, previewKind: "cta", sectionType: "guarantee", variant: "standard", label: "Guarantee", purpose: "Satisfaction guarantee — reduces buyer hesitation" },
  { id: "guarantee--badge", dataKey: "warranty", navEntry: undefined, previewKind: "cta", sectionType: "guarantee", variant: "badge", label: "Guarantee Badge", purpose: "Money-back or warranty badge block" },
  { id: "guarantee--safety", dataKey: "warranty", navEntry: undefined, previewKind: "cta", sectionType: "guarantee", variant: "safety", label: "Safety Compliance", purpose: "Safety certifications and compliance block" },
  // type: contact  |  variants: standard (default), minimal, visual, withMap, columns, split
  { id: "contact", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "standard", label: "Contact", purpose: "Best for all service businesses" },
  { id: "contact--minimal", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "minimal", label: "Contact Minimal", purpose: "Clean minimal form — best for premium brands" },
  { id: "contact--visual", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "visual", label: "Contact Visual", purpose: "Full-bleed background image contact" },
  { id: "contact--with-map", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "map", sectionType: "contact", variant: "with-map", label: "Contact With Map", purpose: "Best for businesses with a physical location" },
  { id: "contact--columns", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "columns", label: "Contact Columns", purpose: "Multi-channel contact with social links" },
  { id: "contact--split", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "split", label: "Contact Split", purpose: "Two-column split layout" },
  // legacy aliases
  { id: "contact-minimal", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  { id: "contact-visual", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  { id: "contact-with-map", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "map", legacy: true },
  { id: "contact-columns", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  { id: "contact-split", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
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
 * Canonical IDs only — legacy aliases are excluded automatically.
 *
 * Architecture: ~18 core section types, each with configurable variants.
 * Everything else is configuration inside JSON.
 */
export const SECTION_CATEGORIES: { label: string; ids: string[] }[] = [
  {
    label: "Hero",
    ids: [
      "hero--emergency",
    ],
  },
  {
    label: "Trust & Social Proof",
    ids: [
      "certifications",
      "trust_badges",
      "testimonials",
      "testimonials--grid",
      "testimonials--facebook",
      "logo_cloud",
    ],
  },
  {
    label: "Services & Features",
    ids: [
      "services",
      "services--modern",
      "services--highlight",
      "service_detail",
      "service_detail--split",
      "comparison",
      "comparison--table",
      "comparison--vs",
      "specialty_listings",
    ],
  },
  {
    label: "Process & Info",
    ids: [
      "process",
      "process--timeline",
      "faq",
      "faq--two-column",
      "blog_preview",
      "stats",
      "case_study",
      "case_study--detail",
    ],
  },
  {
    label: "Team",
    ids: [
      "team",
      "team--carousel",
      "team--profile",
      "team--spotlight",
    ],
  },
  {
    label: "Pricing",
    ids: [
      "pricing",
      "pricing--subscription",
      "price_preview",
    ],
  },
  {
    label: "Coverage",
    ids: [
      "service_area",
      "service_area--radius",
    ],
  },
  {
    label: "Gallery & Media",
    ids: [
      "gallery",
      "gallery--slider",
    ],
  },
  {
    label: "CTA & Conversion",
    ids: [
      "announcement_bar",
      "announcement_bar--promo",
      "announcement_bar--emergency",
      "announcement_bar--offer",
      "cta",
      "cta--emergency",
      "cta--promo-strip",
      "cta--sticky",
      "booking",
      "lead_capture",
      "lead_capture--multi-step",
      "free_consultation",
      "payment_options",
      "guarantee",
      "guarantee--badge",
      "guarantee--safety",
    ],
  },
  {
    label: "Contact",
    ids: [
      "contact",
      "contact--minimal",
      "contact--visual",
      "contact--with-map",
      "contact--columns",
      "contact--split",
    ],
  },
];

/**
 * Structured section type groups used by the two-step "Add Section" modal.
 * Each group represents one core section type with an icon, label, and the
 * list of variant IDs that belong to it.
 */
export interface SectionTypeGroup {
  /** Core type identifier (matches sectionType field on BlockDefinition). */
  type: string;
  /** Lucide icon name (string key) for the type picker. */
  icon: string;
  /** Human-readable label for the type. */
  label: string;
  /** All canonical variant IDs that belong to this type. */
  variantIds: string[];
}

export const SECTION_TYPE_GROUPS: SectionTypeGroup[] = [
  {
    type: "hero",
    icon: "Zap",
    label: "Hero",
    variantIds: ["hero", "hero--emergency"],
  },
  {
    type: "trust",
    icon: "ShieldCheck",
    label: "Trust & Social Proof",
    variantIds: ["trust_badges", "testimonials", "testimonials--grid", "testimonials--facebook", "certifications", "logo_cloud"],
  },
  {
    type: "services",
    icon: "Wrench",
    label: "Services & Features",
    variantIds: ["services", "services--modern", "services--highlight", "service_detail", "service_detail--split", "comparison", "comparison--table", "comparison--vs", "specialty_listings"],
  },
  {
    type: "process",
    icon: "ListChecks",
    label: "Process & Info",
    variantIds: ["process", "process--timeline", "faq", "faq--two-column", "blog_preview", "stats", "case_study", "case_study--detail"],
  },
  {
    type: "team",
    icon: "Users",
    label: "Team",
    variantIds: ["team", "team--carousel", "team--profile", "team--spotlight"],
  },
  {
    type: "pricing",
    icon: "BadgeDollarSign",
    label: "Pricing",
    variantIds: ["pricing", "pricing--subscription", "price_preview"],
  },
  {
    type: "coverage",
    icon: "MapPin",
    label: "Coverage",
    variantIds: ["service_area", "service_area--radius"],
  },
  {
    type: "gallery",
    icon: "Images",
    label: "Gallery & Media",
    variantIds: ["gallery", "gallery--slider"],
  },
  {
    type: "announcement_bar",
    icon: "Bell",
    label: "Announcement Bar",
    variantIds: ["announcement_bar", "announcement_bar--promo", "announcement_bar--emergency", "announcement_bar--offer"],
  },
  {
    type: "cta",
    icon: "Megaphone",
    label: "CTA & Conversion",
    variantIds: ["cta", "cta--emergency", "cta--promo-strip", "cta--sticky", "booking", "lead_capture", "lead_capture--multi-step", "free_consultation", "payment_options"],
  },
  {
    type: "guarantee",
    icon: "BadgeCheck",
    label: "Trust & Guarantee",
    variantIds: ["guarantee", "guarantee--badge", "guarantee--safety"],
  },
  {
    type: "contact",
    icon: "Mail",
    label: "Contact",
    variantIds: ["contact", "contact--minimal", "contact--visual", "contact--with-map", "contact--columns", "contact--split"],
  },
];
