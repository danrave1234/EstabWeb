"use client"

/**
 * SectionLivePreview
 * Extracted from ClientDashboardPreview.tsx — handles the hover-to-preview
 * thumbnails shown in the section picker.
 *
 * Adding a new block preview:
 *  1. Add a `LivePreview*` dynamic import below.
 *  2. Add a `case` in `prefetchSectionPreview`.
 *  3. Add a `case` in the `content` useMemo inside SectionLivePreview.
 *  4. The previewKind is driven by block-registry.ts — no changes needed here.
 */

import * as React from "react"
import dynamic from "next/dynamic"
import { getPreviewKind } from "@/lib/utils/block-registry"
import {
  DEFAULT_PRACTICE_AREAS,
  DEFAULT_HOW_IT_WORKS,
  DEFAULT_TREATMENT_PROCESS,
  DEFAULT_AWARDS_STRIP,
  DEFAULT_BEFORE_AFTER_GALLERY,
  DEFAULT_COMMON_PESTS,
  DEFAULT_FEATURED_LISTINGS,
  DEFAULT_DEVELOPER_PARTNERS,
  DEFAULT_REVIEW_TRUST_BAR,
  DEFAULT_FINANCING,
  DEFAULT_AC_TYPES,
  DEFAULT_PRICE_PREVIEW,
  DEFAULT_PRICING_TABLE,
  DEFAULT_MAINTENANCE_PLANS,
  DEFAULT_FACEBOOK_REVIEW_EMBED,
  DEFAULT_WHY_CHOOSE_ME,
  DEFAULT_SERVICE_AREA_MAP,
  DEFAULT_LOGO_CLOUD,
  DEFAULT_DELIVERY_COVERAGE,
  DEFAULT_FAQ_ACCORDION,
  DEFAULT_BLOG,
} from "@/config/dashboard-config"

// ── Live-preview dynamic imports (ssr: false — section picker only) ──────────
const LivePreviewFeaturesGrid = dynamic(() => import("@/components/blocks/FeaturesGrid"), { ssr: false })
const LivePreviewFeaturesModern = dynamic(() => import("@/components/blocks/FeaturesModern"), { ssr: false })
const LivePreviewPracticeAreas = dynamic(() => import("@/components/blocks/PracticeAreasGrid"), { ssr: false })
const LivePreviewHowItWorks = dynamic(() => import("@/components/blocks/HowItWorksSteps"), { ssr: false })
const LivePreviewTreatmentProcess = dynamic(() => import("@/components/blocks/TreatmentProcessTimeline"), { ssr: false })
const LivePreviewAwardsStrip = dynamic(() => import("@/components/blocks/AwardsStrip"), { ssr: false })
const LivePreviewBeforeAfterSlider = dynamic(() => import("@/components/blocks/BeforeAfterSlider"), { ssr: false })
const LivePreviewBeforeAfterGallery = dynamic(() => import("@/components/blocks/BeforeAfterGalleryGrid"), { ssr: false })
const LivePreviewTrustBadges = dynamic(() => import("@/components/blocks/TrustBadgesGrid"), { ssr: false })
const LivePreviewSafetySection = dynamic(() => import("@/components/blocks/SafetySection"), { ssr: false })
const LivePreviewLogoCloud = dynamic(() => import("@/components/blocks/LogoCloud"), { ssr: false })
const LivePreviewACTypes = dynamic(() => import("@/components/blocks/ACTypesGrid"), { ssr: false })
const LivePreviewPricingTable = dynamic(() => import("@/components/blocks/PricingTable"), { ssr: false })
const LivePreviewFeaturedListings = dynamic(() => import("@/components/blocks/FeaturedListingsGrid"), { ssr: false })
const LivePreviewFinancingSection = dynamic(() => import("@/components/blocks/FinancingSection"), { ssr: false })
const LivePreviewDeveloperPartners = dynamic(() => import("@/components/blocks/DeveloperPartnersLogos"), { ssr: false })
const LivePreviewWhyChooseMe = dynamic(() => import("@/components/blocks/WhyChooseMe"), { ssr: false })
const LivePreviewServiceAreaMap = dynamic(() => import("@/components/blocks/ServiceAreaMap"), { ssr: false })
const LivePreviewPricePreviewStrip = dynamic(() => import("@/components/blocks/PricePreviewStrip"), { ssr: false })
const LivePreviewEmergencyCTAStrip = dynamic(() => import("@/components/blocks/EmergencyCTAStrip"), { ssr: false })
const LivePreviewMaintenancePlans = dynamic(() => import("@/components/blocks/MaintenancePlans"), { ssr: false })
const LivePreviewPromoCTASection = dynamic(() => import("@/components/blocks/PromoCTASection"), { ssr: false })
const LivePreviewPromoBannerStrip = dynamic(() => import("@/components/blocks/PromoBannerStrip"), { ssr: false })
const LivePreviewPaymentOptionsStrip = dynamic(() => import("@/components/blocks/PaymentOptionsStrip"), { ssr: false })
const LivePreviewStatsSection = dynamic(() => import("@/components/blocks/StatsSection"), { ssr: false })
const LivePreviewFAQAccordion = dynamic(() => import("@/components/blocks/FAQAccordion"), { ssr: false })
const LivePreviewCommonPests = dynamic(() => import("@/components/blocks/CommonPestsGrid"), { ssr: false })
const LivePreviewWarrantyBlock = dynamic(() => import("@/components/blocks/WarrantyGuaranteeBlock"), { ssr: false })
const LivePreviewFacebookReviewEmbed = dynamic(() => import("@/components/blocks/FacebookReviewEmbed"), { ssr: false })

