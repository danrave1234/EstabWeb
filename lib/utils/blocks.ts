/**
 * Shared block/section utilities used by both SiteBlockRenderer and ClientDashboardPreview.
 * Single source of truth — do not duplicate these maps in other files.
 */

/** Maps a section ID to its nav category label (used for auto-building page nav). */
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

/** Maps a section ID to its header nav entry (null = not shown in nav). */
export const SECTION_NAV_MAP: Record<string, { name: string; href: string } | null> = {
  hero: null,
  "hero-emergency": { name: "Emergency", href: "#hero-emergency" },
  features: { name: "Services", href: "#services" },
  "features-modern": { name: "Services", href: "#services" },
  "features-grid": { name: "Services", href: "#services" },
  "feature-highlight": { name: "Highlights", href: "#highlights" },
  "pricing-table": { name: "Pricing", href: "#pricing" },
  "packages-pricing": { name: "Pricing", href: "#pricing" },
  "how-it-works": { name: "How It Works", href: "#how-it-works" },
  "team-carousel": { name: "Team", href: "#team" },
  "patient-faq": { name: "FAQ", href: "#faq" },
  "faq-two-column": { name: "FAQ", href: "#faq" },
  "faq-accordion": { name: "FAQ", href: "#faq" },
  "practice-areas": { name: "Practice Areas", href: "#services" },
  "attorney-profile": { name: "About", href: "#about" },
  testimonials: { name: "Testimonials", href: "#testimonials" },
  "review-trust-bar": { name: "Reviews", href: "#reviews" },
  contact: { name: "Contact", href: "#contact" },
  "contact-minimal": { name: "Contact", href: "#contact" },
  "contact-visual": { name: "Contact", href: "#contact" },
  "contact-with-map": { name: "Contact", href: "#contact" },
  "contact-columns": { name: "Contact", href: "#contact" },
  "free-consultation": { name: "Free Consultation", href: "#contact" },
  pricing: { name: "Pricing", href: "/pricing" },
  awards: { name: "Credentials", href: "#credentials" },
  blog: { name: "Insights", href: "#blog" },
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

/** Returns the nav category label for a section ID, or empty string. */
export function categoryLabelForSection(sectionId: string): string {
  return PAGE_CATEGORY_LABELS[sectionId] || "";
}
