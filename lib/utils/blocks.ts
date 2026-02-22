/**
 * Shared block/section utilities used by both SiteBlockRenderer and ClientDashboardPreview.
 * Single source of truth — do not duplicate these maps in other files.
 *
 * Nav entries and labels are now derived from BLOCK_REGISTRY (block-registry.ts).
 * PAGE_CATEGORY_LABELS and SECTION_NAV_MAP are kept as legacy shims for any
 * code that hasn't migrated yet — prefer BLOCK_MAP from block-registry.ts.
 */
import { BLOCK_MAP } from "@/lib/utils/block-registry";

/** @deprecated Use BLOCK_MAP[id].navEntry from block-registry.ts instead. */
export const PAGE_CATEGORY_LABELS: Record<string, string> = {
  "review-trust-bar": "Reviews",
  "reviews-grid": "Reviews",
  "facebook-review-embed": "Reviews",
  "testimonials": "Reviews",
  "trust-badges-grid": "Trust",
  "awards": "Credentials",
  "pricing": "Pricing",
  "pricing-table": "Pricing",
  "packages-pricing": "Pricing",
  "practice-areas": "Services",
  "features": "Services",
  "features-modern": "Services",
  "services-grid": "Services",
  "feature-highlight": "Highlights",
  "how-it-works": "How It Works",
  "treatment-process": "Process",
  "patient-faq": "FAQ",
  "faq-accordion": "FAQ",
  "faq-two-column": "FAQ",
  "team-carousel": "Team",
  "team-grid": "Team",
  "attorney-profile": "About",
  "contact": "Contact",
  "contact-minimal": "Contact",
  "contact-visual": "Contact",
  "contact-with-map": "Contact",
  "contact-columns": "Contact",
};