// ── Prefetch on hover ────────────────────────────────────────────────────────
export function prefetchSectionPreview(id: string) {
  switch (id) {
    case "features":
    case "services-grid":
    case "project-gallery":
    case "programs-grid":
    case "faculty-grid":
      void import("@/components/blocks/FeaturesGrid"); return
    case "features-modern":
      void import("@/components/blocks/FeaturesModern"); return
    case "practice-areas":
      void import("@/components/blocks/PracticeAreasGrid"); return
    case "how-it-works":
      void import("@/components/blocks/HowItWorksSteps"); return
    case "treatment-process":
      void import("@/components/blocks/TreatmentProcessTimeline"); return
    case "awards":
    case "certifications":
      void import("@/components/blocks/AwardsStrip"); return
    case "before-after-slider":
      void import("@/components/blocks/BeforeAfterSlider"); return
    case "before-after-gallery-grid":
      void import("@/components/blocks/BeforeAfterGalleryGrid"); return
    case "trust-badges-grid":
      void import("@/components/blocks/TrustBadgesGrid"); return
    case "safety-section":
      void import("@/components/blocks/SafetySection"); return
    case "logo-cloud":
      void import("@/components/blocks/LogoCloud"); return
    case "ac-types-grid":
      void import("@/components/blocks/ACTypesGrid"); return
    case "pricing":
      void import("@/components/blocks/PricingTable"); return
    case "featured-properties-grid":
      void import("@/components/blocks/FeaturedListingsGrid"); return
    case "financing-section":
      void import("@/components/blocks/FinancingSection"); return
    case "developer-partners":
      void import("@/components/blocks/DeveloperPartnersLogos"); return
    case "why-choose-me":
      void import("@/components/blocks/WhyChooseMe"); return
    case "service-area-map":
      void import("@/components/blocks/ServiceAreaMap"); return
    case "price-preview-strip":
      void import("@/components/blocks/PricePreviewStrip"); return
    case "emergency-cta-strip":
      void import("@/components/blocks/EmergencyCTAStrip"); return
    case "maintenance-plans":
      void import("@/components/blocks/MaintenancePlans"); return
    case "promo-cta-section":
      void import("@/components/blocks/PromoCTASection"); return
    case "promo-banner-strip":
      void import("@/components/blocks/PromoBannerStrip"); return
    case "payment-options-strip":
      void import("@/components/blocks/PaymentOptionsStrip"); return
    case "stats-section":
      void import("@/components/blocks/StatsSection"); return
    case "faq-accordion":
      void import("@/components/blocks/FAQAccordion"); return
    case "common-pests":
      void import("@/components/blocks/CommonPestsGrid"); return
    case "warranty-block":
      void import("@/components/blocks/WarrantyGuaranteeBlock"); return
    case "facebook-review-embed":
      void import("@/components/blocks/FacebookReviewEmbed"); return
    default:
      return
  }
}

