"use client"

import nextDynamic from "next/dynamic";
import SiteEditorSidebar from "@/components/shared/SiteEditorSidebar";
import FloatingCTA from "@/components/shared/FloatingCTA";
import { useLivePreview } from "./LivePreviewProvider";

// Shared components
const Header = nextDynamic(() => import("@/components/shared/Header"), { ssr: false });

// Hero blocks
const HeroAuthority = nextDynamic(() => import("@/components/blocks/HeroAuthority"), { ssr: false });
const HeroSaas = nextDynamic(() => import("@/components/blocks/HeroSaas"), { ssr: false });
const HeroChiropractor = nextDynamic(() => import("@/components/blocks/HeroChiropractor"), { ssr: false });
const HeroDentist = nextDynamic(() => import("@/components/blocks/HeroDentist"), { ssr: false });
const HeroClinic = nextDynamic(() => import("@/components/blocks/HeroClinic"), { ssr: false });
const HeroCleaning = nextDynamic(() => import("@/components/blocks/HeroCleaning"), { ssr: false });
const HeroPool = nextDynamic(() => import("@/components/blocks/HeroPool"), { ssr: false });
const HeroPestControl = nextDynamic(() => import("@/components/blocks/HeroPestControl"), { ssr: false });
const HeroEmergency = nextDynamic(() => import("@/components/blocks/HeroEmergency"), { ssr: false });

// Content blocks
const FeaturesGrid = nextDynamic(() => import("@/components/blocks/FeaturesGrid"));
const TrustBar = nextDynamic(() => import("@/components/blocks/TrustBar"));
const PricingTable = nextDynamic(() => import("@/components/blocks/PricingTable"));
const AwardsStrip = nextDynamic(() => import("@/components/blocks/AwardsStrip"));
const ContactForm = nextDynamic(() => import("@/components/blocks/ContactForm"));
const ContactSplit = nextDynamic(() => import("@/components/blocks/ContactSplit"));
const PracticeAreasGrid = nextDynamic(() => import("@/components/blocks/PracticeAreasGrid"));
const AttorneyProfile = nextDynamic(() => import("@/components/blocks/AttorneyProfile"));
const FreeConsultationForm = nextDynamic(() => import("@/components/blocks/FreeConsultationForm"));
const HowItWorksSteps = nextDynamic(() => import("@/components/blocks/HowItWorksSteps"));
const ReviewTrustBar = nextDynamic(() => import("@/components/blocks/ReviewTrustBar"));
const FeatureHighlightZigzag = nextDynamic(() => import("@/components/blocks/FeatureHighlightZigzag"));
const TeamCarousel = nextDynamic(() => import("@/components/blocks/TeamCarousel"));
const TeamGrid = nextDynamic(() => import("@/components/blocks/TeamGrid"));
const PatientFaq = nextDynamic(() => import("@/components/blocks/PatientFaq"));
const BlogGrid = nextDynamic(() => import("@/components/blocks/BlogGrid"));
const FeaturesModern = nextDynamic(() => import("@/components/blocks/FeaturesModern"));
const ReviewsGrid = nextDynamic(() => import("@/components/blocks/ReviewsGrid"));
const FAQTwoColumn = nextDynamic(() => import("@/components/blocks/FAQTwoColumn"));

// Footer blocks
const LeadMagnetFooter = nextDynamic(() => import("@/components/blocks/LeadMagnetFooter"));
const SimpleFooter = nextDynamic(() => import("@/components/blocks/SimpleFooter"));
const MinimalFooter = nextDynamic(() => import("@/components/blocks/MinimalFooter"));

interface SiteTemplateProps {
  data: any;
  isAdmin?: boolean;
}

