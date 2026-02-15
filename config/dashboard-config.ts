export const COLOR_THEME_SWATCHES: Record<string, [string, string, string]> = {
  partner: ["#1a2b3c", "#c5a059", "#f8f9fa"],
  justice: ["#2d3436", "#d63031", "#ffffff"],
  modern: ["#000000", "#636e72", "#f1f2f6"],
  "frost-fire": ["#0984e3", "#e17055", "#ffffff"],
  reliable: ["#2d3436", "#fdcb6e", "#fafafa"],
  "eco-clean": ["#00b894", "#00cec9", "#f9fff9"],
  surgeon: ["#0984e3", "#74b9ff", "#ffffff"],
  wellness: ["#6c5ce7", "#a29bfe", "#fdfbff"],
  holistic: ["#218c74", "#f7f1e3", "#fefcf8"],
  "clinical-gold": ["#b8892a", "#eab308", "#ffffff"],
  "red-crimson": ["#d63031", "#2d3436", "#ffffff"],
  "cyan-ocean": ["#00a8ff", "#0097e6", "#ffffff"],
  "orange-amber": ["#f39c12", "#e67e22", "#ffffff"],
  "dark-pink-white": ["#1a0a12", "#e91e63", "#ffffff"],
  "blue-mint": ["#0d9488", "#5eead4", "#f0fdfa"],
  "red-black": ["#b91c1c", "#1f2937", "#ffffff"],
  "dark-green-ivory-yellow": ["#166534", "#facc15", "#f7fee7"],
  "bright-green-hot-pink": ["#22c55e", "#ec4899", "#f0fdf4"],
  "dark-grey-yellowgreen": ["#374151", "#84cc16", "#f9fafb"],
  "blue-shades-white": ["#1e40af", "#3b82f6", "#eff6ff"],
  "white-lime": ["#65a30d", "#84cc16", "#f7fee7"],
  "beige-dark-grey": ["#44403c", "#d6d3d1", "#fafaf9"],
  "pastel-purple-neutral": ["#7c3aed", "#c4b5fd", "#faf5ff"],
  "navy-electric-blue": ["#1e3a5f", "#3b82f6", "#eff6ff"],
  "navy-electric": ["#1e3a5f", "#3b82f6", "#eff6ff"],
  "gradient-white-dark-blue": ["#1e40af", "#60a5fa", "#f0f9ff"],
  "white-blue-grey": ["#1e40af", "#64748b", "#f8fafc"],
  "bright-red-white": ["#dc2626", "#1f2937", "#ffffff"],
  "classic-blue-turquoise-gold": ["#0e7490", "#c5a059", "#ecfeff"],
  "dark-royal-blue-gold": ["#1e3a8a", "#f0c674", "#eff6ff"],
  "white-purple": ["#6d28d9", "#a78bfa", "#faf5ff"],
  "blue-shades-white-red-violet": ["#1e40af", "#7c3aed", "#eff6ff"],
  "light-reddish-orange": ["#ea580c", "#c2410c", "#fff7ed"],
  "white-purple-orange": ["#7c3aed", "#f97316", "#faf5ff"],
  "deep-purple-orange-red-pink": ["#6d28d9", "#f43f5e", "#1e1b4b"],
  "brown-beige": ["#78350f", "#d6d3d1", "#fef3c7"],
  "dark-green-ivory": ["#14532d", "#f0fdf4", "#ecfccb"],
  "fiesta-red-yellow": ["#dc2626", "#eab308", "#fef2f2"],
  "barangay-blue": ["#1e40af", "#22c55e", "#eff6ff"],
  "tropical-teal": ["#0f766e", "#2dd4bf", "#f0fdfa"],
  "luxury-black-gold": ["#0a0a0a", "#d4af37", "#fafaf9"],
  "facebook-blue": ["#1877f2", "#42b72a", "#ffffff"],
  nebula: ["#6c5ce7", "#00cec9", "#0f172a"],
  flow: ["#4834d4", "#eb4d4b", "#ffffff"],
  mono: ["#000000", "#636e72", "#f1f2f6"],
};

