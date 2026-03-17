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
import { BadgeDollarSign, ShieldCheck, Star, CheckCircle, Lock, Leaf, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPreviewKind } from "@/lib/utils/block-registry"
import {
  DEFAULT_PRACTICE_AREAS,
  DEFAULT_HOW_IT_WORKS,
  DEFAULT_TREATMENT_PROCESS,
  DEFAULT_AWARDS_STRIP,
  DEFAULT_BEFORE_AFTER_GALLERY,
  DEFAULT_AGENCY_BLOG,
  DEFAULT_AGENCY_CONTACT,
  DEFAULT_AGENCY_PRODUCTS,
  DEFAULT_COMMON_PESTS,
  DEFAULT_FEATURED_LISTINGS,
  DEFAULT_DEVELOPER_PARTNERS,
  DEFAULT_REVIEW_TRUST_BAR,
  DEFAULT_ANIMATED_TESTIMONIALS,
  DEFAULT_FINANCING,
  DEFAULT_VERTICAL_TABS,
  DEFAULT_FEATURES_BENTO,
  DEFAULT_FEATURES_V2,
  DEFAULT_AC_TYPES,
  DEFAULT_PRICE_PREVIEW,
  DEFAULT_PRICING_COMPARISON_TABLE,
  DEFAULT_PRICING_TABLE,
  DEFAULT_FACEBOOK_REVIEW_EMBED,
  DEFAULT_WHY_CHOOSE_ME,
  DEFAULT_SERVICE_AREA_MAP,
  DEFAULT_LOGO_CLOUD,
  DEFAULT_HERO_SHOWCASE,
  DEFAULT_FAQ_ACCORDION,
  DEFAULT_GYM_PROGRAMS,
  DEFAULT_GYM_SCHEDULE,
  DEFAULT_GYM_MEMBERSHIPS,
  DEFAULT_GYM_TRAINERS,
  DEFAULT_GYM_RESULTS,
  DEFAULT_GYM_FACILITY,
  DEFAULT_GYM_CLASS_TYPES,
  DEFAULT_GYM_FAQ,
  DEFAULT_TESTIMONIALS_COMMUNITY,
  DEFAULT_TESTIMONIALS_V2,
  DEFAULT_CTA_BEAMS,
  DEFAULT_GALLERY4,
  DEFAULT_GALLERY_GRID,
  DEFAULT_HERO_MINIMALISM,
  DEFAULT_HERO_MODERN,
  DEFAULT_HERO_GROUP_IMAGES,
  DEFAULT_HERO_V6,
  DEFAULT_HERO_V7,
  DEFAULT_TEAM_SHOWCASE,
  DEFAULT_FEATURE_STEPS,
  DEFAULT_FEATURE_SPOTLIGHT,
  DEFAULT_HERO_ELEGANT_CAROUSEL,
  DEFAULT_HERO_AERO_3,
  DEFAULT_HERO_EMERGENCY,
  DEFAULT_HERO,
  DEFAULT_HERO_CHIROPRACTOR,
  DEFAULT_HERO_DENTIST,
  DEFAULT_HERO_CLINIC,
  DEFAULT_HERO_CLEANING,
  DEFAULT_HERO_POOL,
  DEFAULT_HERO_PEST_CONTROL,
  DEFAULT_HERO_LAWYER,
  DEFAULT_HERO_GYM,
  DEFAULT_HERO_STARTUP,
} from "@/config/dashboard-config"

