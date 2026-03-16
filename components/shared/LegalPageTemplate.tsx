"use client"

import React from "react";
import { useLivePreview } from "./LivePreviewProvider";
import Header from "@/components/shared/Header";
import TubelightHeader from "@/components/shared/TubelightHeader";
import MegamenuHeader from "@/components/shared/MegamenuHeader";
import LeadMagnetFooter from "@/components/blocks/LeadMagnetFooter";
import SimpleFooter from "@/components/blocks/SimpleFooter";
import MinimalFooter from "@/components/blocks/MinimalFooter";

interface LegalPageTemplateProps {
  title: string;
  lastUpdated?: string;
  content?: string;
  serverData: any;
}

export default function LegalPageTemplate({ title, lastUpdated, content, serverData }: LegalPageTemplateProps) {
  const previewData = useLivePreview();
  const data = previewData || serverData;
  
  // Use data from config if available, fallback to provided content
  const legalData = data?.legal?.[title.toLowerCase().replace(/\s+/g, '')] || {};
  const displayTitle = legalData.title || title;
  const displayContent = legalData.content || content || "Content coming soon...";
  const displayDate = legalData.lastUpdated || lastUpdated || new Date().toLocaleDateString();

  const brand = data?.brand || { name: "Site", logoUrl: "" };
  const hero = data?.hero || {};
  const contact = data?.contact || {};
  const footer = data?.footer || {};
  const headerStyle = data?.headerStyle || "solid";
  const footerStyle = data?.footerStyle || "lead-magnet";

  const defaultNav = [
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "/contact" },
  ];

  const slugify = (value: string) => value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const pageCategoryLabels: Record<string, string> = {
    "hero": "Home",
    "hero--emergency": "Home",
    "hero--video": "Home",
    "hero--split": "Home",
    "review-trust-bar": "Reviews",
    "reviews-grid": "Reviews",
    "facebook-review-embed": "Reviews",
    "testimonials": "Reviews",
    "trust-badges-grid": "Trust",
    "awards": "Credentials",
    "pricing": "Pricing",
    "pricing-table": "Pricing",
    "packages-pricing": "Pricing",
    "practice-areas": "Services",
    "features": "Services",
    "features-modern": "Services",
    "services-grid": "Services",
    "feature-highlight": "Highlights",
    "how-it-works": "How It Works",
    "treatment-process": "Process",
    "patient-faq": "FAQ",
    "faq-accordion": "FAQ",
    "faq-two-column": "FAQ",
    "team-carousel": "Team",
    "team-grid": "Team",
    "attorney-profile": "About",
    "contact": "Contact",
    "contact-minimal": "Contact",
    "contact-visual": "Contact",
    "contact-with-map": "Contact",
    "contact-columns": "Contact",
  };

  const categoryLabelForSection = (sectionId: string) => {
    if (sectionId === "hero" || sectionId.startsWith("hero--") || sectionId === "hero-emergency") return "Home";
    return pageCategoryLabels[sectionId] || "";
  };
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
          const label = (isGenericLabel || categoryLabel) ? fallbackLabel : rawLabel;
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
    Array.isArray((data as any)?.navigation) && (data as any).navigation.length > 0
      ? (data as any).navigation
      : pagesNav.length > 1 || pagesNav.some((item: any) => item.href !== "/")
        ? pagesNav
        : defaultNav;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {headerStyle === "tubelight" ? (
        <TubelightHeader
          brandName={brand.name}
          logoUrl={brand.logoUrl}
          navigation={navigationFromSections}
          ctaText={brand.ctaText ?? hero.primaryCTA}
          ctaHref={brand.ctaHref ?? "#contact"}
        />
      ) : headerStyle === "megamenu" ? (
        <MegamenuHeader
          brandName={brand.name}
          logoUrl={brand.logoUrl}
          navigation={navigationFromSections}
          ctaText={brand.ctaText ?? hero.primaryCTA}
          ctaHref={brand.ctaHref ?? "#contact"}
        />
      ) : (
        <Header
          brandName={brand.name}
          logoUrl={brand.logoUrl}
          navigation={navigationFromSections}
          ctaText={brand.ctaText ?? hero.primaryCTA}
          ctaHref={brand.ctaHref ?? "#contact"}
          headerStyle={headerStyle}
        />
      )}

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight">{displayTitle}</h1>
        <p className="text-sm text-muted-foreground mb-12 flex items-center gap-2">
          <span className="w-1 h-1 bg-primary rounded-full" />
          Last updated: {displayDate}
        </p>
        
        <div 
          className="prose prose-neutral dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight 
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-bold
            prose-ul:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: displayContent.replace(/\n/g, '<br/>') }}
        />
      </main>

      {footerStyle === "lead-magnet" && (
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
      {footerStyle === "simple" && (
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
      {footerStyle === "minimal" && (
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
    </div>
  );
}
