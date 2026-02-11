/**
 * Genre presets: one-click "best practices" for hero style, color theme, and active sections.
 * Content uses generic placeholder text; users customize in site-data or config.
 */

export type ThemeKey =
  | "lawyer"
  | "startup"
  | "chiropractor"
  | "dentist"
  | "clinic"
  | "cleaning"
  | "pool"
  | "pest-control";

export type ColorThemeKey =
  | "partner"
  | "justice"
  | "modern"
  | "frost-fire"
  | "reliable"
  | "eco-clean"
  | "surgeon"
  | "wellness"
  | "holistic"
  | "clinical-gold"
  | "red-crimson"
  | "cyan-ocean"
  | "orange-amber"
  | "dark-pink-white"
  | "blue-mint"
  | "red-black"
  | "dark-green-ivory-yellow"
  | "bright-green-hot-pink"
  | "dark-grey-yellowgreen"
  | "blue-shades-white"
  | "white-lime"
  | "beige-dark-grey"
  | "pastel-purple-neutral"
  | "navy-electric-blue"
  | "gradient-white-dark-blue"
  | "white-blue-grey"
  | "bright-red-white"
  | "classic-blue-turquoise-gold"
  | "dark-royal-blue-gold"
  | "white-purple"
  | "blue-shades-white-red-violet"
  | "light-reddish-orange"
  | "white-purple-orange"
  | "deep-purple-orange-red-pink"
  | "brown-beige"
  | "nebula"
  | "flow"
  | "mono";

export type PresetContent = {
  brand?: { name: string; logoUrl: string };
  hero?: Record<string, unknown>;
  features?: { title: string; subtitle: string; items: { title: string; description: string; icon: string }[] };
  testimonials?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  practiceAreas?: Record<string, unknown>;
  attorneyProfile?: Record<string, unknown>;
  heroEmergency?: Record<string, unknown>;
  howItWorks?: Record<string, unknown>;
  reviewTrustBar?: Record<string, unknown>;
  featureHighlight?: Record<string, unknown>;
  teamCarousel?: Record<string, unknown>;
  patientFaq?: Record<string, unknown>;
  freeConsultation?: Record<string, unknown>;
  pricingTable?: Record<string, unknown>;
  awardsStrip?: Record<string, unknown>;
  blog?: Record<string, unknown>;
};