export const TYPOGRAPHY_OPTIONS = [
  { value: "elegant", label: "Elegant", fontFamily: "var(--font-source-sans-3), var(--font-playfair-display), Georgia, serif" },
  { value: "modern", label: "Modern", fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" },
  { value: "bold", label: "Bold", fontFamily: "var(--font-space-grotesk), var(--font-instrument-serif), Georgia, serif" },
  { value: "technical", label: "Technical", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" },
  { value: "clinical", label: "Clinical", fontFamily: "var(--font-geist-sans), var(--font-source-serif-4), Georgia, serif" },
  { value: "playful", label: "Playful", fontFamily: "var(--font-nunito), system-ui, sans-serif" },
  { value: "traditional", label: "Traditional", fontFamily: "var(--font-source-sans-3), var(--font-libre-baskerville), Georgia, serif" },
];

export const AWARD_ICON_NAMES = ['Award', 'ShieldCheck', 'Star', 'Users', 'Shield', 'Gavel', 'Scale', 'Briefcase', 'Home', 'Zap', 'Clock', 'Calendar', 'ClipboardCheck', 'Phone', 'MapPin', 'Mail', 'Check', 'Heart', 'Smile', 'ThumbsUp', 'Bug', 'Search', 'RotateCw', 'Leaf', 'Lock', 'Dog', 'Hammer', 'BookOpen', 'PenTool', 'GraduationCap', 'Trophy', 'Snowflake', 'Layout', 'Grid', 'Wind', 'Building', 'Wallet'].sort();

export const DEFAULT_FOOTER = {
  tagline: "Expert advice and reliable service for modern businesses. Customize your footer and social links here.",
  formHeading: "Stay connected",
  formSubmitText: "Submit",
  formThankYouText: "Thank you!",
  social: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    showSocial: true,
    showContact: true,
    facebookEnabled: true,
    twitterEnabled: true,
    linkedinEnabled: true,
    instagramEnabled: true,
  },
  privacyUrl: "/privacy",
  termsUrl: "/terms",
  cookieUrl: "/cookies",
};

export const DEFAULT_NAVIGATION = [
  { name: "Services", href: "#services" },
  { name: "About Us", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "/contact" },
];

export const DEFAULT_EMERGENCY_CTA = {
  title: "Emergency Service?",
  subtitle: "We're ready to assist you. Fast response guaranteed.",
  buttonText: "Call Now",
  phone: "",
  imageUrl: "",
  icon: "Phone",
};

export const DEFAULT_AWARDS_STRIP = {
  title: "Trusted & Recognized By",
  items: [
    { label: "Top Rated 2024", sublabel: "Industry Award", icon: "Award" },
    { label: "Verified Business", sublabel: "Trust Seal", icon: "ShieldCheck" },
    { label: "5-Star Service", sublabel: "Customer Choice", icon: "Star" },
    { label: "10k+ Clients", sublabel: "Community", icon: "Users" },
  ],
};

export const DEFAULT_FAQ_ACCORDION = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our services.",
  items: [
    { question: "How do I get started?", answer: "Simply click the contact button and fill out the form." },
    { question: "What are your operating hours?", answer: "We are open Monday to Friday, 9am to 6pm." },
    { question: "Do you offer emergency services?", answer: "Yes, we have a 24/7 emergency response team available." },
  ],
};

export const DEFAULT_BLOG = {
  title: "Latest Insights",
  subtitle: "Stay updated with our latest news and expert advice.",
  linkText: "Read Article",
  posts: [
    { title: "Article Title", excerpt: "Short description.", date: "Jan 1, 2025", category: "News", imageUrl: "", href: "#" },
  ],
};

export const DEFAULT_BEFORE_AFTER_GALLERY = {
  title: "Before & After",
  subtitle: "See the transformation. Customize titles and images below.",
  beforeLabel: "Before",
  afterLabel: "After",
  items: [
    { title: "Example 1", description: "Add a short description.", beforeImage: "", afterImage: "" },
    { title: "Example 2", description: "Add a short description.", beforeImage: "", afterImage: "" },
  ],
};

export const DEFAULT_HOW_IT_WORKS = {
  title: "How It Works",
  subtitle: "Simple and transparent.",
  steps: [
    { number: "01", title: "Step One", description: "Brief description.", icon: "Calendar" },
    { number: "02", title: "Step Two", description: "Brief description.", icon: "ClipboardCheck" },
    { number: "03", title: "Step Three", description: "Brief description.", icon: "ShieldCheck" },
  ],
};

export const DEFAULT_PRACTICE_AREAS = {
  title: "Our Services",
  subtitle: "Tailored to your needs.",
  items: [
    { title: "Service One", description: "Description of your first offering.", icon: "Scale", href: "#" },
    { title: "Service Two", description: "Description of your second offering.", icon: "Briefcase", href: "#" },
    { title: "Service Three", description: "Description of your third offering.", icon: "Shield", href: "#" },
  ],
};