// ── Minimal skeleton previews ────────────────────────────────────────────────
function MinimalSectionPreview({ kind }: { kind: ReturnType<typeof getPreviewKind> }) {
  return (
    <div className="w-full aspect-video rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
      <div className="w-full h-full p-3 animate-pulse">
        {kind === "strip" && (
          <>
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="h-10 rounded bg-muted" />
              <div className="h-10 rounded bg-muted" />
              <div className="h-10 rounded bg-muted" />
              <div className="h-10 rounded bg-muted" />
            </div>
            <div className="mt-3 h-16 rounded bg-muted" />
          </>
        )}

        {kind === "logos" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted" />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-6 gap-2 opacity-70">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-muted" />
              ))}
            </div>
          </>
        )}

        {kind === "timeline" && (
          <>
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="mt-5 h-1 rounded bg-muted" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/40 bg-background/40 p-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="mt-3 h-3 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-10 rounded bg-muted" />
                </div>
              ))}
            </div>
          </>
        )}

        {(kind === "cards-3" || kind === "cards-4") && (
          <>
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className={`mt-4 grid ${kind === "cards-4" ? "grid-cols-4" : "grid-cols-3"} gap-2`}>
              {Array.from({ length: kind === "cards-4" ? 4 : 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded bg-muted" />
              ))}
            </div>
            <div className="mt-3 h-20 rounded bg-muted" />
            <div className="mt-2 flex gap-2">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
          </>
        )}

        {kind === "pricing" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/40 bg-background/40 p-3">
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="mt-3 h-6 w-1/2 rounded bg-muted" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-2 w-5/6 rounded bg-muted" />
                    <div className="h-2 w-4/6 rounded bg-muted" />
                  </div>
                  <div className="mt-4 h-8 rounded bg-muted" />
                </div>
              ))}
            </div>
          </>
        )}

        {kind === "faq" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted" />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-16 rounded bg-muted" />
              <div className="h-16 rounded bg-muted" />
            </div>
          </>
        )}

        {kind === "gallery" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded bg-muted" />
              ))}
            </div>
          </>
        )}

        {kind === "map" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 h-32 rounded bg-muted" />
            <div className="mt-3 flex gap-2">
              <div className="h-3 w-16 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </>
        )}

        {kind === "cta" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 h-20 rounded bg-muted" />
            <div className="mt-3 flex gap-2">
              <div className="h-8 w-24 rounded bg-muted" />
              <div className="h-8 w-24 rounded bg-muted" />
            </div>
          </>
        )}

        {kind === "stats" && (
          <>
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/40 bg-background/40 p-3">
                  <div className="h-6 w-1/2 rounded bg-muted" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          </>
        )}

        {kind === "generic" && (
          <>
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="mt-4 h-24 rounded bg-muted" />
            <div className="mt-3 h-16 rounded bg-muted" />
            <div className="mt-2 flex gap-2">
              <div className="h-8 w-24 rounded bg-muted" />
              <div className="h-8 w-24 rounded bg-muted" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export function SectionLivePreview({ id }: { id: string }) {
  const [hovered, setHovered] = React.useState(false)
  const prefetchedRef = React.useRef(false)

  const STAGE_W = 1920
  const STAGE_H = 1080

  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = React.useState(0.18)

  React.useLayoutEffect(() => {
    if (!hovered) return
    const el = viewportRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const w = rect.width || 0
      const h = rect.height || 0
      if (w <= 0 || h <= 0) return
      const next = Math.min(w / STAGE_W, h / STAGE_H)
      setScale(next)
    }

    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      ro.disconnect()
    }
  }, [hovered])

  const content = React.useMemo(() => {
    if (!hovered) return null
    switch (id) {
      case "features":
      case "services-grid":
      case "project-gallery":
      case "programs-grid":
      case "faculty-grid": {
        const fallbackFeatures = (DEFAULT_PRACTICE_AREAS.items || []).map((it: any) => ({
          title: it.title,
          description: it.description,
          icon: it.icon,
        }))
        return (
          <LivePreviewFeaturesGrid
            title="Our Services"
            subtitle="What we can do for you"
            features={fallbackFeatures}
          />
        )
      }
      case "features-modern": {
        const items = (DEFAULT_PRACTICE_AREAS.items || []).map((it: any) => ({
          title: it.title,
          description: it.description,
          icon: it.icon,
        }))
        return (
          <LivePreviewFeaturesModern
            title="Our Services"
            subtitle="Fast, friendly, reliable"
            features={items}
          />
        )
      }
      case "practice-areas":
        return (
          <LivePreviewPracticeAreas
            title={DEFAULT_PRACTICE_AREAS.title}
            subtitle={DEFAULT_PRACTICE_AREAS.subtitle}
            items={DEFAULT_PRACTICE_AREAS.items as any}
            linkText="Learn More"
          />
        )
      case "how-it-works":
        return (
          <LivePreviewHowItWorks
            title={DEFAULT_HOW_IT_WORKS.title}
            subtitle={DEFAULT_HOW_IT_WORKS.subtitle}
            steps={DEFAULT_HOW_IT_WORKS.steps as any}
          />
        )
      case "treatment-process":
        return (
          <LivePreviewTreatmentProcess
            title={DEFAULT_TREATMENT_PROCESS.title}
            subtitle={DEFAULT_TREATMENT_PROCESS.subtitle}
            steps={DEFAULT_TREATMENT_PROCESS.steps as any}
          />
        )
      case "awards":
      case "certifications":
        return <LivePreviewAwardsStrip title={DEFAULT_AWARDS_STRIP.title} items={DEFAULT_AWARDS_STRIP.items as any} />
      case "trust-badges-grid": {
        const items = (DEFAULT_AWARDS_STRIP.items || []).map((it: any) => ({
          label: it.label,
          sublabel: it.sublabel,
          icon: it.icon || "Award",
          imageUrl: it.imageUrl,
        }))
        return <LivePreviewTrustBadges title="Trusted By" subtitle="Social proof" items={items as any} />
      }
      case "before-after-slider":
        return (
          <LivePreviewBeforeAfterSlider
            title="Before & After"
            subtitle="See the difference"
            beforeImage={(DEFAULT_BEFORE_AFTER_GALLERY.items?.[0] as any)?.beforeImage || ""}
            afterImage={(DEFAULT_BEFORE_AFTER_GALLERY.items?.[0] as any)?.afterImage || ""}
            beforeLabel={DEFAULT_BEFORE_AFTER_GALLERY.beforeLabel}
            afterLabel={DEFAULT_BEFORE_AFTER_GALLERY.afterLabel}
          />
        )
      case "before-after-gallery-grid":
        return (
          <LivePreviewBeforeAfterGallery
            title="Before & After"
            subtitle="See the difference"
            items={DEFAULT_BEFORE_AFTER_GALLERY.items as any}
          />
        )
      case "safety-section":
        return <LivePreviewSafetySection title="Safety First" subtitle="Our commitment to you" items={[]} />
      case "logo-cloud":
        return (
          <LivePreviewLogoCloud
            title={DEFAULT_LOGO_CLOUD.title}
            items={DEFAULT_LOGO_CLOUD.items as any}
          />
        )
      case "ac-types-grid":
        return (
          <LivePreviewACTypes
            title={DEFAULT_AC_TYPES.title}
            subtitle={DEFAULT_AC_TYPES.subtitle}
            items={DEFAULT_AC_TYPES.items as any}
          />
        )
      case "pricing":
        return (
          <LivePreviewPricingTable
            title={DEFAULT_PRICING_TABLE.title}
            subtitle={DEFAULT_PRICING_TABLE.subtitle}
            plans={DEFAULT_PRICING_TABLE.plans as any}
          />
        )
      case "featured-properties-grid":
        return (
          <LivePreviewFeaturedListings
            title={DEFAULT_FEATURED_LISTINGS.title}
            subtitle={DEFAULT_FEATURED_LISTINGS.subtitle}
            items={DEFAULT_FEATURED_LISTINGS.items as any}
          />
        )
      case "financing-section":
        return (
          <LivePreviewFinancingSection
            title={DEFAULT_FINANCING.title}
            subtitle={DEFAULT_FINANCING.subtitle}
            items={DEFAULT_FINANCING.items as any}
          />
        )
      case "developer-partners":
        return (
          <LivePreviewDeveloperPartners
            title={DEFAULT_DEVELOPER_PARTNERS.title}
            items={DEFAULT_DEVELOPER_PARTNERS.items as any}
          />
        )
      case "why-choose-me": {
        const w = DEFAULT_WHY_CHOOSE_ME as any
        return (
          <LivePreviewWhyChooseMe
            title={w.title}
            subtitle={w.subtitle}
            agentName={w.agentName ?? "Juan Dela Cruz"}
            agentRole={w.agentRole ?? "Licensed Professional"}
            licenseNumber={w.licenseNumber ?? "#12345"}
            agentBio={w.agentBio ?? "Add your bio"}
            agentImageUrl={w.agentImageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"}
            trustSignals={(Array.isArray(w.trustSignals) ? w.trustSignals : []) as any}
            licensedBrokerLabel={w.licensedBrokerLabel}
            inquireNowLabel={w.inquireNowLabel}
          />
        )
      }
      case "service-area-map":
        return (
          <LivePreviewServiceAreaMap
            title={DEFAULT_SERVICE_AREA_MAP.title}
            subtitle={DEFAULT_SERVICE_AREA_MAP.subtitle}
            cities={(DEFAULT_SERVICE_AREA_MAP.cities ?? []) as any}
            googleMapsEmbedUrl={(DEFAULT_SERVICE_AREA_MAP as any).googleMapsEmbedUrl}
          />
        )
      case "price-preview-strip":
        return (
          <LivePreviewPricePreviewStrip
            title={DEFAULT_PRICE_PREVIEW.title}
            items={DEFAULT_PRICE_PREVIEW.items as any}
          />
        )
      case "emergency-cta-strip":
        return <LivePreviewEmergencyCTAStrip title="Emergency? We're here." phone="(555) 000-0000" />
      case "maintenance-plans":
        return (
          <LivePreviewMaintenancePlans
            title={DEFAULT_MAINTENANCE_PLANS.title}
            subtitle={DEFAULT_MAINTENANCE_PLANS.subtitle}
            plans={DEFAULT_MAINTENANCE_PLANS.plans as any}
          />
        )
      case "promo-cta-section":
        return <LivePreviewPromoCTASection title="Limited Time Offer" subtitle="Book today and save." buttonText="Claim Offer" buttonHref="#" />
      case "promo-banner-strip":
        return <LivePreviewPromoBannerStrip text="Special Offer — This week only" />
      case "payment-options-strip":
        return <LivePreviewPaymentOptionsStrip title="We Accept" />
      case "stats-section":
        return (
          <LivePreviewStatsSection
            title="By the Numbers"
            subtitle="Our track record"
            items={[
              { label: "Happy Clients", value: "500+" },
              { label: "Projects Done", value: "1,200+" },
              { label: "Years Experience", value: "10+" },
              { label: "5-Star Reviews", value: "300+" },
            ]}
          />
        )
      case "faq-accordion":
        return (
          <LivePreviewFAQAccordion
            title={DEFAULT_FAQ_ACCORDION.title}
            subtitle={DEFAULT_FAQ_ACCORDION.subtitle}
            items={DEFAULT_FAQ_ACCORDION.items as any}
          />
        )
      case "common-pests":
        return (
          <LivePreviewCommonPests
            title={DEFAULT_COMMON_PESTS.title}
            subtitle={DEFAULT_COMMON_PESTS.subtitle}
            items={DEFAULT_COMMON_PESTS.items as any}
          />
        )
      case "warranty-block":
        return <LivePreviewWarrantyBlock title="Our Guarantee" subtitle="100% satisfaction or your money back." />
      case "facebook-review-embed":
        return (
          <LivePreviewFacebookReviewEmbed
            title={DEFAULT_FACEBOOK_REVIEW_EMBED.title}
            subtitle={DEFAULT_FACEBOOK_REVIEW_EMBED.subtitle}
            reviews={DEFAULT_FACEBOOK_REVIEW_EMBED.reviews as any}
          />
        )
      default:
        return null
    }
  }, [hovered, id])

  return (
    <div
      className="mt-3 relative"
      onMouseEnter={() => {
        if (!prefetchedRef.current) {
          prefetchedRef.current = true
          prefetchSectionPreview(id)
        }
        setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        if (!prefetchedRef.current) {
          prefetchedRef.current = true
          prefetchSectionPreview(id)
        }
        setHovered(true)
      }}
      onBlur={() => setHovered(false)}
    >
      <MinimalSectionPreview kind={getPreviewKind(id)} />

      {hovered && (
        <div className="absolute inset-0 z-20 rounded-lg border border-primary/25 bg-background shadow-2xl overflow-hidden">
          <div ref={viewportRef} className="w-full h-full overflow-hidden bg-background">
            <div className="pointer-events-none">
              <div
                className="origin-top-left"
                style={{
                  width: STAGE_W,
                  height: STAGE_H,
                  transform: `scale(${scale})`,
                }}
              >
                {content ?? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[70%] h-[60%] bg-muted/20 border border-border rounded-xl flex items-center justify-center">
                      <div className="text-xs font-semibold text-muted-foreground">Loading preview…</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