// ── Live-preview dynamic imports (ssr: false — section picker only) ──────────
const LivePreviewFeaturesGrid = dynamic(() => import("@/components/blocks/FeaturesGrid"), { ssr: false })
const LivePreviewFeaturesBento = dynamic(() => import("@/components/blocks/FeaturesBento"), { ssr: false })
const LivePreviewFeaturesModern = dynamic(() => import("@/components/blocks/FeaturesModern"), { ssr: false })
const LivePreviewFeaturesV2 = dynamic(() => import("@/components/blocks/FeaturesV2Block"), { ssr: false })
const LivePreviewVerticalTabs = dynamic(() => import("@/components/blocks/VerticalTabsBlock"), { ssr: false })
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
const LivePreviewPricingComparisonTable = dynamic(() => import("@/components/blocks/PricingComparisonTable"), { ssr: false })
const LivePreviewPricingSectionWithComparison = dynamic(() => import("@/components/blocks/PricingSectionWithComparisonBlock"), { ssr: false })
const LivePreviewFeaturedListings = dynamic(() => import("@/components/blocks/FeaturedListingsGrid"), { ssr: false })
const LivePreviewFinancingSection = dynamic(() => import("@/components/blocks/FinancingSection"), { ssr: false })
const LivePreviewDeveloperPartners = dynamic(() => import("@/components/blocks/DeveloperPartnersLogos"), { ssr: false })
const LivePreviewWhyChooseMe = dynamic(() => import("@/components/blocks/WhyChooseMe"), { ssr: false })
const LivePreviewServiceAreaMap = dynamic(() => import("@/components/blocks/ServiceAreaMap"), { ssr: false })
const LivePreviewPricePreviewStrip = dynamic(() => import("@/components/blocks/PricePreviewStrip"), { ssr: false })
const LivePreviewEmergencyCTAStrip = dynamic(() => import("@/components/blocks/EmergencyCTAStrip"), { ssr: false })
const LivePreviewPromoCTASection = dynamic(() => import("@/components/blocks/PromoCTASection"), { ssr: false })
const LivePreviewPromoBannerStrip = dynamic(() => import("@/components/blocks/PromoBannerStrip"), { ssr: false })
const LivePreviewPaymentOptionsStrip = dynamic(() => import("@/components/blocks/PaymentOptionsStrip"), { ssr: false })
const LivePreviewStatsSection = dynamic(() => import("@/components/blocks/StatsSection"), { ssr: false })
const LivePreviewFAQAccordion = dynamic(() => import("@/components/blocks/FAQAccordion"), { ssr: false })
const LivePreviewCommonPests = dynamic(() => import("@/components/blocks/CommonPestsGrid"), { ssr: false })
const LivePreviewWarrantyBlock = dynamic(() => import("@/components/blocks/WarrantyGuaranteeBlock"), { ssr: false })
const LivePreviewFacebookReviewEmbed = dynamic(() => import("@/components/blocks/FacebookReviewEmbed"), { ssr: false })
const LivePreviewAnimatedTestimonials = dynamic(() => import("@/components/blocks/AnimatedTestimonialsBlock"), { ssr: false })
const LivePreviewTeamGrid = dynamic(() => import("@/components/blocks/TeamGrid"), { ssr: false })
const LivePreviewTeamCarousel = dynamic(() => import("@/components/blocks/TeamCarousel"), { ssr: false })
const LivePreviewTeamShowcase = dynamic(() => import("@/components/blocks/TeamShowcaseBlock"), { ssr: false })
const LivePreviewAttorneyProfile = dynamic(() => import("@/components/blocks/AttorneyProfile"), { ssr: false })
const LivePreviewBlogGrid = dynamic(() => import("@/components/blocks/BlogGrid"), { ssr: false })
const LivePreviewAgencyBlog = dynamic(() => import("@/components/blocks/AgencyBlogBlock"), { ssr: false })
const LivePreviewContactMinimal = dynamic(() => import("@/components/blocks/ContactMinimal"), { ssr: false })
const LivePreviewContactWithMap = dynamic(() => import("@/components/blocks/ContactWithMap"), { ssr: false })
const LivePreviewContactColumns = dynamic(() => import("@/components/blocks/ContactColumns"), { ssr: false })
const LivePreviewContactSplit = dynamic(() => import("@/components/blocks/ContactSplit"), { ssr: false })
const LivePreviewContactVisual = dynamic(() => import("@/components/blocks/ContactVisual"), { ssr: false })
const LivePreviewAgencyContact = dynamic(() => import("@/components/blocks/AgencyContactBlock"), { ssr: false })
const LivePreviewAgencyProducts = dynamic(() => import("@/components/blocks/AgencyProductsBlock"), { ssr: false })
const LivePreviewCoverageRadius = dynamic(() => import("@/components/blocks/CoverageRadiusBlock"), { ssr: false })
const LivePreviewFAQTwoColumn = dynamic(() => import("@/components/blocks/FAQTwoColumn"), { ssr: false })
const LivePreviewMaintenancePlans = dynamic(() => import("@/components/blocks/MaintenancePlans"), { ssr: false })
const LivePreviewFreeConsultation = dynamic(() => import("@/components/blocks/FreeConsultationForm"), { ssr: false })
const LivePreviewMessengerStickyCTA = dynamic(() => import("@/components/blocks/MessengerStickyCTA"), { ssr: false })
const LivePreviewHeroShowcase = dynamic(() => import("@/components/blocks/HeroShowcase"), { ssr: false })
const LivePreviewHeroMinimalism = dynamic(() => import("@/components/blocks/HeroMinimalismBlock"), { ssr: false })
const LivePreviewGymPrograms = dynamic(() => import("@/components/blocks/GymPrograms"), { ssr: false })
const LivePreviewGymClassSchedule = dynamic(() => import("@/components/blocks/GymClassSchedule"), { ssr: false })
const LivePreviewGymMembershipTiers = dynamic(() => import("@/components/blocks/GymMembershipTiers"), { ssr: false })
const LivePreviewGymTrainers = dynamic(() => import("@/components/blocks/GymTrainers"), { ssr: false })
const LivePreviewGymResultsStories = dynamic(() => import("@/components/blocks/GymResultsStories"), { ssr: false })
const LivePreviewGymFacilityHighlights = dynamic(() => import("@/components/blocks/GymFacilityHighlights"), { ssr: false })
const LivePreviewGymClassTypes = dynamic(() => import("@/components/blocks/GymClassTypes"), { ssr: false })
const LivePreviewGymFaq = dynamic(() => import("@/components/blocks/GymFaq"), { ssr: false })
const LivePreviewAnimatedTestimonialsCommunity = dynamic(() => import("@/components/blocks/AnimatedTestimonialsCommunityBlock"), { ssr: false })
const LivePreviewTestimonialsV2 = dynamic(() => import("@/components/blocks/TestimonialsV2Block"), { ssr: false })
const LivePreviewBackgroundBeamsCTA = dynamic(() => import("@/components/blocks/BackgroundBeamsCTABlock"), { ssr: false })
const LivePreviewGallery4 = dynamic(() => import("@/components/blocks/Gallery4Block"), { ssr: false })
const LivePreviewGalleryGrid = dynamic(() => import("@/components/blocks/GalleryGridBlock"), { ssr: false })
const LivePreviewFeatureSteps = dynamic(() => import("@/components/blocks/FeatureStepsBlock"), { ssr: false })
const LivePreviewFeatureSpotlight = dynamic(() => import("@/components/blocks/FeatureSpotlightBlock"), { ssr: false })

// Hero variants
const LivePreviewHeroBlock = dynamic(() => import("@/components/blocks/HeroBlock"), { ssr: false })
const LivePreviewHeroEmergency = dynamic(() => import("@/components/blocks/HeroEmergency"), { ssr: false })
const LivePreviewHeroAero3 = dynamic(() => import("@/components/blocks/HeroAero3"), { ssr: false })
const LivePreviewHeroAuthority = dynamic(() => import("@/components/blocks/HeroAuthority"), { ssr: false })
const LivePreviewHeroSaas = dynamic(() => import("@/components/blocks/HeroSaas"), { ssr: false })
const LivePreviewHeroChiropractor = dynamic(() => import("@/components/blocks/HeroChiropractor"), { ssr: false })
const LivePreviewHeroDentist = dynamic(() => import("@/components/blocks/HeroDentist"), { ssr: false })
const LivePreviewHeroClinic = dynamic(() => import("@/components/blocks/HeroClinic"), { ssr: false })
const LivePreviewHeroCleaning = dynamic(() => import("@/components/blocks/HeroCleaning"), { ssr: false })
const LivePreviewHeroPool = dynamic(() => import("@/components/blocks/HeroPool"), { ssr: false })
const LivePreviewHeroPestControl = dynamic(() => import("@/components/blocks/HeroPestControl"), { ssr: false })
const LivePreviewHeroGym = dynamic(() => import("@/components/blocks/HeroGym"), { ssr: false })
const LivePreviewElegantCarousel = dynamic(() => import("@/components/blocks/ElegantCarouselBlock"), { ssr: false })
const LivePreviewModernHero = dynamic(() => import("@/components/blocks/ModernHeroBlock"), { ssr: false })
const LivePreviewHeroGroupImages = dynamic(() => import("@/components/blocks/HeroWithGroupImagesBlock"), { ssr: false })
const LivePreviewHeroV6 = dynamic(() => import("@/components/blocks/HeroV6Block"), { ssr: false })
const LivePreviewHeroV7 = dynamic(() => import("@/components/blocks/HeroV7Block"), { ssr: false })