export const DEFAULT_TREATMENT_PROCESS = {
  title: "Our Treatment Process",
  subtitle: "A systematic approach.",
  steps: [
    { title: "Inspection", description: "Thorough check of your property.", icon: "Search" },
    { title: "Treatment", description: "Application of safe, targeted solutions.", icon: "ShieldCheck" },
    { title: "Follow-up", description: "Monitoring to ensure long-term results.", icon: "RotateCw" },
  ],
};

export const DEFAULT_COMMON_PESTS = {
  title: "Common Pests We Treat",
  subtitle: "Professional solutions for every type of infestation.",
  items: [
    { name: "Termites", icon: "Bug" },
    { name: "Cockroaches", icon: "Bug" },
    { name: "Rats & Mice", icon: "Bug" },
  ],
};

export const DEFAULT_FEATURED_LISTINGS = {
  title: "Featured Properties",
  subtitle: "Discover the best opportunities.",
  items: [
    { title: "Listing One", location: "City", price: "₱0", imageUrl: "", beds: 0, baths: 0, sqm: 0, tag: "" },
    { title: "Listing Two", location: "City", price: "₱0", imageUrl: "", beds: 0, baths: 0, sqm: 0, tag: "" },
  ],
};

export const DEFAULT_DEVELOPER_PARTNERS = {
  title: "Our Partners",
  items: [
    { name: "Partner 1", logoUrl: "" },
    { name: "Partner 2", logoUrl: "" },
  ],
};

export const DEFAULT_REVIEW_TRUST_BAR = {
  title: "What Our Customers Say",
  subtitle: "Real feedback from real people.",
  testimonials: [
    { quoteTitle: "Great service", body: "Professional and reliable.", customerName: "Customer A", verified: true },
  ],
};

export const DEFAULT_FINANCING = {
  title: "Financing Options",
  subtitle: "Flexible payment terms.",
  items: [
    { title: "Option One", description: "Brief description.", icon: "Home", features: ["Feature 1", "Feature 2"] },
    { title: "Option Two", description: "Brief description.", icon: "Building", features: ["Feature 1"] },
  ],
};

export const DEFAULT_BLUEPRINT_CONFIG = {
  privacy: {
    title: "Privacy Policy",
    content: "Our commitment to protecting your data and privacy.\n\nWe respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information when you use our website or services.",
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
  termsofservice: {
    title: "Terms of Service",
    content: "Please read these terms carefully before using our service.\n\nBy accessing or using our service, you agree to be bound by these terms. If you do not agree, please do not use our service.",
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
  cookiepolicy: {
    title: "Cookie Policy",
    content: "This policy explains how we use cookies and similar technologies.\n\nWe use cookies to improve your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.",
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
};

export const FIELD_LABELS: Record<string, string> = {
  imageUrl: "Image",
  logoUrl: "Logo",
  backgroundImage: "Background image",
  beforeImage: "Before image",
  afterImage: "After image",
  avatar: "Photo",
  headshotUrl: "Photo",
  bioUrl: "Profile link",
  privacyUrl: "Privacy page link",
  termsUrl: "Terms page link",
  cookieUrl: "Cookie page link",
};

export const DEFAULT_AC_TYPES = {
  title: "AC Types We Service",
  subtitle: "Expert service for all types.",
  items: [
    { name: "Window Type", icon: "Zap", description: "Description here." },
    { name: "Split Type", icon: "Zap", description: "Description here." },
  ],
};

export const DEFAULT_PRICE_PREVIEW = {
  title: "Quick Price Guide",
  items: [
    { service: "Service 1", price: "₱XXX", note: "" },
    { service: "Service 2", price: "₱XXX", note: "" },
  ],
};

export const DEFAULT_PRICING_TABLE = {
  title: "Simple Pricing",
  subtitle: "Choose the plan that fits.",
  plans: [
    { name: "Basic", price: "₱0", description: "Get started for free.", features: [{ text: "Core features", included: true }, { text: "Support", included: true }], buttonText: "Get Started", isPopular: false },
    { name: "Pro", price: "₱999", description: "For growing teams.", features: [{ text: "Everything in Basic", included: true }, { text: "Priority support", included: true }], buttonText: "Get Pro", isPopular: true },
  ],
};

export const DEFAULT_MAINTENANCE_PLANS = {
  title: "Maintenance Plans",
  subtitle: "Keep your systems running smoothly.",
  plans: [
    { name: "Basic", price: "₱2,800", period: "/year", description: "2 visits per year.", features: ["Inspection", "Cleaning"], isPopular: false },
    { name: "Premium", price: "₱5,000", period: "/year", description: "4 visits per year.", features: ["Everything in Basic", "Priority service"], isPopular: true },
  ],
};

export const DEFAULT_FACEBOOK_REVIEW_EMBED = {
  title: "Highly Rated on Facebook",
  subtitle: "See why our customers love us",
  reviews: [
    { author: "Customer A", text: "Excellent service!", date: "2 weeks ago", rating: 5 },
    { author: "Customer B", text: "Very satisfied.", date: "1 month ago", rating: 5 },
  ],
};

export const DEFAULT_WHY_CHOOSE_ME = {
  title: "Why Choose Me",
  subtitle: "Your trusted partner",
  agentName: "",
  agentRole: "",
  licenseNumber: "",
  agentBio: "",
  agentImageUrl: "",
  trustSignals: [
    { label: "Licensed", icon: "Award" },
    { label: "10+ Years", icon: "Clock" },
  ],
};

export const DEFAULT_SERVICE_AREA_MAP = {
  title: "Our Service Areas",
  subtitle: "We serve the following locations.",
  cities: ["City 1", "City 2", "City 3"],
  googleMapsEmbedUrl: "",
};

export const DEFAULT_LOGO_CLOUD = {
  title: "Trusted by",
  items: [
    { name: "Company 1", logoUrl: "" },
    { name: "Company 2", logoUrl: "" },
  ],
};

export function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^\s+/, "");
}

export function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, string>;
    return Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => obj[k])
      .filter((v): v is string => typeof v === "string");
  }
  return [];
}

