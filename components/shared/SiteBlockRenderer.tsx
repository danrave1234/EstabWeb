import { dynamicWithSkeleton } from "@/lib/utils/dynamic";
import React from "react";

import FloatingCTA from "@/components/shared/FloatingCTA";
import SiteEditorSidebar from "@/components/shared/SiteEditorSidebar";

// Header
const Header = dynamicWithSkeleton(() => import("@/components/shared/Header"), { className: "h-20" });

// Hero blocks
const HeroAuthority = dynamicWithSkeleton(() => import("@/components/blocks/HeroAuthority"), { className: "h-[600px]" });
const HeroSaas = dynamicWithSkeleton(() => import("@/components/blocks/HeroSaas"), { className: "h-[600px]" });
const HeroChiropractor = dynamicWithSkeleton(() => import("@/components/blocks/HeroChiropractor"), { className: "h-[600px]" });
const HeroDentist = dynamicWithSkeleton(() => import("@/components/blocks/HeroDentist"), { className: "h-[600px]" });
const HeroClinic = dynamicWithSkeleton(() => import("@/components/blocks/HeroClinic"), { className: "h-[600px]" });
const HeroCleaning = dynamicWithSkeleton(() => import("@/components/blocks/HeroCleaning"), { className: "h-[600px]" });
const HeroPool = dynamicWithSkeleton(() => import("@/components/blocks/HeroPool"), { className: "h-[600px]" });
const HeroPestControl = dynamicWithSkeleton(() => import("@/components/blocks/HeroPestControl"), { className: "h-[600px]" });
const HeroEmergency = dynamicWithSkeleton(() => import("@/components/blocks/HeroEmergency"), { className: "h-[400px]" });
const HeroBlock = dynamicWithSkeleton(() => import("@/components/blocks/HeroBlock"), { className: "h-[600px]" });

// Content blocks
const FeaturesGrid = dynamicWithSkeleton(() => import("@/components/blocks/FeaturesGrid"), { className: "h-[500px]" });
const TrustBar = dynamicWithSkeleton(() => import("@/components/blocks/TrustBar"), { className: "h-24" });
const PricingTable = dynamicWithSkeleton(() => import("@/components/blocks/PricingTable"), { className: "h-[600px]" });
const AwardsStrip = dynamicWithSkeleton(() => import("@/components/blocks/AwardsStrip"), { className: "h-32" });
const ContactForm = dynamicWithSkeleton(() => import("@/components/blocks/ContactForm"), { className: "h-[600px]" });
const ContactSplit = dynamicWithSkeleton(() => import("@/components/blocks/ContactSplit"), { className: "h-[600px]" });
const ContactMinimal = dynamicWithSkeleton(() => import("@/components/blocks/ContactMinimal"), { className: "h-[500px]" });
const ContactVisual = dynamicWithSkeleton(() => import("@/components/blocks/ContactVisual"), { className: "h-[600px]" });
const ContactWithMap = dynamicWithSkeleton(() => import("@/components/blocks/ContactWithMap"), { className: "h-[600px]" });
const ContactColumns = dynamicWithSkeleton(() => import("@/components/blocks/ContactColumns"), { className: "h-[800px]" });
const PracticeAreasGrid = dynamicWithSkeleton(() => import("@/components/blocks/PracticeAreasGrid"), { className: "h-[500px]" });
const AttorneyProfile = dynamicWithSkeleton(() => import("@/components/blocks/AttorneyProfile"), { className: "h-[500px]" });
const FreeConsultationForm = dynamicWithSkeleton(() => import("@/components/blocks/FreeConsultationForm"), { className: "h-[500px]" });
const HowItWorksSteps = dynamicWithSkeleton(() => import("@/components/blocks/HowItWorksSteps"), { className: "h-[400px]" });
const ReviewTrustBar = dynamicWithSkeleton(() => import("@/components/blocks/ReviewTrustBar"), { className: "h-32" });
const FeatureHighlightZigzag = dynamicWithSkeleton(() => import("@/components/blocks/FeatureHighlightZigzag"), { className: "h-[600px]" });
const TeamCarousel = dynamicWithSkeleton(() => import("@/components/blocks/TeamCarousel"), { className: "h-[500px]" });
const TeamGrid = dynamicWithSkeleton(() => import("@/components/blocks/TeamGrid"), { className: "h-[600px]" });
const PatientFaq = dynamicWithSkeleton(() => import("@/components/blocks/PatientFaq"), { className: "h-[500px]" });
const BlogGrid = dynamicWithSkeleton(() => import("@/components/blocks/BlogGrid"), { className: "h-[600px]" });
const FeaturesModern = dynamicWithSkeleton(() => import("@/components/blocks/FeaturesModern"), { className: "h-[600px]" });
const ReviewsGrid = dynamicWithSkeleton(() => import("@/components/blocks/ReviewsGrid"), { className: "h-[600px]" });
const FAQTwoColumn = dynamicWithSkeleton(() => import("@/components/blocks/FAQTwoColumn"), { className: "h-[500px]" });