/** @deprecated Use BLOCK_MAP[id].navEntry from block-registry.ts instead. */
export const SECTION_NAV_MAP: Record<string, { name: string; href: string } | null> = {
  // canonical IDs
  hero: null,
  "hero--emergency": null,
  "hero--video": null,
  "hero--split": null,
  trust_badges: null,
  testimonials: { name: "Testimonials", href: "#testimonials" },
  "testimonials--grid": { name: "Testimonials", href: "#testimonials" },
  "testimonials--facebook": { name: "Reviews", href: "#reviews" },
  certifications: { name: "Credentials", href: "#credentials" },
  logo_cloud: null,
  services: { name: "Services", href: "#services" },
  "services--modern": { name: "Services", href: "#services" },
  "services--highlight": { name: "Services", href: "#services" },
  comparison: { name: "Compare", href: "#compare" },
  "comparison--table": { name: "Compare", href: "#compare" },
  "comparison--vs": { name: "Compare", href: "#compare" },
  process: { name: "How It Works", href: "#how-it-works" },
  "process--timeline": { name: "How It Works", href: "#how-it-works" },
  faq: { name: "FAQ", href: "#faq" },
  "faq--two-column": { name: "FAQ", href: "#faq" },
  blog_preview: { name: "Blog", href: "#blog" },
  stats: null,
  team: { name: "Team", href: "#team" },
  "team--grid": { name: "Team", href: "#team" },
  "team--carousel": { name: "Team", href: "#team" },
  "team--spotlight": { name: "About", href: "#about" },
  "team--profile": { name: "About", href: "#about" },
  pricing: { name: "Pricing", href: "#pricing" },
  "pricing--subscription": { name: "Plans", href: "#pricing" },
  price_preview: null,
  service_area: { name: "Coverage", href: "#coverage" },
  "service_area--radius": { name: "Coverage", href: "#coverage" },
  gallery: { name: "Gallery", href: "#gallery" },
  "gallery--slider": { name: "Gallery", href: "#gallery" },
  "gallery--before-after": { name: "Before & After", href: "#gallery" },
  cta: null,
  "cta--emergency": null,
  "cta--sticky": null,
  "cta--promo-strip": null,
  booking: { name: "Book Now", href: "#booking" },
  free_consultation: { name: "Free Consultation", href: "#contact" },
  payment_options: null,
  contact: { name: "Contact", href: "#contact" },
  "contact--minimal": { name: "Contact", href: "#contact" },
  "contact--with-map": { name: "Contact", href: "#contact" },
  "contact--columns": { name: "Contact", href: "#contact" },
  "contact--split": { name: "Contact", href: "#contact" },
  "contact--visual": { name: "Contact", href: "#contact" },
  announcement_bar: null,
  "announcement_bar--promo": null,
  "announcement_bar--emergency": null,
  "announcement_bar--offer": null,
  service_detail: { name: "Services", href: "#services" },
  "service_detail--split": { name: "Services", href: "#services" },
  case_study: { name: "Portfolio", href: "#portfolio" },
  "case_study--before-after": { name: "Before & After", href: "#portfolio" },
  lead_capture: { name: "Get Started", href: "#contact" },
  "lead_capture--multi-step": { name: "Get Started", href: "#contact" },
  guarantee: { name: "Guarantee", href: "#guarantee" },
  "guarantee--badge": { name: "Guarantee", href: "#guarantee" },
  "guarantee--safety": { name: "Safety", href: "#guarantee" },
  // legacy IDs
  "hero-emergency": null,
  features: { name: "Services", href: "#services" },
  "features-modern": { name: "Services", href: "#services" },
  "features-grid": { name: "Services", href: "#services" },
  "feature-highlight": { name: "Highlights", href: "#highlights" },
  "pricing-table": { name: "Pricing", href: "#pricing" },
  "packages-pricing": { name: "Pricing", href: "#pricing" },
  "how-it-works": { name: "How It Works", href: "#how-it-works" },
  "team-carousel": { name: "Team", href: "#team" },
  "team-grid": { name: "Team", href: "#team" },
  "patient-faq": { name: "FAQ", href: "#faq" },
  "faq-two-column": { name: "FAQ", href: "#faq" },
  "faq-accordion": { name: "FAQ", href: "#faq" },
  "practice-areas": { name: "Practice Areas", href: "#services" },
  "attorney-profile": { name: "About", href: "#about" },
  "review-trust-bar": { name: "Reviews", href: "#reviews" },
  "reviews-grid": { name: "Reviews", href: "#reviews" },
  "contact-minimal": { name: "Contact", href: "#contact" },
  "contact-visual": { name: "Contact", href: "#contact" },
  "contact-with-map": { name: "Contact", href: "#contact" },
  "contact-columns": { name: "Contact", href: "#contact" },
  "contact-split": { name: "Contact", href: "#contact" },
  "free-consultation": { name: "Free Consultation", href: "#contact" },
  awards: { name: "Credentials", href: "#credentials" },
  blog: { name: "Blog", href: "#blog" },
  "blog-preview": { name: "Blog", href: "#blog" },
  "service-area-map": { name: "Coverage", href: "#coverage" },
  "coverage-radius-block": { name: "Coverage", href: "#coverage" },
  "before-after-gallery": { name: "Gallery", href: "#gallery" },
  "before-after-slider": { name: "Gallery", href: "#gallery" },
  "booking-cta": { name: "Book Now", href: "#booking" },
  "why-choose-me": { name: "About", href: "#about" },
  "why-choose-us": { name: "About", href: "#about" },
  "maintenance-plans": { name: "Plans", href: "#pricing" },
  "warranty-block": { name: "Guarantee", href: "#guarantee" },
  "stats-section": { name: "Stats", href: "#stats" },
  "logo-cloud": null,
  "trust-badges-grid": null,
  "promo-banner-strip": null,
  "emergency-cta-strip": null,
  "messenger-sticky-cta": null,
  "payment-options-strip": null,
  "facebook-review-embed": { name: "Reviews", href: "#reviews" },
  "promo-cta-section": null,
};

/** Converts any string to a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Returns a human-readable category label for a section ID.
 * Prefers the registry `label` field; falls back to the legacy map.
 */
export function categoryLabelForSection(sectionId: string): string {
  const block = BLOCK_MAP[sectionId];
  if (block?.label) return block.label;
  return PAGE_CATEGORY_LABELS[sectionId] || "";
}
