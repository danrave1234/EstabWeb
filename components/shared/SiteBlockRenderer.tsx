import { dynamicWithSkeleton } from "@/lib/utils/dynamic";
import { DEFAULT_FAQ_ACCORDION } from "@/config/dashboard-config";
import React from "react";
import { SECTION_NAV_MAP, slugify, categoryLabelForSection } from "@/lib/utils/blocks";
import { allFontVariables, getFontVariables } from "@/lib/fonts";

import SmartContactCTA from "@/components/shared/SmartContactCTA";
import SiteEditorSidebar from "@/components/shared/SiteEditorSidebar";

import {
  Header,
  TubelightHeader,
  MegamenuHeader,
  LeadMagnetFooter,
  SimpleFooter,
  MinimalFooter,
  PromoBannerStrip,
} from "@/components/shared/BlockRegistry";
import { renderSection, normalizeToArray } from "@/lib/utils/block-props";

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
    headerStyle = "sticky",
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
    colorTheme = "partner",
    darkMode = false,
    typographyStyle = "modern",
  } = data;



  const builtFromSections = activeSections.reduce(
    (acc: any[], sectionId: string) => {
      const entry = SECTION_NAV_MAP[sectionId];
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
        /** First page with empty slug is always the home route — never name it after the first content block (e.g. when hero is hidden). */
        const isHomePageEntry = index === 0 && (!slug || slug === "");
        const firstIsHero =
          firstSection === "hero" ||
          firstSection.startsWith("hero--") ||
          firstSection === "hero-emergency";
        /** Old logic could save the home page label as the first section's category (e.g. "Gym Programs") — treat as Home. */
        const homeLabelFromCategoryOnly =
          isHomePageEntry &&
          !firstIsHero &&
          categoryLabel !== "" &&
          !isGenericLabel &&
          rawLabel.trim() === categoryLabel;
        const fallbackLabel = categoryLabel || (slug && !isGenericSlug ? slug.replace(/-/g, " ") : `Page ${index + 1}`);
        const label = isGenericLabel
          ? (isHomePageEntry ? "Home" : fallbackLabel)
          : homeLabelFromCategoryOnly
            ? "Home"
            : rawLabel;
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
  const usedAnchorIds = new Set<string>();

  const toSectionLabel = (sectionId: string) => {
    const category = categoryLabelForSection(sectionId);
    if (category) return `${category} section`;
    return sectionId.replace(/[-_]/g, " ").replace(/--/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const mode = darkMode ? "dark" : "light";

  return (
    <div 
      data-theme={colorTheme}
      data-mode={mode}
      data-typography={typographyStyle}
      className={`min-h-screen bg-background flex flex-col client-site ${allFontVariables} ${getFontVariables(colorTheme, typographyStyle)}`}
    >
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
        headerStyle === "tubelight" ? (
          <TubelightHeader
            brandName={brand.name}
            logoUrl={brand.logoUrl}
            navigation={navigationFromSections}
            ctaText={brand.ctaText ?? data.hero?.primaryCTA ?? "Get started"}
            ctaHref={brand.ctaHref ?? "#contact"}
          />
        ) : headerStyle === "megamenu" ? (
          <MegamenuHeader
            brandName={brand.name}
            logoUrl={brand.logoUrl}
            navigation={navigationFromSections}
            ctaText={brand.ctaText ?? data.hero?.primaryCTA ?? "Get started"}
            ctaHref={brand.ctaHref ?? "#contact"}
          />
        ) : (
          <Header
            brandName={brand.name}
            logoUrl={brand.logoUrl}
            navigation={navigationFromSections}
            ctaText={brand.ctaText ?? data.hero?.primaryCTA ?? "Get started"}
            ctaHref={brand.ctaHref ?? "#contact"}
            headerStyle={headerStyle}
          />
        )
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
          sectionContent = renderSection(sectionId, data, brand, theme, contact, index, key);

          if (!sectionContent) return null;
          const navEntry = SECTION_NAV_MAP[String(sectionId)];
          const suggestedAnchorId =
            typeof navEntry?.href === "string" && navEntry.href.startsWith("#")
              ? navEntry.href.slice(1)
              : "";
          const stableAnchorId =
            suggestedAnchorId && !usedAnchorIds.has(suggestedAnchorId) ? suggestedAnchorId : "";
          if (stableAnchorId) {
            usedAnchorIds.add(stableAnchorId);
          }
          const sectionLabel = toSectionLabel(String(sectionId));

          return (
            <section
              key={key}
              id={stableAnchorId || `section-${sectionId}-${index}`}
              aria-label={sectionLabel}
              data-section={sectionId}
              data-section-id={sectionId}
              data-section-index={index}
              className="scroll-mt-24"
            >
              {sectionContent}
            </section>
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

      <SmartContactCTA
        phone={brand.phone ?? contact.phone}
        messengerUrl={messengerStickyCTA?.messengerUrl ?? contact.messenger}
        viberNumber={messengerStickyCTA?.viberNumber ?? contact.viber}
        ctaText={brand.ctaText ?? data.hero?.primaryCTA ?? "Book Service"}
        ctaHref={brand.ctaHref ?? "#contact"}
      />
    </div>
  );
}