export default function SiteTemplate({ data: serverData, isAdmin = false }: SiteTemplateProps) {
  const previewData = useLivePreview();
  const data = previewData || serverData;

  const {
    theme = "lawyer",
    activeSections = ["hero"],
    brand = { name: "Site", logoUrl: "" },
    headerStyle = "solid",
    footerStyle = "lead-magnet",
    navigation = [],
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
  } = data || {};

  const heroProps = {
    title: hero.title ?? "",
    subtitle: hero.subtitle ?? "",
    primaryCTA: hero.primaryCTA ?? "Get started",
    secondaryCTA: hero.secondaryCTA ?? "Learn more",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? "#contact",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
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
    primaryCTAHref: hero.primaryCTAHref ?? "#contact",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#reviews",
    trustSignals,
  };

  const heroDentistProps = {
    title: hero.title ?? "A Smile You'll Love to Share.",
    subtitle: hero.subtitle ?? "Gentle, modern care for the whole family in [City Name].",
    primaryCTA: hero.primaryCTA ?? "Book Appointment",
    imageUrl: hero.imageUrl ?? hero.backgroundImage ?? "",
    cityName: hero.cityName ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? "#contact",
    secondaryCTA: hero.secondaryCTA ?? undefined,
    secondaryCTAHref: hero.secondaryCTAHref ?? "#about",
    trustSignals,
  };

  const heroClinicProps = {
    title: hero.title ?? "Expert Care, Closer to Home.",
    subtitle: hero.subtitle ?? "Accepting new patients and walk-ins daily.",
    primaryCTA: hero.primaryCTA ?? "Find a Doctor",
    secondaryCTA: hero.secondaryCTA ?? "Patient Portal",
    primaryCTAHref: hero.primaryCTAHref ?? "#doctors",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#portal",
    trustSignals,
  };

  const heroCleaningProps = {
    title: hero.title ?? "Reclaim Your Weekend.",
    subtitle: hero.subtitle ?? "Professional, background-checked cleaners for homes and offices.",
    primaryCTA: hero.primaryCTA ?? "Get an Instant Quote",
    beforeImageUrl: hero.beforeImageUrl ?? undefined,
    afterImageUrl: hero.afterImageUrl ?? undefined,
    singleImageUrl: hero.singleImageUrl ?? hero.backgroundImage ?? undefined,
    primaryCTAHref: hero.primaryCTAHref ?? "#quote",
    secondaryCTA: hero.secondaryCTA ?? undefined,
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
    trustSignals,
  };

  const heroPoolProps = {
    title: hero.title ?? "Perfectly Clear Water, All Season Long.",
    subtitle: hero.subtitle ?? "Weekly maintenance, chemical balancing, and equipment repair.",
    primaryCTA: hero.primaryCTA ?? "Schedule a Free Inspection",
    backgroundImage: hero.backgroundImage ?? "",
    primaryCTAHref: hero.primaryCTAHref ?? "#inspection",
    secondaryCTA: hero.secondaryCTA ?? undefined,
    secondaryCTAHref: hero.secondaryCTAHref ?? "#services",
    trustSignals,
  };

  const heroPestControlProps = {
    title: hero.title ?? "Don't Let Pests Take Over Your Home.",
    subtitle: hero.subtitle ?? "Eco-friendly, 24/7 emergency extermination services.",
    primaryCTA: hero.primaryCTA ?? "Get a Free Estimate",
    secondaryCTA: hero.secondaryCTA ?? "Bundle & Save",
    primaryCTAHref: hero.primaryCTAHref ?? "#estimate",
    secondaryCTAHref: hero.secondaryCTAHref ?? "#bundles",
    backgroundImage: hero.backgroundImage ?? undefined,
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
    "practice-areas": { name: "Practice Areas", href: "#services" },
    "attorney-profile": { name: "About", href: "#about" },
    testimonials: { name: "Testimonials", href: "#testimonials" },
    "review-trust-bar": { name: "Reviews", href: "#reviews" },
    contact: { name: "Contact", href: "#contact" },
    "free-consultation": { name: "Free Consultation", href: "#contact" },
    "pricing": { name: "Pricing", href: "#pricing" },
    "awards": { name: "Credentials", href: "#credentials" },
    "blog": { name: "Insights", href: "#blog" },
  };

  type NavItemFromSection = { name: string; href: string };

  const navigationFromSections: NavItemFromSection[] = activeSections.reduce(
    (acc: NavItemFromSection[], sectionId: string) => {
      const entry = sectionNavMap[sectionId];
      if (!entry) return acc;
      if (!acc.some((item) => item.href === entry.href || item.name === entry.name)) {
        acc.push(entry);
      }
      return acc;
    },
    [] as NavItemFromSection[],
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isAdmin && <SiteEditorSidebar />}
      <Header
        brandName={brand.name}
        logoUrl={brand.logoUrl}
        navigation={navigationFromSections}
        ctaText={heroProps.primaryCTA}
        ctaHref="#contact"
        headerStyle={headerStyle}
      />
      <main className="flex-1">
        {activeSections.map((sectionId: string) => {
          switch (sectionId) {
            case "hero":
              if (theme === "chiropractor") return <HeroChiropractor key="hero" {...heroChiropractorProps} />;
              if (theme === "dentist") return <HeroDentist key="hero" {...heroDentistProps} />;
              if (theme === "clinic") return <HeroClinic key="hero" {...heroClinicProps} />;
              if (theme === "cleaning") return <HeroCleaning key="hero" {...heroCleaningProps} />;
              if (theme === "pool") return <HeroPool key="hero" {...heroPoolProps} />;
              if (theme === "pest-control") return <HeroPestControl key="hero" {...heroPestControlProps} />;
              if (theme === "startup") return <HeroSaas key="hero" {...heroProps} />;
              return <HeroAuthority key="hero" {...heroProps} />;
            case "hero-emergency":
              return (
                <HeroEmergency
                  key="hero-emergency"
                  title={heroEmergency.title ?? "Broken AC? We'll be there in 2 hours."}
                  subtitle={heroEmergency.subtitle ?? "No Hidden Fees."}
                  primaryCTA={heroEmergency.primaryCTA ?? "Call Now"}
                  primaryCTAHref={heroEmergency.primaryCTAHref ?? "tel:+18005551234"}
                  secondaryCTA={heroEmergency.secondaryCTA ?? "Schedule Online"}
                  secondaryCTAHref={heroEmergency.secondaryCTAHref ?? "#schedule"}
                  imageUrl={heroEmergency.imageUrl ?? ""}
                />
              );
            case "features":
              return (
                <FeaturesGrid
                  key="features"
                  title={features.title ?? "Our Services"}
                  subtitle={features.subtitle}
                  features={features.items ?? []}
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
            case "feature-highlight":
              return (
                <FeatureHighlightZigzag
                  key="feature-highlight"
                  title={featureHighlight.title}
                  subtitle={featureHighlight.subtitle}
                  items={Array.isArray(featureHighlight.items) ? featureHighlight.items : []}
                />
              );
            case "how-it-works":
              return (
                <HowItWorksSteps
                  key="how-it-works"
                  title={howItWorks.title}
                  subtitle={howItWorks.subtitle}
                  steps={howItWorks.steps ?? []}
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
                  ratingLabel={reviewTrustBar.ratingLabel}
                  sourceLabel={reviewTrustBar.sourceLabel}
                  sourceLogoUrl={reviewTrustBar.sourceLogoUrl}
                  testimonials={Array.isArray(reviewTrustBar.testimonials) ? reviewTrustBar.testimonials : []}
                />
              );
            case "reviews-grid":
              return (
                <ReviewsGrid
                  key="reviews-grid"
                  title={reviewTrustBar.title}
                  subtitle={reviewTrustBar.subtitle}
                  testimonials={Array.isArray(reviewTrustBar.testimonials) ? reviewTrustBar.testimonials : []}
                />
              );
            case "team-carousel":
              return (
                <TeamCarousel
                  key="team-carousel"
                  title={teamCarousel.title}
                  subtitle={teamCarousel.subtitle}
                  members={Array.isArray(teamCarousel.members) ? teamCarousel.members : []}
                />
              );
            case "team-grid":
              return (
                <TeamGrid
                  key="team-grid"
                  title={teamCarousel.title}
                  subtitle={teamCarousel.subtitle}
                  members={Array.isArray(teamCarousel.members) ? teamCarousel.members : []}
                />
              );
            case "patient-faq":
              return (
                <PatientFaq
                  key="patient-faq"
                  title={patientFaq.title}
                  subtitle={patientFaq.subtitle}
                  items={Array.isArray(patientFaq.items) ? patientFaq.items : []}
                />
              );
            case "faq-two-column":
              return (
                <FAQTwoColumn
                  key="faq-two-column"
                  title={patientFaq.title}
                  subtitle={patientFaq.subtitle}
                  items={Array.isArray(patientFaq.items) ? patientFaq.items : []}
                />
              );
            case "contact":
              return (
                <ContactForm
                  key="contact"
                  tagline={contact.tagline ?? ""}
                  formHeading={contact.formHeading ?? "Stay Connected"}
                  formSubmitText={contact.formSubmitText ?? "Submit"}
                  formThankYouText={contact.formThankYouText ?? "Thank you!"}
                  email={contact.email ?? ""}
                  phone={contact.phone ?? ""}
                  address={contact.address ?? ""}
                />
              );
            case "contact-split":
              return (
                <ContactSplit
                  key="contact-split"
                  tagline={contact.tagline ?? ""}
                  formHeading={contact.formHeading ?? "Stay Connected"}
                  formSubmitText={contact.formSubmitText ?? "Submit"}
                  formThankYouText={contact.formThankYouText ?? "Thank you!"}
                  email={contact.email ?? ""}
                  phone={contact.phone ?? ""}
                  address={contact.address ?? ""}
                />
              );
            case "practice-areas":
              return (
                <PracticeAreasGrid
                  key="practice-areas"
                  title={practiceAreas.title}
                  subtitle={practiceAreas.subtitle}
                  items={practiceAreas.items ?? []}
                />
              );
            case "attorney-profile":
              return (
                <AttorneyProfile
                  key="attorney-profile"
                  label={attorneyProfile.label ?? "Founding Partner"}
                  name={attorneyProfile.name ?? ""}
                  bioParagraph1={attorneyProfile.bioParagraph1 ?? ""}
                  bioParagraph2={attorneyProfile.bioParagraph2 ?? ""}
                  signatureName={attorneyProfile.signatureName ?? ""}
                  headshotUrl={attorneyProfile.headshotUrl ?? ""}
                />
              );
            case "free-consultation":
              return (
                <FreeConsultationForm
                  key="free-consultation"
                  headline={freeConsultation.headline ?? "Free Case Evaluation"}
                  bullet1={freeConsultation.bullet1 ?? ""}
                  bullet2={freeConsultation.bullet2 ?? ""}
                  bullet3={freeConsultation.bullet3 ?? ""}
                  formTitle={freeConsultation.formTitle}
                  namePlaceholder={freeConsultation.namePlaceholder}
                  emailPlaceholder={freeConsultation.emailPlaceholder}
                  dropdownLabel={freeConsultation.dropdownLabel}
                  dropdownOptions={
                    Array.isArray(freeConsultation.dropdownOptions) && freeConsultation.dropdownOptions.length > 0
                      ? freeConsultation.dropdownOptions
                      : ["Criminal Defense", "Civil Litigation", "Other"]
                  }
                  buttonText={freeConsultation.buttonText ?? "Request My Consultation"}
                  buttonThankYou={freeConsultation.buttonThankYou}
                />
              );
            case "pricing":
              return (
                <PricingTable
                  key="pricing"
                  title={pricingTable.title ?? "Simple, Transparent Pricing"}
                  subtitle={pricingTable.subtitle ?? "Choose the plan that's right for your business."}
                  plans={
                    Array.isArray(pricingTable.plans) && pricingTable.plans.length > 0
                      ? pricingTable.plans
                      : [
                          { name: "Free", price: "$0", description: "Perfect for trying out our services.", features: [{ text: "Basic Features", included: true }, { text: "Email Support", included: true }, { text: "Advanced Tools", included: false }], buttonText: "Start for Free" },
                          { name: "Pro", price: "$49", description: "Essential features for growing teams.", isPopular: true, features: [{ text: "All Basic Features", included: true }, { text: "Priority Support", included: true }, { text: "Advanced Tools", included: true }], buttonText: "Get Started" },
                          { name: "Enterprise", price: "$99", description: "Custom solutions for large scale.", features: [{ text: "Unlimited Everything", included: true }, { text: "Dedicated Manager", included: true }, { text: "Custom Integration", included: true }], buttonText: "Contact Sales" },
                        ]
                  }
                />
              );
            case "awards":
              return (
                <AwardsStrip
                  key="awards"
                  title={awardsStrip.title ?? "Trusted & Recognized By"}
                  items={
                    Array.isArray(awardsStrip.items) && awardsStrip.items.length > 0
                      ? awardsStrip.items
                      : [
                          { label: "Top Rated 2024", sublabel: "Industry Award", icon: "Award" },
                          { label: "Verified Business", sublabel: "Trust Seal", icon: "ShieldCheck" },
                          { label: "5-Star Service", sublabel: "Customer Choice", icon: "Star" },
                          { label: "10k+ Clients", sublabel: "Community", icon: "Users" },
                        ]
                  }
                />
              );
            case "blog":
              return (
                <BlogGrid
                  key="blog"
                  title={blog.title}
                  subtitle={blog.subtitle}
                  posts={Array.isArray(blog.posts) ? blog.posts : []}
                />
              );
            default:
              return null;
          }
        })}
      </main>
      {(() => {
        const footerTagline =
          (footer && footer.tagline) ||
          contact.tagline ||
          "Expert service for modern businesses. Edit this footer in config/site-data.json.";
        const footerFormHeading = (footer && footer.formHeading) || "Stay connected";
        const footerFormSubmitText = (footer && footer.formSubmitText) || "Submit";
        const footerFormThankYouText = (footer && footer.formThankYouText) || "Thank you!";
        const footerSocial = (footer && footer.social) || {};
        const privacyUrl = (footer && footer.privacyUrl) || "#";
        const termsUrl = (footer && footer.termsUrl) || "#";
        const cookieUrl = (footer && footer.cookieUrl) || "#";
        const contactProps = {
          email: contact.email ?? "",
          phone: contact.phone ?? "",
          address: contact.address ?? "",
        };

        if (footerStyle === "minimal") {
          return (
            <MinimalFooter
              brandName={brand.name}
              logoUrl={brand.logoUrl}
              tagline={footerTagline}
              contact={contactProps}
              social={footerSocial}
              privacyUrl={privacyUrl}
              termsUrl={termsUrl}
              cookieUrl={cookieUrl}
            />
          );
        }

        if (footerStyle === "simple") {
          return (
            <SimpleFooter
              brandName={brand.name}
              logoUrl={brand.logoUrl}
              tagline={footerTagline}
              navigation={navigation}
              contact={contactProps}
              social={footerSocial}
              privacyUrl={privacyUrl}
              termsUrl={termsUrl}
              cookieUrl={cookieUrl}
            />
          );
        }

        return (
          <LeadMagnetFooter
            brandName={brand.name}
            logoUrl={brand.logoUrl}
            tagline={footerTagline}
            contact={contactProps}
            formHeading={footerFormHeading}
            formSubmitText={footerFormSubmitText}
            formThankYouText={footerFormThankYouText}
            social={footerSocial}
            privacyUrl={privacyUrl}
            termsUrl={termsUrl}
            cookieUrl={cookieUrl}
          />
        );
      })()}
      <FloatingCTA 
        phone={contact.phone} 
        ctaText={heroProps.primaryCTA} 
        ctaHref="#contact" 
      />
    </div>
  );
}