export function deepMerge(target: any, source: any) {
  if (Array.isArray(source)) return [...source]
  if (!source || typeof source !== 'object') return source

  const result = { ...target }
  for (const key in source) {
    const next = source[key]
    if (next && typeof next === 'object' && !Array.isArray(next) && key in target) {
      result[key] = deepMerge(target[key], next)
    } else {
      result[key] = next
    }
  }
  return result
}

export function sectionIdToKey(id: string) {
  const map: Record<string, string> = {
    brand: 'brand',
    hero: 'hero',
    'hero-emergency': 'heroEmergency',
    'practice-areas': 'practiceAreas',
    'attorney-profile': 'attorneyProfile',
    'free-consultation': 'freeConsultation',
    'how-it-works': 'howItWorks',
    'review-trust-bar': 'reviewTrustBar',
    'feature-highlight': 'featureHighlight',
    'team-carousel': 'teamCarousel',
    'team-grid': 'teamCarousel',
    'patient-faq': 'patientFaq',
    'faq-two-column': 'patientFaq',
    'reviews-grid': 'reviewTrustBar',
    'pricing': 'pricingTable',
    'packages-pricing': 'pricingTable',
    'awards': 'awardsStrip',
    'certifications': 'awardsStrip',
    'contact-minimal': 'contact',
    'contact-visual': 'contact',
    'contact-with-map': 'contact',
    'contact-columns': 'contact',
    'common-pests': 'commonPests',
    'treatment-process': 'treatmentProcess',
    'safety-section': 'safety',
    'warranty-block': 'warranty',
    'ac-types-grid': 'acTypes',
    'price-preview-strip': 'pricePreview',
    'emergency-cta-strip': 'emergencyCTA',
    'maintenance-plans': 'maintenancePlans',
    'before-after-gallery-grid': 'beforeAfterGallery',
    'before-after-gallery': 'beforeAfterGallery',
    'promo-cta-section': 'promoCTA',
    'messenger-sticky-cta': 'messengerStickyCTA',
    'service-area-map': 'serviceAreaMap',
    'before-after-slider': 'beforeAfterSlider',
    'promo-banner-strip': 'promoBannerStrip',
    'payment-options-strip': 'paymentOptionsStrip',
    'facebook-review-embed': 'facebookReviewEmbed',
    'coverage-radius-block': 'coverageRadiusBlock',
    'stats-section': 'statsSection',
    'faq-accordion': 'faqAccordion',
    'logo-cloud': 'logoCloud',
    'trust-badges-grid': 'trustBadgesGrid',
    'featured-properties-grid': 'featuredListings',
    'financing-section': 'financing',
    'developer-partners': 'developerPartners',
    'why-choose-me': 'whyChooseMe',
    'features': 'features',
    'features-modern': 'features',
    'services-grid': 'features',
    'project-gallery': 'features',
    'programs-grid': 'features',
    'faculty-grid': 'features',
    'delivery-coverage': 'deliveryCoverage',
    'booking-cta': 'bookingCTA',
    'footer': 'footer',
    'contact': 'contact',
    'navigation': 'navigation',
    'legal': 'legal'
  };
  return map[id] || id;
}