// ── Prefetch on hover ────────────────────────────────────────────────────────
export function prefetchSectionPreview(id: string) {
  switch (id) {
    case "features":
    case "services-grid":
    case "project-gallery":
    case "programs-grid":
    case "faculty-grid":
      void import("@/components/blocks/FeaturesGrid"); return
    case "services--bento":
    case "services-bento":
      void import("@/components/blocks/FeaturesBento"); return
    case "features-modern":
      void import("@/components/blocks/FeaturesModern"); return
    case "services--vertical-tabs":
      void import("@/components/blocks/VerticalTabsBlock"); return
    case "services--features-v2":
      void import("@/components/blocks/FeaturesV2Block"); return
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
    case "pricing--comparison":
    case "pricing-comparison-table":
      void import("@/components/blocks/PricingComparisonTable"); return
    case "pricing--feature-comparison":
    case "pricing-section-with-comparison":
      void import("@/components/blocks/PricingSectionWithComparisonBlock"); return
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
    case "testimonials--animated":
      void import("@/components/blocks/AnimatedTestimonialsBlock"); return
    case "hero--showcase":
    case "hero-showcase":
      void import("@/components/blocks/HeroShowcase"); return
    case "hero--minimalism":
      void import("@/components/blocks/HeroMinimalismBlock"); return
    case "hero--elegant-carousel":
      void import("@/components/blocks/ElegantCarouselBlock"); return
    case "hero--modern":
      void import("@/components/blocks/ModernHeroBlock"); return
    case "hero--group-images":
      void import("@/components/blocks/HeroWithGroupImagesBlock"); return
    case "hero--v6":
      void import("@/components/blocks/HeroV6Block"); return
    case "hero--v7":
      void import("@/components/blocks/HeroV7Block"); return
    case "gym--programs":
      void import("@/components/blocks/GymPrograms"); return
    case "gym--schedule":
      void import("@/components/blocks/GymClassSchedule"); return
    case "gym--memberships":
      void import("@/components/blocks/GymMembershipTiers"); return
    case "gym--trainers":
      void import("@/components/blocks/GymTrainers"); return
    case "gym--results":
      void import("@/components/blocks/GymResultsStories"); return
    case "gym--facility":
      void import("@/components/blocks/GymFacilityHighlights"); return
    case "gym--class-types":
      void import("@/components/blocks/GymClassTypes"); return
    case "gym--faq":
      void import("@/components/blocks/GymFaq"); return
    case "testimonials--community":
      void import("@/components/blocks/AnimatedTestimonialsCommunityBlock"); return
    case "testimonials--v2":
      void import("@/components/blocks/TestimonialsV2Block"); return
    case "cta--beams":
      void import("@/components/blocks/BackgroundBeamsCTABlock"); return
    case "gallery--carousel":
      void import("@/components/blocks/Gallery4Block"); return
    case "gallery--grid":
      void import("@/components/blocks/GalleryGridBlock"); return
    case "team--showcase":
      void import("@/components/blocks/TeamShowcaseBlock"); return
    case "features--steps":
      void import("@/components/blocks/FeatureStepsBlock"); return
    case "features--spotlight":
      void import("@/components/blocks/FeatureSpotlightBlock"); return
    case "blog--agency":
      void import("@/components/blocks/AgencyBlogBlock"); return
    case "contact--agency":
      void import("@/components/blocks/AgencyContactBlock"); return
    case "products--agency":
      void import("@/components/blocks/AgencyProductsBlock"); return
    default:
      return
  }
}

// ── Minimal skeleton previews ────────────────────────────────────────────────
function MinimalSectionPreview({ kind }: { kind: ReturnType<typeof getPreviewKind> }) {
  const isHero = kind === "hero"
  return (
    <div className={cn(
      "w-full rounded-lg border border-border/60 bg-muted/20 overflow-hidden",
      isHero ? "aspect-[16/14]" : "aspect-video"
    )}>
      <div className="w-full h-full p-3 animate-pulse">
        {kind === "hero" && (
          <div className="space-y-4">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-12 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="flex gap-2 pt-2">
              <div className="h-10 w-28 rounded bg-muted" />
              <div className="h-10 w-28 rounded bg-muted" />
            </div>
            <div className="mt-8 h-40 rounded-xl bg-muted/50 border border-muted" />
          </div>
        )}

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

  const kind = getPreviewKind(id)
  const isHero = kind === "hero"
  const STAGE_W = 1920
  const STAGE_H = isHero ? 1680 : 1080

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
    return buildSectionPreviewContent(id)
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
                className="origin-top-left client-site"
                data-mode="light"
                data-theme="partner"
                style={{
                  width: STAGE_W,
                  height: STAGE_H,
                  transform: `scale(${scale})`,
                  backgroundColor: "#ffffff",
                  color: "#1a2b3c",
                  "--background": "#ffffff",
                  "--foreground": "#1a2b3c",
                } as any}
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

// ── Full-panel always-visible preview (used in AddSectionModal right panel) ──
export const SectionLivePreviewPanel = React.memo(function SectionLivePreviewPanel({ id, className }: { id: string; className?: string }) {
  const STAGE_W = 1280
  const kind = getPreviewKind(id)
  const isHero = kind === "hero"

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = React.useState(0.7)

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.getBoundingClientRect().width
      if (w > 0) setScale(w / STAGE_W)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const content = React.useMemo(() => buildSectionPreviewContent(id), [id])

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full rounded-xl border border-border bg-background overflow-hidden shadow-sm transition-all duration-500",
        className ?? (isHero ? "aspect-[16/14] max-h-[75vh]" : "aspect-video")
      )}
    >
      <div
        className="pointer-events-auto origin-top-left client-site"
        data-mode="light"
        data-theme="partner"
        style={{
          width: STAGE_W,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          height: `calc(100% / ${scale})`,
          backgroundColor: "#ffffff",
          color: "#1a2b3c",
          "--background": "#ffffff",
          "--foreground": "#1a2b3c",
        } as any}
      >
        {content ?? (
          <div className="w-full py-24 flex items-center justify-center">
            <div className="text-sm font-semibold text-muted-foreground">No preview available</div>
          </div>
        )}
      </div>
    </div>
  )
})

