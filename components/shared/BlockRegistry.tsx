import { dynamicWithSkeleton } from "@/lib/utils/dynamic";
// Header
export const Header = dynamicWithSkeleton(() => import("@/components/shared/Header"), { className: "h-20" });

// Hero blocks
export const HeroAuthority = dynamicWithSkeleton(() => import("@/components/blocks/HeroAuthority"), { className: "h-[600px]" });
export const HeroSaas = dynamicWithSkeleton(() => import("@/components/blocks/HeroSaas"), { className: "h-[600px]" });
export const HeroChiropractor = dynamicWithSkeleton(() => import("@/components/blocks/HeroChiropractor"), { className: "h-[600px]" });
export const HeroDentist = dynamicWithSkeleton(() => import("@/components/blocks/HeroDentist"), { className: "h-[600px]" });
export const HeroClinic = dynamicWithSkeleton(() => import("@/components/blocks/HeroClinic"), { className: "h-[600px]" });
export const HeroCleaning = dynamicWithSkeleton(() => import("@/components/blocks/HeroCleaning"), { className: "h-[600px]" });
export const HeroPool = dynamicWithSkeleton(() => import("@/components/blocks/HeroPool"), { className: "h-[600px]" });
export const HeroPestControl = dynamicWithSkeleton(() => import("@/components/blocks/HeroPestControl"), { className: "h-[600px]" });
export const HeroGym = dynamicWithSkeleton(() => import("@/components/blocks/HeroGym"), { className: "h-[620px]" });
export const HeroEmergency = dynamicWithSkeleton(() => import("@/components/blocks/HeroEmergency"), { className: "h-[400px]" });
export const HeroBlock = dynamicWithSkeleton(() => import("@/components/blocks/HeroBlock"), { className: "h-[600px]" });

// Content blocks
export const FeaturesGrid = dynamicWithSkeleton(() => import("@/components/blocks/FeaturesGrid"), { className: "h-[500px]" });
export const TrustBar = dynamicWithSkeleton(() => import("@/components/blocks/TrustBar"), { className: "h-24" });
export const PricingTable = dynamicWithSkeleton(() => import("@/components/blocks/PricingTable"), { className: "h-[600px]" });
export const AwardsStrip = dynamicWithSkeleton(() => import("@/components/blocks/AwardsStrip"), { className: "h-32" });
export const ContactForm = dynamicWithSkeleton(() => import("@/components/blocks/ContactForm"), { className: "h-[600px]" });
export const ContactMinimal = dynamicWithSkeleton(() => import("@/components/blocks/ContactMinimal"), { className: "h-[500px]" });
export const ContactVisual = dynamicWithSkeleton(() => import("@/components/blocks/ContactVisual"), { className: "h-[600px]" });
export const ContactWithMap = dynamicWithSkeleton(() => import("@/components/blocks/ContactWithMap"), { className: "h-[600px]" });
export const ContactColumns = dynamicWithSkeleton(() => import("@/components/blocks/ContactColumns"), { className: "h-[800px]" });
export const ContactSplit = dynamicWithSkeleton(() => import("@/components/blocks/ContactSplit"), { className: "h-[700px]" });
export const PracticeAreasGrid = dynamicWithSkeleton(() => import("@/components/blocks/PracticeAreasGrid"), { className: "h-[500px]" });
export const AttorneyProfile = dynamicWithSkeleton(() => import("@/components/blocks/AttorneyProfile"), { className: "h-[500px]" });
export const FreeConsultationForm = dynamicWithSkeleton(() => import("@/components/blocks/FreeConsultationForm"), { className: "h-[500px]" });
export const HowItWorksSteps = dynamicWithSkeleton(() => import("@/components/blocks/HowItWorksSteps"), { className: "h-[400px]" });
export const ReviewTrustBar = dynamicWithSkeleton(() => import("@/components/blocks/ReviewTrustBar"), { className: "h-32" });
export const FeatureHighlightZigzag = dynamicWithSkeleton(() => import("@/components/blocks/FeatureHighlightZigzag"), { className: "h-[600px]" });
export const TeamCarousel = dynamicWithSkeleton(() => import("@/components/blocks/TeamCarousel"), { className: "h-[500px]" });
export const TeamGrid = dynamicWithSkeleton(() => import("@/components/blocks/TeamGrid"), { className: "h-[600px]" });
export const PatientFaq = dynamicWithSkeleton(() => import("@/components/blocks/PatientFaq"), { className: "h-[500px]" });
export const BlogGrid = dynamicWithSkeleton(() => import("@/components/blocks/BlogGrid"), { className: "h-[600px]" });
export const FeaturesModern = dynamicWithSkeleton(() => import("@/components/blocks/FeaturesModern"), { className: "h-[600px]" });
export const ReviewsGrid = dynamicWithSkeleton(() => import("@/components/blocks/ReviewsGrid"), { className: "h-[600px]" });
export const FAQTwoColumn = dynamicWithSkeleton(() => import("@/components/blocks/FAQTwoColumn"), { className: "h-[500px]" });