export function navigationToArray(nav: unknown): { name: string; href: string }[] {
  if (Array.isArray(nav) && nav.length > 0) return nav as { name: string; href: string }[];
  if (nav && typeof nav === 'object' && !Array.isArray(nav)) {
    const obj = nav as Record<string, { name?: string; href?: string }>;
    return Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => ({ name: obj[k]?.name ?? '', href: obj[k]?.href ?? '#' }))
      .filter((item) => item.name || item.href);
  }
  return DEFAULT_NAVIGATION;
}

export function formatSectionLabel(id: string): string {
  const labelMap: Record<string, string> = {
    'brand': 'Brand & Logo',
    'hero': 'Hero Section',
    'hero-emergency': 'Emergency Hero',
    'practice-areas': 'Practice Areas',
    'attorney-profile': 'Attorney Profile',
    'free-consultation': 'Free Consultation',
    'how-it-works': 'How It Works',
    'review-trust-bar': 'Reviews & Trust',
    'feature-highlight': 'Feature Highlight',
    'team-carousel': 'Team Carousel',
    'team-grid': 'Team Grid',
    'patient-faq': 'FAQ Section',
    'faq-two-column': 'Two-Column FAQ',
    'reviews-grid': 'Reviews Grid',
    'pricing': 'Pricing Table',
    'packages-pricing': 'Packages & Pricing',
    'awards': 'Awards Strip',
    'certifications': 'Certifications',
    'contact-minimal': 'Minimal Contact',
    'contact-visual': 'Visual Contact',
    'contact-with-map': 'Contact w/ Map',
    'contact-columns': 'Contact Columns',
    'common-pests': 'Common Pests',
    'treatment-process': 'Treatment Process',
    'safety-section': 'Safety Section',
    'warranty-block': 'Warranty Block',
    'ac-types-grid': 'AC Types Grid',
    'price-preview-strip': 'Price Preview',
    'emergency-cta-strip': 'Emergency CTA',
    'maintenance-plans': 'Maintenance Plans',
    'before-after-gallery-grid': 'B&A Gallery Grid',
    'before-after-gallery': 'B&A Gallery',
    'promo-cta-section': 'Promo CTA',
    'messenger-sticky-cta': 'Sticky Messenger',
    'service-area-map': 'Service Area Map',
    'before-after-slider': 'B&A Slider',
    'promo-banner-strip': 'Promo Banner',
    'payment-options-strip': 'Payment Options',
    'facebook-review-embed': 'Facebook Reviews',
    'coverage-radius-block': 'Coverage Radius',
    'stats-section': 'Stats Section',
    'faq-accordion': 'FAQ Accordion',
    'logo-cloud': 'Logo Cloud',
    'trust-badges-grid': 'Trust Badges',
    'featured-properties-grid': 'Featured Listings',
    'financing-section': 'Financing Section',
    'developer-partners': 'Partners',
    'why-choose-me': 'Why Choose Us',
    'features': 'Features Section',
    'features-modern': 'Modern Features',
    'services-grid': 'Services Grid',
    'project-gallery': 'Project Gallery',
    'programs-grid': 'Programs Grid',
    'faculty-grid': 'Faculty Grid',
    'delivery-coverage': 'Delivery Coverage',
    'booking-cta': 'Booking CTA',
    'footer': 'Footer Settings',
    'contact': 'Contact Info',
    'navigation': 'Navigation Menu',
    'legal': 'Legal Pages'
  };
  return labelMap[id] || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const DEFAULT_DELIVERY_COVERAGE = {
  title: "Delivery & Coverage",
  subtitle: "We deliver to the following areas.",
  areas: [
    { name: "Zone 1", price: "₱0", status: "Active" },
    { name: "Zone 2", price: "₱0", status: "Active" },
  ],
};