const GENERIC_CONTENT: PresetContent = {
  brand: { name: "Your Business Name", logoUrl: "https://placehold.co/80x80/1a2b3c/ffffff?text=YB" },
  hero: {
    title: "Your Headline Here.",
    subtitle: "A short description of what you offer. Edit this in site-data or config.",
    primaryCTA: "Get Started",
    secondaryCTA: "Learn More",
    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&q=80",
    trustSignals: ["Licensed & Insured", "5-Star Rated", "Local Business"],
  },
  features: {
    title: "Our Services",
    subtitle: "Quality and clarity guaranteed. Customize this content for your business.",
    items: [
      { title: "Service One", description: "Brief description of your first service or offering.", icon: "Shield" },
      { title: "Service Two", description: "Brief description of your second service or offering.", icon: "ShieldCheck" },
      { title: "Service Three", description: "Brief description of your third service or offering.", icon: "Home" },
    ],
  },
  testimonials: {
    label: "What our customers say",
    logos: [],
    testimonial: {
      quote: "Great service. Professional and reliable. Highly recommend.",
      author: "Customer Name",
      role: "Customer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=112&h=112&fit=crop&q=80",
      rating: 5,
    },
  },
  contact: {
    tagline: "Get in touch. We're here to help.",
    formHeading: "Contact Us",
    formSubmitText: "Submit",
    formThankYouText: "Thank you!",
    email: "contact@yourbusiness.com",
    phone: "+63 912 345 6789",
    address: "123 Main St, Your City",
  },
  practiceAreas: {
    title: "Our Services",
    subtitle: "Tailored to your needs. Customize in site-data.",
    items: [
      { title: "Service One", description: "Description of your first offering.", icon: "Scale", href: "#" },
      { title: "Service Two", description: "Description of your second offering.", icon: "Briefcase", href: "#" },
      { title: "Service Three", description: "Description of your third offering.", icon: "Shield", href: "#" },
    ],
  },
  attorneyProfile: {
    label: "Team Member",
    name: "Your Name",
    bioParagraph1: "Short bio. Edit this in site-data to describe your experience and background.",
    bioParagraph2: "Additional details about your approach and expertise.",
    signatureName: "Your Name",
    headshotUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=533&fit=crop&q=80",
  },
  heroEmergency: {
    title: "Need help? We're here.",
    subtitle: "Fast, reliable service.",
    primaryCTA: "Call Now",
    primaryCTAHref: "tel:+18005551234",
    secondaryCTA: "Schedule Online",
    secondaryCTAHref: "#schedule",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Simple and transparent.",
    steps: [
      { number: "01", title: "Step One", description: "Brief description of the first step.", icon: "Calendar" },
      { number: "02", title: "Step Two", description: "Brief description of the second step.", icon: "ClipboardCheck" },
      { number: "03", title: "Step Three", description: "Brief description of the third step.", icon: "ShieldCheck" },
    ],
  },
  reviewTrustBar: {
    rating: 5,
    ratingLabel: "Rated 5.0",
    sourceLabel: "Google & Yelp",
    testimonials: [
      { quoteTitle: "Great service", body: "Professional and reliable. Would use again.", customerName: "Customer A.", verified: true },
      { quoteTitle: "Highly recommend", body: "Fast response and quality work. Very satisfied.", customerName: "Customer B.", verified: true },
      { quoteTitle: "Five stars", body: "Excellent experience from start to finish.", customerName: "Customer C.", verified: true },
    ],
  },
  featureHighlight: {
    title: "Why Choose Us",
    subtitle: "Quality and care.",
    items: [
      { imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", title: "Feature One", description: "Brief description of this feature or benefit." },
      { imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", title: "Feature Two", description: "Brief description of this feature or benefit." },
    ],
  },
  teamCarousel: {
    title: "Our Team",
    subtitle: "Meet the people behind our work.",
    members: [
      { imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80", name: "Team Member One", specialty: "Role", bioUrl: "#" },
      { imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80", name: "Team Member Two", specialty: "Role", bioUrl: "#" },
      { imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80", name: "Team Member Three", specialty: "Role", bioUrl: "#" },
    ],
  },
  patientFaq: {
    title: "Frequently Asked Questions",
    subtitle: "Common questions about our services.",
    items: [
      { question: "What should I expect?", answer: "Edit this in site-data. Add your answer here." },
      { question: "How do I get started?", answer: "Edit this in site-data. Add your answer here." },
      { question: "What are your hours?", answer: "Edit this in site-data. Add your answer here." },
    ],
  },
  freeConsultation: {
    headline: "Free Consultation",
    bullet1: "No obligation. We'll review and advise.",
    bullet2: "Quick response. Usually within one business day.",
    bullet3: "Your information is kept confidential.",
    formTitle: "Request a Consultation",
    namePlaceholder: "Full Name",
    emailPlaceholder: "Email",
    dropdownLabel: "Topic",
    dropdownOptions: ["Option 1", "Option 2", "Option 3", "Other"],
    buttonText: "Submit Request",
    buttonThankYou: "Request received.",
  },
  pricingTable: {
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the plan that's right for your business.",
    plans: [
      { name: "Free", price: "$0", description: "Perfect for trying out our services.", features: [{ text: "Basic Features", included: true }, { text: "Email Support", included: true }, { text: "Advanced Tools", included: false }], buttonText: "Start for Free" },
      { name: "Pro", price: "$49", description: "Essential features for growing teams.", isPopular: true, features: [{ text: "All Basic Features", included: true }, { text: "Priority Support", included: true }, { text: "Advanced Tools", included: true }], buttonText: "Get Started" },
      { name: "Enterprise", price: "$99", description: "Custom solutions for large scale.", features: [{ text: "Unlimited Everything", included: true }, { text: "Dedicated Manager", included: true }, { text: "Custom Integration", included: true }], buttonText: "Contact Sales" },
    ],
  },
  awardsStrip: {
    title: "Trusted & Recognized By",
    items: [
      { label: "Top Rated 2024", sublabel: "Industry Award", icon: "Award" },
      { label: "Verified Business", sublabel: "Trust Seal", icon: "ShieldCheck" },
      { label: "5-Star Service", sublabel: "Customer Choice", icon: "Star" },
      { label: "10k+ Clients", sublabel: "Community", icon: "Users" },
    ],
  },
  blog: {
    title: "Latest Insights",
    subtitle: "Stay updated with our latest news and expert advice.",
    posts: [
      {
        title: "5 Tips for Growing Your Business",
        excerpt: "Discover the essential strategies for scaling your operations effectively.",
        date: "Oct 24, 2024",
        category: "Growth",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      },
      {
        title: "The Future of Digital Innovation",
        excerpt: "How emerging technologies are reshaping the industry landscape.",
        date: "Oct 20, 2024",
        category: "Tech",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      },
      {
        title: "Maximizing Your ROI",
        excerpt: "Learn how to get the most value out of your investments.",
        date: "Oct 15, 2024",
        category: "Finance",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      },
    ],
  },
};

export type GenrePreset = {
  theme: ThemeKey;
  colorTheme: ColorThemeKey;
  typographyStyle?: string;
  activeSections: string[];
  content: PresetContent;
};

const LAWYER_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    title: "Dedicated Legal Defense You Can Trust.",
    subtitle: "Protecting your rights and securing your future with expert legal representation tailored to your case.",
    primaryCTA: "Free Consultation",
    secondaryCTA: "View Practice Areas",
    backgroundImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1080&q=80",
    trustSignals: ["AV Preeminent Rated", "Super Lawyers 2024", "Former Prosecutors"],
  },
  practiceAreas: {
    title: "Expertise You Can Depend On",
    subtitle: "We handle a wide range of legal matters with precision and care.",
    items: [
      { title: "Criminal Defense", description: "Vigorous defense for all felony and misdemeanor charges.", icon: "Gavel", href: "#" },
      { title: "Personal Injury", description: "Securing maximum compensation for your physical and emotional recovery.", icon: "Scale", href: "#" },
      { title: "Family Law", description: "Compassionate guidance through divorce, custody, and support matters.", icon: "ShieldCheck", href: "#" },
    ],
  },
};

const DENTIST_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    title: "A Brighter Smile Starts Here.",
    subtitle: "Experience modern, comfortable dentistry for the whole family in our state-of-the-art clinic.",
    primaryCTA: "Book Appointment",
    secondaryCTA: "Meet Our Team",
    backgroundImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1080&q=80",
    trustSignals: ["In-Network Provider", "Gentle Care", "Emergency Service"],
  },
  features: {
    title: "Our Dental Services",
    subtitle: "Comprehensive care for your oral health and aesthetic goals.",
    items: [
      { title: "General Dentistry", description: "Regular cleanings, fillings, and preventative care.", icon: "ShieldCheck" },
      { title: "Cosmetic Veneers", description: "Transform your smile with custom-crafted porcelain veneers.", icon: "Zap" },
      { title: "Emergency Care", description: "Same-day appointments for toothaches and dental trauma.", icon: "Clock" },
    ],
  },
};

const STARTUP_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    title: "Scale Your Business Faster Than Ever.",
    subtitle: "The all-in-one platform to automate your workflow, manage your team, and grow your revenue.",
    primaryCTA: "Start Free Trial",
    secondaryCTA: "Watch Demo",
    backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080&q=80",
    trustSignals: ["No Credit Card Required", "SOC2 Compliant", "24/7 Support"],
  },
  features: {
    title: "Built for Modern Teams",
    subtitle: "Powerful tools designed to simplify complex business operations.",
    items: [
      { title: "Smart Automation", description: "Automate repetitive tasks and focus on what matters.", icon: "Zap" },
      { title: "Real-time Analytics", description: "Deep insights into your performance and growth metrics.", icon: "ShieldCheck" },
      { title: "Secure Cloud", description: "Enterprise-grade security for all your sensitive data.", icon: "Shield" },
    ],
  },
};