// PH Specific Blocks
const MessengerStickyCTA = dynamicWithSkeleton(() => import("@/components/blocks/MessengerStickyCTA"), { className: "h-0" });
const ServiceAreaMap = dynamicWithSkeleton(() => import("@/components/blocks/ServiceAreaMap"), { className: "h-[500px]" });
const BeforeAfterSlider = dynamicWithSkeleton(() => import("@/components/blocks/BeforeAfterSlider"), { className: "h-[600px]" });
const PromoBannerStrip = dynamicWithSkeleton(() => import("@/components/blocks/PromoBannerStrip"), { className: "h-12" });
const PaymentOptionsStrip = dynamicWithSkeleton(() => import("@/components/blocks/PaymentOptionsStrip"), { className: "h-24" });
const FacebookReviewEmbed = dynamicWithSkeleton(() => import("@/components/blocks/FacebookReviewEmbed"), { className: "h-[600px]" });
const CoverageRadiusBlock = dynamicWithSkeleton(() => import("@/components/blocks/CoverageRadiusBlock"), { className: "h-[500px]" });
const StatsSection = dynamicWithSkeleton(() => import("@/components/blocks/StatsSection"), { className: "h-[400px]" });
const FAQAccordion = dynamicWithSkeleton(() => import("@/components/blocks/FAQAccordion"), { className: "h-[600px]" });
const LogoCloud = dynamicWithSkeleton(() => import("@/components/blocks/LogoCloud"), { className: "h-[200px]" });
const TrustBadgesGrid = dynamicWithSkeleton(() => import("@/components/blocks/TrustBadgesGrid"), { className: "h-[400px]" });
const ACTypesGrid = dynamicWithSkeleton(() => import("@/components/blocks/ACTypesGrid"), { className: "h-[500px]" });
const PricePreviewStrip = dynamicWithSkeleton(() => import("@/components/blocks/PricePreviewStrip"), { className: "h-[300px]" });
const EmergencyCTAStrip = dynamicWithSkeleton(() => import("@/components/blocks/EmergencyCTAStrip"), { className: "h-[200px]" });
const MaintenancePlans = dynamicWithSkeleton(() => import("@/components/blocks/MaintenancePlans"), { className: "h-[600px]" });

// Pest Control Specific Blocks
const CommonPestsGrid = dynamicWithSkeleton(() => import("@/components/blocks/CommonPestsGrid"), { className: "h-[500px]" });
const TreatmentProcessTimeline = dynamicWithSkeleton(() => import("@/components/blocks/TreatmentProcessTimeline"), { className: "h-[600px]" });
const SafetySection = dynamicWithSkeleton(() => import("@/components/blocks/SafetySection"), { className: "h-[600px]" });
const WarrantyGuaranteeBlock = dynamicWithSkeleton(() => import("@/components/blocks/WarrantyGuaranteeBlock"), { className: "h-[400px]" });

const BeforeAfterGalleryGrid = dynamicWithSkeleton(() => import("@/components/blocks/BeforeAfterGalleryGrid"), { className: "h-[600px]" });
const PromoCTASection = dynamicWithSkeleton(() => import("@/components/blocks/PromoCTASection"), { className: "h-[500px]" });

// Real Estate Specific Blocks
const FeaturedListingsGrid = dynamicWithSkeleton(() => import("@/components/blocks/FeaturedListingsGrid"), { className: "h-[600px]" });
const FinancingSection = dynamicWithSkeleton(() => import("@/components/blocks/FinancingSection"), { className: "h-[500px]" });
const DeveloperPartnersLogos = dynamicWithSkeleton(() => import("@/components/blocks/DeveloperPartnersLogos"), { className: "h-[200px]" });
const WhyChooseMe = dynamicWithSkeleton(() => import("@/components/blocks/WhyChooseMe"), { className: "h-[600px]" });

// Footer blocks
const LeadMagnetFooter = dynamicWithSkeleton(() => import("@/components/blocks/LeadMagnetFooter"), { className: "h-[400px]" });
const SimpleFooter = dynamicWithSkeleton(() => import("@/components/blocks/SimpleFooter"), { className: "h-[200px]" });
const MinimalFooter = dynamicWithSkeleton(() => import("@/components/blocks/MinimalFooter"), { className: "h-32" });

function normalizeToArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const obj = value as Record<string, any>;
    return Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => obj[k]);
  }
  return [];
}

interface SiteBlockRendererProps {
  data: any;
  isAdmin?: boolean;
}

