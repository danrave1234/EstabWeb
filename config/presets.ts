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
  | "pest-control"
  | "real-estate-modern"
  | "before-after-split"
  | "industrial"
  | "clean-delivery"
  | "luxury-soft"
  | "academic-clean"
  | "hvac"
  | "before-after"
  | "hvac-blue"
  | "generic"
  | "personal-portfolio"
  | "ecommerce"
  | "photobooth"
  | "gym";

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
  | "navy-electric"
  | "dark-green-ivory"
  | "fiesta-red-yellow"
  | "barangay-blue"
  | "tropical-teal"
  | "luxury-black-gold"
  | "facebook-blue"
  | "nebula"
  | "flow"
  | "mono"
  | "gym-boutique"
  | "gym-hardcore"
  | "gym-functional";

export type PresetContent = {
  brand?: { name: string; logoUrl: string };
  hero?: Record<string, unknown> & {
    layout?: string;
    trustBadges?: { label: string; icon: string }[];
    promoText?: string;
    benefitText?: string;
    localCoverage?: string;
  };
  heroElegantCarousel?: {
    slides?: { title: string; subtitle: string; description: string; accent: string; imageUrl: string }[];
  };
  heroShowcase?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
    primaryCTAHref?: string;
    secondaryCTAHref?: string;
    imageUrl?: string;
    trustPoints?: string[];
    metrics?: { label: string; value: string }[];
  };
  heroModern?: {
    heading?: string;
    description?: string;
    button?: { text: string; url: string };
    reviews?: { count: number; avatars: { src: string; alt: string }[] };
  };
  heroGroupImages?: {
    badge?: string;
    title?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    image1?: string;
    image2?: string;
    image3?: string;
  };
  heroV6?: {
    badgeText?: string;
    badgeTag?: string;
    badgeHref?: string;
    title?: string;
    description?: string;
    emailPlaceholder?: string;
    buttonText?: string;
    features?: string[];
    imageDark?: string;
    imageLight?: string;
    showHeader?: boolean;
  };
  heroMinimalism?: {
    kicker?: string;
    title?: string;
    subtitle?: string;
    footerTag?: string;
    footerHeading?: string;
    footerDesc?: string;
  };
  features?: { title: string; subtitle: string; items: { title: string; description: string; icon: string }[] };
  featuresBento?: { title?: string; subtitle?: string; items: { title: string; description: string; icon?: string; eyebrow?: string }[] };
  testimonials?: Record<string, unknown>;
  animatedTestimonials?: {
    testimonials?: { quote: string; name: string; designation: string; src: string }[];
    autoplay?: boolean;
    className?: string;
  };
  testimonialsCommunity?: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    testimonials?: { id: number; name: string; role: string; company: string; content: string; rating: number; avatar: string }[];
    autoRotateInterval?: number;
    trustedCompanies?: string[];
    trustedCompaniesTitle?: string;
    className?: string;
  };
  testimonialsV2?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    items?: { text: string; image: string; name: string; role: string }[];
  };
  ctaBeams?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    inputPlaceholder?: string;
    showEmailInput?: boolean;
  };
  featureSteps?: {
    title?: string;
    features?: { step: string; title?: string; content: string; image: string }[];
    autoPlayInterval?: number;
  };
  featureSpotlight?: {
    label?: string;
    title1?: string;
    title2?: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
    imageUrl?: string;
    indexText?: string;
  };
  contact?: Record<string, unknown>;
  practiceAreas?: Record<string, unknown>;
  attorneyProfile?: Record<string, unknown>;
  heroEmergency?: Record<string, unknown>;
  howItWorks?: Record<string, unknown>;
  reviewTrustBar?: Record<string, unknown>;
  featureHighlight?: Record<string, unknown>;
  teamCarousel?: Record<string, unknown>;
  teamShowcase?: { members: { id: string; name: string; role: string; image: string; social?: { twitter?: string; linkedin?: string; instagram?: string; behance?: string } }[] };
  patientFaq?: Record<string, unknown>;
  freeConsultation?: Record<string, unknown>;
  pricingTable?: Record<string, unknown>;
  pricingComparisonTable?: {
    features?: { name: string; included: "starter" | "pro" | "all" | string | null }[];
    plans?: { name: string; level: "starter" | "pro" | "all" | string; price: { monthly: number; yearly: number }; popular?: boolean }[];
    defaultPlan?: "starter" | "pro" | "all" | string;
    defaultInterval?: "monthly" | "yearly";
    containerClassName?: string;
    buttonClassName?: string;
  };
  pricingSectionComparison?: {
    className?: string;
  };
  awardsStrip?: Record<string, unknown>;
  blog?: Record<string, unknown>;
  deliveryCoverage?: Record<string, unknown>;
  bookingCTA?: Record<string, unknown>;
  messengerStickyCTA?: Record<string, unknown>;
  serviceAreaMap?: Record<string, unknown>;
  beforeAfterSlider?: Record<string, unknown>;
  promoBannerStrip?: Record<string, unknown>;
  paymentOptionsStrip?: Record<string, unknown>;
  facebookReviewEmbed?: Record<string, unknown>;
  coverageRadiusBlock?: Record<string, unknown>;
  trustBadgesGrid?: { title?: string; subtitle?: string; items: { label: string; sublabel?: string; icon: string }[] };
  commonPests?: { title?: string; subtitle?: string; items: { name: string; icon: string }[] };
  treatmentProcess?: { title?: string; subtitle?: string; steps: { title: string; description: string; icon: string }[] };
  safety?: { title?: string; subtitle?: string; items: { title: string; description: string; icon: string }[] };
  warranty?: { title?: string; subtitle?: string; badgeText?: string; icon?: string };
  acTypes?: { title?: string; subtitle?: string; items: { name: string; icon: string; description: string }[] };
  pricePreview?: { title?: string; items: { service: string; price: string; note?: string }[] };
  emergencyCTA?: { title?: string; subtitle?: string; buttonText?: string; phone?: string };
  maintenancePlans?: { title?: string; subtitle?: string; plans: { name: string; price: string; period: string; description: string; features: string[]; isPopular?: boolean }[] };
  gymPrograms?: { title?: string; subtitle?: string; items: { name: string; tagline?: string; schedule?: string; coach?: string; intensity?: string; icon?: string }[] };
  gymSchedule?: { title?: string; subtitle?: string; days: { day: string; classes: { time: string; name: string; coach?: string; studio?: string }[] }[] };
  gymMemberships?: { title?: string; subtitle?: string; tiers: { name: string; price: string; period?: string; description?: string; perks: string[]; isPopular?: boolean; ctaLabel?: string; ctaHref?: string }[] };
  gymTrainers?: { title?: string; subtitle?: string; items: { name: string; role: string; specialty?: string; yearsExperience?: string; imageUrl?: string }[] };
  gymResults?: { title?: string; subtitle?: string; stories: { name: string; result: string; timeframe?: string; quote?: string; beforeImage?: string; afterImage?: string }[] };
  gymFacility?: { title?: string; subtitle?: string; items: { name: string; description?: string; icon?: string; imageUrl?: string }[] };
  gymClassTypes?: { title?: string; subtitle?: string; items: { name: string; duration?: string; level?: string; description?: string; icon?: string }[] };
  gymFaq?: { title?: string; subtitle?: string; items: { question: string; answer: string }[] };
  customHtml?: { title?: string; subtitle?: string; aiPrompt?: string; html?: string; css?: string };
  beforeAfterGallery?: { title?: string; subtitle?: string; items: { title: string; beforeImage: string; afterImage: string; description?: string }[] };
  gallery4?: { title?: string; description?: string; items: { id: string; title: string; description: string; href: string; image: string }[] };
  galleryGrid?: { badgeLabel?: string; title?: string; subtitle?: string; images: { id: number | string; url: string; title: string; category: string }[] };
  promoCTA?: { title?: string; subtitle?: string; promoBadge?: string; buttonText?: string; buttonHref?: string; phone?: string; countdownEndDate?: string; backgroundImage?: string };
  featuredListings?: { title?: string; subtitle?: string; viewDetailsLabel?: string; sqmLabel?: string; items: { title: string; location: string; price: string; imageUrl: string; beds: number; baths: number; sqm: number; tag?: string }[] };
  financing?: { title?: string; subtitle?: string; items: { title: string; description: string; icon: string; features: string[] }[] };
  developerPartners?: { title?: string; items: { name: string; logoUrl: string }[] };
  whyChooseMe?: { title?: string; subtitle?: string; agentName: string; agentRole: string; licenseNumber: string; agentBio: string; agentImageUrl: string; trustSignals: { label: string; icon: string }[] };
  productGrid?: { title?: string; subtitle?: string; items: { name: string; price: string; description?: string; imageUrl?: string; icon?: string; stock?: number | string; tag?: string; isPopular?: boolean }[] };
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
  heroShowcase: {
    badge: "Trusted by local businesses",
    title: "Launch a conversion-ready website in days, not months.",
    subtitle: "Purpose-built sections and practical editing tools for service businesses.",
    primaryCTA: "Start your site",
    secondaryCTA: "Explore sections",
    primaryCTAHref: "#contact",
    secondaryCTAHref: "#services",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400&q=80",
    trustPoints: ["No-code editing", "SEO-ready structure", "Fast mobile performance"],
    metrics: [
      { label: "Projects launched", value: "500+" },
      { label: "Avg. setup time", value: "3 days" },
      { label: "Client rating", value: "4.9/5" },
      { label: "Lead forms captured", value: "25k+" },
    ],
  },
  heroElegantCarousel: {
    slides: [
      { title: "Venetian Dusk", subtitle: "Autumn / Winter Collection", description: "Where ancient architecture meets the dying light — a palette drawn from terracotta, aged stone, and the shimmering canals of Venice at twilight.", accent: "#C4956A", imageUrl: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=900&h=1200&fit=crop&q=80" },
      { title: "Nordic Silence", subtitle: "Spring / Summer Collection", description: "Inspired by the vast stillness of Scandinavian fjords — clean lines, muted tones, and the quiet power of unadorned beauty.", accent: "#8BA7B8", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1200&fit=crop&q=80" },
      { title: "Kyoto Garden", subtitle: "Resort Collection", description: "Moss-covered pathways and paper lanterns — an ode to the meditative elegance of Japanese garden design and its timeless restraint.", accent: "#7A9E7E", imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1200&fit=crop&q=80" },
    ],
  },
  heroModern: {
    heading: "Professional Solutions for Your Local Business",
    description: "Get a modern, high-performance website that captures leads and grows your presence online. Built for reliability and speed.",
    button: { text: "Get Started Now", url: "/contact" },
    reviews: {
      count: 200,
      avatars: [
        { src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&q=80", alt: "Customer 1" },
        { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80", alt: "Customer 2" },
        { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&q=80", alt: "Customer 3" },
        { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&q=80", alt: "Customer 4" },
        { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&q=80", alt: "Customer 5" },
      ],
    },
  },
  heroGroupImages: {
    badge: "We're live!",
    title: "Streamline Your Business Operations Today",
    description: "Managing a local business is tough. Ditch the outdated methods and embrace a faster, more efficient way to grow your trade.",
    primaryButtonText: "Sign Up Now",
    primaryButtonHref: "/contact",
    secondaryButtonText: "Book a Demo",
    secondaryButtonHref: "#services",
    image1: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2024&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    image3: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
  },
  heroV6: {
    badgeText: "New",
    badgeTag: "Tailark Component Library",
    badgeHref: "#",
    title: "Production Ready Digital Marketing blocks",
    description: "Empower your business with modern, high-performance web sections built for conversion and speed. Easy to customize and deploy.",
    emailPlaceholder: "Your mail address",
    buttonText: "Get Started",
    features: ["Faster Performance", "Modern UI Design", "100% Customizable"],
    imageDark: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    imageLight: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2070&auto=format&fit=crop",
    showHeader: false,
  },
  features: {
    title: "Our Services",
    subtitle: "Quality and clarity guaranteed. Customize this content for your business.",
    items: [
      { title: "Criminal Defense", description: "Aggressive representation for all criminal charges, ensuring your rights are protected.", icon: "Gavel" },
      { title: "DUI & DWI", description: "Expert defense for driving under the influence charges to help you keep your license.", icon: "Shield" },
      { title: "Drug Crimes", description: "Comprehensive legal support for drug-related offenses, from possession to trafficking.", icon: "Scale" },
    ],
  },
  featuresBento: {
    title: "Services Built for Growth",
    subtitle: "Flexible blocks inspired by modern component systems, tuned for business websites.",
    items: [
      { title: "Lead Capture Funnels", description: "Turn visits into inquiries with clear calls-to-action and structured forms.", icon: "Target", eyebrow: "Conversion" },
      { title: "Fast Editing Workflow", description: "Update key sections from the dashboard and preview changes instantly.", icon: "PenTool", eyebrow: "Productivity" },
      { title: "SEO Foundations", description: "Built-in metadata controls and index-ready page structures.", icon: "Search", eyebrow: "Discovery" },
      { title: "Plan-Based Gating", description: "Enable premium capabilities per subscription tier with centralized checks.", icon: "ShieldCheck", eyebrow: "Monetization" },
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
  animatedTestimonials: {
    testimonials: [
      {
        quote:
          "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we have been looking for.",
        name: "Sarah Chen",
        designation: "Product Manager at TechFlow",
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
      },
      {
        quote:
          "Implementation was seamless and the results exceeded our expectations. The platform flexibility is remarkable.",
        name: "Michael Rodriguez",
        designation: "CTO at InnovateSphere",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
      },
      {
        quote:
          "This solution has significantly improved our team productivity. The intuitive interface makes complex tasks simple.",
        name: "Emily Watson",
        designation: "Operations Director at CloudScale",
        src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
      },
    ],
    autoplay: false,
    className: "",
  },
  testimonialsCommunity: {
    title: "Loved by Our Clients",
    subtitle: "Don't just take our word for it. Hear from businesses who have grown with us.",
    badgeText: "Trusted by businesses",
    testimonials: [
      {
        id: 1,
        name: "Alex Johnson",
        role: "Business Owner",
        company: "TechFlow",
        content: "The attention to detail and professional quality completely transformed our online presence. Worth every peso.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
      },
      {
        id: 2,
        name: "Sarah Miller",
        role: "Marketing Manager",
        company: "DesignHub",
        content: "Our leads doubled within the first month. The site looks professional and loads fast.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
      },
      {
        id: 3,
        name: "Michael Chen",
        role: "Operations Director",
        company: "InnovateLabs",
        content: "We were up and running in days. The editing tools are intuitive and the SEO foundation is solid.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
      },
    ],
    autoRotateInterval: 6000,
    trustedCompanies: [],
    trustedCompaniesTitle: "Trusted by businesses worldwide",
    className: "",
  },
  testimonialsV2: {
    badge: "Testimonials",
    title: "What our users say",
    subtitle: "Discover how thousands of teams streamline their operations with our platform.",
    items: [
      { text: "This platform revolutionized our operations, streamlining finance and inventory. The cloud-based system keeps us productive anywhere.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", name: "Briana Patton", role: "Operations Manager" },
      { text: "Implementing this solution was smooth and quick. The customizable, user-friendly interface made team training effortless.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150", name: "Bilal Ahmed", role: "IT Manager" },
      { text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our complete satisfaction.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150", name: "Saman Malik", role: "Customer Support Lead" },
      { text: "The seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface and power.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", name: "Omar Raza", role: "CEO" },
      { text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient and organized.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", name: "Zainab Hussain", role: "Project Manager" },
      { text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance remarkably.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150", name: "Aliza Khan", role: "Business Analyst" },
    ],
  },
  ctaBeams: {
    title: "Ready to get started?",
    subtitle: "Join hundreds of local businesses that launched their site with us. Fast setup, professional results.",
    ctaText: "Get Started",
    ctaHref: "#contact",
    inputPlaceholder: "Enter your email",
    showEmailInput: false,
  },
  featureSteps: {
    title: "How It Works",
    features: [
      {
        step: "Step 1",
        title: "Get in Touch",
        content: "Reach out to us and describe what you need. We'll get back to you within 24 hours with a clear plan.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
      },
      {
        step: "Step 2",
        title: "We Do the Work",
        content: "Our team takes care of everything — from planning to execution — so you can focus on running your business.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
      },
      {
        step: "Step 3",
        title: "See the Results",
        content: "You get a professional outcome you're proud of, on time and on budget. Guaranteed.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
      },
    ],
    autoPlayInterval: 4000,
  },
  featureSpotlight: {
    label: "Featured",
    title1: "Modern",
    title2: "Living",
    description: "Where architecture meets the natural world. Experience a new standard of contemporary design and comfort.",
    ctaText: "Explore",
    ctaHref: "#",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6191da9d0d?q=80&w=2070&auto=format&fit=crop",
    indexText: "01",
  },
  gallery4: {
    title: "Project Highlights",
    description: "A quick look at recent builds, upgrades, and client results.",
    items: [
      {
        id: "renovation-1",
        title: "Modern Kitchen Renovation",
        description: "A complete redesign focused on function, durability, and clean finishes.",
        href: "#contact",
        image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1080&q=80",
      },
      {
        id: "renovation-2",
        title: "Small Business Fit-Out",
        description: "Retail interior upgrade delivered on schedule with minimal downtime.",
        href: "#contact",
        image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1080&q=80",
      },
      {
        id: "renovation-3",
        title: "Residential Exterior Refresh",
        description: "Facade improvements that boosted curb appeal and long-term protection.",
        href: "#contact",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&q=80",
      },
      {
        id: "renovation-4",
        title: "Office Interior Revamp",
        description: "Workspace redesign with practical storage and cleaner circulation.",
        href: "#contact",
        image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1080&q=80",
      },
      {
        id: "renovation-5",
        title: "Outdoor Patio Upgrade",
        description: "Durable outdoor improvements built for comfort and long-term use.",
        href: "#contact",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1080&q=80",
      },
    ],
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
  customHtml: {
    title: "Custom Section",
    subtitle: "Generated with AI custom section builder.",
    aiPrompt: "",
    html: `<div class="grid gap-4 md:grid-cols-3">
  <article class="card">
    <h3>Fast Turnaround</h3>
    <p>Publish polished updates in minutes, not days.</p>
  </article>
  <article class="card">
    <h3>Built for Leads</h3>
    <p>Conversion-focused layout with clear next actions.</p>
  </article>
  <article class="card">
    <h3>Editable Anytime</h3>
    <p>Refine content quickly from your dashboard editor.</p>
  </article>
</div>`,
    css: `.custom-html-section .grid{display:grid;gap:1rem}
.custom-html-section .card{padding:1rem;border:1px solid var(--color-border);border-radius:12px;background:var(--color-muted)}
.custom-html-section h3{margin:0 0 .5rem;font-weight:700}
.custom-html-section p{margin:0;color:var(--color-muted-foreground)}
@media (min-width:768px){.custom-html-section .md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}`,
  },
  practiceAreas: {
    title: "Our Services",
    subtitle: "Tailored to your needs. Customize in site-data.",
    items: [
      { title: "Criminal Defense", description: "Aggressive representation for all criminal charges, ensuring your rights are protected.", icon: "Gavel", href: "#" },
      { title: "DUI & DWI", description: "Expert defense for driving under the influence charges to help you keep your license.", icon: "Shield", href: "#" },
      { title: "Drug Crimes", description: "Comprehensive legal support for drug-related offenses, from possession to trafficking.", icon: "Scale", href: "#" },
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
  teamShowcase: {
    members: [
      { id: "1", name: "Sarah Chen", role: "Director of Photography", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
      { id: "2", name: "Marcus Johnson", role: "Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
      { id: "3", name: "Elena Rodriguez", role: "Lead Front-End", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
      { id: "4", name: "David Kim", role: "Product Owner", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", social: { linkedin: "#" } },
      { id: "5", name: "Ana Cruz", role: "CTO & Product Designer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
      { id: "6", name: "Jemima Lee", role: "Creative Director", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80", social: { instagram: "#" } },
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
  pricingComparisonTable: {
    features: [
      { name: "Basic Analytics", included: "starter" },
      { name: "Up to 5 team members", included: "starter" },
      { name: "Basic support", included: "starter" },
      { name: "Advanced Analytics", included: "pro" },
      { name: "Up to 20 team members", included: "pro" },
      { name: "Priority support", included: "pro" },
      { name: "Custom integrations", included: "all" },
      { name: "Unlimited team members", included: "all" },
      { name: "24/7 phone support", included: "all" },
    ],
    plans: [
      { name: "Starter", level: "starter", price: { monthly: 15, yearly: 144 } },
      { name: "Pro", level: "pro", popular: true, price: { monthly: 49, yearly: 470 } },
      { name: "Enterprise", level: "all", price: { monthly: 99, yearly: 990 } },
    ],
    defaultPlan: "pro",
    defaultInterval: "monthly",
  },
  pricingSectionComparison: {
    className: "",
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
  messengerStickyCTA: {
    messengerUrl: "https://m.me/yourpage",
    viberNumber: "+639123456789",
    messengerLabel: "Chat on Messenger",
    viberLabel: "Book via Viber",
    callLabel: "Call Now",
  },
  serviceAreaMap: {
    title: "Our Service Areas",
    subtitle: "We proudly serve the following locations across Metro Cebu",
    cities: ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Liloan", "Consolacion"],
    mapEmbedUrl: "",
  },
  beforeAfterSlider: {
    title: "Seeing is Believing",
    subtitle: "Check out our amazing transformations",
    beforeImage: "https://images.unsplash.com/photo-1507133353243-30912e777745?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80",
    beforeLabel: "Before",
    afterLabel: "After",
  },
  promoBannerStrip: {
    text: "Limited Promo: Free Site Visit & Consultation This Month!",
    countdownDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    buttonText: "Claim Promo",
    buttonHref: "#contact",
  },
  paymentOptionsStrip: {
    title: "We Accept Payments via",
    methods: ["gcash", "maya", "bank", "cod"],
  },
  facebookReviewEmbed: {
    title: "Highly Rated on Facebook",
    subtitle: "See why our customers love us",
    reviews: [
      { author: "Juan Dela Cruz", text: "Excellent service! Highly recommended for their professional approach and quality work.", date: "2 weeks ago", rating: 5 },
      { author: "Maria Clara", text: "Best in the area. Very accommodating staff and reasonable prices.", date: "1 month ago", rating: 5 },
      { author: "Jose Rizal", text: "Very satisfied with the results. Will definitely book again.", date: "3 months ago", rating: 5 },
    ],
  },
  coverageRadiusBlock: {
    title: "Free Service Area",
    subtitle: "We offer free delivery and site visits within our primary zone.",
    radiusKm: 5,
    locationName: "Our Main Branch",
    note: "A minimal fee applies to locations outside the 5km radius.",
  },
  trustBadgesGrid: {
    title: "Why Trust Us?",
    subtitle: "We take pride in our professional standards and customer satisfaction.",
    items: [
      { label: "Licensed", sublabel: "Gov't Certified", icon: "ShieldCheck" },
      { label: "Insured", sublabel: "Total Protection", icon: "Lock" },
      { label: "Since 2015", sublabel: "Years of Expertise", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Customer Choice", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Served Locally", icon: "Users" },
    ],
  },
  featuredListings: {
    title: "Featured Properties",
    subtitle: "Discover the best real estate opportunities in the Philippines.",
    items: [
      { title: "Modern Condo Unit", location: "Makati City", price: "₱5,500,000", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", beds: 2, baths: 1, sqm: 45, tag: "Best Seller" },
      { title: "Family House & Lot", location: "Quezon City", price: "₱8,200,000", imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80", beds: 3, baths: 2, sqm: 120, tag: "New Listing" },
    ],
  },
  financing: {
    title: "Flexible Financing Options",
    subtitle: "We help you secure the best payment terms through our accredited partners.",
    items: [
      { title: "Pag-IBIG Fund", description: "Lower interest rates and longer payment terms for qualified members.", icon: "Home", features: ["Up to 30 years term", "Low interest rates", "Member benefits"] },
      { title: "Bank Financing", description: "Fast processing through our partner banks with competitive rates.", icon: "Building", features: ["Fast approval", "Flexible terms", "Major banks"] },
      { title: "In-House Financing", description: "Direct financing from the developer with minimal requirements.", icon: "Wallet", features: ["No bank hassle", "Minimal requirements", "Flexible terms"] },
    ],
  },
  developerPartners: {
    title: "Our Developer Partners",
    items: [
      { name: "SMDC", logoUrl: "https://placehold.co/200x100?text=SMDC" },
      { name: "Ayala Land", logoUrl: "https://placehold.co/200x100?text=Ayala" },
      { name: "Megaworld", logoUrl: "https://placehold.co/200x100?text=Megaworld" },
      { name: "Robinsons Land", logoUrl: "https://placehold.co/200x100?text=RLC" },
    ],
  },
  whyChooseMe: {
    title: "Why Choose Me",
    subtitle: "Your Trusted Real Estate Partner",
    agentName: "Juan Dela Cruz",
    agentRole: "Licensed Real Estate Broker",
    licenseNumber: "PRC #12345",
    agentBio: "With over 10 years of experience in the Philippine real estate market, I have helped hundreds of families find their perfect homes and smart investments.",
    agentImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    trustSignals: [
      { label: "PRC Licensed", icon: "Award" },
      { label: "10+ Years Exp", icon: "Clock" },
    ],
  },
  commonPests: {
    title: "Common Pests We Treat",
    subtitle: "Professional solutions for every type of infestation.",
    items: [
      { name: "Termites", icon: "Bug" },
      { name: "Cockroaches", icon: "Bug" },
      { name: "Rats & Mice", icon: "Bug" },
      { name: "Ants", icon: "Bug" },
      { name: "Bed Bugs", icon: "Bug" },
    ],
  },
  treatmentProcess: {
    title: "Our Treatment Process",
    subtitle: "A systematic approach to total pest elimination.",
    steps: [
      { title: "Inspection", description: "Thorough check of your property to identify pest types and nesting areas.", icon: "Search" },
      { title: "Treatment", description: "Application of safe, targeted solutions to eliminate the infestation.", icon: "ShieldCheck" },
      { title: "Follow-up", description: "Monitoring and secondary treatment to ensure long-term results.", icon: "RotateCw" },
      { title: "Warranty", description: "Your property is protected by our service guarantee.", icon: "Award" },
    ],
  },
  safety: {
    title: "Safe for Your Family & Pets",
    subtitle: "We use eco-friendly and low-toxicity treatments that are tough on pests but safe for your loved ones.",
    items: [
      { title: "Eco-Friendly", description: "Derived from natural ingredients where possible.", icon: "Leaf" },
      { title: "Odorless", description: "No harsh chemical smells after treatment.", icon: "Wind" },
      { title: "Pet Safe", description: "Tested and approved for use around domestic animals.", icon: "Dog" },
      { title: "Low Toxicity", description: "Meets strict safety standards for indoor use.", icon: "Shield" },
    ],
  },
  warranty: {
    title: "30-Day Service Warranty",
    subtitle: "If pests return within 30 days of treatment, we'll come back and re-treat your home at no extra cost.",
    badgeText: "Guaranteed Results",
    icon: "ShieldCheck",
  },
};

const REAL_ESTATE_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "PRC Broker #XXXXX", icon: "Award" },
      { label: "Insured", sublabel: "Transaction Bond", icon: "ShieldCheck" },
      { label: "Since 2018", sublabel: "PH Property Experts", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Happy Homeowners", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Successful Closings", icon: "Users" },
    ],
  },
  hero: {
    layout: "full-screen",
    benefitText: "Premium Real Estate",
    title: "Find Your Dream Home",
    subtitle: "Condo & House Listings with Bank and Pag-IBIG Financing.",
    localCoverage: "PRC Licensed Broker #XXXXX",
    primaryCTA: "View Available Units",
    secondaryCTA: "Book Free Site Visit",
    backgroundImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1080&q=80",
    trustSignals: ["PRC Licensed", "Pag-IBIG Financing Accepted", "Bank Support"],
  },
  featuredListings: {
    title: "Featured Properties",
    subtitle: "Handpicked listings from top developers across the PH.",
    items: [
      { title: "Modern Condo Unit", location: "Makati City", price: "₱5,500,000", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", beds: 2, baths: 1, sqm: 45, tag: "Best Seller" },
      { title: "Family House & Lot", location: "Quezon City", price: "₱8,200,000", imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80", beds: 3, baths: 2, sqm: 120, tag: "New Listing" },
      { title: "Investment Lot", location: "Cebu City", price: "₱2,500,000", imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", beds: 0, baths: 0, sqm: 300, tag: "High ROI" },
    ],
  },
  financing: {
    title: "Financing Options",
    subtitle: "We support multiple payment methods to suit your budget.",
    items: [
      { title: "Pag-IBIG Financing", description: "Ideal for long-term monthly installments with low interest rates.", icon: "Home", features: ["Low monthly", "Up to 30 years", "Gov't Backed"] },
      { title: "Bank Financing", description: "Competitive rates from major local banks (BPI, BDO, Metrobank).", icon: "Building", features: ["Fast approval", "Competitive rates", "Major banks"] },
      { title: "In-House Financing", description: "Direct payment to developer with minimal documentation required.", icon: "Wallet", features: ["No bank hassle", "Minimal docs", "Easy process"] },
    ],
  },
  developerPartners: {
    title: "Our Developer Partners",
    items: [
      { name: "SMDC", logoUrl: "https://placehold.co/200x100?text=SMDC" },
      { name: "Ayala Land", logoUrl: "https://placehold.co/200x100?text=Ayala" },
      { name: "Megaworld", logoUrl: "https://placehold.co/200x100?text=Megaworld" },
      { name: "Robinsons Land", logoUrl: "https://placehold.co/200x100?text=RLC" },
    ],
  },
  whyChooseMe: {
    agentName: "Maria Santos",
    agentRole: "Professional Real Estate Broker",
    licenseNumber: "PRC Broker License #98765",
    agentBio: "Helping you find the best property deals in Metro Manila. I specialize in condos and house & lots for families and investors.",
    agentImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    trustSignals: [
      { label: "PRC Licensed", icon: "Award" },
      { label: "DHSUD Registered", icon: "ShieldCheck" },
    ],
  },
};

const CAR_DETAILING_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "Registered Business", icon: "Award" },
      { label: "Insured", sublabel: "Service Warranty", icon: "ShieldCheck" },
      { label: "Since 2019", sublabel: "Detailing Masters", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "On Facebook", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Shiny Cars Served", icon: "Users" },
    ],
  },
  hero: {
    layout: "split",
    benefitText: "Premium Car Care",
    title: "Premium Ceramic Coating & Detailing.",
    subtitle: "Give your car the showroom shine it deserves. Professional care for your investment.",
    localCoverage: "Serving Metro Manila",
    primaryCTA: "₱3,999 limited offer",
    secondaryCTA: "View Our Work",
    backgroundImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1080&q=80",
    trustSignals: ["9H Ceramic Coating", "Facebook Reviews Embed", "Same Day Service"],
  },
  pricingTable: {
    title: "Detailing Packages",
    subtitle: "Choose the best protection for your vehicle.",
    plans: [
      { name: "Basic Wash", price: "₱1,500", description: "Deep clean and disinfection.", features: [{ text: "Vacuum & Wipe", included: true }, { text: "Steam Clean", included: true }, { text: "Coating", included: false }], buttonText: "Book Now" },
      { name: "Premium Detail", price: "₱3,999", description: "Complete interior and exterior care.", isPopular: true, features: [{ text: "Paint Correction", included: true }, { text: "Wax Protection", included: true }, { text: "Engine Wash", included: true }], buttonText: "Limited Offer" },
      { name: "Ceramic Pro", price: "₱12,000", description: "3-year paint protection.", features: [{ text: "9H Hardness", included: true }, { text: "Hydrophobic", included: true }, { text: "Warranty", included: true }], buttonText: "Get Protected" },
    ],
  },
  beforeAfterGallery: {
    title: "Before & After Results",
    subtitle: "See the transformation of our client vehicles.",
    items: [
      { title: "Tesla Model 3", description: "Paint correction and 3-year ceramic coating applied.", beforeImage: "https://images.unsplash.com/photo-1507133353243-30912e777745?w=800&q=80", afterImage: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80" },
      { title: "Toyota Fortuner", description: "Full interior detailing and engine wash.", beforeImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80", afterImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
      { title: "Honda Civic", description: "Headlight restoration and wax protection.", beforeImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80", afterImage: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=80" },
    ],
  },
  promoCTA: {
    title: "Claim Your ₱1,000 Voucher",
    subtitle: "First 10 customers today get an additional ₱1,000 off on Ceramic Pro packages.",
    promoBadge: "Limited Offer",
    buttonText: "Claim Voucher Now",
    backgroundImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=1200&q=80",
    countdownEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  serviceAreaMap: {
    title: "Our Location",
    subtitle: "Visit our shop in Quezon City or book a home service.",
    cities: ["Quezon City", "Pasig", "Makati", "Taguig", "Mandaluyong"],
  },
};

const CONSTRUCTION_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "PCAB Contractor", icon: "Award" },
      { label: "Insured", sublabel: "Worker Insurance", icon: "ShieldCheck" },
      { label: "Since 2012", sublabel: "Building Excellence", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Trusted Contractor", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Projects Completed", icon: "Users" },
    ],
  },
  hero: {
    layout: "industrial",
    title: "Reliable Construction & Renovation Services in Cebu",
    subtitle: "Free Site Visit & Detailed Quotation",
    primaryCTA: "Request Free Site Visit",
    secondaryCTA: "View Projects",
    backgroundImage: "https://images.unsplash.com/photo-1503387762-592dee58c460?w=1080&q=80",
    trustSignals: ["PCAB Licensed", "Free Estimates", "Quality Workmanship"],
    trustBadges: [
      { label: "PCAB Licensed", icon: "ShieldCheck" },
      { label: "10+ Years Experience", icon: "Clock" },
      { label: "200+ Projects", icon: "CheckCircle" },
    ],
  },
  features: {
    title: "Our Expertise",
    subtitle: "Quality construction services for residential and commercial needs.",
    items: [
      { title: "House Construction", description: "From foundation to finishing, we build your dream home.", icon: "Home" },
      { title: "Renovation", description: "Modernize your space with our expert renovation team.", icon: "Hammer" },
      { title: "Project Management", description: "Hassle-free construction with dedicated supervisors.", icon: "ClipboardCheck" },
    ],
  },
  awardsStrip: {
    title: "Our Certifications",
    items: [
      { label: "PCAB Licensed", sublabel: "Gov't Certified", icon: "ShieldCheck" },
      { label: "ISO Certified", sublabel: "Quality Standard", icon: "Award" },
      { label: "10+ Years Exp", sublabel: "Industry Leader", icon: "Clock" },
    ],
  },
};

const WATER_REFILLING_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    layout: "bright-clean",
    benefitText: "Pure & Safe",
    title: "Clean & Safe Drinking Water Delivered to Your Door",
    subtitle: "₱XX per Gallon | Free Delivery within 5km",
    localCoverage: "Free Delivery within 5km",
    primaryCTA: "Order Now via Messenger",
    secondaryCTA: "Learn More",
    backgroundImage: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1080&q=80",
    trustSignals: ["DOH Certified", "Regular Lab Testing", "UV Sterilized"],
  },
  pricingTable: {
    title: "Water Station Pricing",
    subtitle: "Affordable rates for your daily hydration needs.",
    plans: [
      { name: "Refill (Slim)", price: "₱25", description: "Standard 5-gallon slim container.", features: [{ text: "UV Sterilized", included: true }, { text: "Free Delivery", included: true }], buttonText: "Order Now" },
      { name: "Refill (Round)", price: "₱30", description: "Standard 5-gallon round container.", features: [{ text: "UV Sterilized", included: true }, { text: "Free Delivery", included: true }], buttonText: "Order Now" },
      { name: "New Container", price: "₱250", description: "Brand new 5-gallon container + first fill.", features: [{ text: "BPA Free", included: true }, { text: "High Quality", included: true }], buttonText: "Buy Now" },
    ],
  },
  deliveryCoverage: {
    title: "Delivery Coverage",
    subtitle: "We deliver to the following areas with a 2-gallon minimum.",
    areas: ["Barangay San Juan", "Barangay Holy Spirit", "Project 4", "East Fairview"],
  },
};

const SALON_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "DOH/FDA Certified", icon: "Award" },
      { label: "Insured", sublabel: "Client Protection", icon: "ShieldCheck" },
      { label: "Since 2017", sublabel: "Aesthetic Experts", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Top Rated Clinic", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Happy Transformations", icon: "Users" },
    ],
  },
  hero: {
    layout: "soft-luxury",
    title: "Glow with Confidence",
    subtitle: "Professional Skin & Aesthetic Treatments",
    promoText: "Valentine’s Promo – 20% Off",
    primaryCTA: "Book Consultation",
    secondaryCTA: "View Services",
    backgroundImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1080&q=80",
    trustSignals: ["Certified Estheticians", "GCash Accepted", "Instagram Verified"],
  },
  pricingTable: {
    title: "Our Services & Packages",
    subtitle: "Affordable luxury treatments tailored for you.",
    plans: [
      { name: "Hair Spa + Cut", price: "₱499", description: "Basic rejuvenation package.", features: [{ text: "Argan Oil Treatment", included: true }, { text: "Styling", included: true }], buttonText: "Book Now" },
      { name: "Glow Package", price: "₱1,299", description: "Facial + Diamond Peel.", isPopular: true, features: [{ text: "Skin Analysis", included: true }, { text: "Deep Cleansing", included: true }, { text: "Serum Infusion", included: true }], buttonText: "Limited Offer" },
      { name: "Full Glam", price: "₱2,500", description: "Hair, Makeup, and Nails.", features: [{ text: "High-end Products", included: true }, { text: "Expert Styling", included: true }, { text: "Lasts all day", included: true }], buttonText: "Get Glam" },
    ],
  },
  bookingCTA: {
    title: "Book Your Transformation",
    subtitle: "Promo ends in: 02:45:12",
    buttonText: "Schedule Now",
  },
};

const SCHOOL_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "DepEd Recognized", icon: "Award" },
      { label: "Insured", sublabel: "Student Safety", icon: "ShieldCheck" },
      { label: "Since 2010", sublabel: "Academic Excellence", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Parent Approved", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Graduates Produced", icon: "Users" },
    ],
  },
  hero: {
    layout: "structured-split",
    title: "Quality Education for Future Leaders",
    subtitle: "DepEd Recognized | Enrollment Open for SY 2026–2027",
    primaryCTA: "Enroll Now",
    secondaryCTA: "Download Prospectus",
    backgroundImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1080&q=80",
    trustSignals: ["DepEd Recognized", "Licensed Teachers", "Modern Facilities"],
    trustBadges: [
      { label: "98%", icon: "Passing Rate" },
      { label: "20+", icon: "Years" },
      { label: "Small", icon: "Class Size" },
    ],
  },
  features: {
    title: "Our Academic Programs",
    subtitle: "Comprehensive curriculum designed for student success.",
    items: [
      { title: "Preschool", description: "Play-based learning for early childhood development.", icon: "BookOpen" },
      { title: "Elementary", description: "Strong foundation in core subjects and values.", icon: "PenTool" },
      { title: "Tutorial Services", description: "One-on-one sessions for specialized subjects.", icon: "Users" },
    ],
  },
  pricingTable: {
    title: "Tuition & Fees",
    subtitle: "Transparent and flexible payment options.",
    plans: [
      { name: "Preschool", price: "₱25k / yr", description: "Nursery to Kinder.", features: [{ text: "Learning Materials", included: true }, { text: "Air-conditioned", included: true }], buttonText: "Enroll Now" },
      { name: "Elementary", price: "₱35k / yr", description: "Grades 1 to 6.", features: [{ text: "STEM Curriculum", included: true }, { text: "Sports Program", included: true }], buttonText: "Enroll Now" },
      { name: "Tutorial", price: "₱350 / hr", description: "Specialized tutoring.", features: [{ text: "All Subjects", included: true }, { text: "Mock Exams", included: true }], buttonText: "Book Session" },
    ],
  },
  awardsStrip: {
    title: "School Achievements",
    items: [
      { label: "100% Passing", sublabel: "Board Exams", icon: "GraduationCap" },
      { label: "Regional Champ", sublabel: "Math Olympiad", icon: "Trophy" },
      { label: "DepEd Level II", sublabel: "Accredited", icon: "Award" },
    ],
  },
};

export type GenrePreset = {
  theme: ThemeKey;
  colorTheme: ColorThemeKey;
  typographyStyle?: string;
  headerStyle?: string;
  footerStyle?: string;
  activeSections: string[];
  content: PresetContent;
};

const CLEANING_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "Registered Business", icon: "Award" },
      { label: "Insured", sublabel: "Total Liability", icon: "ShieldCheck" },
      { label: "Since 2016", sublabel: "Cleaning Pros", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Customer Choice", icon: "Star" },
      { label: "5000+ Houses", sublabel: "Cleaned Locally", icon: "Home" },
    ],
  },
  hero: {
    layout: "cleaning-fresh",
    benefitText: "Pure & Fresh",
    title: "A Cleaner Home, A Happier You.",
    subtitle: "₱XXX Starting Price | Professional cleaning services tailored to your needs.",
    localCoverage: "Serving Metro Manila & Nearby Cities",
    primaryCTA: "Book a Clean",
    secondaryCTA: "View Pricing",
    backgroundImage: "https://images.unsplash.com/photo-1581578731522-a2049ac899d3?w=1080&q=80",
    trustSignals: ["Certified Cleaners", "Eco-Friendly Products", "Same-Day Booking"],
  },
  pricingTable: {
    title: "Cleaning Packages",
    subtitle: "Transparent pricing with no hidden charges.",
    plans: [
      { name: "General Clean", price: "₱1,200", description: "Standard cleaning for small spaces.", features: [{ text: "Mopping & Vacuum", included: true }, { text: "Dusting", included: true }, { text: "Disinfection", included: false }], buttonText: "Book Now" },
      { name: "Deep Clean", price: "₱3,500", description: "Intensive cleaning for houses.", isPopular: true, features: [{ text: "Kitchen Degreasing", included: true }, { text: "Bathroom Scrubbing", included: true }, { text: "Mattress Vacuum", included: true }], buttonText: "Most Requested" },
      { name: "Post-Constru", price: "₱7,500", description: "Heavy-duty cleaning after works.", features: [{ text: "Debris Removal", included: true }, { text: "Stain Treatment", included: true }, { text: "Air Purifying", included: true }], buttonText: "Get Quote" },
    ],
  },
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


const HVAC_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    layout: "hvac-urgent",
    benefitText: "Free Estimate | No Hidden Charges",
    title: "AC Not Cooling? We Fix It Today.",
    subtitle: "24/7 HVAC Repair in Cebu",
    localCoverage: "Serving Cebu City, Mandaue & Lapu-Lapu",
    primaryCTA: "Call Now - 09XXXXXXXXX",
    secondaryCTA: "Book Maintenance",
    backgroundImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1080",
    trustBadges: [
      { label: "Licensed Technicians", icon: "ShieldCheck" },
      { label: "Same-Day Service", icon: "Clock" },
      { label: "5-Star Facebook Reviews", icon: "Star" },
      { label: "Since 2018", icon: "Award" },
    ],
  },
  acTypes: {
    title: "AC Types We Service",
    subtitle: "Professional expertise for all air conditioning units in the Philippines.",
    items: [
      { name: "Split-type", icon: "Snowflake", description: "Inverter and non-inverter wall-mounted units." },
      { name: "Window-type", icon: "Layout", description: "Standard and inverter window AC cleaning & repair." },
      { name: "Cassette", icon: "Grid", description: "Ceiling-mounted units for commercial and large spaces." },
      { name: "Central", icon: "Wind", description: "Ducted systems and floor-standing units." },
    ],
  },
  pricePreview: {
    title: "Affordable AC Services",
    items: [
      { service: "AC Cleaning", price: "₱1,500", note: "Starting from" },
      { service: "Check-up/Repair", price: "₱500", note: "Labor only" },
      { service: "Freon Charging", price: "₱1,200", note: "Per unit" },
    ],
  },
  emergencyCTA: {
    title: "Emergency AC Repair Service?",
    subtitle: "Our technicians are ready to assist you 24/7. Fast response guaranteed.",
    buttonText: "Call Now",
    phone: "09XXXXXXXXX",
  },
  maintenancePlans: {
    title: "AC Maintenance Plans",
    subtitle: "Ensure your AC runs efficiently all year round with our scheduled maintenance programs.",
    plans: [
      {
        name: "Semi-Annual",
        price: "₱2,800",
        period: "per year",
        description: "2 professional cleanings per year.",
        features: ["Full system cleaning", "Filter replacement", "Unit inspection", "Priority scheduling"],
      },
      {
        name: "Quarterly",
        price: "₱5,000",
        period: "per year",
        description: "4 professional cleanings per year.",
        isPopular: true,
        features: ["Everything in Semi-Annual", "Freon level check", "Condenser cleaning", "10% off on parts"],
      },
    ],
  },
  trustBadgesGrid: {
    items: [
      { label: "Licensed", sublabel: "DTI/SEC Registered", icon: "Award" },
      { label: "Insured", sublabel: "Service Protection", icon: "ShieldCheck" },
      { label: "Since 2018", sublabel: "Expert Technicians", icon: "Clock" },
      { label: "5-Star Reviews", sublabel: "Happy Clients", icon: "Star" },
      { label: "1000+ Clients", sublabel: "Units Repaired", icon: "Users" },
    ],
  },
};

const PERSONAL_PORTFOLIO_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  brand: { name: "Your Name", logoUrl: "https://placehold.co/80x80/1a2b3c/ffffff?text=YN" },
  hero: {
    layout: "full-screen",
    title: "Designer & Developer",
    subtitle: "I craft digital experiences and build products that people love.",
    primaryCTA: "View My Work",
    secondaryCTA: "Get in Touch",
    backgroundImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&q=80",
    trustSignals: ["Available for Hire", "Remote-Friendly", "10+ Projects"],
  },
  features: {
    title: "What I Do",
    subtitle: "Services and skills I bring to the table.",
    items: [
      { title: "Web Design", description: "Clean, modern interfaces and user-centered design.", icon: "Layout" },
      { title: "Development", description: "Fast, responsive sites and web applications.", icon: "Code" },
      { title: "Consulting", description: "Strategy and technical guidance for your product.", icon: "Lightbulb" },
    ],
  },
  featuredListings: {
    title: "Projects",
    subtitle: "A selection of work I've shipped. Design, code, and collaboration.",
    viewDetailsLabel: "View Project",
    sqmLabel: "stack",
    items: [
      { title: "E‑commerce Platform", location: "React, Node, PayMongo", price: "Web App", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", beds: 0, baths: 0, sqm: 0, tag: "Featured" },
      { title: "SaaS Dashboard", location: "Next.js, Tailwind", price: "Product", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", beds: 0, baths: 0, sqm: 0 },
      { title: "Mobile App Redesign", location: "Figma, Design System", price: "UI/UX", imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80", beds: 0, baths: 0, sqm: 0 },
    ],
  },
  contact: {
    tagline: "Let's work together.",
    formHeading: "Say Hello",
    formSubmitText: "Send",
    formThankYouText: "Thanks! I'll get back soon.",
    email: "hello@yourname.com",
    phone: "",
    address: "",
  },
};

const PHOTOBOOTH_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  brand: { name: "Your Photobooth", logoUrl: "https://placehold.co/80x80/ec4899/ffffff?text=PB" },
  hero: {
    layout: "soft-luxury",
    title: "Capture the Moment",
    subtitle: "Premium photobooth rentals for weddings, parties, and corporate events.",
    promoText: "Book Early – Save 10%",
    primaryCTA: "Book Now",
    secondaryCTA: "View Packages",
    backgroundImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&q=80",
    trustSignals: ["Same-Day Setup", "Unlimited Prints", "Props Included"],
  },
  trustBadgesGrid: {
    items: [
      { label: "500+ Events", sublabel: "Happy Clients", icon: "Camera" },
      { label: "5-Star Rated", sublabel: "Google & Facebook", icon: "Star" },
      { label: "Same-Day Setup", sublabel: "Professional Crew", icon: "Clock" },
      { label: "Unlimited Prints", sublabel: "No Hidden Fees", icon: "Image" },
    ],
  },
  features: {
    title: "Why Choose Us",
    subtitle: "Everything you need for a memorable photobooth experience.",
    items: [
      { title: "Custom Backdrops", description: "Match your theme with our range of backdrops and props.", icon: "Image" },
      { title: "Instant Prints", description: "Guests take home prints on the spot.", icon: "Printer" },
      { title: "Social Sharing", description: "Digital copies and hashtag printing available.", icon: "Share2" },
    ],
  },
  beforeAfterGallery: {
    title: "Gallery",
    subtitle: "See our setups from real events.",
    items: [
      { title: "Wedding", description: "Elegant setup", beforeImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", afterImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80" },
      { title: "Corporate", description: "Professional look", beforeImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", afterImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80" },
    ],
  },
  pricingTable: {
    title: "Packages",
    subtitle: "Transparent pricing for every event size.",
    plans: [
      { name: "Starter", price: "₱5,000", description: "2 hours, 100 prints.", features: [{ text: "Setup & teardown", included: true }, { text: "Props included", included: true }, { text: "Digital copies", included: false }], buttonText: "Book" },
      { name: "Popular", price: "₱8,000", description: "4 hours, unlimited prints.", isPopular: true, features: [{ text: "Setup & teardown", included: true }, { text: "Props + backdrop", included: true }, { text: "Digital copies", included: true }], buttonText: "Book" },
      { name: "Premium", price: "₱12,000", description: "6 hours, full package.", features: [{ text: "Everything in Popular", included: true }, { text: "Dedicated attendant", included: true }, { text: "Custom branding", included: true }], buttonText: "Inquire" },
    ],
  },
  contact: {
    tagline: "Reserve your date.",
    formHeading: "Book a Photobooth",
    formSubmitText: "Send Inquiry",
    formThankYouText: "We'll confirm within 24 hours.",
    email: "book@yourphotobooth.com",
    phone: "+63 912 345 6789",
    address: "Metro Manila",
  },
};

const PEST_CONTROL_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    layout: "split",
    benefitText: "Urgent Pest Response",
    title: "Don't Let Pests Take Over Your Home.",
    subtitle: "Eco-friendly, 24/7 emergency extermination services in Metro Manila.",
    localCoverage: "Serving Metro Manila & Nearby Areas",
    primaryCTA: "Call Now",
    secondaryCTA: "Free Inspection",
    backgroundImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1080&q=80",
    trustBadges: [
      { label: "Licensed Exterminators", icon: "Award" },
      { label: "30-Day Warranty", icon: "ShieldCheck" },
      { label: "Pet-Safe Products", icon: "Leaf" },
    ],
  },
  commonPests: {
    items: [
      { name: "Termites", icon: "Bug" },
      { name: "Cockroaches", icon: "Bug" },
      { name: "Rats", icon: "Bug" },
      { name: "Ants", icon: "Bug" },
      { name: "Bed Bugs", icon: "Bug" },
    ],
  },
};

const ECOMMERCE_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  hero: {
    title: "The Best Gadgets, Delivered to You.",
    subtitle: "Shop the latest tech and accessories with nationwide delivery and secure payments.",
    primaryCTA: "Shop Now",
    secondaryCTA: "New Arrivals",
    backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&q=80",
    trustSignals: ["Free Shipping", "7-Day Returns", "Secure Payments"],
  },
  productGrid: {
    title: "Featured Products",
    subtitle: "Handpicked deals just for you.",
    items: [
      { name: "Wireless Headphones", price: "₱2,499", description: "Noise-cancelling with 40-hour battery life.", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", stock: 15, tag: "Best Seller", isPopular: true },
      { name: "Smart Watch Series X", price: "₱4,990", description: "Fitness tracking and heart rate monitoring.", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", stock: 8, tag: "New" },
      { name: "Mechanical Keyboard", price: "₱3,200", description: "RGB lighting with tactile blue switches.", imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80", stock: 0, tag: "Out of Stock" },
      { name: "Portable Power Bank", price: "₱1,250", description: "20,000mAh high-capacity fast charging.", imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&q=80", stock: 25 },
    ],
  },
};

const GYM_BOUTIQUE_CONTENT: PresetContent = {
  ...GENERIC_CONTENT,
  brand: { name: "Atelier Strength Studio", logoUrl: "https://placehold.co/80x80/4c1d95/ffffff?text=AS" },
  hero: {
    layout: "boutique",
    title: "Personalized Coaching, Studio Energy.",
    subtitle: "Small-group strength sessions designed for busy professionals who want measurable results.",
    primaryCTA: "Book Intro Session",
    secondaryCTA: "See Schedule",
    benefitText: "Coach-Led Programs",
    localCoverage: "Open Daily 6AM - 10PM",
    promoText: "Free Movement Assessment",
    backgroundImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
  },
  gymPrograms: {
    title: "Signature Programs",
    subtitle: "Progressive tracks for strength, body composition, and functional performance.",
    items: [
      { name: "Strength Foundations", tagline: "Build confidence with form-first lifting.", schedule: "Mon/Wed/Fri - 6:00 PM", coach: "Coach Bea", intensity: "Beginner", icon: "Dumbbell" },
      { name: "Sculpt & Tone", tagline: "High-energy training for lean muscle and endurance.", schedule: "Tue/Thu/Sat - 7:00 AM", coach: "Coach Sam", intensity: "Intermediate", icon: "Flame" },
      { name: "Power Lab", tagline: "Advanced progressive overload cycles.", schedule: "Tue/Thu - 7:30 PM", coach: "Coach Nico", intensity: "Advanced", icon: "Zap" },
    ],
  },
  gymSchedule: {
    title: "Studio Class Flow",
    subtitle: "Reserve your slot and train with a consistent rhythm each week.",
    days: [
      { day: "Monday", classes: [{ time: "6:00 AM", name: "Functional Lift", coach: "Coach Bea", studio: "Main Floor" }, { time: "6:30 PM", name: "Sculpt Circuit", coach: "Coach Sam", studio: "Studio A" }] },
      { day: "Wednesday", classes: [{ time: "5:30 AM", name: "Athletic Conditioning", coach: "Coach Nico", studio: "Performance Zone" }, { time: "7:00 PM", name: "Strength Foundations", coach: "Coach Bea", studio: "Main Floor" }] },
      { day: "Saturday", classes: [{ time: "8:00 AM", name: "Weekend Burn", coach: "Coach Team", studio: "Studio A" }, { time: "10:00 AM", name: "Mobility Reset", coach: "Coach Aya", studio: "Recovery Room" }] },
    ],
  },
  gymMemberships: {
    title: "Membership Options",
    subtitle: "Flexible plans for every training frequency and coaching need.",
    tiers: [
      { name: "Essential", price: "PHP 2,200", period: "/month", description: "Best for 2 to 3 sessions weekly.", perks: ["Open gym access", "1 onboarding session", "Locker access"], ctaLabel: "Choose Essential", ctaHref: "#contact" },
      { name: "Signature", price: "PHP 3,800", period: "/month", description: "Unlimited classes and monthly progress checks.", perks: ["Unlimited group classes", "Monthly body composition scan", "Priority booking"], isPopular: true, ctaLabel: "Start Signature", ctaHref: "#contact" },
      { name: "Private Elite", price: "PHP 7,500", period: "/month", description: "Premium coaching and tailored programming.", perks: ["Weekly 1:1 coaching", "Custom plan updates", "Nutrition support"], ctaLabel: "Apply for Elite", ctaHref: "#contact" },
    ],
  },
  gymTrainers: {
    title: "Meet Your Coaches",
    subtitle: "Highly engaged coaches committed to form quality, progression, and accountability.",
    items: [
      { name: "Coach Mara", role: "Head Strength Coach", specialty: "Powerlifting & Fundamentals", yearsExperience: "8 years", imageUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&q=80" },
      { name: "Coach Nico", role: "Performance Coach", specialty: "Conditioning & Fat Loss", yearsExperience: "6 years", imageUrl: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=800&q=80" },
      { name: "Coach Aya", role: "Mobility Coach", specialty: "Recovery & Movement Quality", yearsExperience: "5 years", imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80" },
    ],
  },
  gymResults: {
    title: "Member Results",
    subtitle: "Progress stories from members who committed to structured training.",
    stories: [
      { name: "Anne P.", result: "-8kg and improved posture", timeframe: "12 weeks", quote: "I finally have a routine that I can sustain.", beforeImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=80", afterImage: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=700&q=80" },
      { name: "Carlo M.", result: "+35kg deadlift PR", timeframe: "16 weeks", quote: "The coaching cues and structure made a huge difference.", beforeImage: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=700&q=80", afterImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=80" },
    ],
  },
  gymFacility: {
    title: "Facility Highlights",
    subtitle: "Train in a clean, high-performance environment with complete equipment.",
    items: [
      { name: "Strength Zone", description: "Racks, platforms, and calibrated plates for serious lifting.", icon: "Dumbbell", imageUrl: "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=1000&q=80" },
      { name: "Conditioning Turf", description: "Sled lanes and functional equipment for high-intensity sessions.", icon: "Activity", imageUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1000&q=80" },
      { name: "Recovery Corner", description: "Stretching and mobility space to reduce soreness and injury risk.", icon: "HeartPulse", imageUrl: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1000&q=80" },
    ],
  },
  gymClassTypes: {
    title: "Class Types",
    subtitle: "Choose your class format by intensity, duration, and fitness objective.",
    items: [
      { name: "Strength 45", duration: "45 mins", level: "Beginner to Intermediate", description: "Foundational barbell and dumbbell work with coaching support.", icon: "Dumbbell" },
      { name: "MetCon 30", duration: "30 mins", level: "All Levels", description: "Short, efficient conditioning circuits for stamina and fat loss.", icon: "Flame" },
      { name: "Mobility Reset", duration: "40 mins", level: "All Levels", description: "Recovery-focused movement sessions for flexibility and joint health.", icon: "HeartPulse" },
    ],
  },
  gymFaq: {
    title: "Gym FAQs",
    subtitle: "Quick answers before your first session.",
    items: [
      { question: "Do I need prior gym experience?", answer: "No. We have beginner-friendly options and guided onboarding sessions." },
      { question: "Can I freeze my membership?", answer: "Yes, freeze policies depend on your selected membership plan." },
      { question: "Is there parking available?", answer: "Yes, we provide nearby parking options for members." },
    ],
  },
};

const GYM_HARDCORE_CONTENT: PresetContent = {
  ...GYM_BOUTIQUE_CONTENT,
  brand: { name: "Iron District Gym", logoUrl: "https://placehold.co/80x80/111827/ffffff?text=ID" },
  hero: {
    ...GYM_BOUTIQUE_CONTENT.hero,
    layout: "hardcore",
    title: "No Excuses. Just Work.",
    subtitle: "Heavy lifts, hard conditioning, and coaches that push your limits safely.",
    benefitText: "Powerlifting + Conditioning",
    promoText: "7-Day Trial Pass",
    backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
  },
};

const GYM_FUNCTIONAL_CONTENT: PresetContent = {
  ...GYM_BOUTIQUE_CONTENT,
  brand: { name: "Pulse Functional Club", logoUrl: "https://placehold.co/80x80/0f766e/ffffff?text=PF" },
  hero: {
    ...GYM_BOUTIQUE_CONTENT.hero,
    layout: "functional",
    title: "Move Better. Feel Stronger.",
    subtitle: "Functional training for mobility, stamina, and sustainable strength.",
    benefitText: "Mobility + Conditioning",
    promoText: "Free Intro Workout",
    backgroundImage: "https://images.unsplash.com/photo-1599058918144-1ffabb6ab9a0?w=1200&q=80",
  },
};

export const GENRE_PRESETS: Record<string, GenrePreset> = {
  gym_boutique: {
    theme: "gym",
    colorTheme: "gym-boutique",
    typographyStyle: "bold",
    activeSections: ["hero", "gym--programs", "gym--class-types", "gym--schedule", "gym--trainers", "gym--results", "gym--facility", "gym--memberships", "gym--faq", "testimonials", "contact"],
    content: GYM_BOUTIQUE_CONTENT,
  },
  gym_hardcore: {
    theme: "gym",
    colorTheme: "gym-hardcore",
    typographyStyle: "bold",
    activeSections: ["hero", "gym--programs", "gym--class-types", "gym--schedule", "gym--trainers", "gym--results", "gym--facility", "gym--memberships", "gym--faq", "testimonials", "contact"],
    content: GYM_HARDCORE_CONTENT,
  },
  gym_functional: {
    theme: "gym",
    colorTheme: "gym-functional",
    typographyStyle: "modern",
    activeSections: ["hero", "gym--programs", "gym--class-types", "gym--schedule", "gym--trainers", "gym--results", "gym--facility", "gym--memberships", "gym--faq", "testimonials", "contact-with-map"],
    content: GYM_FUNCTIONAL_CONTENT,
  },
  cleaning: {
    theme: "cleaning",
    colorTheme: "eco-clean",
    activeSections: ["hero", "trust-badges-grid", "features", "how-it-works", "pricing", "testimonials", "contact"],
    content: CLEANING_CONTENT,
  },
  lawyer: {
    theme: "lawyer",
    colorTheme: "partner",
    typographyStyle: "elegant",
    activeSections: ["hero", "awards", "practice-areas", "blog", "team-grid", "contact-with-map"],
    content: LAWYER_CONTENT,
  },
  pest_control: {
    theme: "pest-control",
    colorTheme: "reliable",
    typographyStyle: "bold",
    activeSections: ["hero", "common-pests", "treatment-process", "safety-section", "before-after-slider", "review-trust-bar", "warranty-block", "contact"],
    content: PEST_CONTROL_CONTENT,
  },
  hvac: {
    theme: "hvac",
    colorTheme: "frost-fire",
    typographyStyle: "technical",
    activeSections: ["hero", "ac-types-grid", "features", "price-preview-strip", "how-it-works", "reviews-grid", "emergency-cta-strip", "contact-with-map"],
    content: HVAC_CONTENT,
  },
  dentist: {
    theme: "dentist",
    colorTheme: "wellness",
    typographyStyle: "clinical",
    activeSections: ["hero", "features", "team-carousel", "blog", "patient-faq", "contact-with-map"],
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
    activeSections: ["hero", "awards", "features", "team-carousel", "faq-two-column", "contact-with-map"],
    content: GENERIC_CONTENT,
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
  real_estate: {
    theme: "real-estate-modern",
    colorTheme: "navy-electric",
    typographyStyle: "modern",
    activeSections: ["hero", "featured-properties-grid", "financing-section", "developer-partners", "why-choose-me", "testimonials", "contact-with-map"],
    content: REAL_ESTATE_CONTENT,
  },
  car_detailing: {
    theme: "before-after",
    colorTheme: "red-black",
    typographyStyle: "bold",
    activeSections: ["hero", "trust-badges-grid", "packages-pricing", "before-after-gallery-grid", "facebook-review-embed", "promo-cta-section", "service-area-map", "contact-with-map"],
    content: CAR_DETAILING_CONTENT,
  },
  construction: {
    theme: "industrial",
    colorTheme: "reliable",
    typographyStyle: "technical",
    activeSections: ["hero", "trust-badges-grid", "services-grid", "certifications", "testimonials", "free-consultation", "contact-with-map"],
    content: CONSTRUCTION_CONTENT,
  },
  water_refilling: {
    theme: "clean-delivery",
    colorTheme: "cyan-ocean",
    typographyStyle: "playful",
    activeSections: ["hero", "pricing", "delivery-coverage", "testimonials", "contact-with-map"],
    content: WATER_REFILLING_CONTENT,
  },
  salon_aesthetic: {
    theme: "luxury-soft",
    colorTheme: "dark-pink-white",
    typographyStyle: "elegant",
    activeSections: ["hero", "trust-badges-grid", "services-grid", "before-after-gallery", "testimonials", "pricing", "booking-cta", "contact-with-map"],
    content: SALON_CONTENT,
  },
  private_school: {
    theme: "academic-clean",
    colorTheme: "dark-green-ivory",
    typographyStyle: "traditional",
    activeSections: ["hero", "trust-badges-grid", "programs-grid", "awards", "faculty-grid", "enrollment-process", "faq", "contact"],
    content: SCHOOL_CONTENT,
  },
  personal_portfolio: {
    theme: "personal-portfolio",
    colorTheme: "navy-electric",
    typographyStyle: "modern",
    activeSections: ["hero", "features", "featured-properties-grid", "team-carousel", "reviews-grid", "contact"],
    content: PERSONAL_PORTFOLIO_CONTENT,
  },
  photobooth: {
    theme: "photobooth",
    colorTheme: "dark-pink-white",
    typographyStyle: "elegant",
    activeSections: ["hero", "trust-badges-grid", "features", "before-after-gallery-grid", "pricing", "contact"],
    content: PHOTOBOOTH_CONTENT,
  },
  ecommerce: {
    theme: "ecommerce",
    colorTheme: "modern",
    typographyStyle: "modern",
    activeSections: ["hero", "product-grid", "features", "testimonials", "contact"],
    content: ECOMMERCE_CONTENT,
  },
};

export const GENRE_LABELS: Record<string, string> = {
  gym_boutique: "Gym Boutique",
  gym_hardcore: "Gym Hardcore",
  gym_functional: "Gym Functional",
  lawyer: "Lawyer",
  pest_control: "Pest Control",
  hvac: "HVAC / Plumber",
  dentist: "Dentist",
  chiropractor: "Chiropractor",
  clinic: "Clinic / Medical",
  cleaning: "Cleaning",
  pool: "Pool",
  startup: "Startup",
  real_estate: "Real Estate (PH)",
  car_detailing: "Car Detailing",
  construction: "Construction (PH)",
  water_refilling: "Water Refilling (PH)",
  salon_aesthetic: "Salon / Aesthetic",
  private_school: "Private School (PH)",
  personal_portfolio: "Personal Portfolio",
  photobooth: "Photobooth",
  ecommerce: "E-commerce Shop",
};


