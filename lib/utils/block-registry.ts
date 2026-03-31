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
  | "split-content"
  | "timeline"
  | "strip"
  | "logos"
  | "pricing"
  | "faq"
  | "gallery"
  | "map"
  | "cta"
  | "stats"
  | "hero"
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
  /**
   * Visual layout description for AI context — describes how the section looks on screen.
   * Example: "Full-width dark background with large headline left, hero image right, and a CTA button"
   */
  visualDescription?: string;
}

/**
 * All registered blocks. Order here does not matter — it's a lookup table.
 *
 * Canonical IDs use the pattern: `<type>` or `<type>--<variant>`
 * Legacy aliases are marked `legacy: true` and hidden from the picker.
 */
export const BLOCK_REGISTRY: BlockDefinition[] = [

  // ── HERO ──────────────────────────────────────────────────────────────────
  // type: hero  |  variants: standard (default), emergency, showcase
  { id: "hero", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "standard", label: "Hero", purpose: "Best for all service businesses", visualDescription: "Full-width section with large headline, subtext, and a CTA button on the left; hero image fills the right half" },
  { id: "hero--generic", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "generic", label: "Standard Hero", purpose: "Clean, professional layout suitable for any business", visualDescription: "Centered headline and description over a full-bleed background image with a single CTA button" },
  { id: "hero--emergency", dataKey: "heroEmergency", navEntry: { name: "Emergency", href: "#hero-emergency" }, previewKind: "hero", sectionType: "hero", variant: "emergency", label: "Emergency Hero", purpose: "Best for 24/7 emergency services", visualDescription: "Dark red/orange background with bold emergency headline, phone number prominently displayed, and urgent CTA" },
  { id: "hero--showcase", dataKey: "heroShowcase", navEntry: { name: "Overview", href: "#hero-showcase" }, previewKind: "hero", sectionType: "hero", variant: "showcase", label: "Showcase Hero", purpose: "Trust-first hero with proof points and metrics", visualDescription: "Split layout: left has headline + trust badges + stats row; right has a large product/service image" },
  { id: "hero--aero-3", dataKey: "heroAero3", navEntry: { name: "Intro", href: "#intro" }, previewKind: "hero", sectionType: "hero", variant: "aero-3", label: "Aero Hero 3", purpose: "Modern, high-impact hero with immersive background and interactive CTA", visualDescription: "Full-screen immersive background with centered bold headline, animated gradient overlay, and prominent CTA button" },
  { id: "hero--minimalism", dataKey: "heroMinimalism", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "minimalism", label: "Minimalist Hero", purpose: "Clean, high-performance hero with animated particles and geometric lines", visualDescription: "White/light background with minimal typography, thin geometric line accents, animated particle dots, and a single CTA" },
  { id: "hero--elegant-carousel", dataKey: "heroElegantCarousel", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "elegant-carousel", label: "Elegant Carousel Hero", purpose: "Full-screen carousel with text and imagery for fashion, collections, or portfolios", visualDescription: "Full-screen auto-advancing slides each with a full-bleed image, large serif title, subtitle, and accent color overlay" },
  { id: "hero--modern", dataKey: "heroModern", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "modern", label: "Modern Hero", purpose: "Clean center-aligned hero with customer reviews and star ratings", visualDescription: "Center-aligned layout with headline, star rating row, small customer avatar cluster, and two CTA buttons side by side" },
  { id: "hero--group-images", dataKey: "heroGroupImages", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "group-images", label: "Group Images Hero", purpose: "Split hero with a grid of three images and two call-to-action buttons", visualDescription: "Left: headline, description, badge, and two CTA buttons; Right: three stacked/grid photos of the business or team" },
  { id: "hero--v6", dataKey: "heroV6", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "v6", label: "Tailark Hero", purpose: "Modern hero with email signup, integrated app illustration, and feature list", visualDescription: "Light background with centered headline, inline email capture form, feature icon list below, and app screenshot illustration" },
  { id: "hero--v7", dataKey: "heroV7", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "v7", label: "Stats & Team Hero", purpose: "High-impact hero with scrolling stats and team avatars — best for agencies", visualDescription: "Dark background with large headline, scrolling animated stats bar, and a row of team member avatar photos" },
  { id: "hero--lawyer", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "lawyer", label: "Lawyer Hero", purpose: "Professional and authoritative layout for legal services", visualDescription: "Dark navy background, serif headline on the left, attorney photo on the right, with trust badges and a consultation CTA" },
  { id: "hero--dentist", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "dentist", label: "Dentist Hero", purpose: "Clean and trust-focused layout for dental clinics", visualDescription: "White/light blue background, smiling patient or dentist photo, headline with trust icons, and a book-appointment CTA" },
  { id: "hero--clinic", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "clinic", label: "Clinic Hero", purpose: "Medical-grade layout for clinics and healthcare providers", visualDescription: "Clean white layout with medical imagery, headline, short description, and a schedule-visit CTA button" },
  { id: "hero--gym", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "gym", label: "Gym Hero", purpose: "High-energy layout for fitness centers and gyms", visualDescription: "Dark/black background with high-contrast athlete photo, bold uppercase headline, and a join-now CTA with urgency text" },
  { id: "hero--startup", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "startup", label: "Startup Hero", purpose: "Bold and innovative layout for tech companies", visualDescription: "Gradient or dark background, large bold headline with colored keyword highlight, product screenshot, and two CTA buttons" },
  { id: "hero--chiropractor", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "chiropractor", label: "Chiropractor Hero", purpose: "Wellness-focused layout for chiropractic care", visualDescription: "Soft warm background, wellness imagery, headline with pain-point copy, and a book-session CTA" },
  { id: "hero--cleaning", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "cleaning", label: "Cleaning Hero", purpose: "Fresh and professional layout for cleaning services", visualDescription: "Bright white/teal background, before-after or clean-home imagery, headline, and a get-a-quote CTA" },
  { id: "hero--pool", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "pool", label: "Pool Hero", purpose: "Refreshing layout for pool maintenance and installation", visualDescription: "Blue-toned background with pool photo, headline, service highlights strip, and a free-estimate CTA" },
  { id: "hero--pest-control", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "pest-control", label: "Pest Control Hero", purpose: "Reliable and effective layout for pest management", visualDescription: "Dark green or earthy background, pest-free home imagery, bold headline, and a call-now CTA with phone number" },
  { id: "hero--real-estate-modern", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "real-estate-modern", label: "Real Estate Hero", purpose: "Modern property-focused layout for real estate agents", visualDescription: "Full-bleed property photo background, search bar or CTA overlay, agent name/photo badge, and headline" },
  { id: "hero--before-after-split", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "before-after-split", label: "Transformation Hero", purpose: "Impactful layout highlighting results and transformations", visualDescription: "Side-by-side before/after image split with a draggable divider, headline above, and a results-focused CTA" },
  { id: "hero--industrial", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "industrial", label: "Industrial Hero", purpose: "Rugged and professional layout for industrial services", visualDescription: "Dark steel/charcoal background, industrial machinery or team photo, bold sans-serif headline, and a contact CTA" },
  { id: "hero--clean-delivery", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "clean-delivery", label: "Delivery Hero", purpose: "Efficiency-focused layout for delivery and logistics", visualDescription: "White background with delivery vehicle or package imagery, headline, delivery zone info, and an order-now CTA" },
  { id: "hero--luxury-soft", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "luxury-soft", label: "Luxury Hero", purpose: "Elegant and sophisticated layout for premium brands", visualDescription: "Soft beige/cream background, elegant serif typography, high-end product or lifestyle photo, and a subtle CTA" },
  { id: "hero--academic-clean", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "academic-clean", label: "Academic Hero", purpose: "Structured and clean layout for educational institutions", visualDescription: "White background with school/campus imagery, structured headline, enrollment stats, and an apply-now CTA" },
  { id: "hero--hvac", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "hvac", label: "HVAC Hero", purpose: "Service-oriented layout for heating and cooling experts", visualDescription: "Blue/grey background, HVAC technician or unit photo, headline with service areas, and a schedule-service CTA" },
  { id: "hero--hvac-blue", dataKey: "hero", navEntry: null, previewKind: "hero", sectionType: "hero", variant: "hvac-blue", label: "HVAC Pro Hero", purpose: "Modern blue-themed layout for service professionals", visualDescription: "Bold blue gradient background, professional technician photo, headline, and a prominent call-now button" },
  // legacy aliases
  { id: "hero-emergency", dataKey: "heroEmergency", navEntry: { name: "Emergency", href: "#hero-emergency" }, previewKind: "hero", legacy: true },
  { id: "hero-showcase", dataKey: "heroShowcase", navEntry: { name: "Overview", href: "#hero-showcase" }, previewKind: "hero", legacy: true },

  // ── TRUST ─────────────────────────────────────────────────────────────────
  // type: trust_badges
  { id: "trust_badges", dataKey: "trustBadgesGrid", navEntry: undefined, previewKind: "cards-4", sectionType: "trust_badges", variant: "standard", label: "Trust Badges", purpose: "Quick authority reinforcement above the fold", visualDescription: "Horizontal row of 4–6 icon+label badge cards (e.g. Licensed, Insured, 5-Star) displayed just below the hero" },
  // type: testimonials  |  variants: bar (default), grid, facebook
  { id: "testimonials", dataKey: "testimonials", navEntry: { name: "Testimonials", href: "#testimonials" }, previewKind: "strip", sectionType: "testimonials", variant: "bar", label: "Testimonials Bar", purpose: "Compact social proof strip", visualDescription: "Single-row scrolling strip of short quote cards with star ratings and customer names" },
  { id: "testimonials--grid", dataKey: "reviewTrustBar", navEntry: { name: "Reviews", href: "#reviews" }, previewKind: "cards-3", sectionType: "testimonials", variant: "grid", label: "Testimonials Grid", purpose: "Best for showcasing multiple reviews", visualDescription: "3-column grid of review cards each with avatar, name, star rating, and quote text" },
  { id: "testimonials--animated", dataKey: "animatedTestimonials", navEntry: { name: "Testimonials", href: "#testimonials" }, previewKind: "cards-3", sectionType: "testimonials", variant: "animated", label: "Testimonials Animated", purpose: "Stacked-photo animated testimonials carousel", visualDescription: "Stacked card carousel where each card slides in with a customer photo, quote, and star rating" },
  { id: "testimonials--community", dataKey: "testimonialsCommunity", navEntry: { name: "Testimonials", href: "#testimonials" }, previewKind: "cards-3", sectionType: "testimonials", variant: "community", label: "Testimonials Community", purpose: "Slide-in card testimonials with star ratings and logo cloud", visualDescription: "Masonry-style cards that slide in from the side, each with avatar, quote, stars, and an optional trusted-brands logo row at the bottom" },
  { id: "testimonials--v2", dataKey: "testimonialsV2", navEntry: { name: "Testimonials", href: "#testimonials" }, previewKind: "cards-3", sectionType: "testimonials", variant: "v2", label: "Testimonials Scrolling", purpose: "Animated vertically scrolling testimonials wall", visualDescription: "Two or three columns of testimonial cards that auto-scroll vertically in opposite directions, creating a live wall effect" },
  { id: "testimonials--facebook", dataKey: "facebookReviewEmbed", navEntry: undefined, previewKind: "cards-3", sectionType: "testimonials", variant: "facebook", label: "Facebook Reviews", purpose: "Best for Facebook-heavy audiences", visualDescription: "Embedded Facebook-style review cards with profile photos, star ratings, and review text pulled from the page" },
  // type: certifications  (awards strip / credentials)
  { id: "certifications", dataKey: "awardsStrip", navEntry: { name: "Credentials", href: "#credentials" }, previewKind: "strip", sectionType: "certifications", variant: "standard", label: "Certifications", purpose: "Licenses, awards, and industry credentials", visualDescription: "Horizontal strip of certification logos and award badges with short label text beneath each" },
  // type: logo_cloud
  { id: "logo_cloud", dataKey: "logoCloud", navEntry: undefined, previewKind: "logos", sectionType: "logo_cloud", variant: "standard", label: "Logo Cloud", purpose: "Partner and client brand logos", visualDescription: "Centered section with a row of grayscale partner/client logos that color on hover" },
  // legacy aliases
  { id: "awards", dataKey: "awardsStrip", navEntry: { name: "Credentials", href: "#credentials" }, previewKind: "strip", legacy: true },
  { id: "review-trust-bar", dataKey: "reviewTrustBar", navEntry: { name: "Reviews", href: "#reviews" }, previewKind: "strip", legacy: true },
  { id: "reviews-grid", dataKey: "reviewTrustBar", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "trust-badges-grid", dataKey: "trustBadgesGrid", navEntry: undefined, previewKind: "cards-4", legacy: true },
  { id: "facebook-review-embed", dataKey: "facebookReviewEmbed", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "logo-cloud", dataKey: "logoCloud", navEntry: undefined, previewKind: "logos", legacy: true },

  // ── SERVICES ──────────────────────────────────────────────────────────────
  // type: services  |  variants: grid (default), list, highlight
  { id: "services", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", sectionType: "services", variant: "grid", label: "Services Grid", purpose: "Best for listing multiple services", visualDescription: "3-column grid of service cards each with an icon, title, and short description" },
  { id: "services--bento", dataKey: "featuresBento", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", sectionType: "services", variant: "bento", label: "Services Bento", purpose: "Card-heavy layout inspired by modern component libraries", visualDescription: "Asymmetric bento grid of feature cards in varying sizes with icons, titles, and descriptions" },
  { id: "services--modern", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", sectionType: "services", variant: "modern", label: "Services Modern", purpose: "Best for premium brands", visualDescription: "Elegant cards with large icons, bold titles, and hover lift effect on a light or dark background" },
  { id: "services--vertical-tabs", dataKey: "verticalTabs", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", sectionType: "services", variant: "vertical-tabs", label: "Vertical Tabs", purpose: "Animated interactive tabs with high-impact imagery — best for high-end service businesses", visualDescription: "Left column of clickable service tabs; right panel shows a large image and description that animates on tab change" },
  { id: "services--features-v2", dataKey: "featuresV2", navEntry: { name: "Features", href: "#features" }, previewKind: "cards-3", sectionType: "services", variant: "features-v2", label: "Agency Features", purpose: "High-end features grid with animated entry — best for professional agencies", visualDescription: "2×3 grid of feature blocks with numbered icons, bold titles, and descriptions that animate in on scroll" },
  { id: "services--highlight", dataKey: "featureHighlight", navEntry: { name: "Highlights", href: "#highlights" }, previewKind: "cards-3", sectionType: "services", variant: "highlight", label: "Feature Highlight", purpose: "Best for a single key service or offer", visualDescription: "Full-width section with a large image on one side and a headline, bullet list of benefits, and CTA on the other" },
  // type: service_detail  |  variants: standard (default), split
  { id: "service_detail", dataKey: "featureHighlight", navEntry: undefined, previewKind: "cards-3", sectionType: "service_detail", variant: "standard", label: "Service Detail", purpose: "Deep dive into one service with image + CTA", visualDescription: "Centered content block with service image, detailed description paragraphs, and a bottom CTA button" },
  { id: "service_detail--split", dataKey: "featureHighlight", navEntry: undefined, previewKind: "cards-3", sectionType: "service_detail", variant: "split", label: "Service Detail Split", purpose: "Image left, explanation right layout", visualDescription: "Two-column split: large service photo on the left, headline + description + CTA on the right" },
  // type: comparison  (financing, AC types, specialty grids)
  { id: "comparison", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", sectionType: "comparison", variant: "standard", label: "Comparison", purpose: "Compare options side by side", visualDescription: "Side-by-side cards comparing two or three options with icons, feature lists, and a recommended badge" },
  { id: "comparison--table", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", sectionType: "comparison", variant: "table", label: "Comparison Table", purpose: "Feature checklist vs competitor", visualDescription: "Rows of features with checkmarks/crosses across competitor columns — classic feature matrix table" },
  { id: "comparison--vs", dataKey: "acTypes", navEntry: undefined, previewKind: "cards-3", sectionType: "comparison", variant: "vs", label: "Us vs Others", purpose: "High-conversion why-choose-us layout", visualDescription: "Two-column layout: 'Us' column with green checkmarks vs 'Others' column with red crosses, bold headline above" },
  // type: specialty_listings  (real-estate featured properties)
  { id: "specialty_listings", dataKey: "featuredListings", navEntry: undefined, previewKind: "cards-3", sectionType: "specialty_listings", variant: "standard", label: "Featured Listings", purpose: "Best for real estate and portfolio sites", visualDescription: "Property cards in a 3-column grid each with photo, price, address, bed/bath stats, and a view-details CTA" },
  // type: gym  | variants: programs, schedule, memberships
  { id: "gym--programs", dataKey: "gymPrograms", navEntry: { name: "Programs", href: "#programs" }, previewKind: "cards-3", sectionType: "gym", variant: "programs", label: "Gym Programs", purpose: "Program tracks with goals, schedule, and coach info", visualDescription: "Cards for each program track with a photo, program name, goal tags, duration, and enroll CTA" },
  { id: "gym--schedule", dataKey: "gymSchedule", navEntry: { name: "Schedule", href: "#schedule" }, previewKind: "timeline", sectionType: "gym", variant: "schedule", label: "Gym Schedule", purpose: "Weekly class schedule by day and time slot", visualDescription: "Weekly calendar grid with day columns and time-slot rows showing class name, instructor, and duration" },
  { id: "gym--memberships", dataKey: "gymMemberships", navEntry: { name: "Memberships", href: "#memberships" }, previewKind: "pricing", sectionType: "gym", variant: "memberships", label: "Membership Tiers", purpose: "Pricing tiers with perks and conversion CTA", visualDescription: "3-tier pricing cards (Basic/Pro/Elite) with monthly price, perks list, and a join-now CTA; middle card highlighted" },
  { id: "gym--trainers", dataKey: "gymTrainers", navEntry: { name: "Trainers", href: "#trainers" }, previewKind: "cards-3", sectionType: "gym", variant: "trainers", label: "Gym Trainers", purpose: "Coach profiles with specialization and credentials", visualDescription: "Grid of trainer profile cards with photo, name, specialty tags, certifications, and a book-session link" },
  { id: "gym--results", dataKey: "gymResults", navEntry: { name: "Results", href: "#results" }, previewKind: "gallery", sectionType: "gym", variant: "results", label: "Results Stories", purpose: "Transformation stories with before/after proof", visualDescription: "Before/after photo pairs with member name, weight-loss or strength stats, and a short testimonial quote" },
  { id: "gym--facility", dataKey: "gymFacility", navEntry: { name: "Facility", href: "#facility" }, previewKind: "cards-3", sectionType: "gym", variant: "facility", label: "Facility Highlights", purpose: "Equipment, amenities, and training environment highlights", visualDescription: "Photo grid of gym areas (weights room, cardio zone, pool) with caption labels and a tour-the-gym CTA" },
  { id: "gym--class-types", dataKey: "gymClassTypes", navEntry: { name: "Classes", href: "#class-types" }, previewKind: "cards-3", sectionType: "gym", variant: "class-types", label: "Class Types", purpose: "Class format overview by level and duration", visualDescription: "Icon cards for each class type (HIIT, Yoga, Spin) with level badge, duration, and a learn-more link" },
  { id: "gym--faq", dataKey: "gymFaq", navEntry: { name: "FAQ", href: "#gym-faq" }, previewKind: "faq", sectionType: "gym", variant: "faq", label: "Gym FAQ", purpose: "Membership, schedule, and onboarding FAQs", visualDescription: "Accordion list of gym-specific questions (membership cancellation, trial passes, parking) with expand/collapse" },
  // legacy aliases
  { id: "features", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
  { id: "features-modern", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
  { id: "services-grid", dataKey: "features", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
  { id: "services-bento", dataKey: "featuresBento", navEntry: { name: "Services", href: "#services" }, previewKind: "cards-3", legacy: true },
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
  { id: "process", dataKey: "howItWorks", navEntry: { name: "How It Works", href: "#how-it-works" }, previewKind: "timeline", sectionType: "process", variant: "steps", label: "Process Steps", purpose: "Numbered icon steps — best for service flow", visualDescription: "Horizontal row of 3–5 numbered steps each with an icon, title, and short description connected by a dotted line" },
  { id: "process--timeline", dataKey: "treatmentProcess", navEntry: undefined, previewKind: "timeline", sectionType: "process", variant: "timeline", label: "Process Timeline", purpose: "Horizontal visual timeline layout", visualDescription: "Horizontal timeline with milestone markers, dates, and description text alternating above and below the line" },
  { id: "features--steps", dataKey: "featureSteps", navEntry: { name: "How It Works", href: "#how-it-works" }, previewKind: "timeline", sectionType: "process", variant: "feature-steps", label: "Feature Steps", purpose: "Animated step-by-step walkthrough with image panel", visualDescription: "Left: numbered step list that highlights on scroll; Right: large image panel that swaps to match the active step" },
  { id: "features--spotlight", dataKey: "featureSpotlight", navEntry: { name: "Featured", href: "#featured" }, previewKind: "generic", sectionType: "services", variant: "spotlight", label: "Feature Spotlight", purpose: "Elegant single-feature highlight with image and interactive text", visualDescription: "Large feature image with corner accent overlays; beside it, interactive text items that highlight on hover with a description" },
  // type: faq  |  variants: accordion (default), two-column
  { id: "faq", dataKey: "faqAccordion", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", sectionType: "faq", variant: "accordion", label: "FAQ Accordion", purpose: "Best for long Q&A lists", visualDescription: "Full-width stacked accordion rows; each row expands on click to reveal the answer with a smooth animation" },
  { id: "faq--two-column", dataKey: "patientFaq", navEntry: { name: "FAQ", href: "#faq" }, previewKind: "faq", sectionType: "faq", variant: "two-column", label: "FAQ Two Column", purpose: "Best for dense FAQ content", visualDescription: "Two-column layout of accordion items side by side, allowing more questions to be visible without scrolling" },
  // type: blog_preview
  { id: "blog_preview", dataKey: "blog", navEntry: { name: "Insights", href: "#blog" }, previewKind: "cards-3", sectionType: "blog_preview", variant: "standard", label: "Blog Preview", purpose: "Show latest articles to build authority", visualDescription: "3-column grid of article preview cards each with a cover image, category tag, title, date, and read-more link" },
  // type: stats
  { id: "stats", dataKey: "statsSection", navEntry: undefined, previewKind: "stats", sectionType: "stats", variant: "standard", label: "Stats & Metrics", purpose: "Numbers that build instant credibility", visualDescription: "Full-width dark or branded band with 3–4 large animated counter numbers and short labels (e.g. '500+ Projects', '10 Years')" },
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
  { id: "team", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", sectionType: "team", variant: "grid", label: "Team Grid", purpose: "Best for agencies and multi-staff businesses", visualDescription: "3–4 column grid of team member cards each with a headshot photo, name, role, and social links" },
  { id: "team--carousel", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", sectionType: "team", variant: "carousel", label: "Team Carousel", purpose: "Best for large teams", visualDescription: "Horizontally scrollable carousel of team member cards with photo, name, and role; arrows or dots for navigation" },
  { id: "team--profile", dataKey: "attorneyProfile", navEntry: { name: "About", href: "#about" }, previewKind: "generic", sectionType: "team", variant: "profile", label: "Team Profile", purpose: "Best for solo professionals and consultants", visualDescription: "Single large profile block: professional headshot on one side, bio, credentials, and contact CTA on the other" },
  { id: "team--spotlight", dataKey: "whyChooseMe", navEntry: undefined, previewKind: "cards-3", sectionType: "team", variant: "spotlight", label: "Team Spotlight", purpose: "Best for real estate agents and coaches", visualDescription: "Centered spotlight card with large photo, name, tagline, achievement stats, and a connect CTA" },
  { id: "team--showcase", dataKey: "teamShowcase", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", sectionType: "team", variant: "showcase", label: "Team Showcase", purpose: "Staggered photo grid with hover-to-highlight and social links", visualDescription: "Staggered asymmetric photo grid where hovering a member dims others and reveals their name, role, and social icons" },
  // legacy aliases
  { id: "team-carousel", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", legacy: true },
  { id: "team-grid", dataKey: "teamCarousel", navEntry: { name: "Team", href: "#team" }, previewKind: "cards-3", legacy: true },
  { id: "attorney-profile", dataKey: "attorneyProfile", navEntry: { name: "About", href: "#about" }, previewKind: "generic", legacy: true },

  // ── PRICING ───────────────────────────────────────────────────────────────
  // type: pricing  |  variants: cards (default), subscription
  { id: "pricing", dataKey: "pricingTable", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", sectionType: "pricing", variant: "cards", label: "Pricing Cards", purpose: "Best for service packages and tiers", visualDescription: "3-column pricing cards with plan name, price, feature list, and a highlighted recommended plan in the center" },
  { id: "pricing--comparison", dataKey: "pricingComparisonTable", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", sectionType: "pricing", variant: "comparison", label: "Pricing Comparison", purpose: "Interactive feature comparison with monthly/yearly toggle", visualDescription: "Toggle switch for monthly/yearly billing above 3 plan cards; each card has price, feature list, and a subscribe CTA" },
  { id: "pricing--feature-comparison", dataKey: "pricingSectionComparison", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", sectionType: "pricing", variant: "feature-comparison", label: "Pricing Feature Comparison", purpose: "Plan cards plus row-by-row feature matrix", visualDescription: "Plan cards at the top followed by a detailed feature matrix table with checkmarks per plan column" },
  { id: "pricing--subscription", dataKey: "maintenancePlans", navEntry: undefined, previewKind: "pricing", sectionType: "pricing", variant: "subscription", label: "Subscription Plans", purpose: "Best for recurring maintenance or SaaS", visualDescription: "Subscription tier cards with monthly/annual price, included visits or credits, and a subscribe button" },
  // type: price_preview
  { id: "price_preview", dataKey: "pricePreview", navEntry: undefined, previewKind: "cta", sectionType: "price_preview", variant: "standard", label: "Price Preview", purpose: "Transparent pricing strip to reduce friction", visualDescription: "Slim horizontal band showing starting price, key inclusions, and a get-a-quote CTA button" },
  // legacy aliases
  { id: "packages-pricing", dataKey: "pricingTable", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", legacy: true },
  { id: "pricing-comparison-table", dataKey: "pricingComparisonTable", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", legacy: true },
  { id: "pricing-section-with-comparison", dataKey: "pricingSectionComparison", navEntry: { name: "Pricing", href: "#pricing" }, previewKind: "pricing", legacy: true },
  { id: "maintenance-plans", dataKey: "maintenancePlans", navEntry: undefined, previewKind: "pricing", legacy: true },
  { id: "price-preview-strip", dataKey: "pricePreview", navEntry: undefined, previewKind: "cta", legacy: true },

  // ── COVERAGE ──────────────────────────────────────────────────────────────
  // type: service_area  |  variants: map (default), radius, list
  { id: "service_area", dataKey: "serviceAreaMap", navEntry: undefined, previewKind: "map", sectionType: "service_area", variant: "map", label: "Service Area Map", purpose: "Best for local service businesses", visualDescription: "Embedded map with highlighted service zone polygons and a list of covered cities/barangays beside it" },
  { id: "service_area--radius", dataKey: "coverageRadiusBlock", navEntry: undefined, previewKind: "map", sectionType: "service_area", variant: "radius", label: "Coverage Radius", purpose: "Show km radius from a central location", visualDescription: "Map with a shaded circle radius from the business location, plus a text list of covered areas" },
  // legacy aliases
  { id: "service-area-map", dataKey: "serviceAreaMap", navEntry: undefined, previewKind: "map", legacy: true },
  { id: "coverage-radius-block", dataKey: "coverageRadiusBlock", navEntry: undefined, previewKind: "map", legacy: true },

  // ── MEDIA / GALLERY ───────────────────────────────────────────────────────
  // type: gallery  |  variants: grid (default), slider, before_after
  { id: "gallery", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", sectionType: "gallery", variant: "grid", label: "Gallery Grid", purpose: "Best for contractors and cleaning services", visualDescription: "Masonry or uniform grid of project photos with a lightbox on click; optional before/after label overlay" },
  { id: "gallery--slider", dataKey: "beforeAfterSlider", navEntry: undefined, previewKind: "gallery", sectionType: "gallery", variant: "slider", label: "Gallery Slider", purpose: "Before/after comparison slider", visualDescription: "Single image with a draggable vertical divider revealing the before state on the left and after state on the right" },
  { id: "gallery--carousel", dataKey: "gallery4", navEntry: { name: "Projects", href: "#gallery" }, previewKind: "gallery", sectionType: "gallery", variant: "carousel", label: "Gallery Carousel", purpose: "Horizontally scrolling project cards with CTA links", visualDescription: "Horizontally scrollable row of wide project cards each with a photo, project title, category tag, and a view-project link" },
  { id: "gallery--grid", dataKey: "galleryGrid", navEntry: { name: "Gallery", href: "#gallery" }, previewKind: "gallery", sectionType: "gallery", variant: "grid", label: "Gallery Grid", purpose: "Filterable grid with category tabs and lightbox", visualDescription: "Category filter tabs above a responsive photo grid; clicking a photo opens a full-screen lightbox with caption" },
  // type: case_study  |  variants: standard (default), detail
  { id: "case_study", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", sectionType: "case_study", variant: "standard", label: "Case Study", purpose: "Problem → Solution → Results layout", visualDescription: "Structured card with problem statement, solution description, and measurable results with before/after images" },
  { id: "case_study--detail", dataKey: "caseStudyDetail", navEntry: undefined, previewKind: "cards-3", sectionType: "case_study", variant: "detail", label: "Case Study Detail", purpose: "Best for agencies, contractors, law firms", visualDescription: "Full-width case study layout with hero image, challenge/approach/outcome sections, and client quote" },
  // legacy aliases
  { id: "before-after-gallery-grid", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", legacy: true },
  { id: "before-after-gallery", dataKey: "beforeAfterGallery", navEntry: undefined, previewKind: "gallery", legacy: true },
  { id: "before-after-slider", dataKey: "beforeAfterSlider", navEntry: undefined, previewKind: "gallery", legacy: true },
  { id: "common-pests", dataKey: "commonPests", navEntry: undefined, previewKind: "cards-3", legacy: true },
  { id: "safety-section", dataKey: "safety", navEntry: undefined, previewKind: "cards-3", legacy: true },

  // ── CTA ───────────────────────────────────────────────────────────────────
  // type: cta  |  variants: banner (default), emergency, promo, sticky
  { id: "cta", dataKey: "promoCTA", navEntry: undefined, previewKind: "cta", sectionType: "cta", variant: "banner", label: "CTA Banner", purpose: "Best for high-conversion service sites", visualDescription: "Full-width colored band with a bold headline, short subtext, and a large CTA button centered or left-aligned" },
  { id: "cta--emergency", dataKey: "emergencyCTA", navEntry: undefined, previewKind: "cta", sectionType: "cta", variant: "emergency", label: "Emergency CTA", purpose: "Best for emergency businesses", visualDescription: "Red/orange urgent banner with flashing or bold phone number, 24/7 badge, and a call-now button" },
  { id: "cta--promo-strip", dataKey: "promoBannerStrip", navEntry: undefined, previewKind: "strip", sectionType: "cta", variant: "promo-strip", label: "Promo Strip", purpose: "Limited-time offer or announcement", visualDescription: "Slim top-of-page strip with promo text, countdown timer or discount code, and a claim-offer link" },
  { id: "cta--sticky", dataKey: "messengerStickyCTA", navEntry: null, previewKind: "cta", sectionType: "cta", variant: "sticky", label: "Sticky CTA", purpose: "Floating call/chat button — always visible", visualDescription: "Fixed floating button in the bottom-right corner with a phone or chat icon that stays visible while scrolling" },
  // type: announcement_bar  |  variants: standard (default), promo, emergency, offer
  { id: "announcement_bar", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "standard", label: "Announcement Bar", purpose: "Sits above hero — best for urgent messages", visualDescription: "Thin full-width bar above the header with centered text and an optional dismiss button" },
  { id: "announcement_bar--promo", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "promo", label: "Promo Bar", purpose: "Limited offer or discount strip", visualDescription: "Colored top bar with promo message, discount code highlight, and a shop-now link" },
  { id: "announcement_bar--emergency", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "emergency", label: "Emergency Hotline Bar", purpose: "Best for emergency and 24/7 services", visualDescription: "Red top bar with emergency icon, hotline number in bold, and available-now text" },
  { id: "announcement_bar--offer", dataKey: "promoBannerStrip", navEntry: null, previewKind: "strip", sectionType: "announcement_bar", variant: "offer", label: "Free Inspection Bar", purpose: "Free inspection or consultation offer", visualDescription: "Green or branded top bar offering a free inspection/consultation with a book-now link" },
  // type: booking
  { id: "booking", dataKey: "bookingCTA", navEntry: undefined, previewKind: "cta", sectionType: "booking", variant: "standard", label: "Booking", purpose: "Best for appointment-based businesses", visualDescription: "Centered section with a date/time picker, service selector dropdown, and a confirm-booking CTA button" },
  // type: lead_capture  |  variants: standard (default), multi-step
  { id: "lead_capture", dataKey: "freeConsultation", navEntry: undefined, previewKind: "cta", sectionType: "lead_capture", variant: "standard", label: "Lead Capture", purpose: "Simple lead form — service type + contact", visualDescription: "Compact form with service type dropdown, name, phone, and a submit button on a contrasting background" },
  { id: "lead_capture--multi-step", dataKey: "freeConsultation", navEntry: undefined, previewKind: "cta", sectionType: "lead_capture", variant: "multi-step", label: "Multi-Step Lead Form", purpose: "Step 1: Service → Step 2: Location → Step 3: Contact", visualDescription: "3-step wizard form with progress indicator: step 1 selects service, step 2 enters location, step 3 fills contact info" },
  // type: free_consultation
  { id: "free_consultation", dataKey: "freeConsultation", navEntry: { name: "Free Consultation", href: "#contact" }, previewKind: "cta", sectionType: "free_consultation", variant: "standard", label: "Free Consultation", purpose: "Best for law firms, clinics, and consultants", visualDescription: "Split section: left has headline and trust points; right has a short form (name, email, message) and a submit CTA" },
  // type: payment_options
  { id: "payment_options", dataKey: "paymentOptionsStrip", navEntry: undefined, previewKind: "strip", sectionType: "payment_options", variant: "standard", label: "Payment Options", purpose: "Accepted payment methods strip", visualDescription: "Horizontal strip of payment method logos (GCash, Maya, Visa, Cash) with a short 'We Accept' label" },
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
  { id: "guarantee", dataKey: "warranty", navEntry: undefined, previewKind: "cta", sectionType: "guarantee", variant: "standard", label: "Guarantee", purpose: "Satisfaction guarantee — reduces buyer hesitation", visualDescription: "Centered block with a shield or checkmark icon, bold guarantee headline, short description, and a get-started CTA" },
  { id: "guarantee--badge", dataKey: "warranty", navEntry: undefined, previewKind: "cta", sectionType: "guarantee", variant: "badge", label: "Guarantee Badge", purpose: "Money-back or warranty badge block", visualDescription: "Circular or ribbon badge graphic with '100% Satisfaction' or money-back text, displayed inline or as a section" },
  { id: "guarantee--safety", dataKey: "warranty", navEntry: undefined, previewKind: "cta", sectionType: "guarantee", variant: "safety", label: "Safety Compliance", purpose: "Safety certifications and compliance block", visualDescription: "Row of safety/compliance icons (OSHA, ISO, DOH) with labels and a short compliance statement below" },
  // type: contact  |  variants: standard (default), minimal, visual, withMap, columns, split
  { id: "contact", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "standard", label: "Contact", purpose: "Best for all service businesses", visualDescription: "Two-column layout: left has address, phone, email, and hours; right has a name/email/message form with a send button" },
  { id: "contact--minimal", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "minimal", label: "Contact Minimal", purpose: "Clean minimal form — best for premium brands", visualDescription: "Centered minimal form on a white background with just name, email, message fields and a subtle submit button" },
  { id: "contact--visual", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "visual", label: "Contact Visual", purpose: "Full-bleed background image contact", visualDescription: "Full-bleed background photo with a semi-transparent overlay and a centered contact form on top" },
  { id: "contact--with-map", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "map", sectionType: "contact", variant: "with-map", label: "Contact With Map", purpose: "Best for businesses with a physical location", visualDescription: "Left: contact form; Right: embedded Google Map showing the business location with a pin" },
  { id: "contact--columns", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "columns", label: "Contact Columns", purpose: "Multi-channel contact with social links", visualDescription: "3-column layout: phone column, email column, social links column — each with an icon and clickable detail" },
  { id: "contact--split", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", sectionType: "contact", variant: "split", label: "Contact Split", purpose: "Two-column split layout", visualDescription: "Dark left panel with contact info and brand accent; light right panel with the contact form" },
  // type: custom_html
  { id: "custom-html", dataKey: "customHtml", navEntry: undefined, previewKind: "generic", sectionType: "custom_html", variant: "ai-html", label: "AI Custom Section", purpose: "Prompt AI to generate a custom HTML/CSS section (Pro+ only)", visualDescription: "Fully custom section rendered from AI-generated HTML and CSS — appearance depends on the prompt" },
  // type: cta  |  variant: beams
  { id: "cta--beams", dataKey: "ctaBeams", navEntry: undefined, previewKind: "cta", sectionType: "cta", variant: "beams", label: "CTA Beams", purpose: "Animated beam background CTA — eye-catching conversion section", visualDescription: "Dark section with animated light-beam rays radiating from the center behind a bold headline and CTA button" },
  // legacy aliases
  { id: "contact-minimal", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  { id: "contact-visual", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  { id: "contact-with-map", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "map", legacy: true },
  { id: "contact-columns", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  { id: "contact-split", dataKey: "contact", navEntry: { name: "Contact", href: "#contact" }, previewKind: "generic", legacy: true },
  {
    id: "contact--agency",
    dataKey: "contactAgency",
    navEntry: { name: "Contact", href: "#contact" },
    previewKind: "split-content",
    sectionType: "contact",
    variant: "agency",
    label: "Agency Contact",
    purpose: "Premium split contact form with info items and optional map",
    visualDescription: "Left dark panel with business info items (address, phone, hours) and optional map embed; right panel has a styled multi-field contact form",
  },
  {
    id: "blog--agency",
    dataKey: "blogAgency",
    navEntry: { name: "Journal", href: "#journal" },
    previewKind: "cards-3",
    sectionType: "blog_preview",
    variant: "agency",
    label: "Agency Blog",
    purpose: "High-end magazine style blog grid with featured post",
    visualDescription: "Large featured article card spanning full width at the top, followed by a 3-column grid of smaller article cards with cover images and category tags",
  },
  {
    id: "products--agency",
    dataKey: "productsAgency",
    navEntry: { name: "Shop", href: "#shop" },
    previewKind: "cards-4",
    sectionType: "products",
    variant: "agency",
    label: "Agency Products",
    purpose: "Premium e-commerce grid with categories, badges, and quick-add — best for physical products",
    visualDescription: "4-column product grid with category filter tabs, product photo, name, price, badge (New/Sale), and a quick-add-to-cart button on hover",
  },
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
    label: "Trust & Social Proof",
    ids: [
      "certifications",
      "trust_badges",
      "testimonials",
      "testimonials--grid",
      "testimonials--animated",
      "testimonials--community",
      "testimonials--facebook",
      "logo_cloud",
    ],
  },
  {
    label: "Services & Features",
    ids: [
      "services",
      "services--bento",
      "services--modern",
      "services--vertical-tabs",
      "services--features-v2",
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
    label: "Gym",
    ids: [
      "gym--programs",
      "gym--schedule",
      "gym--memberships",
      "gym--trainers",
      "gym--results",
      "gym--facility",
      "gym--class-types",
      "gym--faq",
    ],
  },
  {
    label: "Process & Info",
    ids: [
      "process",
      "process--timeline",
      "features--steps",
      "faq",
      "faq--two-column",
      "blog_preview",
      "blog--agency",
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
      "team--grid",
      "team--showcase",
      "team--profile",
      "team--spotlight",
    ],
  },
  {
    label: "Pricing",
    ids: [
      "pricing",
      "pricing--comparison",
      "pricing--feature-comparison",
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
      "gallery--carousel",
      "gallery--grid",
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
      "cta--beams",
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
      "contact--agency",
    ],
  },
  {
    label: "Products & E-commerce",
    ids: [
      "products--agency",
    ],
  },
  {
    label: "Custom",
    ids: [
      "custom-html",
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
    type: "trust",
    icon: "ShieldCheck",
    label: "Trust & Social Proof",
    variantIds: ["trust_badges", "testimonials", "testimonials--grid", "testimonials--animated", "testimonials--community", "testimonials--v2", "testimonials--facebook", "certifications", "logo_cloud"],
  },
  {
    type: "services",
    icon: "Wrench",
    label: "Services & Features",
    variantIds: ["services", "services--bento", "services--modern", "services--vertical-tabs", "services--features-v2", "services--highlight", "features--spotlight", "service_detail", "service_detail--split", "comparison", "comparison--table", "comparison--vs", "specialty_listings"],
  },
  {
    type: "gym",
    icon: "Dumbbell",
    label: "Gym",
    variantIds: ["gym--programs", "gym--schedule", "gym--memberships", "gym--trainers", "gym--results", "gym--facility", "gym--class-types", "gym--faq"],
  },
  {
    type: "process",
    icon: "ListChecks",
    label: "Process & Info",
    variantIds: ["process", "process--timeline", "features--steps", "faq", "faq--two-column", "blog_preview", "blog--agency", "stats", "case_study", "case_study--detail"],
  },
  {
    type: "team",
    icon: "Users",
    label: "Team",
    variantIds: ["team", "team--carousel", "team--grid", "team--showcase", "team--profile", "team--spotlight"],
  },
  {
    type: "pricing",
    icon: "BadgeDollarSign",
    label: "Pricing",
    variantIds: ["pricing", "pricing--comparison", "pricing--feature-comparison", "pricing--subscription", "price_preview"],
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
    variantIds: ["gallery", "gallery--slider", "gallery--carousel", "gallery--grid"],
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
    variantIds: ["cta", "cta--emergency", "cta--promo-strip", "cta--sticky", "cta--beams", "booking", "lead_capture", "lead_capture--multi-step", "free_consultation", "payment_options"],
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
    variantIds: ["contact", "contact--minimal", "contact--visual", "contact--with-map", "contact--columns", "contact--split", "contact--agency"],
  },
  {
    type: "products",
    icon: "ShoppingBag",
    label: "Products & Shop",
    variantIds: ["products--agency"],
  },
  {
    type: "custom_html",
    icon: "Code2",
    label: "Custom",
    variantIds: ["custom-html"],
  },
];