export default function SiteBlockRenderer({ data, isAdmin = false }: SiteBlockRendererProps) {
  if (!data) return null;

  const {
    theme = "lawyer",
    activeSections = ["hero"],
    brand = { name: "Site", logoUrl: "" },
    headerStyle = "solid",
    footerStyle = "lead-magnet",
    hero = {},
    features = {},
    testimonials = {},
    contact = {},
    practiceAreas = {},
    attorneyProfile = {},
    freeConsultation = {},
    heroEmergency = {},
    howItWorks = {},
    reviewTrustBar = {},
    featureHighlight = {},
    teamCarousel = {},
    patientFaq = {},
    footer = {},
    pricingTable = {},
    awardsStrip = {},
    blog = {},
    trustBadgesGrid = {},
    commonPests = {},
    treatmentProcess = {},
    safety = {},
    warranty = {},
    acTypes = {},
    pricePreview = {},
    emergencyCTA = {},
    maintenancePlans = {},
    beforeAfterGallery = {},
    promoCTA = {},
    featuredListings = {},
    financing = {},
    developerPartners = {},
    whyChooseMe = {},
    messengerStickyCTA = {},
    serviceAreaMap = {},
    beforeAfterSlider = {},
    promoBannerStrip = {},
    paymentOptionsStrip = {},
    facebookReviewEmbed = {},
    coverageRadiusBlock = {},
    statsSection = {},
    faqAccordion = {},
    logoCloud = {},
    navigation = [],
  } = data;

  const heroProps = {
    title: hero.title ?? "",
    subtitle: hero.subtitle ?? "",
    primaryCTA: hero.primaryCTA ?? "Get started",
    secondaryCTA: hero.secondaryCTA ?? "Learn more",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "/contact",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
    benefitText: hero.benefitText ?? hero.badgeText ?? "Professional Services",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    localCoverage: hero.localCoverage ?? "Metro Manila & Nearby Provinces",
    localCoverageIcon: hero.localCoverageIcon,
    localCoverageImageUrl: hero.localCoverageImageUrl,
    layout: hero.layout,
    trustBadges: hero.trustBadges,
    promoText: hero.promoText,
    icon: hero.icon,
  };

  const trustSignals = Array.isArray(hero.trustSignals) ? hero.trustSignals : [];

  const heroChiropractorProps = {
    ...heroProps,
    title: hero.title ?? "Live Life Without the Pain.",
    subtitle: hero.subtitle ?? "The most thorough adjustment you'll ever experience.",
    primaryCTA: hero.primaryCTA ?? "Book Your First Visit",
    secondaryCTA: hero.secondaryCTA ?? "See Our 5-Star Reviews",
    backgroundVideoUrl: hero.backgroundVideoUrl ?? "",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "/contact",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#reviews",
    benefitText: hero.benefitText ?? hero.badgeText ?? "Natural Pain Relief",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    secondaryCTAIcon: hero.secondaryCTAIcon,
    secondaryCTAImageUrl: hero.secondaryCTAImageUrl,
    trustSignals,
  };

  const heroDentistProps = {
    title: hero.title ?? "A Smile You'll Love to Share.",
    subtitle: hero.subtitle ?? "Gentle, modern care for the whole family in [City Name].",
    primaryCTA: hero.primaryCTA ?? "Book Appointment",
    secondaryCTA: hero.secondaryCTA ?? "Patient Gallery",
    imageUrl: hero.imageUrl ?? hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "/contact",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#gallery",
    cityName: hero.cityName,
    benefitText: hero.benefitText ?? hero.badgeText ?? "Accepting New Patients",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    trustSignals,
  };

  const heroClinicProps = {
    title: hero.title ?? "Advanced Care, Compassionate People.",
    subtitle: hero.subtitle ?? "Leading multi-specialty medical center dedicated to your family's health.",
    primaryCTA: hero.primaryCTA ?? "Find a Doctor",
    secondaryCTA: hero.secondaryCTA ?? "Our Services",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "/contact",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
    benefitText: hero.benefitText ?? hero.badgeText ?? "Professional Healthcare",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    trustSignals,
  };

  const heroCleaningProps = {
    title: hero.title ?? "A Cleaner Home, A Happier You.",
    subtitle: hero.subtitle ?? "Professional, reliable cleaning services tailored to your needs.",
    primaryCTA: hero.primaryCTA ?? "Get a Free Estimate",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "/contact",
    secondaryCTA: hero.secondaryCTA ?? "View Pricing",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#pricing",
    benefitText: hero.benefitText ?? hero.badgeText ?? "Professional Cleaning",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    trustSignals,
  };

  const heroPoolProps = {
    title: hero.title ?? "Perfectly Clear Water, All Season Long.",
    subtitle: hero.subtitle ?? "Weekly maintenance, chemical balancing, and equipment repair.",
    primaryCTA: hero.primaryCTA ?? "Schedule a Free Inspection",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "#inspection",
    secondaryCTA: hero.secondaryCTA ?? undefined,
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
    benefitText: hero.benefitText ?? hero.badgeText ?? "Pool & Spa Services",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    trustSignals,
  };

  const heroPestControlProps = {
    title: hero.title ?? "Don't Let Pests Take Over Your Home.",
    subtitle: hero.subtitle ?? "Eco-friendly, 24/7 emergency extermination services.",
    primaryCTA: hero.primaryCTA ?? "Get a Free Estimate",
    secondaryCTA: hero.secondaryCTA ?? "Bundle & Save",
    backgroundImage: hero.backgroundImage ?? undefined,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? "#estimate",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#pricing",
    benefitText: hero.benefitText ?? hero.badgeText ?? "Rapid Response Team",
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    trustSignals,
  };

  const sectionNavMap: Record<string, { name: string; href: string } | null> = {
    hero: null,
    "hero-emergency": { name: "Emergency", href: "#hero-emergency" },
    features: { name: "Services", href: "#services" },
    "feature-highlight": { name: "Highlights", href: "#highlights" },
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
    "contact-split": { name: "Contact", href: "#contact" },
    "contact-minimal": { name: "Contact", href: "#contact" },
    "contact-visual": { name: "Contact", href: "#contact" },
    "contact-with-map": { name: "Contact", href: "#contact" },
    "contact-columns": { name: "Contact", href: "#contact" },
    "free-consultation": { name: "Free Consultation", href: "#contact" },
    "pricing": { name: "Pricing", href: "/pricing" },
    "awards": { name: "Credentials", href: "#credentials" },
    "blog": { name: "Insights", href: "#blog" },
  };

  const builtFromSections = activeSections.reduce(
    (acc: any[], sectionId: string) => {
      const entry = sectionNavMap[sectionId];
      if (!entry) return acc;
      if (!acc.some((item) => item.href === entry.href || item.name === entry.name)) {
        acc.push(entry);
      }
      return acc;
    },
    []
  );

  const defaultNav = [
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "/contact" },
  ];

  const navigationFromSections =
    Array.isArray(navigation) && navigation.length > 0
      ? navigation
      : builtFromSections.length > 0
        ? builtFromSections
        : defaultNav;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isAdmin && <SiteEditorSidebar />}
      <Header
        brandName={brand.name}
        logoUrl={brand.logoUrl}
        navigation={navigationFromSections}
        ctaText={brand.ctaText ?? heroProps.primaryCTA}
        ctaHref={brand.ctaHref ?? "#contact"}
        headerStyle={headerStyle}
      />
      <main className="flex-1">
        {activeSections.map((sectionId: string) => {
          switch (sectionId) {
            case "hero":
              if (theme === "chiropractor") return <HeroChiropractor key="hero" {...heroChiropractorProps} />;
              if (theme === "dentist") return <HeroDentist key="hero" {...heroDentistProps} />;
              if (theme === "clinic") return <HeroClinic key="hero" {...heroClinicProps} />;
              if (theme === "pool") return <HeroPool key="hero" {...heroPoolProps} />;
              if (theme === "cleaning") return <HeroCleaning key="hero" {...heroCleaningProps} />;
              if (theme === "pest-control") return <HeroPestControl key="hero" {...heroPestControlProps} />;
              if (theme === "startup") return <HeroSaas key="hero" {...heroProps} />;
              if (theme === "generic") return <HeroBlock key="hero" {...heroProps} />;
              if (theme === "before-after" || theme === "real-estate-modern" || theme === "before-after-split" || theme === "industrial" || theme === "clean-delivery" || theme === "luxury-soft" || theme === "academic-clean" || theme === "hvac" || theme === "personal-portfolio" || theme === "photobooth") {
                let layout: any = undefined;
                if (theme === "before-after") layout = "before-after";
                if (theme === "real-estate-modern") layout = "full-screen";
                if (theme === "industrial") layout = "industrial";
                if (theme === "clean-delivery") layout = "bright-clean";
                if (theme === "luxury-soft") layout = "soft-luxury";
                if (theme === "academic-clean") layout = "structured-split";
                if (theme === "hvac") layout = "hvac-urgent";
                if (theme === "hvac-blue") layout = "hvac-blue";
                if (theme === "cleaning") layout = "cleaning-fresh";
                if (theme === "personal-portfolio") layout = "full-screen";
                if (theme === "photobooth") layout = "soft-luxury";

                return <HeroAuthority key="hero" {...heroProps} layout={layout} />;
              }
              return <HeroAuthority key="hero" {...heroProps} />;
            case "hero-emergency":
              return (
                <HeroEmergency
                  key="hero-emergency"
                  title={heroEmergency.title ?? "Need help? We're here."}
                  subtitle={heroEmergency.subtitle ?? "Fast, reliable service."}
                  primaryCTA={heroEmergency.primaryCTA ?? "Call Now"}
                  primaryCTAHref={heroEmergency.primaryCTAHref ?? "tel:+18005551234"}
                  secondaryCTA={heroEmergency.secondaryCTA ?? "Schedule Online"}
                  secondaryCTAHref={heroEmergency.secondaryCTAHref ?? "#schedule"}
                  imageUrl={heroEmergency.imageUrl ?? ""}
                  icon={heroEmergency.icon}
                />
              );
            case "pricing":
            case "packages-pricing":
              return (
                <PricingTable
                  key={sectionId}
                  title={pricingTable.title ?? "Affordable Plans"}
                  subtitle={pricingTable.subtitle}
                  plans={Array.isArray(pricingTable.plans) ? pricingTable.plans.map((p: any) => ({
                    ...p,
                    features: Array.isArray(p.features) ? p.features : []
                  })) : []}
                  mostPopularLabel={pricingTable.mostPopularLabel}
                  startingAtLabel={pricingTable.startingAtLabel}
                  periodLabel={pricingTable.periodLabel}
                />
              );
            case "features-modern":
              return (
                <FeaturesModern
                  key="features-modern"
                  title={features.title}
                  subtitle={features.subtitle}
                  features={features.items ?? []}
                />
              );
            case "awards":
            case "certifications": {
              let awardsItems = awardsStrip.items
              if (!Array.isArray(awardsItems) && awardsItems && typeof awardsItems === "object") {
                awardsItems = Object.keys(awardsItems)
                  .filter((k) => /^\d+$/.test(k))
                  .sort((a, b) => Number(a) - Number(b))
                  .map((k) => (awardsItems as Record<string, unknown>)[k]) as { label: string; sublabel?: string; icon?: string; imageUrl?: string }[]
              }
              if (!Array.isArray(awardsItems)) awardsItems = []
              return (
                <AwardsStrip
                  key={sectionId}
                  title={awardsStrip.title}
                  items={awardsItems}
                />
              );
            }
            case "features":
            case "services-grid":
            case "project-gallery":
            case "before-after-gallery":
            case "programs-grid":
            case "faculty-grid":
              return (
                <FeaturesGrid
                  key={sectionId}
                  title={features.title ?? "Our Services"}
                  subtitle={features.subtitle}
                  features={features.items ?? []}
                />
              );
            case "featured-properties-grid":
              return (
                <FeaturedListingsGrid
                  key="featured-listings"
                  title={featuredListings.title}
                  subtitle={featuredListings.subtitle}
                  items={featuredListings.items ?? []}
                  viewDetailsLabel={featuredListings.viewDetailsLabel}
                  sqmLabel={featuredListings.sqmLabel}
                />
              );
            case "financing-section":
              return (
                <FinancingSection
                  key="financing"
                  title={financing.title}
                  subtitle={financing.subtitle}
                  items={financing.items ?? []}
                />
              );
            case "developer-partners":
              return (
                <DeveloperPartnersLogos
                  key="developer-partners"
                  title={developerPartners.title}
                  items={developerPartners.items ?? []}
                />
              );
            case "why-choose-me":
              return (
                <WhyChooseMe
                  key="why-choose-me"
                  title={whyChooseMe.title}
                  subtitle={whyChooseMe.subtitle}
                  agentName={whyChooseMe.agentName}
                  agentRole={whyChooseMe.agentRole}
                  licenseNumber={whyChooseMe.licenseNumber}
                  agentBio={whyChooseMe.agentBio}
                  agentImageUrl={whyChooseMe.agentImageUrl}
                  trustSignals={whyChooseMe.trustSignals ?? []}
                  licensedBrokerLabel={whyChooseMe.licensedBrokerLabel}
                  inquireNowLabel={whyChooseMe.inquireNowLabel}
                />
              );
            case "feature-highlight":
            case "why-choose-us":
              return (
                <FeatureHighlightZigzag
                  key={sectionId}
                  title={featureHighlight.title ?? "Highlights"}
                  subtitle={featureHighlight.subtitle}
                  items={Array.isArray(featureHighlight.items) ? featureHighlight.items : []}
                />
              );
            case "how-it-works":
            case "delivery-coverage":
            case "enrollment-process":
              return (
                <HowItWorksSteps
                  key={sectionId}
                  title={howItWorks.title ?? (sectionId === "delivery-coverage" ? "Delivery Coverage" : sectionId === "enrollment-process" ? "Enrollment Process" : "How It Works")}
                  subtitle={howItWorks.subtitle}
                  steps={howItWorks.items ?? howItWorks.steps ?? (sectionId === "delivery-coverage" ? (data.deliveryCoverage?.areas?.map((a: string, i: number) => ({ number: String(i+1).padStart(2, '0'), title: a, description: "Daily delivery", icon: "MapPin" })) || []) : [])}
                />
              );
            case "testimonials":
              return (
                <TrustBar
                  key="testimonials"
                  label={testimonials.label ?? "Trusted by"}
                  logos={testimonials.logos ?? []}
                  testimonial={
                    testimonials.testimonial ?? {
                      quote: "",
                      author: "",
                      role: "",
                      avatar: "",
                      rating: 5,
                    }
                  }
                />
              );
            case "review-trust-bar":
              return (
                <ReviewTrustBar
                  key="review-trust-bar"
                  rating={reviewTrustBar.rating ?? 5}
                  ratingLabel={reviewTrustBar.ratingLabel ?? "Rated 5.0"}
                  sourceLabel={reviewTrustBar.sourceLabel ?? "Google & Yelp"}
                  sourceLogoUrl={reviewTrustBar.sourceLogoUrl}
                  testimonials={Array.isArray(reviewTrustBar.testimonials) ? reviewTrustBar.testimonials : []}
                  verifiedLabel={reviewTrustBar.verifiedLabel}
                />
              );
            case "reviews-grid":
              return (
                <ReviewsGrid
                  key="reviews-grid"
                  title={reviewTrustBar.title ?? "What Our Clients Say"}
                  subtitle={reviewTrustBar.subtitle}
                  testimonials={Array.isArray(reviewTrustBar.testimonials) ? reviewTrustBar.testimonials : []}
                />
              );
            case "team-carousel":
              return (
                <TeamCarousel
                  key="team-carousel"
                  title={teamCarousel.title ?? "Our Team"}
                  subtitle={teamCarousel.subtitle}
                  members={teamCarousel.members ?? []}
                  linkText={teamCarousel.linkText}
                />
              );
            case "team-grid":
              return (
                <TeamGrid
                  key="team-grid"
                  title={teamCarousel.title ?? "Meet Our Team"}
                  subtitle={teamCarousel.subtitle}
                  members={teamCarousel.members ?? []}
                  linkText={teamCarousel.linkText}
                />
              );
            case "practice-areas":
              return (
                <PracticeAreasGrid
                  key="practice-areas"
                  title={practiceAreas.title ?? "Areas of Practice"}
                  subtitle={practiceAreas.subtitle}
                  items={normalizeToArray(practiceAreas.items ?? practiceAreas.areas)}
                />
              );
            case "attorney-profile":
              return (
                <AttorneyProfile
                  key="attorney-profile"
                  label={attorneyProfile.label ?? "About Our Firm"}
                  name={attorneyProfile.name ?? "John Doe"}
                  bioParagraph1={attorneyProfile.bioParagraph1 ?? ""}
                  bioParagraph2={attorneyProfile.bioParagraph2 ?? ""}
                  signatureName={attorneyProfile.signatureName ?? attorneyProfile.name}
                  headshotUrl={attorneyProfile.imageUrl ?? attorneyProfile.headshotUrl ?? ""}
                  aboutLabel={attorneyProfile.aboutLabel}
                />
              );
            case "free-consultation":
            case "booking-cta":
              return (
                <FreeConsultationForm
                  key={sectionId}
                  headline={freeConsultation.title ?? freeConsultation.headline ?? (sectionId === "booking-cta" ? (data.bookingCTA?.title || "Book Now") : "Free Case Evaluation")}
                  subtitle={sectionId === "booking-cta" ? data.bookingCTA?.subtitle : undefined}
                  bullet1={freeConsultation.bullet1 ?? "Confidential Consultation"}
                  bullet2={freeConsultation.bullet2 ?? "Expert Legal Advice"}
                  bullet3={freeConsultation.bullet3 ?? "No Obligation"}
                  formTitle={freeConsultation.formTitle}
                  dropdownOptions={Array.isArray(freeConsultation.dropdownOptions) ? freeConsultation.dropdownOptions : ["General Inquiry"]}
                  buttonText={freeConsultation.buttonText ?? (sectionId === "booking-cta" ? (data.bookingCTA?.buttonText || "Schedule Now") : "Request Evaluation")}
                />
              );
            case "contact":
              return (
                <ContactForm
                  key="contact"
                  email={contact.email}
                  phone={contact.phone}
                  address={contact.address}
                  formHeading={contact.formHeading ?? "Get in Touch"}
                  tagline={contact.tagline ?? ""}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Message sent!"}
                  nameLabel={contact.nameLabel}
                  emailLabel={contact.emailLabel}
                  infoLabel={contact.infoLabel}
                  callLabel={contact.callLabel}
                  locationLabel={contact.locationLabel}
                  emailUsLabel={contact.emailUsLabel}
                />
              );
            case "contact-split":
              return (
                <ContactSplit
                  key="contact-split"
                  email={contact.email}
                  phone={contact.phone}
                  address={contact.address}
                  formHeading={contact.formHeading ?? "Get in Touch"}
                  tagline={contact.tagline ?? ""}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Message sent!"}
                  nameLabel={contact.nameLabel}
                  emailLabel={contact.emailLabel}
                  messageLabel={contact.messageLabel}
                  callLabel={contact.callLabel}
                  emailUsLabel={contact.emailUsLabel}
                  locationLabel={contact.locationLabel}
                />
              );
            case "contact-minimal":
              return (
                <ContactMinimal
                  key="contact-minimal"
                  email={contact.email}
                  phone={contact.phone}
                  address={contact.address}
                  title={contact.title ?? "Get in Touch"}
                  subtitle={contact.tagline ?? contact.subtitle ?? ""}
                  formHeading={contact.formHeading ?? "Send us a message"}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Thank you!"}
                  nameLabel={contact.nameLabel}
                  emailLabel={contact.emailLabel}
                  messageLabel={contact.messageLabel}
                />
              );
            case "contact-visual":
              return (
                <ContactVisual
                  key="contact-visual"
                  email={contact.email}
                  phone={contact.phone}
                  address={contact.address}
                  title={contact.title ?? "Ready to Get Started?"}
                  subtitle={contact.tagline ?? contact.subtitle ?? ""}
                  backgroundImage={contact.backgroundImage ?? contact.imageUrl}
                  formHeading={contact.formHeading ?? "Send a Message"}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Message Received!"}
                />
              );
            case "contact-with-map":
              return (
                <ContactWithMap
                  key="contact-with-map"
                  email={contact.email}
                  phone={contact.phone}
                  address={contact.address}
                  title={contact.title ?? "Visit Our Office"}
                  subtitle={contact.tagline ?? contact.subtitle ?? ""}
                  googleMapsEmbedUrl={contact.googleMapsEmbedUrl}
                  businessHours={contact.businessHours}
                  formHeading={contact.formHeading ?? "Send us a Message"}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Message Sent!"}
                />
              );
            case "contact-columns":
              return (
                <ContactColumns
                  key="contact-columns"
                  email={contact.email}
                  phone={contact.phone}
                  address={contact.address}
                  title={contact.title ?? "Contact Us"}
                  subtitle={contact.tagline ?? contact.subtitle ?? ""}
                  whatsapp={contact.whatsapp}
                  messenger={contact.messenger}
                  formHeading={contact.formHeading ?? "Send us a message"}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Message Sent!"}
                />
              );
            case "patient-faq":
              return (
                <PatientFaq
                  key="patient-faq"
                  title={patientFaq.title ?? "Common Questions"}
                  subtitle={patientFaq.subtitle}
                  items={patientFaq.items ?? []}
                />
              );
            case "faq-two-column":
              return (
                <FAQTwoColumn
                  key="faq-two-column"
                  title={patientFaq.title ?? "Common Questions"}
                  subtitle={patientFaq.subtitle}
                  items={patientFaq.items ?? []}
                />
              );
            case "blog":
              return (
                <BlogGrid
                  key="blog"
                  title={blog.title ?? "Latest Insights"}
                  subtitle={blog.subtitle}
                  posts={blog.posts ?? []}
                  linkText={blog.linkText}
                />
              );
            case "common-pests":
              return (
                <CommonPestsGrid
                  key="common-pests"
                  title={commonPests.title ?? "Common Pests We Treat"}
                  subtitle={commonPests.subtitle}
                  items={commonPests.items ?? []}
                />
              );
            case "treatment-process":
              return (
                <TreatmentProcessTimeline
                  key="treatment-process"
                  title={treatmentProcess.title ?? "Our Treatment Process"}
                  subtitle={treatmentProcess.subtitle}
                  steps={treatmentProcess.steps ?? []}
                />
              );
            case "safety-section":
              return (
                <SafetySection
                  key="safety-section"
                  title={safety.title}
                  subtitle={safety.subtitle}
                  items={safety.items ?? []}
                  kidPetFriendlyLabel={safety.kidPetFriendlyLabel}
                />
              );
            case "warranty-block":
              return (
                <WarrantyGuaranteeBlock
                  key="warranty-block"
                  title={warranty.title}
                  subtitle={warranty.subtitle}
                  badgeText={warranty.badgeText}
                  icon={warranty.icon}
                  imageUrl={warranty.imageUrl}
                />
              );
            case "ac-types-grid":
              return (
                <ACTypesGrid
                  key="ac-types-grid"
                  title={acTypes.title}
                  subtitle={acTypes.subtitle}
                  items={acTypes.items}
                />
              );
            case "price-preview-strip":
              return (
                <PricePreviewStrip
                  key="price-preview-strip"
                  title={pricePreview.title}
                  items={pricePreview.items}
                  transparentPricingNote={pricePreview.transparentPricingNote}
                  bookNowLabel={pricePreview.bookNowLabel}
                />
              );
            case "emergency-cta-strip":
              return (
                <EmergencyCTAStrip
                  key="emergency-cta-strip"
                  title={emergencyCTA.title}
                  subtitle={emergencyCTA.subtitle}
                  buttonText={emergencyCTA.buttonText}
                  phone={emergencyCTA.phone || contact.phone}
                  imageUrl={emergencyCTA.imageUrl}
                  icon={emergencyCTA.icon}
                />
              );
            case "maintenance-plans":
              return (
                <MaintenancePlans
                  key="maintenance-plans"
                  title={maintenancePlans.title}
                  subtitle={maintenancePlans.subtitle}
                  plans={maintenancePlans.plans}
                  signUpNowLabel={maintenancePlans.signUpNowLabel}
                />
              );
            case "before-after-gallery-grid":
              return (
                <BeforeAfterGalleryGrid
                  key="before-after-gallery-grid"
                  title={beforeAfterGallery.title}
                  subtitle={beforeAfterGallery.subtitle}
                  items={beforeAfterGallery.items ?? []}
                  beforeLabel={beforeAfterGallery.beforeLabel}
                  afterLabel={beforeAfterGallery.afterLabel}
                />
              );
            case "promo-cta-section":
              return (
                <PromoCTASection
                  key="promo-cta-section"
                  title={promoCTA.title}
                  subtitle={promoCTA.subtitle}
                  promoBadge={promoCTA.promoBadge}
                  buttonText={promoCTA.buttonText}
                  buttonHref={promoCTA.buttonHref}
                  phone={promoCTA.phone || contact.phone}
                  countdownEndDate={promoCTA.countdownEndDate}
                  backgroundImage={promoCTA.backgroundImage}
                  daysLabel={promoCTA.daysLabel}
                  hoursLabel={promoCTA.hoursLabel}
                  minsLabel={promoCTA.minsLabel}
                  secsLabel={promoCTA.secsLabel}
                />
              );
            case "messenger-sticky-cta":
              return (
                <MessengerStickyCTA
                  key="messenger-sticky-cta"
                  messengerUrl={messengerStickyCTA?.messengerUrl}
                  viberNumber={messengerStickyCTA?.viberNumber}
                  phone={contact.phone}
                  messengerLabel={messengerStickyCTA?.messengerLabel}
                  viberLabel={messengerStickyCTA?.viberLabel}
                  callLabel={messengerStickyCTA?.callLabel}
                />
              );
            case "service-area-map":
              return (
                <ServiceAreaMap
                  key="service-area-map"
                  title={serviceAreaMap?.title}
                  subtitle={serviceAreaMap?.subtitle}
                  cities={serviceAreaMap?.cities ?? []}
                  googleMapsEmbedUrl={serviceAreaMap?.googleMapsEmbedUrl}
                  cantFindCityTitle={serviceAreaMap?.cantFindCityTitle}
                  cantFindCityDescription={serviceAreaMap?.cantFindCityDescription}
                />
              );
            case "before-after-slider":
              return (
                <BeforeAfterSlider
                  key="before-after-slider"
                  title={beforeAfterSlider?.title}
                  subtitle={beforeAfterSlider?.subtitle}
                  beforeImage={beforeAfterSlider?.beforeImage}
                  afterImage={beforeAfterSlider?.afterImage}
                  beforeLabel={beforeAfterSlider?.beforeLabel}
                  afterLabel={beforeAfterSlider?.afterLabel}
                />
              );
            case "promo-banner-strip":
              return (
                <PromoBannerStrip
                  key="promo-banner-strip"
                  text={promoBannerStrip?.text}
                  countdownDate={promoBannerStrip?.countdownDate}
                  buttonText={promoBannerStrip?.buttonText}
                  buttonHref={promoBannerStrip?.buttonHref}
                />
              );
            case "payment-options-strip":
              return (
                <PaymentOptionsStrip
                  key="payment-options-strip"
                  title={paymentOptionsStrip?.title}
                  methods={paymentOptionsStrip?.methods}
                />
              );
            case "facebook-review-embed":
              return (
                <FacebookReviewEmbed
                  key="facebook-review-embed"
                  title={facebookReviewEmbed?.title}
                  subtitle={facebookReviewEmbed?.subtitle}
                  reviews={facebookReviewEmbed?.reviews}
                  followUsLabel={facebookReviewEmbed?.followUsLabel}
                  facebookReviewsLabel={facebookReviewEmbed?.facebookReviewsLabel}
                  footerNoteLabel={facebookReviewEmbed?.footerNoteLabel}
                />
              );
            case "coverage-radius-block":
              return (
                <CoverageRadiusBlock
                  key="coverage-radius-block"
                  title={coverageRadiusBlock?.title}
                  subtitle={coverageRadiusBlock?.subtitle}
                  radiusKm={coverageRadiusBlock?.radiusKm}
                  locationName={coverageRadiusBlock?.locationName}
                  note={coverageRadiusBlock?.note}
                  serviceCoverageLabel={coverageRadiusBlock?.serviceCoverageLabel}
                  radiusLabel={coverageRadiusBlock?.radiusLabel}
                />
              );
            case "stats-section":
              return (
                <StatsSection
                  key="stats-section"
                  title={statsSection.title}
                  subtitle={statsSection.subtitle}
                  items={statsSection.items ?? []}
                  variant={statsSection.variant}
                />
              );
            case "faq-accordion":
              return (
                <FAQAccordion
                  key="faq-accordion"
                  title={faqAccordion.title}
                  subtitle={faqAccordion.subtitle}
                  items={faqAccordion.items ?? []}
                />
              );
            case "logo-cloud":
              return (
                <LogoCloud
                  key="logo-cloud"
                  title={logoCloud.title}
                  items={logoCloud.items ?? []}
                  variant={logoCloud.variant}
                />
              );
            case "trust-badges-grid":
              return (
                <TrustBadgesGrid
                  key="trust-badges-grid"
                  title={trustBadgesGrid.title}
                  subtitle={trustBadgesGrid.subtitle}
                  items={Array.isArray(trustBadgesGrid.items) ? trustBadgesGrid.items : []}
                />
              );
            default:
              return null;
          }
        })}
      </main>

      {/* Footer rendering */}
      {footerStyle === "lead-magnet" && (
        <LeadMagnetFooter
          brandName={brand.name}
          logoUrl={brand.logoUrl}
          tagline={footer.tagline ?? hero.subtitle ?? ""}
          contact={{
            email: footer.email ?? contact.email ?? "info@example.com",
            phone: footer.phone ?? contact.phone ?? "1-800-000-0000",
            address: footer.address ?? contact.address ?? "123 Street Name, City, Country",
          }}
          formHeading={footer.formHeading ?? "Contact Us"}
          formSubmitText={footer.formSubmitText ?? "Send Message"}
          formThankYouText={footer.formThankYouText ?? "Message sent!"}
          social={footer.social ?? {}}
          privacyUrl={footer.privacyUrl ?? "/privacy"}
          termsUrl={footer.termsUrl ?? "/terms"}
          cookieUrl={footer.cookieUrl ?? "/cookies"}
          contactUsLabel={footer.contactUsLabel}
          callUsNowLabel={footer.callUsNowLabel}
          privacyLabel={footer.privacyLabel}
          termsLabel={footer.termsLabel}
          cookieLabel={footer.cookieLabel}
        />
      )}
      {footerStyle === "simple" && (
        <SimpleFooter
          brandName={brand.name}
          logoUrl={brand.logoUrl}
          tagline={footer.tagline ?? hero.subtitle ?? ""}
          navigation={navigationFromSections}
          contact={{
            email: footer.email ?? contact.email ?? "info@example.com",
            phone: footer.phone ?? contact.phone ?? "1-800-000-0000",
            address: footer.address ?? contact.address ?? "123 Street Name, City, Country",
          }}
          social={footer.social ?? {}}
          privacyUrl={footer.privacyUrl ?? "/privacy"}
          termsUrl={footer.termsUrl ?? "/terms"}
          cookieUrl={footer.cookieUrl ?? "/cookies"}
          contactLabel={footer.contactLabel}
          followLabel={footer.followLabel}
          privacyLabel={footer.privacyLabel}
          termsLabel={footer.termsLabel}
          cookieLabel={footer.cookieLabel}
        />
      )}
      {footerStyle === "minimal" && (
        <MinimalFooter 
          brandName={brand.name} 
          logoUrl={brand.logoUrl} 
          tagline={footer.tagline ?? hero.subtitle ?? ""}
          contact={{
            email: footer.email ?? contact.email ?? "info@example.com",
            phone: footer.phone ?? contact.phone ?? "1-800-000-0000",
            address: footer.address ?? contact.address ?? "123 Street Name, City, Country",
          }}
          social={footer.social ?? {}}
          privacyUrl={footer.privacyUrl ?? "/privacy"}
          termsUrl={footer.termsUrl ?? "/terms"}
          cookieUrl={footer.cookieUrl ?? "/cookies"}
        />
      )}
      
      <FloatingCTA 
        phone={brand.phone ?? contact.phone} 
        ctaText={brand.ctaText ?? heroProps.primaryCTA} 
        ctaHref={brand.ctaHref ?? "/contact"} 
      />
    </div>
  );
}
