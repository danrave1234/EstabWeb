import React from "react";
import { ACTypesGrid, AgencyBlogBlock, AgencyContactBlock, AgencyProductsBlock, AnimatedTestimonialsBlock, AnimatedTestimonialsCommunityBlock, AttorneyProfile, AwardsStrip, BackgroundBeamsCTABlock, BeforeAfterGalleryGrid, BeforeAfterSlider, BlogGrid, CaseStudyDetailBlock, CommonPestsGrid, ContactColumns, ContactForm, ContactMinimal, ContactSplit, ContactVisual, ContactWithMap, CoverageRadiusBlock, CustomHtmlSection, DeveloperPartnersLogos, ElegantCarouselBlock, EmergencyCTAStrip, FAQAccordion, FAQTwoColumn, FacebookReviewEmbed, FeatureHighlightZigzag, FeaturedListingsGrid, FeaturesBento, VerticalTabsBlock, FeaturesV2Block, FeaturesGrid, FeaturesModern, FeatureSpotlightBlock, FeatureStepsBlock, FinancingSection, FreeConsultationForm, GymClassSchedule, GymClassTypes, GymFacilityHighlights, GymFaq, GymMembershipTiers, GymPrograms, GymResultsStories, GymTrainers, Header, HeroAero3, HeroAuthority, HeroBlock, HeroChiropractor, HeroCleaning, HeroClinic, HeroDentist, HeroEmergency, HeroGym, HeroMinimalismBlock, HeroPestControl, HeroPool, HeroSaas, HeroShowcase, HeroV6Block, HeroV7Block, HeroWithGroupImagesBlock, HowItWorksSteps, LogoCloud, MaintenancePlans, MessengerStickyCTA, ModernHeroBlock, PatientFaq, PaymentOptionsStrip, Gallery4Block, GalleryGridBlock, PhotoGalleryGrid, PracticeAreasGrid, PricePreviewStrip, PricingComparisonTable, PricingSectionWithComparisonBlock, PricingTable, PromoCTASection, ReviewTrustBar, ReviewsGrid, SafetySection, ServiceAreaMap, StatsSection, TeamCarousel, TeamGrid, TeamShowcaseBlock, TestimonialsV2Block, TreatmentProcessTimeline, TrustBadgesGrid, TrustBar, WarrantyGuaranteeBlock, WhyChooseMe } from "@/components/shared/BlockRegistry";
import { SECTION_NAV_MAP } from "@/lib/utils/blocks";
import {
  DEFAULT_GYM_CLASS_TYPES,
  DEFAULT_GYM_FACILITY,
  DEFAULT_GYM_FAQ,
  DEFAULT_GYM_MEMBERSHIPS,
  DEFAULT_GYM_PROGRAMS,
  DEFAULT_GYM_RESULTS,
  DEFAULT_GYM_SCHEDULE,
  DEFAULT_GYM_TRAINERS,
  DEFAULT_HERO_CHIROPRACTOR,
  DEFAULT_HERO_DENTIST,
  DEFAULT_HERO_CLINIC,
  DEFAULT_HERO_CLEANING,
  DEFAULT_HERO_POOL,
  DEFAULT_HERO_PEST_CONTROL,
} from "@/config/dashboard-config";

