"use client";

import * as React from "react";
import {
  Layout,
  ChevronRight,
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Star,
  Users,
  Gavel,
  Bug,
  Snowflake,
  Smile,
  Stethoscope,
  Waves,
  Building2,
  Car,
  Hammer,
  Droplets,
  Scissors,
  GraduationCap,
  Globe,
  Rocket,
  Key,
  ArrowLeft,
  X,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Image,
  Map,
  BarChart2,
  Megaphone,
  Bell,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Camera,
  Loader2,
  Bot,
  Search,
} from "lucide-react";
import { GENRE_PRESETS, GENRE_LABELS } from "@/config/presets";
import { toast } from "sonner";
import NextImage from "next/image";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BUSINESS_ICONS: Record<string, React.ElementType> = {
  lawyer: Gavel,
  pest_control: Bug,
  hvac: Snowflake,
  dentist: Smile,
  chiropractor: Stethoscope,
  clinic: Stethoscope,
  cleaning: Sparkles,
  pool: Waves,
  startup: Rocket,
  real_estate: Building2,
  car_detailing: Car,
  construction: Hammer,
  water_refilling: Droplets,
  salon_aesthetic: Scissors,
  private_school: GraduationCap,
  ecommerce: ShoppingCart,
  personal_portfolio: Briefcase,
  photobooth: Camera,
};

