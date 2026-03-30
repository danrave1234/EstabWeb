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
  "gym-boutique": ["#4c1d95", "#f59e0b", "#faf5ff"],
  "gym-hardcore": ["#111827", "#ef4444", "#f9fafb"],
  "gym-functional": ["#0f766e", "#84cc16", "#f0fdfa"],
};

export const TYPOGRAPHY_OPTIONS = [
  { value: "elegant", label: "Elegant", fontFamily: "var(--font-source-sans-3), var(--font-playfair-display), Georgia, serif" },
  { value: "modern", label: "Modern", fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" },
  { value: "bold", label: "Bold", fontFamily: "var(--font-space-grotesk), var(--font-instrument-serif), Georgia, serif" },
  { value: "technical", label: "Technical", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" },
  { value: "clinical", label: "Clinical", fontFamily: "var(--font-geist-sans), var(--font-source-serif-4), Georgia, serif" },
  { value: "playful", label: "Playful", fontFamily: "var(--font-nunito), system-ui, sans-serif" },
  { value: "traditional", label: "Traditional", fontFamily: "var(--font-source-sans-3), var(--font-libre-baskerville), Georgia, serif" },
  { value: "lucky", label: "Luckiest Guy", fontFamily: "var(--font-luckiest-guy), system-ui, sans-serif" },
  { value: "display", label: "Display", fontFamily: "var(--font-bebas-neue), system-ui, sans-serif" },
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
export const DEFAULT_HERO = {
  title: "Welcome to [Brand Name]",
  subtitle: "We provide high-quality services for your needs in [City Name]. Contact us today for a free estimate.",
  primaryCTA: "Get Started",
  secondaryCTA: "Our Services",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#services",
  backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Trusted Local Business",
  benefitIcon: "Shield",
};

export const DEFAULT_HERO_EMERGENCY = {
  title: "Arrested? Call Us Now.",
  subtitle: "Don't speak to the police without representation. We are available 24/7.",
  primaryCTA: "Call Now: 555-0100",
  primaryCTAHref: "tel:555-0100",
  secondaryCTA: "Book Online",
  secondaryCTAHref: "#contact",
  imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
  icon: "Phone",
};

export const DEFAULT_HERO_SHOWCASE = {
  badge: "Trusted by local businesses",
  title: "Launch a conversion-ready website in days, not months.",
  subtitle: "Purpose-built sections, grounded layouts, and practical editing tools for service businesses.",
  primaryCTA: "Start your site",
  secondaryCTA: "Explore sections",
  primaryCTAHref: "#contact",
  secondaryCTAHref: "#services",
  imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  trustPoints: ["No-code editing", "SEO-ready structure", "Fast mobile performance"],
  metrics: [
    { label: "Projects launched", value: "500+" },
    { label: "Avg. setup time", value: "3 days" },
    { label: "Client rating", value: "4.9/5" },
    { label: "Lead forms captured", value: "25k+" },
  ],
};

export const DEFAULT_HERO_AERO_3 = {
  title: "Sustainable Solutions for a Better Future",
  subtitle: "Empowering businesses and communities to thrive in a low-carbon world through tailored clean energy solutions.",
  primaryCTA: "Start a Project",
  primaryCTAHref: "#contact",
  backgroundImage: "https://images.unsplash.com/photo-1466611653911-95282fc3656b?q=80&w=2070&auto=format&fit=crop",
};

export const DEFAULT_HERO_ELEGANT_CAROUSEL = {
  slides: [
    { title: "Venetian Dusk", subtitle: "Autumn / Winter Collection", description: "Where ancient architecture meets the dying light — a palette drawn from terracotta, aged stone, and the shimmering canals of Venice at twilight.", accent: "#C4956A", imageUrl: "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=900&h=1200&fit=crop&q=80" },
    { title: "Nordic Silence", subtitle: "Spring / Summer Collection", description: "Inspired by the vast stillness of Scandinavian fjords — clean lines, muted tones, and the quiet power of unadorned beauty.", accent: "#8BA7B8", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1200&fit=crop&q=80" },
    { title: "Kyoto Garden", subtitle: "Resort Collection", description: "Moss-covered pathways and paper lanterns — an ode to the meditative elegance of Japanese garden design and its timeless restraint.", accent: "#7A9E7E", imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=900&h=1200&fit=crop&q=80" },
    { title: "Saharan Gold", subtitle: "Capsule Collection", description: "The desert reveals its secrets at dawn — liquid gold spilling across endless dunes, textures carved by centuries of wind and time.", accent: "#D4A955", imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&h=1200&fit=crop&q=80" },
  ],
};

export const DEFAULT_HERO_MINIMALISM = {
  kicker: "Introducing",
  title: "Build fast.\nShip clean.",
  subtitle: "A minimal React starter focused on clarity, speed, and maintainability.",
  footerTag: "Designed for focus",
  footerHeading: "Composable. Accessible. Production-ready.",
  footerDesc: "Start with sensible defaults, ship without the noise, and scale your UI with confidence. Works across any app architecture.",
};

export const DEFAULT_HERO_MODERN = {
  heading: "Professional Solutions for Your Local Business",
  description: "Get a modern, high-performance website that captures leads and grows your presence online. Built for reliability and speed.",
  button: {
    text: "Get Started Now",
    url: "/contact",
  },
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
};

export const DEFAULT_HERO_GROUP_IMAGES = {
  badge: "We're live!",
  title: "This is the start of something!",
  description: "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
  primaryButtonText: "Sign up here",
  primaryButtonHref: "#",
  secondaryButtonText: "Jump on a call",
  secondaryButtonHref: "#",
  image1: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2024&auto=format&fit=crop",
  image2: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
  image3: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
};

export const DEFAULT_HERO_V6 = {
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
};

export const DEFAULT_HERO_V7 = {
  title: "We think, you grow — that's the deal",
  description: "We take your big ideas and turn them into clear, winning strategies. From setting up your company to scaling it worldwide, we're here every step of the way.",
  buttonText: "Get Template",
  backgroundImage: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a",
  stats: [
    { emoji: "🚀", label: "IN CLIENT REVENUE GENERATED", value: "$5M+" },
    { emoji: "📈", label: "BUSINESSES LAUNCHED", value: "200+" },
    { emoji: "💰", label: "SAVED IN OPERATIONAL COSTS", value: "$500K+" },
  ],
  teamAvatars: [
    { initials: "JD", src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a1.jpg" },
    { initials: "HJ", src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a2.jpg" },
    { initials: "PI", src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a3.jpg" },
    { initials: "KD", src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a4.jpg" },
    { initials: "LD", src: "https://res.cloudinary.com/doonkheo8/image/upload/v1770279333/a5.jpg" },
  ],
};

export const DEFAULT_FEATURES_V2 = {
  title: "Why business owners trust us",
  subtitle: "WHY CHOOSE US",
  description: "We don't just build websites; we build growth engines. Our unique approach combines data-driven strategy with world-class design.",
  ctaText: "Start Your Project",
  features: [
    {
      id: "1",
      title: "Fast Delivery",
      description: "We ship your project in record time without compromising quality.",
      icon: "zap",
      accentColor: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "2",
      title: "Premium Quality",
      description: "Every pixel is handcrafted by our expert designers.",
      icon: "star",
      accentColor: "bg-amber-500/10 text-amber-500",
    },
    {
      id: "3",
      title: "Secure & Reliable",
      description: "Built on enterprise-grade infrastructure for 99.9% uptime.",
      icon: "shield",
      accentColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "4",
      title: "Growth Focused",
      description: "Strategies designed to scale your business worldwide.",
      icon: "trending",
      accentColor: "bg-purple-500/10 text-purple-500",
    },
  ],
};

export const DEFAULT_HERO_CHIROPRACTOR = {
  title: "Live Life Without the Pain.",
  subtitle: "The most thorough adjustment you'll ever experience.",
  primaryCTA: "Book Your First Visit",
  secondaryCTA: "See Our 5-Star Reviews",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#reviews",
  backgroundImage: "https://images.unsplash.com/photo-1519824141121-b976743f025f?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Natural Pain Relief",
};

export const DEFAULT_HERO_DENTIST = {
  title: "A Smile You'll Love to Share.",
  subtitle: "Gentle, modern care for the whole family in [City Name].",
  primaryCTA: "Book Appointment",
  secondaryCTA: "Patient Gallery",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#gallery",
  imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Accepting New Patients",
};

export const DEFAULT_HERO_CLINIC = {
  title: "Advanced Care, Compassionate People.",
  subtitle: "Leading multi-specialty medical center dedicated to your family's health.",
  primaryCTA: "Find a Doctor",
  secondaryCTA: "Our Services",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#services",
  backgroundImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Professional Healthcare",
};

export const DEFAULT_HERO_CLEANING = {
  title: "A Cleaner Home, A Happier You.",
  subtitle: "Professional, reliable cleaning services tailored to your needs.",
  primaryCTA: "Get a Free Estimate",
  secondaryCTA: "View Pricing",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#pricing",
  singleImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Professional Cleaning",
};

export const DEFAULT_HERO_POOL = {
  title: "Perfectly Clear Water, All Season Long.",
  subtitle: "Weekly maintenance, chemical balancing, and equipment repair.",
  primaryCTA: "Schedule a Free Inspection",
  primaryCTAHref: "#inspection",
  backgroundImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Pool & Spa Services",
};

export const DEFAULT_HERO_PEST_CONTROL = {
  title: "Don't Let Pests Take Over Your Home.",
  subtitle: "Eco-friendly, 24/7 emergency extermination services.",
  primaryCTA: "Get a Free Estimate",
  secondaryCTA: "Bundle & Save",
  primaryCTAHref: "#estimate",
  secondaryCTAHref: "#pricing",
  backgroundImage: "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Rapid Response Team",
};

export const DEFAULT_HERO_LAWYER = {
  title: "Aggressive Criminal Defense in [City Name]",
  subtitle: "When your freedom is on the line, you need an experienced advocate fighting for you.",
  primaryCTA: "Free Consultation",
  secondaryCTA: "Our Results",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#results",
  backgroundImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop",
  benefitText: "Available 24/7 for Emergencies",
};

export const DEFAULT_HERO_GYM = {
  title: "Build Your Best Self.",
  subtitle: "Join the most supportive fitness community in [City Name].",
  primaryCTA: "Get a Free Pass",
  secondaryCTA: "View Classes",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#classes",
  backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  benefitText: "24/7 Access Available",
};

export const DEFAULT_HERO_STARTUP = {
  title: "Innovate Faster with [Brand Name].",
  subtitle: "The platform for high-growth teams to scale with confidence.",
  primaryCTA: "Try for Free",
  secondaryCTA: "Book a Demo",
  primaryCTAHref: "/contact",
  secondaryCTAHref: "#demo",
  backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
  benefitText: "No Credit Card Required",
};


export const DEFAULT_TRUST_BADGES = {
  title: "Recognized for Excellence",
  items: [
    { label: "Top 100 Trial Lawyers", sublabel: "National recognition", icon: "Award" },
    { label: "Super Lawyers", sublabel: "Selected consistently", icon: "Star" },
    { label: "10.0 Superb Rating", sublabel: "Avvo Rating", icon: "Check" },
    { label: "Client's Choice", sublabel: "Consistently highly rated", icon: "Users" },
  ],
};

export const DEFAULT_TEAM_CAROUSEL = {
  title: "Our Legal Team",
  subtitle: "Experienced, aggressive, and dedicated to your defense.",
  members: [
    { name: "John Doe, Esq.", specialty: "Lead Criminal Defense Attorney", imageUrl: "" },
    { name: "Jane Smith, Esq.", specialty: "DUI Defense Specialist", imageUrl: "" },
  ],
};

export const DEFAULT_TEAM_SHOWCASE = {
  members: [
    { id: "1", name: "Sarah Chen", role: "Director of Photography", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
    { id: "2", name: "Marcus Johnson", role: "Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
    { id: "3", name: "Elena Rodriguez", role: "Lead Front-End", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
    { id: "4", name: "David Park", role: "Product Owner", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", social: { linkedin: "#" } },
    { id: "5", name: "Alex Kim", role: "CTO & Product Designer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80", social: { twitter: "#", linkedin: "#" } },
    { id: "6", name: "Jordan Lee", role: "Creative Director", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80", social: { instagram: "#" } },
  ],
};

export const DEFAULT_ATTORNEY_PROFILE = {
  title: "Meet the Lead Attorney",
  subtitle: "Over 20 years of courtroom experience.",
  members: [
    { name: "John Doe, Esq.", specialty: "Managing Partner", imageUrl: "", bioUrl: "/about" },
  ],
};

export const DEFAULT_VERTICAL_TABS = {
  title: "How I can help you",
  subtitle: "SERVICES",
  services: [
    {
      id: "01",
      title: "Web Design",
      description: "Creating beautiful, functional, and user-centric digital experiences.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
    },
    {
      id: "02",
      title: "Framer Development",
      description: "Building high-performance, animated websites with Framer.",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200",
    },
    {
      id: "03",
      title: "Branding",
      description: "Defining your brand's visual identity and voice for a lasting impression.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    },
  ],
};

export const DEFAULT_PROMO_STRIP = {
  text: "Arrested? Don't wait. Call us immediately for a free, confidential case evaluation.",
  buttonText: "Call Now",
  buttonHref: "tel:555-0100",
};

export const DEFAULT_FREE_CONSULTATION = {
  title: "Get a Free Case Review",
  subtitle: "Fill out the form below and we will contact you immediately.",
  buttonText: "Request Evaluation",
};

export const DEFAULT_GUARANTEE = {
  title: "Our Commitment to You",
  subtitle: "We will fight tirelessly to protect your rights, your reputation, and your freedom.",
  badgeText: "Guaranteed",
  icon: "ShieldCheck",
  imageUrl: "",
};

export const DEFAULT_CONTACT = {
  title: "Contact Us Today",
  subtitle: "We're here to help. Reach out for a free consultation.",
  email: "info@examplelaw.com",
  leadNotificationEmail: "",
  phone: "555-0100",
  address: "123 Main St, Suite 100, CityName, State 12345",
  buttonText: "Send Message",
};

export const DEFAULT_AGENCY_CONTACT = {
  leadNotificationEmail: "",
  subtitle: "GET IN TOUCH",
  title: "Let's build something remarkable together",
  description: "We're always looking for new challenges and exciting projects. Drop us a line and let's start a conversation.",
  formHeading: "Send us a message",
  formButtonText: "Send Message",
  formThankYouText: "Message Sent! We'll be in touch soon.",
  infoHeading: "Contact Details",
  officeHours: "Mon - Fri, 9:00 AM - 6:00 PM",
  infoItems: [
    { id: "1", label: "Email", value: "hello@agency.com", icon: "mail", href: "mailto:hello@agency.com" },
    { id: "2", label: "Phone", value: "+63 912 345 6789", icon: "phone", href: "tel:+639123456789" },
    { id: "3", label: "Office", value: "BGC, Taguig, Metro Manila", icon: "map" },
  ],
  socials: [
    { id: "1", platform: "instagram", href: "#" },
    { id: "2", platform: "twitter", href: "#" },
    { id: "3", platform: "linkedin", href: "#" },
  ],
};

export const DEFAULT_CUSTOM_HTML_SECTION = {
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
};

export const DEFAULT_CTA = {
  title: "Ready to Build Your Defense?",
  subtitle: "Contact us today for a free, confidential consultation.",
  buttonText: "Contact Us",
  buttonHref: "/contact",
};

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

export const DEFAULT_CASE_STUDY_DETAIL = {
  title: "How We Delivered Results",
  subtitle: "A detailed look at how we solved a real client challenge",
  clientName: "Client Name",
  industry: "Industry",
  imageUrl: "",
  problem: "The client was struggling with inefficiencies in their existing workflow, leading to lost time and revenue.",
  solution: "We designed and implemented a tailored solution that addressed the root cause, streamlined operations, and aligned with the client's long-term goals.",
  results: "Within 90 days, the client saw a significant reduction in overhead and a marked improvement in customer satisfaction scores.",
  metrics: [
    { label: "Time Saved", value: "40%" },
    { label: "Revenue Growth", value: "2×" },
    { label: "Client Satisfaction", value: "98%" },
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

export const DEFAULT_AGENCY_BLOG = {
  subtitle: "JOURNAL",
  title: "Our Latest Insights & Stories",
  description: "Stay updated with our latest thoughts on design, technology, and the future of business.",
  ctaText: "View All Posts",
  posts: [
    {
      id: "1",
      title: "The Future of Digital Experiences in 2026",
      excerpt: "How AI and immersive technologies are reshaping the way we interact with brands and digital products.",
      category: "Insights",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
      date: "Mar 15, 2026",
      author: "Alex Rivera",
      readingTime: "5 min read",
    },
    {
      id: "2",
      title: "Mastering Minimalist Design Systems",
      excerpt: "A deep dive into creating scalable, clean, and functional design systems for modern agencies.",
      category: "Design",
      imageUrl: "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=1000&auto=format&fit=crop",
      date: "Mar 12, 2026",
      author: "Sarah Chen",
      readingTime: "8 min read",
    },
    {
      id: "3",
      title: "Why Speed is the Ultimate Feature",
      excerpt: "Exploring the technical and psychological impact of performance in modern web applications.",
      category: "Development",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      date: "Mar 10, 2026",
      author: "Marc Santos",
      readingTime: "6 min read",
    },
  ],
};

export const DEFAULT_AGENCY_PRODUCTS = {
  subtitle: "SHOP THE BEST",
  title: "Premium Collection",
  description: "Curated products designed for those who value quality and craftsmanship.",
  ctaText: "Add to Cart",
  categories: ["All", "Essentials", "Premium", "Limited"],
  items: [
    {
      id: "1",
      name: "Minimalist Leather Watch",
      price: "₱4,500",
      originalPrice: "₱5,200",
      description: "A timeless timepiece with a genuine Italian leather strap and brushed steel case.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
      category: "Premium",
      tag: "Best Seller",
      rating: 4.9,
      isNew: false,
      inStock: true,
    },
    {
      id: "2",
      name: "Studio Headphones Pro",
      price: "₱12,900",
      description: "Professional-grade wireless headphones with active noise cancellation and 40h battery life.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      category: "Limited",
      tag: "Limited Edition",
      rating: 4.8,
      isNew: true,
      inStock: true,
    },
    {
      id: "3",
      name: "Ceramic Coffee Set",
      price: "₱2,200",
      description: "Handcrafted ceramic set including two mugs and a matching pour-over dripper.",
      image: "https://images.unsplash.com/photo-1517254456976-ee8682099819?q=80&w=1000&auto=format&fit=crop",
      category: "Essentials",
      rating: 4.7,
      isNew: false,
      inStock: true,
    },
    {
      id: "4",
      name: "Technical Backpack 20L",
      price: "₱6,800",
      description: "Waterproof, lightweight backpack designed for the modern urban explorer.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
      category: "Essentials",
      rating: 4.9,
      isNew: true,
      inStock: true,
    },
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

export const DEFAULT_GALLERY4 = {
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
};

export const DEFAULT_GALLERY_GRID = {
  badgeLabel: "Gallery",
  title: "Our Portfolio",
  subtitle: "Explore our collection of stunning visuals and creative work",
  images: [
    { id: 1, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", title: "Abstract Architecture", category: "Architecture" },
    { id: 2, url: "https://images.unsplash.com/photo-1618556450994-a83a8bd57fbe?w=500", title: "Modern Design", category: "Design" },
    { id: 3, url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500", title: "Urban Landscape", category: "Nature" },
    { id: 4, url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500", title: "Digital Art", category: "Art" },
    { id: 5, url: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=500", title: "Creative Space", category: "Architecture" },
    { id: 6, url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500", title: "Minimalist View", category: "Design" },
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
  title: "Criminal Defense Expertise",
  subtitle: "Aggressive representation for your most challenging legal issues.",
  items: [
    { title: "Criminal Defense", description: "Aggressive representation for all criminal charges, ensuring your rights are protected.", icon: "Gavel", href: "#" },
    { title: "DUI & DWI", description: "Expert defense for driving under the influence charges to help you keep your license.", icon: "Shield", href: "#" },
    { title: "Drug Crimes", description: "Comprehensive legal support for drug-related offenses, from possession to trafficking.", icon: "Scale", href: "#" },
    { title: "White Collar Crime", description: "Sophisticated defense for complex financial and corporate criminal allegations.", icon: "Briefcase", href: "#" },
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

export const DEFAULT_TESTIMONIALS = {
  label: "What our customers say",
  logos: [],
  testimonial: {
    quote: "Great service. Professional and reliable. Highly recommend.",
    author: "Customer Name",
    role: "Customer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=112&h=112&fit=crop&q=80",
    rating: 5,
  },
};

export const DEFAULT_REVIEW_TRUST_BAR = {
  title: "What Our Customers Say",
  subtitle: "Real feedback from real people.",
  testimonials: [
    { quoteTitle: "Great service", body: "Professional and reliable.", customerName: "Customer A", verified: true },
  ],
};

export const DEFAULT_ANIMATED_TESTIMONIALS = {
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
};

export const DEFAULT_TESTIMONIALS_COMMUNITY = {
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
};

export const DEFAULT_TESTIMONIALS_V2 = {
  badge: "Testimonials",
  title: "What our users say",
  subtitle: "Discover how thousands of teams streamline their operations with our platform.",
  items: [
    {
      text: "This platform revolutionized our operations, streamlining finance and inventory. The cloud-based system keeps us productive anywhere.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Briana Patton",
      role: "Operations Manager",
    },
    {
      text: "Implementing this solution was smooth and quick. The customizable, user-friendly interface made team training effortless.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Bilal Ahmed",
      role: "IT Manager",
    },
    {
      text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our complete satisfaction.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Saman Malik",
      role: "Customer Support Lead",
    },
    {
      text: "The seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface and power.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Omar Raza",
      role: "CEO",
    },
    {
      text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient and organized.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Zainab Hussain",
      role: "Project Manager",
    },
    {
      text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance remarkably.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Aliza Khan",
      role: "Business Analyst",
    },
  ],
};

export const DEFAULT_FEATURE_STEPS = {
  title: "How It Works",
  features: [
    {
      step: "Step 1",
      title: "Get Started",
      content: "Sign up and set up your profile in minutes. Our onboarding process is simple and straightforward.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      step: "Step 2",
      title: "Customize Your Experience",
      content: "Choose from a wide range of options and tailor everything to fit your specific needs and preferences.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    },
    {
      step: "Step 3",
      title: "Achieve Your Goals",
      content: "Put everything into action and start seeing real results. Our team is here to support you every step of the way.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    },
  ],
  autoPlayInterval: 4000,
};

export const DEFAULT_FEATURE_SPOTLIGHT = {
  label: "Featured",
  title1: "Modern",
  title2: "Living",
  description: "Where architecture meets the natural world. Experience a new standard of contemporary design and comfort.",
  ctaText: "Explore",
  ctaHref: "#",
  imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
  indexText: "01",
};

export const DEFAULT_CTA_BEAMS = {
  title: "Ready to get started?",
  subtitle: "Join hundreds of local businesses that launched their site with us. Fast setup, professional results.",
  ctaText: "Get Started",
  ctaHref: "#contact",
  inputPlaceholder: "Enter your email",
  showEmailInput: false,
};

export const DEFAULT_FINANCING = {
  title: "Financing Options",
  subtitle: "Flexible payment terms.",
  items: [
    { title: "Option One", description: "Brief description.", icon: "Home", features: ["Feature 1", "Feature 2"] },
    { title: "Option Two", description: "Brief description.", icon: "Building", features: ["Feature 1"] },
  ],
};

export const DEFAULT_FEATURES = {
  title: "Our Services",
  subtitle: "Everything you need, all in one place.",
  items: [
    { title: "Criminal Defense", description: "Aggressive representation for all criminal charges.", icon: "Gavel", imageUrl: "" },
    { title: "DUI & DWI", description: "Expert defense for driving under the influence charges.", icon: "Shield", imageUrl: "" },
    { title: "Drug Crimes", description: "Comprehensive legal support for drug-related offenses.", icon: "Scale", imageUrl: "" },
    { title: "White Collar Crime", description: "Sophisticated defense for complex allegations.", icon: "Briefcase", imageUrl: "" },
  ],
};

export const DEFAULT_FEATURES_BENTO = {
  title: "Services Built for Growth",
  subtitle: "Flexible blocks inspired by modern component systems, tuned for business websites.",
  items: [
    { title: "Lead Capture Funnels", description: "Turn visits into inquiries with clear calls-to-action and structured forms.", icon: "Target", eyebrow: "Conversion" },
    { title: "Fast Editing Workflow", description: "Update key sections from the dashboard and preview changes instantly.", icon: "PenTool", eyebrow: "Productivity" },
    { title: "SEO Foundations", description: "Built-in metadata controls and index-ready page structures.", icon: "Search", eyebrow: "Discovery" },
    { title: "Plan-Based Gating", description: "Enable premium capabilities per subscription tier with centralized checks.", icon: "ShieldCheck", eyebrow: "Monetization" },
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
  analytics: {
    ga4Id: "",
    pixelId: "",
  },
};

export const FIELD_LABELS: Record<string, string> = {
  leadNotificationEmail: "Form notification email (optional — uses public email if empty)",
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
  ga4Id: "Google Analytics 4 ID (G-XXXXXXXXXX)",
  pixelId: "Facebook Pixel ID",
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
  title: "Affordable AC Services",
  transparentPricingNote: "No hidden charges. Transparent pricing guaranteed.",
  bookNowLabel: "Book Now",
  bookNowUrl: "#contact",
  items: [
    { service: "AC Cleaning", price: "₱1,500", note: "Starting from" },
    { service: "Check-up/Repair", price: "₱500", note: "Labor only" },
    { service: "Freon Charging", price: "₱1,200", note: "Per unit" },
  ],
};

export const DEFAULT_PRICING_TABLE = {
  title: "Simple Pricing",
  subtitle: "Choose the plan that fits.",
  plans: [
    { name: "Free", price: "₱0", description: "Get started for free.", features: [{ text: "Core features", included: true }, { text: "Analytics", included: false }], buttonText: "Get Started", isPopular: false },
    { name: "Starter", price: "₱499", description: "Best for small businesses starting online.", features: [{ text: "Everything in Free", included: true }, { text: "Simple visitor summary", included: true }, { text: "Custom domain", included: true }], buttonText: "Choose Starter", isPopular: false },
    { name: "Business", price: "₱999", description: "Best for growing businesses that want more customers.", features: [{ text: "Everything in Starter", included: true }, { text: "Deeper visitor insights", included: true }, { text: "Google visibility help", included: true }], buttonText: "Choose Business", isPopular: true },
  ],
};

export const DEFAULT_PRICING_COMPARISON_TABLE = {
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
    { name: "Business", level: "pro", popular: true, price: { monthly: 49, yearly: 470 } },
    { name: "Enterprise", level: "all", price: { monthly: 99, yearly: 990 } },
  ],
  defaultPlan: "pro",
  defaultInterval: "monthly",
  containerClassName: "",
  buttonClassName: "",
};

export const DEFAULT_PRICING_SECTION_COMPARISON = {
  className: "",
  badge: "Pricing",
  title: "Prices that make sense!",
  subtitle: "Managing a small business today is already tough. We made it simple.",
  plans: [
    {
      name: "Startup",
      price: "$40",
      description: "Great for small teams just getting started.",
      buttonLabel: "Try it",
      buttonVariant: "outline",
      ctaUrl: "#contact",
    },
    {
      name: "Growth",
      price: "$80",
      description: "Everything you need to scale your business.",
      buttonLabel: "Try it",
      buttonVariant: "default",
      ctaUrl: "#contact",
    },
    {
      name: "Enterprise",
      price: "$120",
      description: "Custom solutions for large organizations.",
      buttonLabel: "Contact us",
      buttonVariant: "outline",
      ctaUrl: "#contact",
    },
  ],
  features: [
    { name: "SSO", values: [true, true, true] },
    { name: "AI Assistant", values: [false, true, true] },
    { name: "Version Control", values: [false, true, true] },
    { name: "Members", values: ["5 members", "25 members", "100+ members"] },
    { name: "Multiplayer Mode", values: [false, true, true] },
    { name: "Orchestration", values: [false, true, true] },
  ],
};

export const DEFAULT_MAINTENANCE_PLANS = {
  title: "Maintenance Plans",
  subtitle: "Keep your systems running smoothly.",
  signUpNowUrl: "#contact",
  plans: [
    { name: "Basic", price: "₱2,800", period: "/year", description: "2 visits per year.", features: ["Inspection", "Cleaning"], isPopular: false },
    { name: "Premium", price: "₱5,000", period: "/year", description: "4 visits per year.", features: ["Everything in Basic", "Priority service"], isPopular: true },
  ],
};

export const DEFAULT_GYM_PROGRAMS = {
  title: "Programs Built for Real Progress",
  subtitle: "Choose your training track and work with coaches who keep your momentum high.",
  items: [
    { name: "Strength Foundations", tagline: "Technique-first lifting for beginners.", schedule: "Mon/Wed/Fri - 6:00 PM", coach: "Coach Mara", intensity: "Beginner", icon: "Dumbbell" },
    { name: "Hypertrophy Lab", tagline: "Muscle-building splits with smart volume.", schedule: "Tue/Thu/Sat - 7:30 PM", coach: "Coach Nico", intensity: "Intermediate", icon: "Flame" },
    { name: "Athletic Conditioning", tagline: "Speed, power, and stamina circuits.", schedule: "Mon/Thu - 5:30 AM", coach: "Coach Lea", intensity: "Advanced", icon: "Zap" },
  ],
};

export const DEFAULT_GYM_SCHEDULE = {
  title: "Class Schedule",
  subtitle: "Book your week in advance and train with structure.",
  days: [
    {
      day: "Monday",
      classes: [
        { time: "6:00 AM", name: "Functional Strength", coach: "Coach Gio", studio: "Main Floor" },
        { time: "6:30 PM", name: "Lower Body Build", coach: "Coach Mara", studio: "Strength Room" },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        { time: "5:30 AM", name: "MetCon Express", coach: "Coach Lea", studio: "Performance Zone" },
        { time: "7:00 PM", name: "Upper Body Power", coach: "Coach Nico", studio: "Main Floor" },
      ],
    },
    {
      day: "Saturday",
      classes: [
        { time: "8:00 AM", name: "Community Bootcamp", coach: "Coach Team", studio: "Open Turf" },
        { time: "10:00 AM", name: "Mobility + Recovery", coach: "Coach Aya", studio: "Recovery Studio" },
      ],
    },
  ],
};

export const DEFAULT_GYM_MEMBERSHIPS = {
  title: "Membership Tiers",
  subtitle: "Transparent plans for casual training, focused progress, and full coaching support.",
  tiers: [
    {
      name: "Starter",
      price: "PHP 1,990",
      period: "/month",
      description: "For members training 2 to 3 times weekly.",
      perks: ["Gym floor access", "Intro assessment", "Locker access"],
      ctaLabel: "Start Starter Plan",
      ctaHref: "#contact",
    },
    {
      name: "Performance",
      price: "PHP 3,490",
      period: "/month",
      description: "Ideal for serious training and coached classes.",
      perks: ["Unlimited class entry", "Monthly progress check", "Nutrition starter guide"],
      isPopular: true,
      ctaLabel: "Choose Performance",
      ctaHref: "#contact",
    },
    {
      name: "Elite Coaching",
      price: "PHP 6,990",
      period: "/month",
      description: "High-accountability coaching and personalized programming.",
      perks: ["1:1 weekly coaching", "Custom training plan", "Priority class slots"],
      ctaLabel: "Apply for Elite",
      ctaHref: "#contact",
    },
  ],
};

export const DEFAULT_GYM_TRAINERS = {
  title: "Meet Your Coaches",
  subtitle: "Certified trainers focused on safe progress and measurable performance improvements.",
  items: [
    { name: "Coach Mara", role: "Head Strength Coach", specialty: "Powerlifting & Form Correction", yearsExperience: "8 years", imageUrl: "" },
    { name: "Coach Nico", role: "Conditioning Coach", specialty: "Fat Loss & Athletic Conditioning", yearsExperience: "6 years", imageUrl: "" },
    { name: "Coach Aya", role: "Mobility Specialist", specialty: "Recovery, Mobility, Injury Prevention", yearsExperience: "5 years", imageUrl: "" },
  ],
};

export const DEFAULT_GYM_RESULTS = {
  title: "Member Results",
  subtitle: "Transformation stories from consistent coaching and structured programming.",
  stories: [
    { name: "Anne P.", result: "-8kg and stronger core", timeframe: "12 weeks", quote: "The coaches made every session clear and motivating.", beforeImage: "", afterImage: "" },
    { name: "Carlo M.", result: "+35kg deadlift PR", timeframe: "16 weeks", quote: "Programming was progressive and easy to follow.", beforeImage: "", afterImage: "" },
  ],
};

export const DEFAULT_GYM_FACILITY = {
  title: "Facility Highlights",
  subtitle: "Purpose-built training zones and amenities that support performance and consistency.",
  items: [
    { name: "Strength Floor", description: "Olympic bars, racks, platforms, and calibrated plates.", icon: "Dumbbell", imageUrl: "" },
    { name: "Conditioning Turf", description: "Sled tracks, battle ropes, and HIIT equipment.", icon: "Activity", imageUrl: "" },
    { name: "Recovery Zone", description: "Mobility tools and guided cooldown space.", icon: "HeartPulse", imageUrl: "" },
  ],
};

export const DEFAULT_GYM_CLASS_TYPES = {
  title: "Class Types",
  subtitle: "Find the right class format based on your current level and fitness goals.",
  items: [
    { name: "Strength 45", duration: "45 mins", level: "Beginner to Intermediate", description: "Technique-based compound lifts with progressive loading.", icon: "Dumbbell" },
    { name: "MetCon 30", duration: "30 mins", level: "All Levels", description: "High-efficiency conditioning sessions to build endurance.", icon: "Flame" },
    { name: "Mobility Reset", duration: "40 mins", level: "All Levels", description: "Recovery-focused sessions to improve movement quality.", icon: "HeartPulse" },
  ],
};

export const DEFAULT_GYM_FAQ = {
  title: "Gym FAQs",
  subtitle: "Answers to the most common membership and class questions.",
  items: [
    { question: "Do I need prior gym experience?", answer: "No. Our beginner-friendly programs include onboarding and movement coaching." },
    { question: "Can I freeze my membership?", answer: "Yes, you can freeze your membership based on your selected plan policy." },
    { question: "What should I bring for my first session?", answer: "Bring water, training shoes, and comfortable workout clothes." },
  ],
};

export const DEFAULT_FACEBOOK_REVIEW_EMBED = {
  title: "Highly Rated on Facebook",
  subtitle: "See why our customers love us",
  facebookUrl: "https://facebook.com",
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
  mapEmbedUrl: "",
};

export const DEFAULT_CONTACT_WITH_MAP = {
  title: "Visit Our Office",
  subtitle: "We're conveniently located and ready to welcome you.",
  email: "",
  leadNotificationEmail: "",
  phone: "",
  address: "",
  mapEmbedUrl: "",
  formHeading: "Send us a Message",
  formSubmitText: "Send Message",
  formThankYouText: "Message Sent!",
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
    'hero--showcase': 'heroShowcase',
    'hero-showcase': 'heroShowcase',
    'hero--aero-3': 'heroAero3',
    'hero--minimalism': 'heroMinimalism',
    'hero--elegant-carousel': 'heroElegantCarousel',
    'hero--modern': 'heroModern',
    'hero--group-images': 'heroGroupImages',
    'hero--v6': 'heroV6',
    'hero--v7': 'heroV7',
    'hero--generic': 'hero',
    'hero--lawyer': 'hero',
    'hero--dentist': 'hero',
    'hero--clinic': 'hero',
    'hero--gym': 'hero',
    'hero--startup': 'hero',
    'hero--chiropractor': 'hero',
    'hero--cleaning': 'hero',
    'hero--pool': 'hero',
    'hero--pest-control': 'hero',
    'hero--real-estate-modern': 'hero',
    'hero--before-after-split': 'hero',
    'hero--industrial': 'hero',
    'hero--clean-delivery': 'hero',
    'hero--luxury-soft': 'hero',
    'hero--academic-clean': 'hero',
    'hero--hvac': 'hero',
    'hero--hvac-blue': 'hero',
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
    'pricing--comparison': 'pricingComparisonTable',
    'pricing--feature-comparison': 'pricingSectionComparison',
    'packages-pricing': 'pricingTable',
    'pricing-comparison-table': 'pricingComparisonTable',
    'pricing-section-with-comparison': 'pricingSectionComparison',
    'awards': 'awardsStrip',
    'certifications': 'awardsStrip',
    'contact-minimal': 'contact',
    'contact-visual': 'contact',
    'contact-with-map': 'contactWithMap',
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
    'announcement_bar': 'promoBannerStrip',
    'announcement_bar--promo': 'promoBannerStrip',
    'announcement_bar--emergency': 'promoBannerStrip',
    'announcement_bar--offer': 'promoBannerStrip',
    'payment-options-strip': 'paymentOptionsStrip',
    'facebook-review-embed': 'facebookReviewEmbed',
    'coverage-radius-block': 'coverageRadiusBlock',
    'stats-section': 'statsSection',
    'faq-accordion': 'faqAccordion',
    // ── canonical IDs (new architecture) ──────────────────────────────────────
    'faq': 'faqAccordion',
    'faq--two-column': 'patientFaq',
    'gallery': 'beforeAfterGallery',
    'gallery--slider': 'beforeAfterSlider',
    'gallery--carousel': 'gallery4',
    'gallery--grid': 'galleryGrid',
    'blog_preview': 'blog',
    'blog--agency': 'blogAgency',
    'process': 'howItWorks',
    'process--timeline': 'treatmentProcess',
    'specialty_listings': 'featuredListings',
    'comparison': 'acTypes',
    'price_preview': 'pricePreview',
    'service_area': 'serviceAreaMap',
    'service_area--radius': 'deliveryCoverage',
    'contact_with_map': 'contactWithMap',
    'logo_cloud': 'logoCloud',
    'gym--programs': 'gymPrograms',
    'gym--schedule': 'gymSchedule',
    'gym--memberships': 'gymMemberships',
    'gym--trainers': 'gymTrainers',
    'gym--results': 'gymResults',
    'gym--facility': 'gymFacility',
    'gym--class-types': 'gymClassTypes',
    'gym--faq': 'gymFaq',
    'testimonials': 'testimonials',
    'testimonials--grid': 'reviewTrustBar',
    'testimonials--animated': 'animatedTestimonials',
    'testimonials--community': 'testimonialsCommunity',
    'testimonials--v2': 'testimonialsV2',
    'testimonials--facebook': 'facebookReviewEmbed',
    'stats': 'statsSection',
    'case_study': 'beforeAfterGallery',
    'case_study--detail': 'caseStudyDetail',
    'cta': 'promoCTA',
    'cta--banner': 'promoCTA',
    'cta--beams': 'ctaBeams',
    'features--steps': 'featureSteps',
    'features--spotlight': 'featureSpotlight',
    'cta--sticky': 'messengerStickyCTA',
    'promo_cta': 'promoCTA',
    'enrollment-process': 'howItWorks',
    'product_grid': 'features',
    'trust_badges': 'trustBadgesGrid',
    'payment_options': 'paymentOptionsStrip',
    'logo-cloud': 'logoCloud',
    'trust-badges-grid': 'trustBadgesGrid',
    'featured-properties-grid': 'featuredListings',
    'financing-section': 'financing',
    'developer-partners': 'developerPartners',
    'why-choose-me': 'whyChooseMe',
    'features': 'features',
    'features-modern': 'features',
    'services-grid': 'features',
    'services--bento': 'featuresBento',
    'services-bento': 'featuresBento',
    'services': 'features',
    'services--modern': 'features',
    'services--vertical-tabs': 'verticalTabs',
    'services--features-v2': 'featuresV2',
    'services--highlight': 'featureHighlight',
    'service_detail': 'featureHighlight',
    'service_detail--split': 'featureHighlight',
    'project-gallery': 'features',
    'programs-grid': 'features',
    'faculty-grid': 'features',
    // canonical IDs — trust & social proof
    // canonical IDs — team
    'team': 'teamCarousel',
    'team--carousel': 'teamCarousel',
    'team--showcase': 'teamShowcase',
    'team--profile': 'attorneyProfile',
    'team--spotlight': 'whyChooseMe',
    // canonical IDs — comparison
    'comparison--table': 'acTypes',
    'comparison--vs': 'acTypes',
    // canonical IDs — gallery / case study
    // (canonical IDs for case_study already defined above)
    // canonical IDs — CTA
    'cta--emergency': 'emergencyCTA',
    'cta--promo-strip': 'promoBannerStrip',
    // canonical IDs — booking / lead / consultation
    'booking': 'bookingCTA',
    'lead_capture': 'freeConsultation',
    'lead_capture--multi-step': 'freeConsultation',
    'free_consultation': 'freeConsultation',
    'custom-html': 'customHtml',
    // canonical IDs — payment / guarantee / contact
    'guarantee': 'warranty',
    'guarantee--badge': 'warranty',
    'guarantee--safety': 'warranty',
    'contact--minimal': 'contact',
    'contact--visual': 'contact',
    'contact--with-map': 'contactWithMap',
    'contact--columns': 'contact',
    'contact--split': 'contact',
    'contact--agency': 'contactAgency',
    'products--agency': 'productsAgency',
    // canonical IDs — hero variant
    'hero--emergency': 'heroEmergency',
    // canonical IDs — stats
    'delivery-coverage': 'deliveryCoverage',
    'booking-cta': 'bookingCTA',
    'footer': 'footer',
    'contact': 'contact',
    'navigation': 'navigation',
    'legal': 'legal',
    'pages': 'pages'
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
    'hero--generic': 'Standard Hero',
    'hero-emergency': 'Emergency Hero',
    'hero--showcase': 'Showcase Hero',
    'hero--aero-3': 'Aero Hero 3',
    'hero--minimalism': 'Minimalist Hero',
    'hero--elegant-carousel': 'Elegant Carousel Hero',
    'hero--modern': 'Modern Hero',
    'hero--group-images': 'Group Images Hero',
    'hero--v6': 'Tailark Hero',
    'hero--v7': 'Stats & Team Hero',
    'hero--lawyer': 'Lawyer Hero',
    'hero--dentist': 'Dentist Hero',
    'hero--clinic': 'Clinic Hero',
    'hero--gym': 'Gym Hero',
    'hero--startup': 'Startup Hero',
    'hero--chiropractor': 'Chiropractor Hero',
    'hero--cleaning': 'Cleaning Hero',
    'hero--pool': 'Pool Hero',
    'hero--pest-control': 'Pest Control Hero',
    'hero--real-estate-modern': 'Real Estate Hero',
    'hero--before-after-split': 'Transformation Hero',
    'hero--industrial': 'Industrial Hero',
    'hero--clean-delivery': 'Delivery Hero',
    'hero--luxury-soft': 'Luxury Hero',
    'hero--academic-clean': 'Academic Hero',
    'hero--hvac': 'HVAC Hero',
    'hero--hvac-blue': 'HVAC Pro Hero',
    'practice-areas': 'Practice Areas',
    'attorney-profile': 'Attorney Profile',
    'free-consultation': 'Free Consultation',
    'how-it-works': 'How It Works',
    'review-trust-bar': 'Reviews & Trust',
    'feature-highlight': 'Feature Highlight',
    'team-carousel': 'Team Carousel',
    'team-grid': 'Team Grid',
    'team--showcase': 'Team Showcase',
    'patient-faq': 'FAQ Section',
    'faq-two-column': 'Two-Column FAQ',
    'reviews-grid': 'Reviews Grid',
    'pricing': 'Pricing Table',
    'pricing--comparison': 'Pricing Comparison',
    'pricing--feature-comparison': 'Pricing Feature Comparison',
    'packages-pricing': 'Packages & Pricing',
    'pricing-comparison-table': 'Pricing Comparison',
    'pricing-section-with-comparison': 'Pricing Feature Comparison',
    'awards': 'Awards Strip',
    'certifications': 'Certifications',
    'contact-minimal': 'Minimal Contact',
    'contact-visual': 'Visual Contact',
    'contact-with-map': 'Contact w/ Map',
    'contact_with_map': 'Contact w/ Map',
    'contact-columns': 'Contact Columns',
    'contact--agency': 'Agency Contact',
    'products--agency': 'Agency Products',
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
    'faq': 'FAQ Accordion',
    'faq--two-column': 'Two-Column FAQ',
    'gallery': 'Before & After Gallery',
    'gallery--slider': 'Before & After Slider',
    'gallery--carousel': 'Gallery Carousel',
    'gallery--grid': 'Gallery Grid',
    'blog_preview': 'Blog Preview',
    'blog--agency': 'Agency Blog',
    'process': 'How It Works',
    'process--timeline': 'Treatment Process',
    'specialty_listings': 'Featured Listings',
    'comparison': 'AC Types / Comparison',
    'price_preview': 'Price Preview',
    'service_area': 'Service Area Map',
    'service_area--radius': 'Delivery Coverage',
    'logo_cloud': 'Logo Cloud',
    'testimonials': 'Reviews & Trust',
    'testimonials--grid': 'Reviews Grid',
    'testimonials--animated': 'Animated Testimonials',
    'testimonials--community': 'Community Testimonials',
    'testimonials--v2': 'Scrolling Testimonials',
    'testimonials--facebook': 'Facebook Reviews',
    'stats': 'Stats & Metrics',
    'case_study': 'Case Study',
    'case_study--detail': 'Case Study Detail',
    'cta': 'CTA Banner',
    'cta--banner': 'CTA Banner',
    'cta--sticky': 'Sticky CTA',
    'promo_cta': 'Promo CTA',
    'enrollment-process': 'Enrollment Process',
    'product_grid': 'Product Grid',
    'trust_badges': 'Trust Badges',
    'payment_options': 'Payment Options',
    'logo-cloud': 'Logo Cloud',
    'gym--programs': 'Gym Programs',
    'gym--schedule': 'Gym Schedule',
    'gym--memberships': 'Membership Tiers',
    'gym--trainers': 'Gym Trainers',
    'gym--results': 'Results Stories',
    'gym--facility': 'Facility Highlights',
    'gym--class-types': 'Class Types',
    'gym--faq': 'Gym FAQ',
    'trust-badges-grid': 'Trust Badges',
    'featured-properties-grid': 'Featured Listings',
    'financing-section': 'Financing Section',
    'developer-partners': 'Partners',
    'why-choose-me': 'Why Choose Us',
    'features': 'Features Section',
    'features--spotlight': 'Feature Spotlight',
    'services--vertical-tabs': 'Vertical Tabs',
    'services--features-v2': 'Agency Features',
    'services--bento': 'Services Bento',
    'features-modern': 'Modern Features',
    'services-grid': 'Services Grid',
    'project-gallery': 'Project Gallery',
    'programs-grid': 'Programs Grid',
    'faculty-grid': 'Faculty Grid',
    'delivery-coverage': 'Delivery Coverage',
    'booking-cta': 'Booking CTA',
    'custom-html': 'AI Custom Section',
    'footer': 'Footer Settings',
    'contact': 'Contact Info',
    'navigation': 'Navigation Menu',
    'legal': 'Legal Pages',
    'pages': 'Site Pages'
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

export const DEFAULT_STATS_SECTION = {
  title: "By the Numbers",
  subtitle: "Trusted by clients across the region.",
  items: [
    { label: "Happy Clients", value: "500+", icon: "Users" },
    { label: "Years Experience", value: "10+", icon: "Award" },
    { label: "Projects Done", value: "1.2k", icon: "Check" },
    { label: "Support", value: "24/7", icon: "Phone" },
  ],
  variant: "cards",
};

export const DEFAULT_PAYMENT_OPTIONS_STRIP = {
  title: "We Accept Payments via",
  methods: [
    { name: "gcash" },
    { name: "maya" },
    { name: "bank" },
    { name: "cod" },
  ],
};

export const DEFAULT_PROMO_CTA_SECTION = {
  title: "Exclusive Promo — Limited Time!",
  subtitle: "Book your slot now and get a special discount on all packages.",
  promoBadge: "Limited Offer",
  buttonText: "Claim My Discount",
  buttonHref: "#contact",
  phone: "",
  countdownEndDate: "",
  backgroundImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=1200&q=80",
  daysLabel: "Days",
  hoursLabel: "Hours",
  minsLabel: "Mins",
  secsLabel: "Secs",
};

export const DEFAULT_BEFORE_AFTER_SLIDER = {
  title: "Seeing is Believing",
  subtitle: "Check out our amazing transformations.",
  beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  afterImage: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80",
  beforeLabel: "Before",
  afterLabel: "After",
};

export const DEFAULT_FEATURE_HIGHLIGHT_ZIGZAG = {
  title: "Why Choose Us",
  subtitle: "A few reasons our clients keep coming back.",
  items: [
    {
      icon: "CheckCircle",
      title: "Quality Results",
      description: "We deliver premium quality on every project, no shortcuts.",
    },
    {
      icon: "Clock",
      title: "Fast Turnaround",
      description: "We respect your time and always deliver on schedule.",
    },
    {
      icon: "HeartHandshake",
      title: "Dedicated Support",
      description: "Our team is available to assist you every step of the way.",
    },
  ],
};

export const DEFAULT_PATIENT_FAQ = {
  title: "Frequently Asked Questions",
  subtitle: "Got questions? We've got answers.",
  items: [
    {
      question: "What should I expect on my first visit?",
      answer: "Your first visit includes a full consultation and assessment. We'll discuss your goals and create a personalized plan for you.",
    },
    {
      question: "How long does a session last?",
      answer: "Sessions typically last 45 to 60 minutes depending on the service you choose.",
    },
    {
      question: "Do I need a referral?",
      answer: "No referral is needed. You can book directly with us online or by phone.",
    },
    {
      question: "What are your payment options?",
      answer: "We accept cash, major credit cards, GCash, and bank transfer.",
    },
  ],
};