export function normalizeToArray(value: unknown): any[] {
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

export function renderSection(sectionId: string, data: any, brand: any, theme: string, contact: any, index: number, key: string) {
  const {
    hero = {},
    heroShowcase = {},
    features = {},
    featuresBento = {},
    testimonials = {},
    animatedTestimonials = {},
    testimonialsCommunity = {},
    testimonialsV2 = {},
    verticalTabs = {},
    featuresV2 = {},
    ctaBeams = {},
    practiceAreas = {},
    attorneyProfile = {},
    freeConsultation = {},
    heroEmergency = {},
    heroAero3 = {},
    heroMinimalism = {},
    heroElegantCarousel = {},
    heroModern = {},
    heroGroupImages = {},
    heroV6 = {},
    heroV7 = {},
    howItWorks = {},
    reviewTrustBar = {},
    featureHighlight = {},
    teamCarousel = {},
    teamShowcase = {},
    patientFaq = {},
    footer = {},
    pricingTable = {},
    pricingComparisonTable = {},
    pricingSectionComparison = {},
    awardsStrip = {},
    blog = {},
    blogAgency = {},
    contactAgency = {},
    productsAgency = {},
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
    gallery4 = {},
    galleryGrid = {},
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
    customHtml = {},
    gymPrograms = {},
    gymSchedule = {},
    gymMemberships = {},
    gymTrainers = {},
    gymResults = {},
    gymFacility = {},
    gymClassTypes = {},
    gymFaq = {},
    featureSteps = {},
    featureSpotlight = {},
    caseStudyDetail = {},
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
    title: hero.title ?? DEFAULT_HERO_CHIROPRACTOR.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_CHIROPRACTOR.subtitle,
    primaryCTA: hero.primaryCTA ?? DEFAULT_HERO_CHIROPRACTOR.primaryCTA,
    secondaryCTA: hero.secondaryCTA ?? DEFAULT_HERO_CHIROPRACTOR.secondaryCTA,
    backgroundVideoUrl: hero.backgroundVideoUrl ?? "",
    backgroundImage: hero.backgroundImage ?? DEFAULT_HERO_CHIROPRACTOR.backgroundImage,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? DEFAULT_HERO_CHIROPRACTOR.primaryCTAHref,
    secondaryCTAHref: hero.secondaryCTAHref ?? DEFAULT_HERO_CHIROPRACTOR.secondaryCTAHref,
    benefitText: hero.benefitText ?? hero.badgeText ?? DEFAULT_HERO_CHIROPRACTOR.benefitText,
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
    secondaryCTAIcon: hero.secondaryCTAIcon,
    secondaryCTAImageUrl: hero.secondaryCTAImageUrl,
  };

  const heroDentistProps = {
    title: hero.title ?? DEFAULT_HERO_DENTIST.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_DENTIST.subtitle,
    primaryCTA: hero.primaryCTA ?? DEFAULT_HERO_DENTIST.primaryCTA,
    secondaryCTA: hero.secondaryCTA ?? DEFAULT_HERO_DENTIST.secondaryCTA,
    imageUrl: hero.imageUrl ?? hero.backgroundImage ?? DEFAULT_HERO_DENTIST.imageUrl,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? DEFAULT_HERO_DENTIST.primaryCTAHref,
    secondaryCTAHref: hero.secondaryCTAHref ?? DEFAULT_HERO_DENTIST.secondaryCTAHref,
    cityName: hero.cityName,
    benefitText: hero.benefitText ?? hero.badgeText ?? DEFAULT_HERO_DENTIST.benefitText,
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
  };

  const heroClinicProps = {
    title: hero.title ?? DEFAULT_HERO_CLINIC.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_CLINIC.subtitle,
    primaryCTA: hero.primaryCTA ?? DEFAULT_HERO_CLINIC.primaryCTA,
    secondaryCTA: hero.secondaryCTA ?? DEFAULT_HERO_CLINIC.secondaryCTA,
    backgroundImage: hero.backgroundImage ?? DEFAULT_HERO_CLINIC.backgroundImage,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? DEFAULT_HERO_CLINIC.primaryCTAHref,
    secondaryCTAHref: hero.secondaryCTAHref ?? DEFAULT_HERO_CLINIC.secondaryCTAHref,
    benefitText: hero.benefitText ?? hero.badgeText ?? DEFAULT_HERO_CLINIC.benefitText,
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
  };

  const heroCleaningProps = {
    title: hero.title ?? DEFAULT_HERO_CLEANING.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_CLEANING.subtitle,
    primaryCTA: hero.primaryCTA ?? DEFAULT_HERO_CLEANING.primaryCTA,
    singleImageUrl: hero.singleImageUrl ?? hero.backgroundImage ?? DEFAULT_HERO_CLEANING.singleImageUrl,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? DEFAULT_HERO_CLEANING.primaryCTAHref,
    secondaryCTA: hero.secondaryCTA ?? DEFAULT_HERO_CLEANING.secondaryCTA,
    secondaryCTAHref: hero.secondaryCTAHref ?? DEFAULT_HERO_CLEANING.secondaryCTAHref,
    benefitText: hero.benefitText ?? hero.badgeText ?? DEFAULT_HERO_CLEANING.benefitText,
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
  };

  const heroPoolProps = {
    title: hero.title ?? DEFAULT_HERO_POOL.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_POOL.subtitle,
    primaryCTA: hero.primaryCTA ?? DEFAULT_HERO_POOL.primaryCTA,
    backgroundImage: hero.backgroundImage ?? DEFAULT_HERO_POOL.backgroundImage,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? DEFAULT_HERO_POOL.primaryCTAHref,
    secondaryCTA: hero.secondaryCTA ?? undefined,
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
    benefitText: hero.benefitText ?? hero.badgeText ?? DEFAULT_HERO_POOL.benefitText,
    benefitIcon: hero.benefitIcon,
    benefitImageUrl: hero.benefitImageUrl,
  };

  const heroPestControlProps = {
    title: hero.title ?? DEFAULT_HERO_PEST_CONTROL.title,
    subtitle: hero.subtitle ?? DEFAULT_HERO_PEST_CONTROL.subtitle,
    primaryCTA: hero.primaryCTA ?? DEFAULT_HERO_PEST_CONTROL.primaryCTA,
    secondaryCTA: hero.secondaryCTA ?? DEFAULT_HERO_PEST_CONTROL.secondaryCTA,
    backgroundImage: hero.backgroundImage ?? DEFAULT_HERO_PEST_CONTROL.backgroundImage,
    primaryCTAHref: hero.primaryCTAHref ?? brand.ctaHref ?? DEFAULT_HERO_PEST_CONTROL.primaryCTAHref,
    secondaryCTAHref: hero.secondaryCTAHref ?? DEFAULT_HERO_PEST_CONTROL.secondaryCTAHref,
    benefitText: hero.benefitText ?? hero.badgeText ?? DEFAULT_HERO_PEST_CONTROL.benefitText,
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
    gym: <HeroGym key="hero" {...heroProps} />,
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

  let sectionContent: React.ReactNode = null;

  switch (sectionId) {
    case "hero--aero-3":
      sectionContent = (
        <HeroAero3
          key={key}
          title={heroAero3.title}
          subtitle={heroAero3.subtitle}
          primaryCTA={heroAero3.primaryCTA}
          primaryCTAHref={heroAero3.primaryCTAHref}
          backgroundImage={heroAero3.backgroundImage}
        />
      );
      break;
    case "hero--elegant-carousel":
      sectionContent = (
        <ElegantCarouselBlock
          key={key}
          slides={Array.isArray(heroElegantCarousel.slides) ? heroElegantCarousel.slides : undefined}
        />
      );
      break;
    case "hero--minimalism":
      sectionContent = (
        <HeroMinimalismBlock
          key={key}
          brandName={heroMinimalism.brandName}
          ctaText={heroMinimalism.ctaText}
          kicker={heroMinimalism.kicker}
          title={heroMinimalism.title}
          subtitle={heroMinimalism.subtitle}
          footerTag={heroMinimalism.footerTag}
          footerHeading={heroMinimalism.footerHeading}
          footerDesc={heroMinimalism.footerDesc}
        />
      );
      break;
    case "hero":
    case "hero--generic":
    case "hero--lawyer":
    case "hero--dentist":
    case "hero--clinic":
    case "hero--gym":
    case "hero--startup":
    case "hero--chiropractor":
    case "hero--cleaning":
    case "hero--pool":
    case "hero--pest-control":
    case "hero--real-estate-modern":
    case "hero--before-after-split":
    case "hero--industrial":
    case "hero--clean-delivery":
    case "hero--luxury-soft":
    case "hero--academic-clean":
    case "hero--hvac":
    case "hero--hvac-blue": {
      // For hero--variant, effective theme is the variant part, otherwise use 'theme' prop
      const effectiveTheme = sectionId.startsWith("hero--") ? sectionId.split('--')[1] : theme;

      // Dedicated hero component per theme (lookup map — no if/else chain)
      const dedicatedHero = HERO_BY_THEME[effectiveTheme];
      if (dedicatedHero) {
        sectionContent = React.cloneElement(dedicatedHero, { key });
      } else {
        // Authority layout: theme drives the layout prop
        const authorityLayout = AUTHORITY_LAYOUT_BY_THEME[effectiveTheme] as any;
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
    case "services--vertical-tabs":
      sectionContent = (
        <VerticalTabsBlock
          key={key}
          title={verticalTabs.title}
          subtitle={verticalTabs.subtitle}
          services={normalizeToArray(verticalTabs.services)}
        />
      );
      break;
    case "services--features-v2":
      sectionContent = (
        <FeaturesV2Block
          key={key}
          title={featuresV2.title}
          subtitle={featuresV2.subtitle}
          description={featuresV2.description}
          features={normalizeToArray(featuresV2.features)}
          ctaText={featuresV2.ctaText}
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
          features={normalizeToArray(features.items ?? features.features)}
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
          steps={howItWorks.items ?? howItWorks.steps ?? (sectionId === "delivery-coverage" ? (data.deliveryCoverage?.areas?.map((a: string, i: number) => ({ number: String(i + 1).padStart(2, '0'), title: a, description: "Daily delivery", icon: "MapPin" })) || []) : [])}
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
    case "team--showcase":
      sectionContent = (
        <TeamShowcaseBlock
          key={key}
          members={Array.isArray(teamShowcase.members) ? teamShowcase.members : []}
        />
      );
      break;
    case "hero--modern":
      sectionContent = (
        <ModernHeroBlock
          key={key}
          {...heroModern}
        />
      );
      break;
    case "hero--group-images":
      sectionContent = (
        <HeroWithGroupImagesBlock
          key={key}
          {...heroGroupImages}
        />
      );
      break;
    case "hero--v6":
      sectionContent = (
        <HeroV6Block
          key={key}
          {...heroV6}
        />
      );
      break;
    case "hero--v7":
      sectionContent = (
        <HeroV7Block
          key={key}
          title={heroV7.title}
          description={heroV7.description}
          buttonText={heroV7.buttonText}
          backgroundImage={heroV7.backgroundImage}
          stats={normalizeToArray(heroV7.stats)}
          teamAvatars={normalizeToArray(heroV7.teamAvatars)}
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
          messageLabel={contact.messageLabel}
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
          mapEmbedUrl={contact.mapEmbedUrl}
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
    case "contact--agency":
      sectionContent = (
        <AgencyContactBlock
          key={key}
          title={contactAgency.title}
          subtitle={contactAgency.subtitle}
          description={contactAgency.description}
          formHeading={contactAgency.formHeading}
          formButtonText={contactAgency.formButtonText}
          formThankYouText={contactAgency.formThankYouText}
          infoHeading={contactAgency.infoHeading}
          infoItems={normalizeToArray(contactAgency.infoItems)}
          socials={normalizeToArray(contactAgency.socials)}
          mapEmbedUrl={contactAgency.mapEmbedUrl || contact.mapEmbedUrl}
          officeHours={contactAgency.officeHours || contact.businessHours}
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
    case "blog--agency":
      sectionContent = (
        <AgencyBlogBlock
          key={key}
          title={blogAgency.title}
          subtitle={blogAgency.subtitle}
          description={blogAgency.description}
          posts={normalizeToArray(blogAgency.posts)}
          ctaText={blogAgency.ctaText}
          featuredPostId={blogAgency.featuredPostId}
        />
      );
      break;
    case "products--agency":
      sectionContent = (
        <AgencyProductsBlock
          key={key}
          title={productsAgency.title}
          subtitle={productsAgency.subtitle}
          description={productsAgency.description}
          items={normalizeToArray(productsAgency.items)}
          categories={normalizeToArray(productsAgency.categories)}
          ctaText={productsAgency.ctaText}
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
          bookNowUrl={pricePreview.bookNowUrl}
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
          signUpNowUrl={maintenancePlans.signUpNowUrl}
        />
      );
      break;
    case "services--bento":
    case "services-bento":
      sectionContent = (
        <FeaturesBento
          key={key}
          title={featuresBento.title}
          subtitle={featuresBento.subtitle}
          items={normalizeToArray(featuresBento.items)}
        />
      );
      break;
    case "hero--showcase":
    case "hero-showcase":
      sectionContent = (
        <HeroShowcase
          key={key}
          badge={heroShowcase.badge}
          title={heroShowcase.title ?? hero.title ?? "Build trust from the first glance"}
          subtitle={heroShowcase.subtitle ?? hero.subtitle ?? ""}
          primaryCTA={heroShowcase.primaryCTA ?? hero.primaryCTA ?? "Get started"}
          secondaryCTA={heroShowcase.secondaryCTA ?? hero.secondaryCTA ?? "See services"}
          primaryCTAHref={heroShowcase.primaryCTAHref ?? hero.primaryCTAHref ?? "#contact"}
          secondaryCTAHref={heroShowcase.secondaryCTAHref ?? hero.secondaryCTAHref ?? "#services"}
          imageUrl={heroShowcase.imageUrl ?? hero.backgroundImage}
          trustPoints={Array.isArray(heroShowcase.trustPoints) ? heroShowcase.trustPoints : []}
          metrics={Array.isArray(heroShowcase.metrics) ? heroShowcase.metrics : []}
        />
      );
      break;
    case "pricing--comparison":
    case "pricing-comparison-table":
      sectionContent = (
        <PricingComparisonTable
          key={key}
          features={Array.isArray(pricingComparisonTable.features) ? pricingComparisonTable.features : undefined}
          plans={Array.isArray(pricingComparisonTable.plans) ? pricingComparisonTable.plans : undefined}
          defaultPlan={pricingComparisonTable.defaultPlan}
          defaultInterval={pricingComparisonTable.defaultInterval}
          containerClassName={pricingComparisonTable.containerClassName}
          buttonClassName={pricingComparisonTable.buttonClassName}
        />
      );
      break;
    case "pricing--feature-comparison":
    case "pricing-section-with-comparison":
      sectionContent = (
        <PricingSectionWithComparisonBlock
          key={key}
          className={pricingSectionComparison.className}
          badge={pricingSectionComparison.badge}
          title={pricingSectionComparison.title}
          subtitle={pricingSectionComparison.subtitle}
          plans={Array.isArray(pricingSectionComparison.plans) ? pricingSectionComparison.plans : undefined}
          features={Array.isArray(pricingSectionComparison.features) ? pricingSectionComparison.features : undefined}
        />
      );
      break;
    case "gym--programs":
      sectionContent = (
        <GymPrograms
          key={key}
          title={gymPrograms.title ?? DEFAULT_GYM_PROGRAMS.title}
          subtitle={gymPrograms.subtitle ?? DEFAULT_GYM_PROGRAMS.subtitle}
          items={Array.isArray(gymPrograms.items) && gymPrograms.items.length > 0 ? gymPrograms.items : DEFAULT_GYM_PROGRAMS.items}
        />
      );
      break;
    case "gym--schedule":
      sectionContent = (
        <GymClassSchedule
          key={key}
          title={gymSchedule.title ?? DEFAULT_GYM_SCHEDULE.title}
          subtitle={gymSchedule.subtitle ?? DEFAULT_GYM_SCHEDULE.subtitle}
          days={Array.isArray(gymSchedule.days) && gymSchedule.days.length > 0 ? gymSchedule.days : DEFAULT_GYM_SCHEDULE.days}
        />
      );
      break;
    case "gym--memberships":
      sectionContent = (
        <GymMembershipTiers
          key={key}
          title={gymMemberships.title ?? DEFAULT_GYM_MEMBERSHIPS.title}
          subtitle={gymMemberships.subtitle ?? DEFAULT_GYM_MEMBERSHIPS.subtitle}
          tiers={Array.isArray(gymMemberships.tiers) && gymMemberships.tiers.length > 0 ? gymMemberships.tiers : DEFAULT_GYM_MEMBERSHIPS.tiers}
        />
      );
      break;
    case "gym--trainers":
      sectionContent = (
        <GymTrainers
          key={key}
          title={gymTrainers.title ?? DEFAULT_GYM_TRAINERS.title}
          subtitle={gymTrainers.subtitle ?? DEFAULT_GYM_TRAINERS.subtitle}
          items={Array.isArray(gymTrainers.items) && gymTrainers.items.length > 0 ? gymTrainers.items : DEFAULT_GYM_TRAINERS.items}
        />
      );
      break;
    case "gym--results":
      sectionContent = (
        <GymResultsStories
          key={key}
          title={gymResults.title ?? DEFAULT_GYM_RESULTS.title}
          subtitle={gymResults.subtitle ?? DEFAULT_GYM_RESULTS.subtitle}
          stories={Array.isArray(gymResults.stories) && gymResults.stories.length > 0 ? gymResults.stories : DEFAULT_GYM_RESULTS.stories}
        />
      );
      break;
    case "gym--facility":
      sectionContent = (
        <GymFacilityHighlights
          key={key}
          title={gymFacility.title ?? DEFAULT_GYM_FACILITY.title}
          subtitle={gymFacility.subtitle ?? DEFAULT_GYM_FACILITY.subtitle}
          items={Array.isArray(gymFacility.items) && gymFacility.items.length > 0 ? gymFacility.items : DEFAULT_GYM_FACILITY.items}
        />
      );
      break;
    case "gym--class-types":
      sectionContent = (
        <GymClassTypes
          key={key}
          title={gymClassTypes.title ?? DEFAULT_GYM_CLASS_TYPES.title}
          subtitle={gymClassTypes.subtitle ?? DEFAULT_GYM_CLASS_TYPES.subtitle}
          items={Array.isArray(gymClassTypes.items) && gymClassTypes.items.length > 0 ? gymClassTypes.items : DEFAULT_GYM_CLASS_TYPES.items}
        />
      );
      break;
    case "gym--faq":
      sectionContent = (
        <GymFaq
          key={key}
          title={gymFaq.title ?? DEFAULT_GYM_FAQ.title}
          subtitle={gymFaq.subtitle ?? DEFAULT_GYM_FAQ.subtitle}
          items={Array.isArray(gymFaq.items) && gymFaq.items.length > 0 ? gymFaq.items : DEFAULT_GYM_FAQ.items}
        />
      );
      break;
    case "gallery":
      sectionContent = (
        <PhotoGalleryGrid
          key={key}
          title={beforeAfterGallery.title}
          subtitle={beforeAfterGallery.subtitle}
          items={(beforeAfterGallery as { items?: { imageUrl?: string; caption?: string; alt?: string }[] }).items}
        />
      );
      break;
    case "gallery--carousel":
      sectionContent = (
        <Gallery4Block
          key={key}
          title={gallery4.title}
          description={gallery4.description}
          items={Array.isArray(gallery4.items) ? gallery4.items : []}
        />
      );
      break;
    case "gallery--grid":
      sectionContent = (
        <GalleryGridBlock
          key={key}
          badgeLabel={galleryGrid.badgeLabel}
          title={galleryGrid.title}
          subtitle={galleryGrid.subtitle}
          images={Array.isArray(galleryGrid.images) ? galleryGrid.images : []}
        />
      );
      break;
    case "case_study":
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
    case "case_study--detail": {
      const csd = caseStudyDetail as any;
      sectionContent = (
        <CaseStudyDetailBlock
          key={key}
          title={csd.title}
          subtitle={csd.subtitle}
          clientName={csd.clientName}
          industry={csd.industry}
          imageUrl={csd.imageUrl}
          problem={csd.problem}
          solution={csd.solution}
          results={csd.results}
          metrics={csd.metrics}
        />
      );
      break;
    }
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
      sectionContent = null;
      break;
    case "service_area":
    case "service-area-map":
      sectionContent = (
        <ServiceAreaMap
          key={key}
          title={serviceAreaMap?.title}
          subtitle={serviceAreaMap?.subtitle}
          cities={serviceAreaMap?.cities ?? []}
          mapEmbedUrl={serviceAreaMap?.mapEmbedUrl}
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
          facebookUrl={facebookReviewEmbed?.facebookUrl}
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
    case "testimonials--animated":
      sectionContent = (
        <AnimatedTestimonialsBlock
          key={key}
          testimonials={Array.isArray(animatedTestimonials.testimonials) ? animatedTestimonials.testimonials : undefined}
          autoplay={Boolean(animatedTestimonials.autoplay)}
          className={animatedTestimonials.className}
        />
      );
      break;
    case "testimonials--community":
      sectionContent = (
        <AnimatedTestimonialsCommunityBlock
          key={key}
          title={testimonialsCommunity.title}
          subtitle={testimonialsCommunity.subtitle}
          badgeText={testimonialsCommunity.badgeText}
          testimonials={Array.isArray(testimonialsCommunity.testimonials) ? testimonialsCommunity.testimonials : undefined}
          autoRotateInterval={testimonialsCommunity.autoRotateInterval}
          trustedCompanies={Array.isArray(testimonialsCommunity.trustedCompanies) ? testimonialsCommunity.trustedCompanies : undefined}
          trustedCompaniesTitle={testimonialsCommunity.trustedCompaniesTitle}
          className={testimonialsCommunity.className}
        />
      );
      break;
    case "testimonials--v2":
      sectionContent = (
        <TestimonialsV2Block
          key={key}
          badge={testimonialsV2.badge}
          title={testimonialsV2.title}
          subtitle={testimonialsV2.subtitle}
          items={normalizeToArray(testimonialsV2.items)}
        />
      );
      break;
    case "features--steps":
      sectionContent = (
        <FeatureStepsBlock
          key={key}
          title={featureSteps.title}
          features={Array.isArray(featureSteps.features) ? featureSteps.features : undefined}
          autoPlayInterval={featureSteps.autoPlayInterval}
        />
      );
      break;
    case "features--spotlight":
      sectionContent = (
        <FeatureSpotlightBlock
          key={key}
          {...featureSpotlight}
        />
      );
      break;
    case "cta--beams":
      sectionContent = (
        <BackgroundBeamsCTABlock
          key={key}
          title={ctaBeams.title}
          subtitle={ctaBeams.subtitle}
          ctaText={ctaBeams.ctaText}
          ctaHref={ctaBeams.ctaHref}
          inputPlaceholder={ctaBeams.inputPlaceholder}
          showEmailInput={Boolean(ctaBeams.showEmailInput)}
        />
      );
      break;
    case "custom-html":
      sectionContent = (
        <CustomHtmlSection
          key={key}
          title={customHtml.title}
          subtitle={customHtml.subtitle}
          html={customHtml.html}
          css={customHtml.css}
        />
      );
      break;
    default:
      sectionContent = null;
  }

  return sectionContent;
}