const CLEANING_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    title: "Professional Cleaning for a Stress-Free Home.",
    subtitle: "Reliable, eco-friendly cleaning services that make your living space sparkle and shine.",
    primaryCTA: "Get a Quote",
    secondaryCTA: "Our Packages",
    backgroundImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1080&q=80",
    trustSignals: ["Eco-Friendly Products", "Background Checked", "100% Guaranteed"],
  },
};

const HVAC_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  heroEmergency: {
    title: "No Heat? No AC? We're on the Way!",
    subtitle: "Expert HVAC repair and installation available 24/7 for your home's comfort.",
    primaryCTA: "Emergency Dispatch",
    primaryCTAHref: "tel:+18005559999",
    secondaryCTA: "Book Maintenance",
    secondaryCTAHref: "#book",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1080",
  },
};

export const GENRE_PRESETS: Record<string, GenrePreset> = {
  lawyer: {
    theme: "lawyer",
    colorTheme: "partner",
    typographyStyle: "elegant",
    activeSections: ["hero", "awards", "practice-areas", "blog", "team-grid", "contact-split"],
    content: LAWYER_CONTENT,
  },
  pest_control: {
    theme: "pest-control",
    colorTheme: "reliable",
    typographyStyle: "bold",
    activeSections: ["hero", "features", "review-trust-bar", "contact"],
    content: GENERIC_CONTENT,
  },
  hvac: {
    theme: "pest-control",
    colorTheme: "frost-fire",
    typographyStyle: "technical",
    activeSections: ["hero-emergency", "how-it-works", "features", "review-trust-bar", "free-consultation", "contact"],
    content: HVAC_CONTENT,
  },
  dentist: {
    theme: "dentist",
    colorTheme: "wellness",
    typographyStyle: "clinical",
    activeSections: ["hero", "features", "team-carousel", "blog", "patient-faq", "contact"],
    content: DENTIST_CONTENT,
  },
  chiropractor: {
    theme: "chiropractor",
    colorTheme: "holistic",
    typographyStyle: "elegant",
    activeSections: ["hero", "features", "testimonials", "contact"],
    content: GENERIC_CONTENT,
  },
  clinic: {
    theme: "clinic",
    colorTheme: "clinical-gold",
    typographyStyle: "clinical",
    activeSections: ["hero", "awards", "features", "team-carousel", "faq-two-column", "contact"],
    content: GENERIC_CONTENT,
  },
  cleaning: {
    theme: "cleaning",
    colorTheme: "eco-clean",
    typographyStyle: "playful",
    activeSections: ["hero", "features", "review-trust-bar", "contact"],
    content: CLEANING_CONTENT,
  },
  pool: {
    theme: "pool",
    colorTheme: "surgeon",
    typographyStyle: "playful",
    activeSections: ["hero", "features", "how-it-works", "contact"],
    content: GENERIC_CONTENT,
  },
  startup: {
    theme: "startup",
    colorTheme: "flow",
    typographyStyle: "modern",
    activeSections: ["hero", "features-modern", "pricing", "blog", "reviews-grid", "contact"],
    content: STARTUP_CONTENT,
  },
};

export const GENRE_LABELS: Record<string, string> = {
  lawyer: "Lawyer",
  pest_control: "Pest Control",
  hvac: "HVAC / Plumber",
  dentist: "Dentist",
  chiropractor: "Chiropractor",
  clinic: "Clinic / Medical",
  cleaning: "Cleaning",
  pool: "Pool",
  startup: "Startup",
};