// PH Specific Blocks
export const MessengerStickyCTA = dynamicWithSkeleton(() => import("@/components/blocks/MessengerStickyCTA"), { className: "h-0" });
export const ServiceAreaMap = dynamicWithSkeleton(() => import("@/components/blocks/ServiceAreaMap"), { className: "h-[500px]" });
export const BeforeAfterSlider = dynamicWithSkeleton(() => import("@/components/blocks/BeforeAfterSlider"), { className: "h-[600px]" });
export const PromoBannerStrip = dynamicWithSkeleton(() => import("@/components/blocks/PromoBannerStrip"), { className: "h-12" });
export const PaymentOptionsStrip = dynamicWithSkeleton(() => import("@/components/blocks/PaymentOptionsStrip"), { className: "h-24" });
export const FacebookReviewEmbed = dynamicWithSkeleton(() => import("@/components/blocks/FacebookReviewEmbed"), { className: "h-[600px]" });
export const CoverageRadiusBlock = dynamicWithSkeleton(() => import("@/components/blocks/CoverageRadiusBlock"), { className: "h-[500px]" });
export const StatsSection = dynamicWithSkeleton(() => import("@/components/blocks/StatsSection"), { className: "h-[400px]" });
export const FAQAccordion = dynamicWithSkeleton(() => import("@/components/blocks/FAQAccordion"), { className: "h-[600px]" });
export const LogoCloud = dynamicWithSkeleton(() => import("@/components/blocks/LogoCloud"), { className: "h-[200px]" });
export const TrustBadgesGrid = dynamicWithSkeleton(() => import("@/components/blocks/TrustBadgesGrid"), { className: "h-[400px]" });
export const ACTypesGrid = dynamicWithSkeleton(() => import("@/components/blocks/ACTypesGrid"), { className: "h-[500px]" });
export const PricePreviewStrip = dynamicWithSkeleton(() => import("@/components/blocks/PricePreviewStrip"), { className: "h-[300px]" });
export const EmergencyCTAStrip = dynamicWithSkeleton(() => import("@/components/blocks/EmergencyCTAStrip"), { className: "h-[200px]" });
export const MaintenancePlans = dynamicWithSkeleton(() => import("@/components/blocks/MaintenancePlans"), { className: "h-[600px]" });

// Pest Control Specific Blocks
export const CommonPestsGrid = dynamicWithSkeleton(() => import("@/components/blocks/CommonPestsGrid"), { className: "h-[500px]" });
export const TreatmentProcessTimeline = dynamicWithSkeleton(() => import("@/components/blocks/TreatmentProcessTimeline"), { className: "h-[600px]" });
export const SafetySection = dynamicWithSkeleton(() => import("@/components/blocks/SafetySection"), { className: "h-[600px]" });
export const WarrantyGuaranteeBlock = dynamicWithSkeleton(() => import("@/components/blocks/WarrantyGuaranteeBlock"), { className: "h-[400px]" });
export const GymPrograms = dynamicWithSkeleton(() => import("@/components/blocks/GymPrograms"), { className: "h-[640px]" });
export const GymClassSchedule = dynamicWithSkeleton(() => import("@/components/blocks/GymClassSchedule"), { className: "h-[640px]" });
export const GymMembershipTiers = dynamicWithSkeleton(() => import("@/components/blocks/GymMembershipTiers"), { className: "h-[640px]" });
export const GymTrainers = dynamicWithSkeleton(() => import("@/components/blocks/GymTrainers"), { className: "h-[640px]" });
export const GymResultsStories = dynamicWithSkeleton(() => import("@/components/blocks/GymResultsStories"), { className: "h-[640px]" });
export const GymFacilityHighlights = dynamicWithSkeleton(() => import("@/components/blocks/GymFacilityHighlights"), { className: "h-[640px]" });
export const GymClassTypes = dynamicWithSkeleton(() => import("@/components/blocks/GymClassTypes"), { className: "h-[640px]" });
export const GymFaq = dynamicWithSkeleton(() => import("@/components/blocks/GymFaq"), { className: "h-[560px]" });

export const BeforeAfterGalleryGrid = dynamicWithSkeleton(() => import("@/components/blocks/BeforeAfterGalleryGrid"), { className: "h-[600px]" });
export const PhotoGalleryGrid = dynamicWithSkeleton(() => import("@/components/blocks/PhotoGalleryGrid"), { className: "h-[600px]" });
export const PromoCTASection = dynamicWithSkeleton(() => import("@/components/blocks/PromoCTASection"), { className: "h-[500px]" });

// Real Estate Specific Blocks
export const FeaturedListingsGrid = dynamicWithSkeleton(() => import("@/components/blocks/FeaturedListingsGrid"), { className: "h-[600px]" });
export const FinancingSection = dynamicWithSkeleton(() => import("@/components/blocks/FinancingSection"), { className: "h-[500px]" });
export const DeveloperPartnersLogos = dynamicWithSkeleton(() => import("@/components/blocks/DeveloperPartnersLogos"), { className: "h-[200px]" });
export const WhyChooseMe = dynamicWithSkeleton(() => import("@/components/blocks/WhyChooseMe"), { className: "h-[600px]" });

// Footer blocks
export const LeadMagnetFooter = dynamicWithSkeleton(() => import("@/components/blocks/LeadMagnetFooter"), { className: "h-[400px]" });
export const SimpleFooter = dynamicWithSkeleton(() => import("@/components/blocks/SimpleFooter"), { className: "h-[200px]" });
export const MinimalFooter = dynamicWithSkeleton(() => import("@/components/blocks/MinimalFooter"), { className: "h-32" });