// ── Shared content builder ────────────────────────────────────────────────────
function buildSectionPreviewContent(id: string): React.ReactNode {
  switch (id) {
      // ── Services / Features ──────────────────────────────────────────────
      case "services":
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
      case "services--modern":
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
      case "services--bento":
      case "services-bento":
        return (
          <LivePreviewFeaturesBento
            title={DEFAULT_FEATURES_BENTO.title}
            subtitle={DEFAULT_FEATURES_BENTO.subtitle}
            items={DEFAULT_FEATURES_BENTO.items as any}
          />
        )
      case "services--vertical-tabs":
        return (
          <LivePreviewVerticalTabs
            title={DEFAULT_VERTICAL_TABS.title}
            subtitle={DEFAULT_VERTICAL_TABS.subtitle}
            services={DEFAULT_VERTICAL_TABS.services as any}
          />
        )
      case "services--features-v2":
        return (
          <LivePreviewFeaturesV2
            title={DEFAULT_FEATURES_V2.title}
            subtitle={DEFAULT_FEATURES_V2.subtitle}
            description={DEFAULT_FEATURES_V2.description}
            features={DEFAULT_FEATURES_V2.features as any}
            ctaText={DEFAULT_FEATURES_V2.ctaText}
          />
        )
      case "services--highlight":
      case "practice-areas":
        return (
          <LivePreviewPracticeAreas
            title={DEFAULT_PRACTICE_AREAS.title}
            subtitle={DEFAULT_PRACTICE_AREAS.subtitle}
            items={DEFAULT_PRACTICE_AREAS.items as any}
            linkText="Learn More"
          />
        )
      case "process":
      case "how-it-works":
        return (
          <LivePreviewHowItWorks
            title={DEFAULT_HOW_IT_WORKS.title}
            subtitle={DEFAULT_HOW_IT_WORKS.subtitle}
            steps={DEFAULT_HOW_IT_WORKS.steps as any}
          />
        )
      case "process--timeline":
      case "treatment-process":
        return (
          <LivePreviewTreatmentProcess
            title={DEFAULT_TREATMENT_PROCESS.title}
            subtitle={DEFAULT_TREATMENT_PROCESS.subtitle}
            steps={[
              ...(DEFAULT_TREATMENT_PROCESS.steps as any[]).slice(0, 4),
              ...((DEFAULT_TREATMENT_PROCESS.steps as any[]).length < 4
                ? Array.from({ length: 4 - (DEFAULT_TREATMENT_PROCESS.steps as any[]).length }, (_, i) => ({
                    title: `Step ${(DEFAULT_TREATMENT_PROCESS.steps as any[]).length + i + 1}`,
                    description: "Detailed step description goes here.",
                    icon: "CheckCircle",
                  }))
                : []),
            ]}
          />
        )
      case "certifications":
      case "awards":
        return <LivePreviewAwardsStrip title={DEFAULT_AWARDS_STRIP.title} items={DEFAULT_AWARDS_STRIP.items as any} />
      case "trust_badges":
      case "trust-badges-grid": {
        const items = (DEFAULT_AWARDS_STRIP.items || []).map((it: any) => ({
          label: it.label,
          sublabel: it.sublabel,
          icon: it.icon || "Award",
          imageUrl: it.imageUrl,
        }))
        return <LivePreviewTrustBadges title="Trusted By" subtitle="Social proof" items={items as any} />
      }
      case "gallery--slider":
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
      case "gallery":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">Our Gallery</h2>
                <p className="text-muted-foreground">A showcase of our work.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
                  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&q=80",
                  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80",
                  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
                  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
                ].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "gallery--grid":
        return (
          <LivePreviewGalleryGrid
            badgeLabel={DEFAULT_GALLERY_GRID.badgeLabel}
            title={DEFAULT_GALLERY_GRID.title}
            subtitle={DEFAULT_GALLERY_GRID.subtitle}
            images={DEFAULT_GALLERY_GRID.images as any}
          />
        )
      case "gallery--carousel":
        return (
          <LivePreviewGallery4
            title={DEFAULT_GALLERY4.title}
            description={DEFAULT_GALLERY4.description}
            items={DEFAULT_GALLERY4.items as any}
          />
        )
      case "case_study":
      case "case_study--detail":
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
      case "logo_cloud":
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
            plans={[
              ...(DEFAULT_PRICING_TABLE.plans as any[]).slice(0, 3),
              ...((DEFAULT_PRICING_TABLE.plans as any[]).length < 3
                ? [{ name: "Premium", price: "₱4,999", period: "/ month", description: "Full-featured plan for power users.", features: ["Everything in Pro", "Priority support", "Custom integrations"], isPopular: false }]
                : []),
            ]}
          />
        )
      case "pricing--comparison":
      case "pricing-comparison-table":
        return (
          <LivePreviewPricingComparisonTable
            features={DEFAULT_PRICING_COMPARISON_TABLE.features as any}
            plans={DEFAULT_PRICING_COMPARISON_TABLE.plans as any}
            defaultPlan={DEFAULT_PRICING_COMPARISON_TABLE.defaultPlan as any}
            defaultInterval={DEFAULT_PRICING_COMPARISON_TABLE.defaultInterval as any}
          />
        )
      case "pricing--feature-comparison":
      case "pricing-section-with-comparison":
        return <LivePreviewPricingSectionWithComparison />
      case "pricing--subscription":
      case "maintenance-plans":
        return (
          <div className="py-16 px-8 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-foreground mb-2">Subscription Plans</h2>
                <p className="text-muted-foreground mb-6">Recurring coverage that keeps you protected all year.</p>
                <div className="inline-flex items-center gap-1 bg-muted rounded-full p-1 text-sm mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-background shadow font-semibold text-foreground">Monthly</span>
                  <span className="px-4 py-1.5 rounded-full text-muted-foreground">Annual <span className="text-primary font-semibold text-xs ml-1">Save 20%</span></span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Starter", price: "₱799", features: ["1 service visit / month", "Email support", "Basic reporting"], popular: false },
                  { name: "Growth", price: "₱1,599", features: ["3 service visits / month", "Priority support", "Advanced reporting", "Parts discount"], popular: true },
                  { name: "Enterprise", price: "₱2,999", features: ["Unlimited visits", "Dedicated account manager", "Custom SLA", "24/7 hotline", "Free replacements"], popular: false },
                ].map((plan, i) => (
                  <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border ${plan.popular ? "border-primary bg-primary/5 shadow-md" : "border-border bg-background"}`}>
                    <div className="flex items-center gap-4">
                      {plan.popular && <span className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">Most Popular</span>}
                      <div>
                        <p className="font-bold text-foreground">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.features.join(" · ")}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-2xl font-black text-primary">{plan.price}</p>
                      <p className="text-xs text-muted-foreground">/ month</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "comparison--table":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">Us vs The Competition</h2>
                <p className="text-muted-foreground">See why customers choose us over others</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left p-4 font-semibold text-foreground border border-border">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary border border-border bg-primary/5">Us</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground border border-border">Others</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Licensed & Insured", "Yes", "Sometimes"],
                      ["Same-Day Service", "Yes", "No"],
                      ["Satisfaction Guarantee", "100%", "Limited"],
                      ["Transparent Pricing", "Always", "Hidden fees"],
                      ["24/7 Emergency Line", "Yes", "No"],
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="p-4 border border-border text-sm font-medium text-foreground">{row[0]}</td>
                        <td className="p-4 border border-border text-sm text-center font-semibold text-primary bg-primary/5">{row[1]}</td>
                        <td className="p-4 border border-border text-sm text-center text-muted-foreground">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case "comparison--vs":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">Why Choose Us?</h2>
                <p className="text-muted-foreground">The clear choice for quality service</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
                  <div className="text-center mb-4">
                    <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-2">US</span>
                    <h3 className="text-xl font-bold text-foreground">Our Company</h3>
                  </div>
                  <ul className="space-y-3">
                    {["Licensed & fully insured","Same-day response","Transparent pricing","Satisfaction guarantee","24/7 emergency support"].map((f,i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground"><span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">✓</span>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-muted/20 p-6">
                  <div className="text-center mb-4">
                    <span className="inline-block bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">OTHERS</span>
                    <h3 className="text-xl font-bold text-muted-foreground">Typical Competitors</h3>
                  </div>
                  <ul className="space-y-3">
                    {["Unlicensed contractors","Long wait times","Hidden fees","No guarantee","Business hours only"].map((f,i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">✗</span>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      case "comparison":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground mb-3">Compare Our Plans</h2>
                <p className="text-muted-foreground">See which plan is right for you</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left p-4 font-semibold text-foreground border border-border">Feature</th>
                      <th className="text-center p-4 font-semibold text-foreground border border-border">Basic</th>
                      <th className="text-center p-4 font-semibold text-primary border border-border bg-primary/5">Pro</th>
                      <th className="text-center p-4 font-semibold text-foreground border border-border">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["24/7 Support", "—", "✓", "✓"],
                      ["Custom Domain", "—", "✓", "✓"],
                      ["Analytics", "Basic", "Advanced", "Full"],
                      ["Team Members", "1", "5", "Unlimited"],
                      ["Storage", "5 GB", "50 GB", "500 GB"],
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        {row.map((cell, j) => (
                          <td key={j} className={`p-4 border border-border text-sm ${j === 0 ? "font-medium text-foreground" : "text-center text-muted-foreground"} ${j === 2 ? "bg-primary/5 font-semibold text-primary" : ""}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case "specialty_listings":
      case "featured-properties-grid":
        return (
          <LivePreviewFeaturedListings
            title={DEFAULT_FEATURED_LISTINGS.title}
            subtitle={DEFAULT_FEATURED_LISTINGS.subtitle}
            items={DEFAULT_FEATURED_LISTINGS.items as any}
          />
        )
      case "gym--programs":
        return (
          <LivePreviewGymPrograms
            title={DEFAULT_GYM_PROGRAMS.title}
            subtitle={DEFAULT_GYM_PROGRAMS.subtitle}
            items={DEFAULT_GYM_PROGRAMS.items as any}
          />
        )
      case "gym--schedule":
        return (
          <LivePreviewGymClassSchedule
            title={DEFAULT_GYM_SCHEDULE.title}
            subtitle={DEFAULT_GYM_SCHEDULE.subtitle}
            days={DEFAULT_GYM_SCHEDULE.days as any}
          />
        )
      case "gym--memberships":
        return (
          <LivePreviewGymMembershipTiers
            title={DEFAULT_GYM_MEMBERSHIPS.title}
            subtitle={DEFAULT_GYM_MEMBERSHIPS.subtitle}
            tiers={DEFAULT_GYM_MEMBERSHIPS.tiers as any}
          />
        )
      case "gym--trainers":
        return (
          <LivePreviewGymTrainers
            title={DEFAULT_GYM_TRAINERS.title}
            subtitle={DEFAULT_GYM_TRAINERS.subtitle}
            items={DEFAULT_GYM_TRAINERS.items as any}
          />
        )
      case "gym--results":
        return (
          <LivePreviewGymResultsStories
            title={DEFAULT_GYM_RESULTS.title}
            subtitle={DEFAULT_GYM_RESULTS.subtitle}
            stories={DEFAULT_GYM_RESULTS.stories as any}
          />
        )
      case "gym--facility":
        return (
          <LivePreviewGymFacilityHighlights
            title={DEFAULT_GYM_FACILITY.title}
            subtitle={DEFAULT_GYM_FACILITY.subtitle}
            items={DEFAULT_GYM_FACILITY.items as any}
          />
        )
      case "gym--class-types":
        return (
          <LivePreviewGymClassTypes
            title={DEFAULT_GYM_CLASS_TYPES.title}
            subtitle={DEFAULT_GYM_CLASS_TYPES.subtitle}
            items={DEFAULT_GYM_CLASS_TYPES.items as any}
          />
        )
      case "gym--faq":
        return (
          <LivePreviewGymFaq
            title={DEFAULT_GYM_FAQ.title}
            subtitle={DEFAULT_GYM_FAQ.subtitle}
            items={DEFAULT_GYM_FAQ.items as any}
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
      case "service_area":
      case "service-area-map":
        return (
          <LivePreviewServiceAreaMap
            title={DEFAULT_SERVICE_AREA_MAP.title}
            subtitle={DEFAULT_SERVICE_AREA_MAP.subtitle}
            cities={(DEFAULT_SERVICE_AREA_MAP.cities ?? []) as any}
            mapEmbedUrl={(DEFAULT_SERVICE_AREA_MAP as any).mapEmbedUrl}
          />
        )
      case "service_area--radius":
        return (
          <LivePreviewCoverageRadius
            title="Coverage Radius"
            subtitle="We serve all locations within our primary zone."
            radiusKm={10}
            locationName="Our Main Office"
            note="A small fee applies outside the 10km radius."
          />
        )
      case "price_preview":
      case "price-preview-strip":
        return (
          <LivePreviewPricePreviewStrip
            title={DEFAULT_PRICE_PREVIEW.title}
            items={DEFAULT_PRICE_PREVIEW.items as any}
          />
        )
      case "cta--emergency":
      case "emergency-cta-strip":
        return <LivePreviewEmergencyCTAStrip title="Emergency? We're here." phone="(555) 000-0000" />
      case "announcement_bar":
      case "announcement_bar--standard":
        return (
          <div className="w-full bg-primary text-white py-3 px-6 flex items-center justify-center gap-4">
            <span className="text-sm font-medium">Important update: We are now serving new areas. Check availability today.</span>
            <button className="shrink-0 bg-white text-primary text-xs font-bold px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors">Learn More</button>
          </div>
        )
      case "announcement_bar--promo":
        return (
          <div className="w-full bg-amber-500 text-white py-3 px-6 flex items-center justify-center gap-4">
            <span className="text-sm font-bold">Limited Offer:</span>
            <span className="text-sm">Get 20% off your first service booking this month only.</span>
            <button className="shrink-0 bg-white text-amber-600 text-xs font-bold px-4 py-1.5 rounded-full">Claim Now</button>
          </div>
        )
      case "announcement_bar--emergency":
        return (
          <div className="w-full bg-red-600 text-white py-3 px-6 flex items-center justify-center gap-4">
            <span className="text-sm font-bold">24/7 Emergency Hotline:</span>
            <span className="text-sm font-mono">(555) 000-0000</span>
            <button className="shrink-0 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full">Call Now</button>
          </div>
        )
      case "announcement_bar--offer":
        return (
          <div className="w-full bg-green-600 text-white py-3 px-6 flex items-center justify-center gap-4">
            <span className="text-sm font-bold">Free Inspection:</span>
            <span className="text-sm">Book a free no-obligation inspection for your home or business.</span>
            <button className="shrink-0 bg-white text-green-700 text-xs font-bold px-4 py-1.5 rounded-full">Book Free</button>
          </div>
        )
      case "service_detail":
      case "feature-highlight":
      case "why-choose-us":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-5xl mx-auto grid grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" alt="Service" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">Our Specialty</span>
                <h2 className="text-3xl font-bold text-foreground mb-4">Deep Cleaning Service</h2>
                <p className="text-muted-foreground mb-6">Our professional deep cleaning service covers every corner of your space. We use eco-friendly products and proven techniques to deliver spotless results every time.</p>
                <ul className="space-y-2 mb-8">
                  {["Eco-friendly products","Trained & vetted staff","Satisfaction guaranteed","Flexible scheduling"].map((b,i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground"><span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</span>{b}</li>
                  ))}
                </ul>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm">Get a Free Quote</button>
              </div>
            </div>
          </div>
        )
      case "service_detail--split":
        return (
          <div className="py-16 px-8 bg-muted/30">
            <div className="max-w-5xl mx-auto grid grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4">Why It Works</span>
                <h2 className="text-3xl font-bold text-foreground mb-4">Pest Control That Actually Lasts</h2>
                <p className="text-muted-foreground mb-6">Unlike one-time sprays, our integrated treatment plan targets the root cause — eliminating colonies, sealing entry points, and preventing re-infestation for good.</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: "Inspection", desc: "Full property assessment" },
                    { label: "Treatment", desc: "Targeted elimination" },
                    { label: "Prevention", desc: "Entry point sealing" },
                    { label: "Follow-up", desc: "30-day guarantee check" },
                  ].map((item, i) => (
                    <div key={i} className="bg-background rounded-xl p-4 border border-border">
                      <p className="text-sm font-bold text-foreground mb-1">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm">Schedule Inspection</button>
              </div>
              <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Service Detail" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )
      case "lead_capture":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-3">Get a Free Quote</h2>
                <p className="text-muted-foreground">Tell us about your needs and we will get back to you within 24 hours.</p>
              </div>
              <div className="bg-muted/30 rounded-xl border border-border p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service Type</label>
                  <div className="h-10 rounded-lg bg-muted/60 border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Your Name</label>
                  <div className="h-10 rounded-lg bg-muted/60 border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <div className="h-10 rounded-lg bg-muted/60 border border-border" />
                </div>
                <div className="h-11 rounded-lg bg-primary" />
              </div>
            </div>
          </div>
        )
      case "lead_capture--multi-step":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Get Your Free Quote</h2>
                <p className="text-muted-foreground">3 quick steps — takes less than 60 seconds</p>
              </div>
              <div className="flex items-center justify-center gap-2 mb-8">
                {["Service","Location","Contact"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{i+1}</div>
                    <span className={`text-xs font-medium ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                    {i < 2 && <div className="w-8 h-px bg-border" />}
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 rounded-xl border border-border p-6 space-y-4">
                <p className="text-sm font-semibold text-foreground mb-2">Step 1: What service do you need?</p>
                {["Cleaning","Pest Control","HVAC","Plumbing"].map((s,i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${i===0?"border-primary bg-primary/5":"border-border bg-background"}`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${i===0?"border-primary bg-primary":"border-muted-foreground"}`} />
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </div>
                ))}
                <button className="w-full h-11 rounded-lg bg-primary text-white font-semibold text-sm mt-2">Next: Location</button>
              </div>
            </div>
          </div>
        )
      case "cta":
      case "promo-cta-section":
        return <LivePreviewPromoCTASection title="Limited Time Offer" subtitle="Book today and save." buttonText="Claim Offer" buttonHref="#" />
      case "cta--sticky":
        return (
          <LivePreviewMessengerStickyCTA
            messengerUrl="https://m.me/example"
            viberNumber="09171234567"
            phone="(555) 000-0000"
          />
        )
      case "booking":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-3">Book an Appointment</h2>
              <p className="text-muted-foreground mb-8">Choose a date and time that works for you.</p>
              <div className="bg-muted/30 rounded-xl border border-border p-6 text-left space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Your Name</label>
                  <div className="h-10 rounded-lg bg-muted/60 border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Preferred Date</label>
                  <div className="h-10 rounded-lg bg-muted/60 border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service Type</label>
                  <div className="h-10 rounded-lg bg-muted/60 border border-border" />
                </div>
                <div className="h-11 rounded-lg bg-primary" />
              </div>
            </div>
          </div>
        )
      case "free_consultation":
        return (
          <LivePreviewFreeConsultation
            headline="Get a Free Consultation"
            subtitle="No obligation. Talk to an expert today."
            bullet1="100% Free — No hidden fees"
            bullet2="Response within 24 hours"
            bullet3="Personalized advice for your needs"
            formTitle="Request Your Free Consultation"
            dropdownOptions={["General Inquiry", "Service Quote", "Partnership", "Other"]}
            buttonText="Get Free Consultation"
          />
        )
      case "cta--promo-strip":
      case "promo-banner-strip":
        return <LivePreviewPromoBannerStrip text="Special Offer — This week only" />
      case "payment_options":
      case "payment-options-strip":
        return <LivePreviewPaymentOptionsStrip title="We Accept" />
      case "stats":
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
      case "faq":
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
      case "guarantee":
      case "warranty-block":
        return <LivePreviewWarrantyBlock title="Our Guarantee" subtitle="100% satisfaction or your money back." />
      case "guarantee--badge":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Promise to You</h2>
              <p className="text-muted-foreground mb-10">We stand behind every job we do. If you are not satisfied, we will make it right.</p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { Icon: BadgeDollarSign, title: "Money-Back Guarantee", desc: "Full refund if not satisfied" },
                  { Icon: ShieldCheck, title: "1-Year Warranty", desc: "All work covered for 12 months" },
                  { Icon: Star, title: "5-Star Service", desc: "Rated top in your area" },
                ].map((b,i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-muted/20 w-48">
                    <b.Icon className="w-10 h-10 text-primary" />
                    <p className="text-sm font-bold text-foreground text-center">{b.title}</p>
                    <p className="text-xs text-muted-foreground text-center">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "guarantee--safety":
        return (
          <div className="py-16 px-8 bg-background">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Safety & Compliance</h2>
              <p className="text-muted-foreground mb-10">We meet and exceed all industry safety standards and regulations.</p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { Icon: CheckCircle, title: "OSHA Compliant", desc: "Meets all safety regulations" },
                  { Icon: Lock, title: "Fully Insured", desc: "Licensed & bonded" },
                  { Icon: Leaf, title: "Eco-Friendly", desc: "Safe for kids & pets" },
                  { Icon: ClipboardList, title: "Certified Staff", desc: "Background-checked team" },
                ].map((b,i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-muted/20 w-44">
                    <b.Icon className="w-9 h-9 text-primary" />
                    <p className="text-sm font-bold text-foreground text-center">{b.title}</p>
                    <p className="text-xs text-muted-foreground text-center">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "testimonials--facebook":
      case "facebook-review-embed":
        return (
          <LivePreviewFacebookReviewEmbed
            title={DEFAULT_FACEBOOK_REVIEW_EMBED.title}
            subtitle={DEFAULT_FACEBOOK_REVIEW_EMBED.subtitle}
            reviews={DEFAULT_FACEBOOK_REVIEW_EMBED.reviews as any}
          />
        )
      // ── Testimonials (bar / grid) ────────────────────────────────────────
      case "testimonials":
      case "review-trust-bar":
      case "reviews-grid":
        return (
          <LivePreviewFeaturesGrid
            title="What Our Clients Say"
            subtitle="Real reviews from real customers"
            features={(DEFAULT_REVIEW_TRUST_BAR?.testimonials ?? []).slice(0, 3).map((r: any) => ({
              title: r.author ?? r.name ?? "Happy Client",
              description: r.text ?? r.body ?? "",
              icon: "Star",
            }))}
          />
        )
      case "testimonials--grid":
        return (
          <LivePreviewFeaturesGrid
            title="Customer Reviews"
            subtitle="See what our clients are saying"
            features={[
              { title: "Maria Santos", description: "\"Absolutely amazing service! Fast, professional, and very affordable. Highly recommend!\"", icon: "Star" },
              { title: "John Reyes", description: "\"The team was on time and did a fantastic job. Will definitely call again.\"", icon: "Star" },
              { title: "Ana Lim", description: "\"Best experience I've had. They went above and beyond my expectations.\"", icon: "Star" },
            ]}
          />
        )
      // ── Team grid / carousel ─────────────────────────────────────────────
      case "testimonials--animated":
        return (
          <LivePreviewAnimatedTestimonials
            testimonials={DEFAULT_ANIMATED_TESTIMONIALS.testimonials as any}
            autoplay={Boolean(DEFAULT_ANIMATED_TESTIMONIALS.autoplay)}
            className="py-6"
          />
        )
      case "team":
      case "team-grid":
        return (
          <LivePreviewTeamGrid
            title="Meet Our Team"
            subtitle="The experts dedicated to your success."
            members={[
              { name: "Jane Smith", specialty: "Lead Technician", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
              { name: "Mark Reyes", specialty: "Senior Specialist", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
              { name: "Ana Cruz", specialty: "Customer Support", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
            ]}
          />
        )
      case "team--carousel":
      case "team-carousel":
        return (
          <LivePreviewTeamCarousel
            title="Our Team"
            subtitle="Swipe to meet everyone"
            members={[
              { name: "Jane Smith", specialty: "Lead Technician", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
              { name: "Mark Reyes", specialty: "Senior Specialist", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
              { name: "Ana Cruz", specialty: "Customer Support", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
              { name: "Luis Torres", specialty: "Field Technician", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
            ]}
          />
        )
      case "team--showcase":
        return (
          <LivePreviewTeamShowcase
            members={DEFAULT_TEAM_SHOWCASE.members as any}
          />
        )
      case "team--spotlight":
        return (
          <LivePreviewWhyChooseMe
            title="Team Spotlight"
            subtitle="Get to know our lead professional"
            agentName="Maria Santos"
            agentRole="Senior Specialist"
            licenseNumber="#SP-2024"
            agentBio="With over 10 years of hands-on experience, Maria leads our team with dedication and expertise. She has helped hundreds of clients achieve outstanding results."
            agentImageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
            trustSignals={[
              { label: "10+ Years Experience", icon: "Award" },
              { label: "500+ Happy Clients", icon: "Users" },
              { label: "Certified Professional", icon: "ShieldCheck" },
            ]}
          />
        )
      case "team--profile":
        return (
          <LivePreviewAttorneyProfile
            label="About Our Expert"
            name="Juan Dela Cruz"
            bioParagraph1="With over 15 years of experience in the industry, Juan has built a reputation for excellence, integrity, and results-driven service."
            bioParagraph2="He is committed to providing personalized attention to every client, ensuring the best possible outcome for each unique situation."
            signatureName="Juan Dela Cruz"
            headshotUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
          />
        )
      // ── Blog preview ─────────────────────────────────────────────────────
      case "blog_preview":
      case "blog":
        return (
          <LivePreviewBlogGrid
            title="Latest Insights"
            subtitle="Tips, guides, and updates from our team"
            posts={[
              { title: "5 Signs You Need a Professional Inspection", excerpt: "Don't wait until it's too late. Here are the top warning signs every homeowner should know.", date: "Jan 15, 2025", category: "Tips", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
              { title: "How to Choose the Right Service Provider", excerpt: "A step-by-step guide to finding a trusted professional in your area without overpaying.", date: "Feb 3, 2025", category: "Guide", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80" },
              { title: "What to Expect During Your First Appointment", excerpt: "We walk you through the entire process so you know exactly what happens from start to finish.", date: "Feb 20, 2025", category: "FAQ", imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80" },
            ]}
          />
        )
      case "blog--agency":
        return (
          <LivePreviewAgencyBlog
            title={DEFAULT_AGENCY_BLOG.title}
            subtitle={DEFAULT_AGENCY_BLOG.subtitle}
            description={DEFAULT_AGENCY_BLOG.description}
            posts={DEFAULT_AGENCY_BLOG.posts as any}
            ctaText={DEFAULT_AGENCY_BLOG.ctaText}
          />
        )
      // ── Contact variants ─────────────────────────────────────────────────
      case "contact":
        return (
          <LivePreviewFeaturesGrid
            title="Get In Touch"
            subtitle="We'd love to hear from you"
            features={[
              { title: "Call Us", description: "(555) 000-0000", icon: "Phone" },
              { title: "Email Us", description: "hello@example.com", icon: "Mail" },
              { title: "Visit Us", description: "123 Main St, City", icon: "MapPin" },
            ]}
          />
        )
      case "contact--minimal":
        return (
          <LivePreviewContactMinimal
            title="Get in Touch"
            subtitle="Have questions? We're here to help."
            email="hello@example.com"
            phone="(555) 000-0000"
            address="123 Main St, City"
          />
        )
      case "contact--visual":
        return (
          <LivePreviewContactVisual
            title="Ready to Get Started?"
            subtitle="Contact us today for a free consultation."
            email="hello@example.com"
            phone="(555) 000-0000"
            address="123 Main St, City"
          />
        )
      case "contact--with-map":
        return (
          <LivePreviewContactWithMap
            title="Visit Our Office"
            subtitle="We're conveniently located and ready to welcome you."
            email="hello@example.com"
            phone="(555) 000-0000"
            address="123 Main St, City"
          />
        )
      case "contact--columns":
        return (
          <LivePreviewContactColumns
            title="Contact Us"
            subtitle="Choose your preferred way to reach out."
            email="hello@example.com"
            phone="(555) 000-0000"
            address="123 Main St, City"
          />
        )
      case "contact--split":
        return (
          <LivePreviewContactSplit
            tagline="Let's Work Together"
            formHeading="Send Us a Message"
            formSubmitText="Send Message"
            formThankYouText="Thank you! We'll be in touch soon."
            email="hello@example.com"
            phone="(555) 000-0000"
            address="123 Main St, City"
          />
        )
      case "contact--agency":
        return (
          <LivePreviewAgencyContact
            title={DEFAULT_AGENCY_CONTACT.title}
            subtitle={DEFAULT_AGENCY_CONTACT.subtitle}
            description={DEFAULT_AGENCY_CONTACT.description}
            formHeading={DEFAULT_AGENCY_CONTACT.formHeading}
            formButtonText={DEFAULT_AGENCY_CONTACT.formButtonText}
            infoHeading={DEFAULT_AGENCY_CONTACT.infoHeading}
            infoItems={DEFAULT_AGENCY_CONTACT.infoItems as any}
            socials={DEFAULT_AGENCY_CONTACT.socials as any}
            officeHours={DEFAULT_AGENCY_CONTACT.officeHours}
          />
        )
      case "products--agency":
        return (
          <LivePreviewAgencyProducts
            title={DEFAULT_AGENCY_PRODUCTS.title}
            subtitle={DEFAULT_AGENCY_PRODUCTS.subtitle}
            description={DEFAULT_AGENCY_PRODUCTS.description}
            items={DEFAULT_AGENCY_PRODUCTS.items as any}
            categories={DEFAULT_AGENCY_PRODUCTS.categories as any}
            ctaText={DEFAULT_AGENCY_PRODUCTS.ctaText}
          />
        )
      // ── FAQ two-column ────────────────────────────────────────────────────
      case "faq--two-column":
        return (
          <LivePreviewFAQTwoColumn
            title="Common Questions"
            subtitle="Everything you need to know about our services."
            items={(DEFAULT_FAQ_ACCORDION.items as any[]).slice(0, 6)}
          />
        )
      // ── Hero variants ────────────────────────────────────────────────────
    case "hero":
    case "hero--lawyer":
    case "hero--startup":
    case "hero--chiropractor":
    case "hero--dentist":
    case "hero--clinic":
    case "hero--cleaning":
    case "hero--pool":
    case "hero--pest-control":
    case "hero--gym":
    case "hero--real-estate-modern":
    case "hero--before-after-split":
    case "hero--industrial":
    case "hero--clean-delivery":
    case "hero--luxury-soft":
    case "hero--academic-clean":
    case "hero--hvac":
    case "hero--hvac-blue":
    case "hero--generic":
    case "hero--emergency":
    case "hero--showcase":
    case "hero--aero-3":
    case "hero--elegant-carousel":
    case "hero--minimalism":
    case "hero--modern":
    case "hero--group-images":
    case "hero--v6":
      return (
        <HeroPreview theme={id.includes("--") ? id.split("--")[1] : "generic"} />
      )
      case "testimonials--community":
        return (
          <LivePreviewAnimatedTestimonialsCommunity
            title={DEFAULT_TESTIMONIALS_COMMUNITY.title}
            subtitle={DEFAULT_TESTIMONIALS_COMMUNITY.subtitle}
            badgeText={DEFAULT_TESTIMONIALS_COMMUNITY.badgeText}
            testimonials={DEFAULT_TESTIMONIALS_COMMUNITY.testimonials as any}
            autoRotateInterval={DEFAULT_TESTIMONIALS_COMMUNITY.autoRotateInterval}
            trustedCompanies={DEFAULT_TESTIMONIALS_COMMUNITY.trustedCompanies}
            trustedCompaniesTitle={DEFAULT_TESTIMONIALS_COMMUNITY.trustedCompaniesTitle}
          />
        )
      case "testimonials--v2":
        return (
          <LivePreviewTestimonialsV2
            badge={DEFAULT_TESTIMONIALS_V2.badge}
            title={DEFAULT_TESTIMONIALS_V2.title}
            subtitle={DEFAULT_TESTIMONIALS_V2.subtitle}
            items={DEFAULT_TESTIMONIALS_V2.items as any}
          />
        )
      case "features--steps":
        return (
          <LivePreviewFeatureSteps
            title={DEFAULT_FEATURE_STEPS.title}
            features={DEFAULT_FEATURE_STEPS.features as any}
            autoPlayInterval={DEFAULT_FEATURE_STEPS.autoPlayInterval}
          />
        )
      case "features--spotlight":
        return (
          <LivePreviewFeatureSpotlight
            {...DEFAULT_FEATURE_SPOTLIGHT}
          />
        )
      case "cta--beams":
        return (
          <LivePreviewBackgroundBeamsCTA
            title={DEFAULT_CTA_BEAMS.title}
            subtitle={DEFAULT_CTA_BEAMS.subtitle}
            ctaText={DEFAULT_CTA_BEAMS.ctaText}
            ctaHref={DEFAULT_CTA_BEAMS.ctaHref}
            showEmailInput={DEFAULT_CTA_BEAMS.showEmailInput}
          />
        )
      default:
        return null
    }
}


function HeroPreview({ theme }: { theme: string }) {
  switch (theme) {
    case "emergency": return <LivePreviewHeroEmergency {...(DEFAULT_HERO_EMERGENCY || {})} />
    case "showcase": return (
      <LivePreviewHeroShowcase
        badge={DEFAULT_HERO_SHOWCASE.badge}
        title={DEFAULT_HERO_SHOWCASE.title}
        subtitle={DEFAULT_HERO_SHOWCASE.subtitle}
        primaryCTA={DEFAULT_HERO_SHOWCASE.primaryCTA}
        secondaryCTA={DEFAULT_HERO_SHOWCASE.secondaryCTA}
        trustPoints={DEFAULT_HERO_SHOWCASE.trustPoints as any}
        metrics={DEFAULT_HERO_SHOWCASE.metrics as any}
      />
    )
    case "aero-3": return (
      <LivePreviewHeroAero3 
        title={DEFAULT_HERO_AERO_3.title}
        subtitle={DEFAULT_HERO_AERO_3.subtitle}
        backgroundImage={DEFAULT_HERO_AERO_3.backgroundImage}
      />
    )
    case "minimalism": return <LivePreviewHeroMinimalism {...(DEFAULT_HERO_MINIMALISM || {})} />
    case "elegant-carousel": return <LivePreviewElegantCarousel slides={DEFAULT_HERO_ELEGANT_CAROUSEL.slides as any} />
    case "modern": return <LivePreviewModernHero {...(DEFAULT_HERO_MODERN || {})} />
    case "group-images": return <LivePreviewHeroGroupImages {...(DEFAULT_HERO_GROUP_IMAGES || {})} />
    case "v6": return <LivePreviewHeroV6 {...(DEFAULT_HERO_V6 || {})} />
    case "v7": return <LivePreviewHeroV7 {...(DEFAULT_HERO_V7 || {})} />
    case "chiropractor": return <LivePreviewHeroChiropractor {...(DEFAULT_HERO_CHIROPRACTOR as any)} />
    case "dentist": return <LivePreviewHeroDentist {...(DEFAULT_HERO_DENTIST as any)} />
    case "clinic": return <LivePreviewHeroClinic {...(DEFAULT_HERO_CLINIC as any)} />
    case "cleaning": return <LivePreviewHeroCleaning {...(DEFAULT_HERO_CLEANING as any)} />
    case "pool": return <LivePreviewHeroPool {...(DEFAULT_HERO_POOL as any)} />
    case "pest-control": return <LivePreviewHeroPestControl {...(DEFAULT_HERO_PEST_CONTROL as any)} />
    case "gym": return <LivePreviewHeroGym {...(DEFAULT_HERO_GYM as any)} />
    case "startup": return <LivePreviewHeroSaas {...(DEFAULT_HERO_STARTUP as any)} />
    case "lawyer": return <LivePreviewHeroBlock {...(DEFAULT_HERO_LAWYER as any)} />
    case "before-after":
    case "real-estate-modern":
    case "industrial":
    case "clean-delivery":
    case "luxury-soft":
    case "academic-clean":
    case "hvac":
    case "hvac-blue":
    case "personal-portfolio":
    case "photobooth": {
      const layouts: Record<string, string> = {
        "before-after": "before-after",
        "real-estate-modern": "full-screen",
        "industrial": "industrial",
        "clean-delivery": "bright-clean",
        "luxury-soft": "soft-luxury",
        "academic-clean": "structured-split",
        "hvac": "hvac-urgent",
        "hvac-blue": "hvac-blue",
        "cleaning": "cleaning-fresh",
        "personal-portfolio": "full-screen",
        "photobooth": "soft-luxury"
      }
      return <LivePreviewHeroAuthority {...(DEFAULT_HERO as any)} layout={layouts[theme] as any} />
    }
    case "authority": return <LivePreviewHeroAuthority {...(DEFAULT_HERO as any)} />
    default: return <LivePreviewHeroBlock {...(DEFAULT_HERO as any)} />
  }
}

