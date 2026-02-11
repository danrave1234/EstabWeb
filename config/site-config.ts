/**
 * SITE CONFIGURATION
 * This is the 'Source of Truth' for each client project.
 * Edit this file to rebrand the entire website instantly.
 */

export const siteConfig = {
  // 1. Brand Identity (use external image URLs or paths under public/)
  brand: {
    name: "Cebu Legal Partners",
    logoUrl:
      "https://placehold.co/80x80/030213/ffffff?text=CLP",
    favicon: "/favicon.ico",
    theme: "professional-navy", // Matches CSS variable themes in globals.css
  },

  // 2. Contact Information (Used in Header, Footer, and Contact Blocks)
  contact: {
    email: "contact@cebulegal.com",
    phone: "+63 912 345 6789",
    address: "123 Business Park, Cebu City, Philippines",
    googleMapsLink: "https://maps.google.com/...",
  },

  // 3. Navigation
  navigation: [
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
  ],

  // 4. Content Blocks (The 'Lego' Data)
  hero: {
    title: "Protecting Your Business with Integrity.",
    subtitle:
      "Affordable, fast, and reliable legal solutions for Cebuano startups and SMEs.",
    primaryCTA: "Book Free Consultation",
    secondaryCTA: "View Our Services",
    backgroundImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1080&q=80",
  },

  // Services / Features Grid (interchangeable block)
  servicesSection: {
    heading: "Our Services",
    subtitle:
      "Expert legal advice for startups and small businesses. Quality and clarity guaranteed.",
  },
  features: [
    {
      title: "Corporate Law",
      desc: "Helping you set up your business structure the right way.",
      icon: "Scale",
    },
    {
      title: "Contract Review",
      desc: "Fast turnarounds on legal documents to keep you moving.",
      icon: "FileText",
    },
    {
      title: "Dispute Resolution",
      desc: "Protecting your interests in and out of the courtroom.",
      icon: "ShieldCheck",
    },
  ],

  // Trust Bar (social proof) + featured testimonial
  trustBar: {
    label: "Trusted by industry leaders",
    logos: [
      { name: "Stripe", width: 120, logoUrl: "https://logo.clearbit.com/stripe.com" },
      { name: "Spotify", width: 100, logoUrl: "https://logo.clearbit.com/spotify.com" },
      { name: "Slack", width: 140, logoUrl: "https://logo.clearbit.com/slack.com" },
      { name: "Zoom", width: 110, logoUrl: "https://logo.clearbit.com/zoom.us" },
      { name: "Salesforce", width: 130, logoUrl: "https://logo.clearbit.com/salesforce.com" },
    ],
  },
  testimonial: {
    quote:
      "Cebu Legal Partners helped us structure our startup the right way. Professional, fast, and clear. We've closed three rounds with confidence.",
    author: "Maria Santos",
    role: "CEO, CebuTech Solutions",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=112&h=112&fit=crop&q=80",
    rating: 5,
  },

  // Lead Magnet Footer
  footer: {
    tagline:
      "Expert legal advice for startups and small businesses in Cebu. Get in touch.",
    formHeading: "Stay Connected",
    formSubmitText: "Submit",
    formThankYouText: "Thank you!",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
    privacyUrl: "#",
    termsUrl: "#",
    cookieUrl: "#",
  },

  // 5. SEO Metadata
  seo: {
    title: "Cebu Legal Partners | Top Business Lawyers in Cebu",
    description:
      "Expert legal advice for startups and small businesses in Cebu City.",
    keywords: ["lawyer", "cebu", "business law", "startup legal"],
  },
};

export type SiteConfig = typeof siteConfig;
