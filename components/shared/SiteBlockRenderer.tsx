import { dynamicWithSkeleton } from "@/lib/utils/dynamic";
import { DEFAULT_FAQ_ACCORDION } from "@/config/dashboard-config";
import React from "react";
import { SECTION_NAV_MAP, slugify, categoryLabelForSection } from "@/lib/utils/blocks";

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
const ContactMinimal = dynamicWithSkeleton(() => import("@/components/blocks/ContactMinimal"), { className: "h-[500px]" });
const ContactVisual = dynamicWithSkeleton(() => import("@/components/blocks/ContactVisual"), { className: "h-[600px]" });
const ContactWithMap = dynamicWithSkeleton(() => import("@/components/blocks/ContactWithMap"), { className: "h-[600px]" });
const ContactColumns = dynamicWithSkeleton(() => import("@/components/blocks/ContactColumns"), { className: "h-[800px]" });
const ContactSplit = dynamicWithSkeleton(() => import("@/components/blocks/ContactSplit"), { className: "h-[700px]" });
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
const PhotoGalleryGrid = dynamicWithSkeleton(() => import("@/components/blocks/PhotoGalleryGrid"), { className: "h-[600px]" });
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
    faqAccordion = DEFAULT_FAQ_ACCORDION,
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
    promoText: hero.promoText,
    icon: hero.icon,
  };

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
  };

  // SECTION_NAV_MAP imported from @/lib/utils/blocks
  const sectionNavMap = SECTION_NAV_MAP;

  // Hero theme → component lookup (replaces if/else chain)
  const HERO_BY_THEME: Record<string, React.ReactElement> = {
    chiropractor: <HeroChiropractor key="hero" {...heroChiropractorProps} />,
    dentist: <HeroDentist key="hero" {...heroDentistProps} />,
    clinic: <HeroClinic key="hero" {...heroClinicProps} />,
    pool: <HeroPool key="hero" {...heroPoolProps} />,
    cleaning: <HeroCleaning key="hero" {...heroCleaningProps} />,
    "pest-control": <HeroPestControl key="hero" {...heroPestControlProps} />,
    startup: <HeroSaas key="hero" {...heroProps} />,
    generic: <HeroBlock key="hero" {...heroProps} />,
  };

  const AUTHORITY_LAYOUT_BY_THEME: Record<string, string> = {
    "before-after": "before-after",
    "real-estate-modern": "full-screen",
    industrial: "industrial",
    "clean-delivery": "bright-clean",
    "luxury-soft": "soft-luxury",
    "academic-clean": "structured-split",
    hvac: "hvac-urgent",
    "hvac-blue": "hvac-blue",
    cleaning: "cleaning-fresh",
    "personal-portfolio": "full-screen",
    photobooth: "soft-luxury",
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

  // slugify imported from @/lib/utils/blocks

  // PAGE_CATEGORY_LABELS and categoryLabelForSection imported from @/lib/utils/blocks

  const pagesNav = Array.isArray((data as any)?.pages)
    ? (data as any).pages
        .map((page: any, index: number) => {
          const rawSlug = typeof page?.slug === "string" ? page.slug : "";
          let slug = rawSlug.replace(/^\/+|\/+$/g, "").toLowerCase();
          const rawLabel = typeof page?.label === "string" ? page.label : "";
          const rawSections = Array.isArray(page?.activeSections) ? page.activeSections : [];
          const firstSection = typeof rawSections[0] === "string" ? rawSections[0] : "";
          const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : "";
          const isGenericLabel = !rawLabel || /^page\s+\d+$/i.test(rawLabel.trim());
          const isGenericSlug = !slug || /^page-\d+$/i.test(slug);
          const fallbackLabel = categoryLabel || (slug && !isGenericSlug ? slug.replace(/-/g, " ") : `Page ${index + 1}`);
          const label = categoryLabel || (isGenericLabel ? fallbackLabel : rawLabel);
          const shouldUseDefaultSlug = isGenericSlug;
          if (label.toLowerCase() === "home") {
            slug = "";
          } else if (shouldUseDefaultSlug) {
            slug = slugify(label);
          }
          return {
            name: label,
            href: slug ? `/${slug}` : "/",
          };
        })
        .filter((entry: any, idx: number, arr: any[]) =>
          entry.name && entry.href && arr.findIndex((e: any) => e.href === entry.href || e.name === entry.name) === idx
        )
    : [];

  const navigationFromSections =
    Array.isArray(navigation) && navigation.length > 0
      ? navigation
      : pagesNav.length > 1 || pagesNav.some((item: any) => item.href !== "/")
        ? pagesNav
        : builtFromSections.length > 0
          ? builtFromSections
          : defaultNav;

  const contactSections = ["contact", "contact-minimal", "contact-visual", "contact-with-map", "contact-columns"];
  const footerSections = ["footer", "lead-magnet-footer", "simple-footer", "minimal-footer"];
  const showHeader =
    activeSections.includes("header") ||
    navigationFromSections.length > 0 ||
    activeSections.length === 0;
  const showFooter =
    activeSections.includes("footer") ||
    navigationFromSections.length > 0 ||
    activeSections.some((s: string) => contactSections.includes(s) || footerSections.includes(s)) ||
    activeSections.length === 0;

  const announcementBarIds = ["announcement_bar", "announcement_bar--promo", "announcement_bar--emergency", "announcement_bar--offer", "promo-banner-strip", "cta--promo-strip"];
  const announcementBarId = Array.isArray(activeSections) ? activeSections.find((s: string) => announcementBarIds.includes(s)) : null;
  const renderedSections = Array.isArray(activeSections) ? activeSections : [];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isAdmin && <SiteEditorSidebar />}
      {announcementBarId && (
        <PromoBannerStrip
          text={promoBannerStrip?.text}
          countdownDate={promoBannerStrip?.countdownDate}
          buttonText={promoBannerStrip?.buttonText}
          buttonHref={promoBannerStrip?.buttonHref}
        />
      )}
      {showHeader && (
        <Header
          brandName={brand.name}
          logoUrl={brand.logoUrl}
          navigation={navigationFromSections}
          ctaText={brand.ctaText ?? heroProps.primaryCTA}
          ctaHref={brand.ctaHref ?? "#contact"}
          headerStyle={headerStyle}
        />
      )}
      <main className="flex-1">
        {renderedSections.length === 0 && (
          <div className="py-24 text-center bg-muted/20">
            <h2 className="text-2xl font-bold text-muted-foreground">Welcome to your new site</h2>
            <p className="mt-2 text-muted-foreground">Start by adding sections from the editor.</p>
          </div>
        )}
        {renderedSections.map((sectionId: any, index) => {
          const key = `${sectionId}-${index}`;
          let sectionContent: React.ReactNode = null;
          switch (sectionId) {
            case "hero": {
              // Dedicated hero component per theme (lookup map — no if/else chain)
              const dedicatedHero = HERO_BY_THEME[theme];
              if (dedicatedHero) {
                sectionContent = React.cloneElement(dedicatedHero, { key });
              } else {
                // Authority layout: theme drives the layout prop
                const authorityLayout = AUTHORITY_LAYOUT_BY_THEME[theme] as any;
                sectionContent = <HeroAuthority key={key} {...heroProps} layout={authorityLayout} />;
              }
              break;
            }
            case "hero-emergency":
              sectionContent = (
                <HeroEmergency
                  key={key}
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
              break;
            case "pricing":
            case "pricing--cards":
            case "packages-pricing":
              sectionContent = (
                <PricingTable
                  key={key}
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
              break;
            case "features-modern":
              sectionContent = (
                <FeaturesModern
                  key={key}
                  title={features.title}
                  subtitle={features.subtitle}
                  features={features.items ?? []}
                />
              );
              break;
            case "certifications":
            case "awards": {
              let awardsItems = awardsStrip.items
              if (!Array.isArray(awardsItems) && awardsItems && typeof awardsItems === "object") {
                awardsItems = Object.keys(awardsItems)
                  .filter((k) => /^\d+$/.test(k))
                  .sort((a, b) => Number(a) - Number(b))
                  .map((k) => (awardsItems as Record<string, unknown>)[k]) as { label: string; sublabel?: string; icon?: string; imageUrl?: string }[]
              }
              if (!Array.isArray(awardsItems)) awardsItems = []
              sectionContent = (
                <AwardsStrip
                  key={key}
                  title={awardsStrip.title}
                  items={awardsItems}
                />
              );
              break;
            }
            case "services":
            case "services--modern":
            case "services--highlight":
            case "specialty_listings":
            case "comparison":
            case "features":
            case "services-grid":
            case "project-gallery":
            case "before-after-gallery":
            case "programs-grid":
            case "faculty-grid":
              sectionContent = (
                <FeaturesGrid
                  key={key}
                  title={features.title ?? "Our Services"}
                  subtitle={features.subtitle}
                  features={features.items ?? []}
                />
              );
              break;
            case "featured-properties-grid":
              sectionContent = (
                <FeaturedListingsGrid
                  key={key}
                  title={featuredListings.title}
                  subtitle={featuredListings.subtitle}
                  items={featuredListings.items ?? []}
                  viewDetailsLabel={featuredListings.viewDetailsLabel}
                  sqmLabel={featuredListings.sqmLabel}
                />
              );
              break;
            case "financing-section":
              sectionContent = (
                <FinancingSection
                  key={key}
                  title={financing.title}
                  subtitle={financing.subtitle}
                  items={financing.items ?? []}
                />
              );
              break;
            case "developer-partners":
              sectionContent = (
                <DeveloperPartnersLogos
                  key={key}
                  title={developerPartners.title}
                  items={developerPartners.items ?? []}
                />
              );
              break;
            case "team--spotlight":
            case "why-choose-me":
              sectionContent = (
                <WhyChooseMe
                  key={key}
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
              break;
            case "service_detail":
            case "service_detail--split":
            case "feature-highlight":
            case "why-choose-us":
              sectionContent = (
                <FeatureHighlightZigzag
                  key={key}
                  title={featureHighlight.title ?? "Highlights"}
                  subtitle={featureHighlight.subtitle}
                  items={Array.isArray(featureHighlight.items) ? featureHighlight.items : []}
                />
              );
              break;
            case "process":
            case "process--timeline":
            case "how-it-works":
            case "delivery-coverage":
            case "enrollment-process":
              sectionContent = (
                <HowItWorksSteps
                  key={key}
                  title={howItWorks.title ?? (sectionId === "delivery-coverage" ? "Delivery Coverage" : sectionId === "enrollment-process" ? "Enrollment Process" : "How It Works")}
                  subtitle={howItWorks.subtitle}
                  steps={howItWorks.items ?? howItWorks.steps ?? (sectionId === "delivery-coverage" ? (data.deliveryCoverage?.areas?.map((a: string, i: number) => ({ number: String(i+1).padStart(2, '0'), title: a, description: "Daily delivery", icon: "MapPin" })) || []) : [])}
                />
              );
              break;
            case "testimonials--bar":
            case "testimonials":
              sectionContent = (
                <TrustBar
                  key={key}
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
              break;
            case "review-trust-bar":
              sectionContent = (
                <ReviewTrustBar
                  key={key}
                  rating={reviewTrustBar.rating ?? 5}
                  ratingLabel={reviewTrustBar.ratingLabel ?? "Rated 5.0"}
                  sourceLabel={reviewTrustBar.sourceLabel ?? "Google & Yelp"}
                  sourceLogoUrl={reviewTrustBar.sourceLogoUrl}
                  testimonials={Array.isArray(reviewTrustBar.testimonials) ? reviewTrustBar.testimonials : []}
                  verifiedLabel={reviewTrustBar.verifiedLabel}
                />
              );
              break;
            case "testimonials--grid":
            case "reviews-grid":
              sectionContent = (
                <ReviewsGrid
                  key={key}
                  title={reviewTrustBar.title ?? "What Our Clients Say"}
                  subtitle={reviewTrustBar.subtitle}
                  testimonials={Array.isArray(reviewTrustBar.testimonials) ? reviewTrustBar.testimonials : []}
                />
              );
              break;
            case "team":
            case "team--carousel":
            case "team-carousel":
              sectionContent = (
                <TeamCarousel
                  key={key}
                  title={teamCarousel.title ?? "Our Team"}
                  subtitle={teamCarousel.subtitle}
                  members={normalizeToArray(teamCarousel.members)}
                  linkText={teamCarousel.linkText}
                />
              );
              break;
            case "team--grid":
            case "team-grid":
              sectionContent = (
                <TeamGrid
                  key={key}
                  title={teamCarousel.title ?? "Meet Our Team"}
                  subtitle={teamCarousel.subtitle}
                  members={normalizeToArray(teamCarousel.members)}
                  linkText={teamCarousel.linkText}
                />
              );
              break;
            case "practice-areas":
              sectionContent = (
                <PracticeAreasGrid
                  key={key}
                  title={practiceAreas.title ?? "Areas of Practice"}
                  subtitle={practiceAreas.subtitle}
                  items={normalizeToArray(practiceAreas.items ?? practiceAreas.areas)}
                />
              );
              break;
            case "team--profile":
            case "attorney-profile":
              sectionContent = (
                <AttorneyProfile
                  key={key}
                  label={attorneyProfile.label ?? "About Our Firm"}
                  name={attorneyProfile.name ?? "John Doe"}
                  bioParagraph1={attorneyProfile.bioParagraph1 ?? ""}
                  bioParagraph2={attorneyProfile.bioParagraph2 ?? ""}
                  signatureName={attorneyProfile.signatureName ?? attorneyProfile.name}
                  headshotUrl={attorneyProfile.imageUrl ?? attorneyProfile.headshotUrl ?? ""}
                  aboutLabel={attorneyProfile.aboutLabel}
                />
              );
              break;
            case "free_consultation":
            case "booking":
            case "lead_capture":
            case "lead_capture--multi-step":
            case "free-consultation":
            case "booking-cta":
              sectionContent = (
                <FreeConsultationForm
                  key={key}
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
              break;
            case "contact--standard":
            case "contact":
              sectionContent = (
                <ContactForm
                  key={key}
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
              break;
            case "contact--minimal":
            case "contact-minimal":
              sectionContent = (
                <ContactMinimal
                  key={key}
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
              break;
            case "contact--visual":
            case "contact-visual":
              sectionContent = (
                <ContactVisual
                  key={key}
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
              break;
            case "contact--with-map":
            case "contact-with-map":
              sectionContent = (
                <ContactWithMap
                  key={key}
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
              break;
            case "contact--split":
            case "contact-split":
              sectionContent = (
                <ContactSplit
                  key={key}
                  email={contact.email ?? ""}
                  phone={contact.phone ?? ""}
                  address={contact.address ?? ""}
                  tagline={contact.tagline ?? contact.subtitle ?? ""}
                  formHeading={contact.formHeading ?? "Get in Touch"}
                  formSubmitText={contact.formSubmitText ?? "Send Message"}
                  formThankYouText={contact.formThankYouText ?? "Message Sent!"}
                  callLabel={contact.callLabel}
                  emailUsLabel={contact.emailUsLabel}
                  locationLabel={contact.locationLabel}
                  nameLabel={contact.nameLabel}
                  emailLabel={contact.emailLabel}
                  messageLabel={contact.messageLabel}
                />
              );
              break;
            case "contact--columns":
            case "contact-columns":
              sectionContent = (
                <ContactColumns
                  key={key}
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
              break;
            case "faq--two-column":
            case "patient-faq":
              sectionContent = (
                <PatientFaq
                  key={key}
                  title={patientFaq.title ?? "Common Questions"}
                  subtitle={patientFaq.subtitle}
                  items={patientFaq.items ?? []}
                />
              );
              break;
            case "faq-two-column":
              sectionContent = (
                <FAQTwoColumn
                  key={key}
                  title={patientFaq.title ?? "Common Questions"}
                  subtitle={patientFaq.subtitle}
                  items={patientFaq.items ?? []}
                />
              );
              break;
            case "blog_preview":
            case "blog":
              sectionContent = (
                <BlogGrid
                  key={key}
                  title={blog.title ?? "Latest Insights"}
                  subtitle={blog.subtitle}
                  posts={normalizeToArray(blog.posts)}
                  linkText={blog.linkText}
                />
              );
              break;
            case "common-pests":
              sectionContent = (
                <CommonPestsGrid
                  key={key}
                  title={commonPests.title ?? "Common Pests We Treat"}
                  subtitle={commonPests.subtitle}
                  items={commonPests.items ?? []}
                />
              );
              break;
            case "treatment-process":
              sectionContent = (
                <TreatmentProcessTimeline
                  key={key}
                  title={treatmentProcess.title ?? "Our Treatment Process"}
                  subtitle={treatmentProcess.subtitle}
                  steps={treatmentProcess.steps ?? []}
                />
              );
              break;
            case "safety-section":
              sectionContent = (
                <SafetySection
                  key={key}
                  title={safety.title}
                  subtitle={safety.subtitle}
                  items={safety.items ?? []}
                  kidPetFriendlyLabel={safety.kidPetFriendlyLabel}
                />
              );
              break;
            case "guarantee":
            case "guarantee--badge":
            case "guarantee--safety":
            case "warranty-block":
              sectionContent = (
                <WarrantyGuaranteeBlock
                  key={key}
                  title={warranty.title}
                  subtitle={warranty.subtitle}
                  badgeText={warranty.badgeText}
                  icon={warranty.icon}
                  imageUrl={warranty.imageUrl}
                />
              );
              break;
            case "comparison--table":
            case "comparison--vs":
            case "ac-types-grid":
              sectionContent = (
                <ACTypesGrid
                  key={key}
                  title={acTypes.title}
                  subtitle={acTypes.subtitle}
                  items={acTypes.items}
                />
              );
              break;
            case "price_preview":
            case "price-preview-strip":
              sectionContent = (
                <PricePreviewStrip
                  key={key}
                  title={pricePreview.title}
                  items={pricePreview.items}
                  transparentPricingNote={pricePreview.transparentPricingNote}
                  bookNowLabel={pricePreview.bookNowLabel}
                />
              );
              break;
            case "cta--emergency":
            case "emergency-cta-strip":
              sectionContent = (
                <EmergencyCTAStrip
                  key={key}
                  title={emergencyCTA.title}
                  subtitle={emergencyCTA.subtitle}
                  buttonText={emergencyCTA.buttonText}
                  phone={emergencyCTA.phone || contact.phone}
                  imageUrl={emergencyCTA.imageUrl}
                  icon={emergencyCTA.icon}
                />
              );
              break;
            case "pricing--subscription":
            case "maintenance-plans":
              sectionContent = (
                <MaintenancePlans
                  key={key}
                  title={maintenancePlans.title}
                  subtitle={maintenancePlans.subtitle}
                  plans={maintenancePlans.plans}
                  signUpNowLabel={maintenancePlans.signUpNowLabel}
                />
              );
              break;
            case "gallery":
            case "gallery--grid":
              sectionContent = (
                <PhotoGalleryGrid
                  key={key}
                  title={beforeAfterGallery.title}
                  subtitle={beforeAfterGallery.subtitle}
                  items={(beforeAfterGallery as { items?: { imageUrl?: string; caption?: string; alt?: string }[] }).items}
                />
              );
              break;
            case "case_study":
            case "case_study--detail":
            case "before-after-gallery-grid":
              sectionContent = (
                <BeforeAfterGalleryGrid
                  key={key}
                  title={beforeAfterGallery.title}
                  subtitle={beforeAfterGallery.subtitle}
                  items={beforeAfterGallery.items ?? []}
                  beforeLabel={beforeAfterGallery.beforeLabel}
                  afterLabel={beforeAfterGallery.afterLabel}
                />
              );
              break;
            case "cta":
            case "cta--banner":
            case "promo-cta-section":
              sectionContent = (
                <PromoCTASection
                  key={key}
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
              break;
            case "cta--sticky":
            case "messenger-sticky-cta":
              sectionContent = (
                <MessengerStickyCTA
                  key={key}
                  messengerUrl={messengerStickyCTA?.messengerUrl}
                  viberNumber={messengerStickyCTA?.viberNumber}
                  phone={contact.phone}
                  messengerLabel={messengerStickyCTA?.messengerLabel}
                  viberLabel={messengerStickyCTA?.viberLabel}
                  callLabel={messengerStickyCTA?.callLabel}
                />
              );
              break;
            case "service_area":
            case "service-area-map":
              sectionContent = (
                <ServiceAreaMap
                  key={key}
                  title={serviceAreaMap?.title}
                  subtitle={serviceAreaMap?.subtitle}
                  cities={serviceAreaMap?.cities ?? []}
                  googleMapsEmbedUrl={serviceAreaMap?.googleMapsEmbedUrl}
                  cantFindCityTitle={serviceAreaMap?.cantFindCityTitle}
                  cantFindCityDescription={serviceAreaMap?.cantFindCityDescription}
                />
              );
              break;
            case "gallery--slider":
            case "before-after-slider":
              sectionContent = (
                <BeforeAfterSlider
                  key={key}
                  title={beforeAfterSlider?.title}
                  subtitle={beforeAfterSlider?.subtitle}
                  beforeImage={beforeAfterSlider?.beforeImage}
                  afterImage={beforeAfterSlider?.afterImage}
                  beforeLabel={beforeAfterSlider?.beforeLabel}
                  afterLabel={beforeAfterSlider?.afterLabel}
                />
              );
              break;
            case "cta--promo-strip":
            case "announcement_bar":
            case "announcement_bar--promo":
            case "announcement_bar--emergency":
            case "announcement_bar--offer":
            case "promo-banner-strip":
              // Rendered above <Header> — skip here to avoid duplicate
              sectionContent = null;
              break;
            case "payment_options":
            case "payment-options-strip":
              sectionContent = (
                <PaymentOptionsStrip
                  key={key}
                  title={paymentOptionsStrip?.title}
                  methods={paymentOptionsStrip?.methods}
                />
              );
              break;
            case "testimonials--facebook":
            case "facebook-review-embed":
              sectionContent = (
                <FacebookReviewEmbed
                  key={key}
                  title={facebookReviewEmbed?.title}
                  subtitle={facebookReviewEmbed?.subtitle}
                  reviews={facebookReviewEmbed?.reviews}
                  followUsLabel={facebookReviewEmbed?.followUsLabel}
                  facebookReviewsLabel={facebookReviewEmbed?.facebookReviewsLabel}
                  footerNoteLabel={facebookReviewEmbed?.footerNoteLabel}
                />
              );
              break;
            case "service_area--radius":
            case "coverage-radius-block":
              sectionContent = (
                <CoverageRadiusBlock
                  key={key}
                  title={coverageRadiusBlock?.title}
                  subtitle={coverageRadiusBlock?.subtitle}
                  radiusKm={coverageRadiusBlock?.radiusKm}
                  locationName={coverageRadiusBlock?.locationName}
                  note={coverageRadiusBlock?.note}
                  serviceCoverageLabel={coverageRadiusBlock?.serviceCoverageLabel}
                  radiusLabel={coverageRadiusBlock?.radiusLabel}
                />
              );
              break;
            case "stats":
            case "stats-section":
              sectionContent = (
                <StatsSection
                  key={key}
                  title={statsSection.title}
                  subtitle={statsSection.subtitle}
                  items={statsSection.items ?? []}
                  variant={statsSection.variant}
                />
              );
              break;
            case "faq":
            case "faq-accordion":
              sectionContent = (
                <FAQAccordion
                  key={key}
                  title={faqAccordion.title}
                  subtitle={faqAccordion.subtitle}
                  items={faqAccordion.items ?? []}
                />
              );
              break;
            case "logo_cloud":
            case "logo-cloud":
              sectionContent = (
                <LogoCloud
                  key={key}
                  title={logoCloud.title}
                  items={logoCloud.items ?? []}
                  variant={logoCloud.variant}
                />
              );
              break;
            case "trust_badges":
            case "trust-badges-grid":
              sectionContent = (
                <TrustBadgesGrid
                  key={key}
                  title={trustBadgesGrid.title}
                  subtitle={trustBadgesGrid.subtitle}
                  items={Array.isArray(trustBadgesGrid.items) ? trustBadgesGrid.items : []}
                />
              );
              break;
            default:
              sectionContent = null;
          }
          if (!sectionContent) return null;
          return (
            <div
              key={key}
              id={`section-${sectionId}-${index}`}
              data-section-id={sectionId}
              data-section-index={index}
              className="scroll-mt-24"
            >
              {sectionContent}
            </div>
          );
        })}
      </main>

      {/* Footer rendering */}
      {showFooter && footerStyle === "lead-magnet" && (
        <div data-section-id="footer">
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
        </div>
      )}
      {showFooter && footerStyle === "simple" && (
        <div data-section-id="footer">
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
        </div>
      )}
      {showFooter && footerStyle === "minimal" && (
        <div data-section-id="footer">
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
        </div>
      )}
      
      <FloatingCTA 
        phone={brand.phone ?? contact.phone} 
        ctaText={brand.ctaText ?? heroProps.primaryCTA} 
        ctaHref={brand.ctaHref ?? "/contact"} 
      />
    </div>
  );
}