// ─── All available sections for Step 3 customization ─────────────────────────
const ALL_SECTIONS = [
  { id: "hero", label: "Hero", description: "Main banner — always included.", icon: Layout, color: "text-primary", bg: "bg-primary/10", locked: true },
  // Core
  { id: "features", label: "Services", description: "Showcase what you offer.", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", category: "Services" },
  { id: "services-grid", label: "Services Grid", description: "Grid layout of your services.", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", category: "Services" },
  { id: "features-modern", label: "Services Modern", description: "Modern card layout for services.", icon: Zap, color: "text-amber-600", bg: "bg-amber-600/10", category: "Services" },
  { id: "testimonials", label: "Testimonials", description: "Social proof from real clients.", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10", category: "Trust" },
  { id: "review-trust-bar", label: "Review Bar", description: "Compact review trust strip.", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10", category: "Trust" },
  { id: "reviews-grid", label: "Reviews Grid", description: "Grid of client reviews.", icon: Star, color: "text-yellow-600", bg: "bg-yellow-600/10", category: "Trust" },
  { id: "facebook-review-embed", label: "Facebook Reviews", description: "Embed Facebook review cards.", icon: Star, color: "text-blue-400", bg: "bg-blue-400/10", category: "Trust" },
  { id: "contact", label: "Contact", description: "Let visitors reach you easily.", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10", category: "Contact" },
  { id: "contact-with-map", label: "Contact with Map", description: "Contact form with embedded map.", icon: Map, color: "text-blue-600", bg: "bg-blue-600/10", category: "Contact" },
  { id: "pricing", label: "Pricing", description: "Transparent plans and packages.", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", category: "Pricing" },
  { id: "packages-pricing", label: "Packages & Pricing", description: "Detailed package comparison.", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10", category: "Pricing" },
  { id: "price-preview-strip", label: "Price Preview", description: "Compact pricing preview strip.", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-600/10", category: "Pricing" },
  { id: "patient-faq", label: "FAQ", description: "Answer common questions upfront.", icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-500/10", category: "Info" },
  { id: "faq", label: "FAQ Accordion", description: "Expandable FAQ accordion.", icon: MessageSquare, color: "text-sky-400", bg: "bg-sky-400/10", category: "Info" },
  { id: "faq-two-column", label: "FAQ Two Column", description: "Two-column FAQ layout.", icon: MessageSquare, color: "text-sky-600", bg: "bg-sky-600/10", category: "Info" },
  { id: "team-carousel", label: "Team Carousel", description: "Scrollable team showcase.", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", category: "Team" },
  { id: "team-grid", label: "Team Grid", description: "Grid layout of team members.", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", category: "Team" },
  { id: "why-choose-me", label: "Why Choose Us", description: "Highlight your unique advantages.", icon: Users, color: "text-purple-600", bg: "bg-purple-600/10", category: "Team" },
  { id: "blog", label: "Blog / News", description: "Keep your site fresh with articles.", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-500/10", category: "Content" },
  { id: "awards", label: "Trust & Certs", description: "Display badges and certifications.", icon: ShieldCheck, color: "text-teal-500", bg: "bg-teal-500/10", category: "Trust" },
  { id: "certifications", label: "Certifications", description: "Show licenses and certifications.", icon: ShieldCheck, color: "text-teal-400", bg: "bg-teal-400/10", category: "Trust" },
  { id: "trust-badges-grid", label: "Trust Badges", description: "Logos and trust signals.", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10", category: "Trust" },
  { id: "gallery", label: "Gallery", description: "Show your work visually.", icon: Image, color: "text-pink-500", bg: "bg-pink-500/10", category: "Media" },
  { id: "before-after-gallery", label: "Before & After", description: "Side-by-side transformation photos.", icon: Image, color: "text-pink-400", bg: "bg-pink-400/10", category: "Media" },
  { id: "before-after-slider", label: "Before/After Slider", description: "Interactive before/after slider.", icon: Image, color: "text-pink-600", bg: "bg-pink-600/10", category: "Media" },
  { id: "service-area-map", label: "Coverage Map", description: "Show where you operate.", icon: Map, color: "text-orange-500", bg: "bg-orange-500/10", category: "Coverage" },
  { id: "comparison", label: "Comparison", description: "Us vs competitors or plan comparison.", icon: BarChart2, color: "text-red-500", bg: "bg-red-500/10", category: "Info" },
  { id: "stats", label: "Stats / Numbers", description: "Quick authority reinforcement.", icon: BarChart2, color: "text-cyan-500", bg: "bg-cyan-500/10", category: "Info" },
  { id: "case_study", label: "Case Studies", description: "Problem, solution, results.", icon: Briefcase, color: "text-violet-500", bg: "bg-violet-500/10", category: "Content" },
  { id: "announcement_bar", label: "Announcement Bar", description: "Promo strip above the header.", icon: Bell, color: "text-rose-500", bg: "bg-rose-500/10", category: "CTA" },
  { id: "emergency-cta-strip", label: "Emergency CTA", description: "Urgent call-to-action strip.", icon: Bell, color: "text-rose-400", bg: "bg-rose-400/10", category: "CTA" },
  { id: "cta--sticky", label: "Sticky CTA", description: "Floating call-to-action button.", icon: Megaphone, color: "text-lime-500", bg: "bg-lime-500/10", category: "CTA" },
  { id: "promo-cta-section", label: "Promo CTA", description: "Promotional call-to-action section.", icon: Megaphone, color: "text-lime-400", bg: "bg-lime-400/10", category: "CTA" },
  { id: "how-it-works", label: "How It Works", description: "Step-by-step process overview.", icon: ChevronRight, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", category: "Process" },
  { id: "treatment-process", label: "Treatment Process", description: "Detailed process or treatment steps.", icon: ChevronRight, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10", category: "Process" },
  { id: "booking-cta", label: "Booking", description: "Let visitors book appointments.", icon: ArrowRight, color: "text-blue-600", bg: "bg-blue-600/10", category: "CTA" },
  { id: "free-consultation", label: "Free Consultation", description: "Lead capture for consultations.", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-600/10", category: "CTA" },
  { id: "warranty-block", label: "Warranty / Guarantee", description: "Highlight your guarantee or warranty.", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-600/10", category: "Trust" },
  { id: "safety-section", label: "Safety", description: "Safety compliance and standards.", icon: ShieldCheck, color: "text-green-400", bg: "bg-green-400/10", category: "Trust" },
  { id: "practice-areas", label: "Practice Areas", description: "List of specialty practice areas.", icon: Briefcase, color: "text-violet-400", bg: "bg-violet-400/10", category: "Services" },
  { id: "ac-types-grid", label: "Product Types", description: "Grid of product or service types.", icon: Zap, color: "text-amber-300", bg: "bg-amber-300/10", category: "Services" },
  { id: "featured-properties-grid", label: "Featured Listings", description: "Showcase featured properties or items.", icon: Key, color: "text-orange-400", bg: "bg-orange-400/10", category: "Content" },
  { id: "financing-section", label: "Financing", description: "Financing options and payment plans.", icon: DollarSign, color: "text-emerald-300", bg: "bg-emerald-300/10", category: "Pricing" },
  { id: "common-pests", label: "Common Issues", description: "Highlight common problems you solve.", icon: Bug, color: "text-red-400", bg: "bg-red-400/10", category: "Services" },
  { id: "delivery-coverage", label: "Delivery Coverage", description: "Show delivery or service coverage area.", icon: Map, color: "text-orange-600", bg: "bg-orange-600/10", category: "Coverage" },
  { id: "developer-partners", label: "Partners", description: "Showcase developer or brand partners.", icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10", category: "Trust" },
  { id: "enrollment-process", label: "Enrollment Process", description: "Steps to enroll or get started.", icon: ChevronRight, color: "text-fuchsia-600", bg: "bg-fuchsia-600/10", category: "Process" },
  { id: "programs-grid", label: "Programs Grid", description: "Grid of programs or courses offered.", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-600/10", category: "Content" },
  { id: "faculty-grid", label: "Faculty / Staff", description: "Grid of faculty or staff members.", icon: Users, color: "text-purple-300", bg: "bg-purple-300/10", category: "Team" },
  { id: "product-grid", label: "Product Grid", description: "Grid of products for sale.", icon: ShoppingCart, color: "text-pink-300", bg: "bg-pink-300/10", category: "Services" },
];

// ─── Ranking ──────────────────────────────────────────────────────────────────
function rankPresets(businessType: string | null, sections: string[]) {
  return Object.keys(GENRE_PRESETS)
    .map((key) => {
      const preset = GENRE_PRESETS[key];
      const industryMatch = key === businessType ? 50 : 0;
      const sectionOverlap = preset.activeSections.filter((s: string) =>
        sections.includes(s)
      ).length;
      const isRecommended = key === businessType ? 20 : 0;
      const score = industryMatch + sectionOverlap * 10 + isRecommended;
      return { key, label: GENRE_LABELS[key] || key, preset, score };
    })
    .sort((a, b) => b.score - a.score);
}

// ─── Section toggle card ──────────────────────────────────────────────────────
function SectionCard({
  id, label, description, icon: Icon, color, bg, selected, locked, aiSuggested, onToggle,
}: {
  id: string; label: string; description: string; icon: React.ElementType;
  color: string; bg: string; selected: boolean; locked?: boolean; aiSuggested?: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={locked ? undefined : onToggle}
      disabled={locked}
      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group relative ${selected
        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
        : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
        } ${locked ? "opacity-70 cursor-default" : ""}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${selected ? "bg-primary text-primary-foreground scale-110" : `${bg} ${color} group-hover:scale-110`
        }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex-1 ${aiSuggested ? "pr-20" : "pr-6"}`}>
        <span className="font-bold text-sm block mb-0.5">{label}</span>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-1">{description}</p>
      </div>
      {!aiSuggested && !locked && (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all absolute top-1/2 -translate-y-1/2 right-4 ${selected ? "bg-primary border-primary" : "border-border"
          }`}>
          {selected && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
      )}
      {aiSuggested && !locked && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
          {selected && <Check className="w-3.5 h-3.5 text-primary" />}
          <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-violet-600 bg-violet-600/10 px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            AI Pick
          </span>
        </div>
      )}
      {locked && (
        <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          Always On
        </span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [businessType, setBusinessType] = React.useState<string | null>(null);
  const [businessDescription, setBusinessDescription] = React.useState("");
  const [selectedSections, setSelectedSections] = React.useState<string[]>([]);
  const [selectedPresetKey, setSelectedPresetKey] = React.useState<string | null>(null);
  const [submittingKey, setSubmittingKey] = React.useState<string | null>(null);
  const [redeemCode, setRedeemCode] = React.useState("");
  const [isRedeeming, setIsRedeeming] = React.useState(false);
  const [showRedeem, setShowRedeem] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const [moreSearch, setMoreSearch] = React.useState("");
  const [moreCategory, setMoreCategory] = React.useState("All");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [aiReasoning, setAiReasoning] = React.useState("");
  const [aiSuggestedIndustry, setAiSuggestedIndustry] = React.useState<string | null>(null);
  const [aiSuggestedSections, setAiSuggestedSections] = React.useState<string[]>([]);
  const [aiSuggestedPreset, setAiSuggestedPreset] = React.useState<string | null>(null);

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // When a preset is chosen, pre-populate sections from it
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    const preset = GENRE_PRESETS[key];
    if (preset?.activeSections) {
      setSelectedSections(preset.activeSections);
    }
    setShowMore(false);
    setStep(3);
  };

  const handleApplyPreset = async (presetKey: string, sections?: string[]) => {
    setSubmittingKey(presetKey);
    try {
      const res = await fetch("/api/project-config/apply-preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetKey, customSections: sections }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || "Failed to apply preset";
        throw new Error(errorMsg);
      }
      toast.success("Template applied! Redirecting to your dashboard...");
      window.location.href = `/dashboard?projectId=${data.projectId}`;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to apply template.";
      toast.error(msg);
      setSubmittingKey(null);
    }
  };

  const handleFinish = async () => {
    if (!selectedPresetKey) return;
    await handleApplyPreset(selectedPresetKey, selectedSections);
  };

  // AI analysis: call Gemini to detect industry + suggest sections
  const handleAiAnalyze = async () => {
    if (!businessDescription.trim() || businessDescription.trim().length < 5) return;
    setIsAnalyzing(true);
    setAiReasoning("");
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: businessDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI analysis failed");
      if (data.industry) {
        setBusinessType(data.industry);
        setAiSuggestedIndustry(data.industry);
      }
      if (data.sections) setAiSuggestedSections(data.sections);
      if (data.presetKey) setAiSuggestedPreset(data.presetKey);
      if (data.reasoning) setAiReasoning(data.reasoning);
      toast.success("AI detected your industry and suggested sections.");
    } catch {
      toast.error("AI analysis failed. Please select your industry manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setIsRedeeming(true);
    try {
      const res = await fetch("/api/codes/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: redeemCode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to redeem");
      toast.success("Template applied! Creating your project...");
      window.location.href = `/dashboard?projectId=${json.projectId}`;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to apply code";
      toast.error(msg);
    } finally {
      setIsRedeeming(false);
    }
  };

  const rankedPresets = React.useMemo(
    () => rankPresets(businessType, selectedSections),
    [businessType, selectedSections]
  );

  const isSubmitting = !!submittingKey;

  // Sections split: preset-selected sections first (as core), rest as more
  const nonLockedSections = ALL_SECTIONS.filter((s) => !s.locked);
  const coreSections = selectedPresetKey
    ? nonLockedSections.filter((s) => selectedSections.includes(s.id))
    : nonLockedSections.slice(0, 4);
  const coreIds = new Set(coreSections.map((s) => s.id));
  const moreSections = nonLockedSections.filter((s) => !coreIds.has(s.id));

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] -right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] -left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10 shrink-0">
        <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl bg-muted/40 border border-border/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <NextImage src="/Logo.svg" alt="EstabWeb" width={32} height={32} className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
          <span className="font-black text-xl tracking-tighter uppercase text-foreground">EstabWeb</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRedeem(!showRedeem)}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <Key className="w-3.5 h-3.5" />
            {showRedeem ? "Back to Guide" : "Have a Code?"}
          </button>
          <div className="h-5 w-px bg-border" />
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Exit to Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="container mx-auto px-6 h-full flex flex-col">

          {/* ── Code Redeem ── */}
          {showRedeem ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-8">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-tight">
                  Apply a <span className="text-primary">Template Code</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Enter your unique code to instantly set up your website.
                </p>
              </div>
              <form onSubmit={handleRedeem} className="w-full space-y-4">
                <input
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  placeholder="ENTER-YOUR-CODE-HERE"
                  className="w-full p-5 text-lg text-center border-2 border-border rounded-2xl bg-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none uppercase transition-all font-black tracking-widest placeholder:text-muted-foreground/30"
                />
                <button
                  type="submit"
                  disabled={isRedeeming || !redeemCode.trim()}
                  className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isRedeeming ? "Applying..." : "Activate Template"}
                </button>
              </form>
              <button
                onClick={() => setShowRedeem(false)}
                className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to guided setup
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full pt-6">

              {/* Step indicators */}
              <div className="flex items-center gap-3 mb-8 justify-center shrink-0">
                {[
                  { n: 1, label: "Industry" },
                  { n: 2, label: "Template" },
                  { n: 3, label: "Sections" },
                ].map(({ n, label }) => (
                  <React.Fragment key={n}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs transition-all duration-500 ${step >= n ? "bg-primary text-primary-foreground scale-110 shadow-lg" : "bg-muted text-muted-foreground"
                        }`}>
                        {step > n ? <Check className="w-4 h-4" /> : n}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${step >= n ? "text-primary" : "text-muted-foreground/50"}`}>
                        {label}
                      </span>
                    </div>
                    {n < 3 && (
                      <div className={`h-1 w-12 rounded-full transition-all duration-500 mb-4 ${step > n ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* ── Step 1: Industry ── */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-8 flex-1 flex flex-col">
                  <div className="space-y-2 text-center shrink-0">
                    <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                      Choose your <span className="text-primary italic">industry</span>
                    </h1>
                    <p className="text-base text-muted-foreground max-w-xl mx-auto">
                      We'll recommend the best template for your business.
                    </p>
                  </div>

                  {/* AI description box */}
                  <div className="shrink-0 max-w-2xl mx-auto w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Describe your business and let AI pick for you{" "}
                        <span className="font-normal normal-case tracking-normal">(optional)</span>
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <textarea
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                        placeholder="e.g. We're a pest control company serving Metro Cebu, specializing in termite treatment and general pest management."
                        rows={2}
                        className="flex-1 px-4 py-3 text-sm border border-border rounded-xl bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none placeholder:text-muted-foreground/40 transition-all font-medium"
                      />
                      <button
                        onClick={handleAiAnalyze}
                        disabled={isAnalyzing || businessDescription.trim().length < 5}
                        className="sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shrink-0 self-stretch shadow-lg shadow-primary/20"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {isAnalyzing ? "Analyzing..." : "AI Analyze"}
                      </button>
                    </div>
                    {aiReasoning && (
                      <p className="mt-2 text-xs text-primary/80 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 flex items-start gap-2">
                        <Bot className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {aiReasoning}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-y-auto pt-2 pb-6 px-1 flex-1 content-start scrollbar-thin scrollbar-track-muted scrollbar-thumb-border">
                    {Object.entries(GENRE_LABELS).map(([key, label]) => {
                      const Icon = BUSINESS_ICONS[key] || Layout;
                      const selected = businessType === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setBusinessType(key)}
                          className={`px-3 py-3 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1.5 group relative h-[100px] ${selected
                            ? "border-primary bg-primary shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.5)] -translate-y-2 scale-105"
                            : "border-border bg-card hover:border-primary/40 hover:bg-muted/50 hover:-translate-y-1 shadow-sm"
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${selected ? "bg-white/20 text-white scale-110" : "bg-primary/5 text-primary group-hover:scale-110"
                            }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`font-bold text-[10px] uppercase tracking-wider leading-tight ${selected ? "text-white" : "text-foreground"}`}>
                            {label}
                          </span>
                          {selected && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-lg border-2 border-primary">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          )}
                          {aiSuggestedIndustry === key && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-violet-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg whitespace-nowrap">
                              <Sparkles className="w-2.5 h-2.5" />
                              AI Pick
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-center shrink-0 border-t border-border mt-auto bg-background/80 backdrop-blur-sm sticky bottom-0 z-20 pb-4">
                    <button
                      disabled={!businessType}
                      onClick={() => setStep(2)}
                      className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-base shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      Next — Choose a Template
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Templates ── */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 pb-8 flex-1 flex flex-col">
                  <div className="space-y-2 text-center shrink-0">
                    <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                      Choose a <span className="text-primary italic">starting template</span>
                    </h1>
                    <p className="text-base text-muted-foreground max-w-xl mx-auto">
                      Pick the layout that fits your business. You'll customize sections in the next step.
                    </p>
                  </div>

                  <div className="grid gap-4 overflow-y-auto scrollbar-hide py-2 px-1 flex-1">
                    {rankedPresets.slice(0, 8).map(({ key, label, preset }, idx) => {
                      const Icon = BUSINESS_ICONS[key] || Layout;
                      const isTop = idx === 0;
                      return (
                        <div
                          key={key}
                          className={`relative group rounded-2xl border-2 p-5 transition-all duration-300 bg-card ${isTop
                            ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 ring-2 ring-primary/5"
                            : "border-border hover:border-primary/20"
                            }`}
                        >
                          {isTop && (
                            <div className="absolute -top-3 left-8 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                              Recommended
                            </div>
                          )}
                          {aiSuggestedPreset === key && (
                            <div className="absolute -top-3 right-8 flex items-center gap-1 px-3 py-1 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg">
                              <Sparkles className="w-3 h-3" />
                              AI Choice
                            </div>
                          )}

                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-black tracking-tight leading-none">{label}</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {preset.activeSections.length} sections included
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {preset.activeSections.slice(0, 8).map((s: string) => (
                                  <span
                                    key={s}
                                    className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-muted text-muted-foreground/70"
                                  >
                                    {s.replace(/-/g, " ")}
                                  </span>
                                ))}
                                {preset.activeSections.length > 8 && (
                                  <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-muted text-muted-foreground/40">
                                    +{preset.activeSections.length - 8} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              disabled={isSubmitting}
                              onClick={() => handleSelectPreset(key)}
                              className={`w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${isTop
                                ? "bg-primary text-primary-foreground hover:scale-105 shadow-xl shadow-primary/20"
                                : "bg-background border-2 border-border hover:border-primary hover:text-primary"
                                } disabled:opacity-50`}
                            >
                              Use This Template
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center items-center shrink-0 pt-4 border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0 z-20 pb-4 w-full gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="order-2 sm:order-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ArrowLeft className="w-3 h-3" />
                      </div>
                      Back to industry
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Customize Sections ── */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 pb-8 flex-1 flex flex-col">
                  <div className="space-y-2 text-center shrink-0">
                    <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                      Customize your <span className="text-primary italic">sections</span>
                    </h1>
                    <p className="text-base text-muted-foreground max-w-xl mx-auto">
                      These sections come from your chosen template. Remove what you don't need or add more.
                    </p>
                  </div>

                  <div className="overflow-y-auto scrollbar-hide flex-1 space-y-4 py-1 px-1">
                    {/* Hero — always locked */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primary/30 bg-primary/5 opacity-80 cursor-default">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
                        <Layout className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-sm block">Hero</span>
                        <p className="text-[11px] text-muted-foreground">Main banner — always included.</p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">Always On</span>
                    </div>

                    {/* Core sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {coreSections.map((s) => (
                        <SectionCard
                          key={s.id}
                          {...s}
                          locked={false}
                          selected={selectedSections.includes(s.id)}
                          aiSuggested={aiSuggestedSections.includes(s.id)}
                          onToggle={() => toggleSection(s.id)}
                        />
                      ))}
                    </div>

                    {/* More options accordion */}
                    <div>
                      <button
                        onClick={() => setShowMore((v) => !v)}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showMore ? "Hide additional sections" : "Show more sections"}
                      </button>
                      {showMore && (
                        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                              type="text"
                              placeholder="Search sections..."
                              value={moreSearch}
                              onChange={(e) => setMoreSearch(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            {moreSearch && (
                              <button
                                onClick={() => setMoreSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          {/* Category filter pills */}
                          <div className="flex flex-wrap gap-1.5">
                            {["All", "Services", "Trust", "Pricing", "Info", "Team", "Content", "Media", "Coverage", "CTA", "Process", "Contact"].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setMoreCategory(cat)}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${moreCategory === cat
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/70"
                                  }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                          {/* Filtered grid */}
                          {(() => {
                            const q = moreSearch.toLowerCase();
                            const filtered = moreSections.filter((s) => {
                              const matchesSearch = !q || s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
                              const matchesCat = moreCategory === "All" || (s as { category?: string }).category === moreCategory;
                              return matchesSearch && matchesCat;
                            });
                            return filtered.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filtered.map((s) => (
                                  <SectionCard
                                    key={s.id}
                                    {...s}
                                    locked={false}
                                    selected={selectedSections.includes(s.id)}
                                    aiSuggested={aiSuggestedSections.includes(s.id)}
                                    onToggle={() => toggleSection(s.id)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-6">No sections match your search.</p>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0 z-20 pb-4">
                    <button
                      onClick={() => setStep(2)}
                      className="order-2 sm:order-1 flex items-center gap-2 px-6 py-3 text-muted-foreground font-black uppercase tracking-widest hover:text-foreground transition-colors text-[10px]"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to templates
                    </button>

                    <button
                      disabled={isSubmitting}
                      onClick={handleFinish}
                      className="order-1 sm:order-2 group flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-base shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {submittingKey ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Building...
                        </>
                      ) : (
                        <>
                          Build My Website
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/50 bg-muted/5 shrink-0 px-6 sm:px-0">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 opacity-50 text-[10px] font-black uppercase tracking-[0.2em] text-center sm:text-left">
          <span>© 2026 EstabWeb Inc.</span>
          <div className="flex gap-8 sm:gap-6 flex-wrap justify-center">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
