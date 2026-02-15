"use client";

import * as React from "react";
import { 
  Layout, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Search, 
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
  ShoppingCart
} from "lucide-react";
import { GENRE_PRESETS, GENRE_LABELS } from "@/config/presets";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BUSINESS_ICONS: Record<string, any> = {
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
};

const ALL_SECTION_OPTIONS = [
  { id: 'features', label: 'Services & Expert Expertise', description: 'Showcase what you do best with beautiful grids.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'testimonials', label: 'Client Success Stories', description: 'Social proof that builds immediate trust.', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'pricing', label: 'Transparent Pricing', description: 'Packages and plans for clear conversions.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'patient-faq', label: 'Smart FAQ Accordion', description: 'Answer common questions before they ask.', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'team-carousel', label: 'Meet the Team', description: 'Humanize your brand with staff profiles.', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'blog', label: 'Industry Insights', description: 'Keep your site fresh with news and articles.', icon: Globe, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { id: 'awards', label: 'Trust & Certifications', description: 'Display your badges and professional awards.', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

export default function OnboardingPage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [businessType, setBusinessType] = React.useState<string | null>(null);
  const [selectedSections, setSelectedSections] = React.useState<string[]>([]);
  const [submittingKey, setSubmittingKey] = React.useState<string | null>(null);
  const [redeemCode, setRedeemCode] = React.useState("");
  const [isRedeeming, setIsRedeeming] = React.useState(false);
  const [showRedeem, setShowRedeem] = React.useState(false);
  
  const router = useRouter();

  const toggleSection = (id: string) => {
    setSelectedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleApplyPreset = async (presetKey: string) => {
    setSubmittingKey(presetKey);
    try {
      const res = await fetch('/api/project-config/apply-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetKey })
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to apply preset');
        throw new Error(errorMsg);
      }
      
      toast.success('Template applied! Redirecting to your dashboard...');
      window.location.href = `/dashboard?projectId=${data.projectId}`;
    } catch (e: any) {
      toast.error(e.message || "Failed to apply template.");
      setSubmittingKey(null);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setIsRedeeming(true);
    try {
      const res = await fetch('/api/codes/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode.trim() })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to redeem');
      toast.success('Template applied! Creating your project...');
      window.location.href = `/dashboard?projectId=${json.projectId}`;
    } catch (e: any) {
      toast.error(e?.message || 'Failed to apply code');
    } finally {
      setIsRedeeming(false);
    }
  };

  const curatedPresets = React.useMemo(() => {
    const allPresets = Object.keys(GENRE_PRESETS).map(key => ({
      key,
      label: GENRE_LABELS[key] || key,
      preset: GENRE_PRESETS[key]
    }));

    return allPresets.sort((a, b) => {
      if (a.key === businessType) return -1;
      if (b.key === businessType) return 1;
      const aOverlap = a.preset.activeSections.filter(s => selectedSections.includes(s)).length;
      const bOverlap = b.preset.activeSections.filter(s => selectedSections.includes(s)).length;
      return bOverlap - aOverlap;
    });
  }, [businessType, selectedSections]);

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] -right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] -left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Image 
            src="/Logo.svg" 
            alt="EstabWeb Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8 object-contain"
          />
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
            onClick={() => window.location.href = '/dashboard'}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Exit to Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="container mx-auto px-6 h-full flex flex-col">
          {showRedeem ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 py-8">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-black tracking-tight leading-tight">
                  Apply a <span className="text-primary">Template Code</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Enter your unique design code below to instantly set up your website.
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
                <ArrowLeft className="w-4 h-4" /> Or follow our guided onboarding
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full pt-6">
              {/* Step Indicators */}
              <div className="flex items-center gap-3 mb-8 justify-center shrink-0">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs transition-all duration-500 ${
                      step >= s ? "bg-primary text-primary-foreground scale-110 shadow-lg" : "bg-muted text-muted-foreground"
                    }`}>
                      {step > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`h-1 w-8 rounded-full transition-all duration-500 ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-8 flex-1 flex flex-col">
                  <div className="space-y-2 text-center shrink-0">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                      What is the <span className="text-primary">soul</span> of your business?
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Choose your industry to unlock curated layouts and features.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 overflow-y-auto scrollbar-hide py-2 px-1">
                    {Object.entries(GENRE_LABELS).map(([key, label]) => {
                      const Icon = BUSINESS_ICONS[key] || Layout;
                      return (
                        <button
                          key={key}
                          onClick={() => setBusinessType(key)}
                          className={`p-4 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center gap-3 group relative ${
                            businessType === key 
                              ? "border-primary bg-primary shadow-xl shadow-primary/20 -translate-y-1" 
                              : "border-border bg-card hover:border-primary/30 hover:bg-muted/50 hover:-translate-y-0.5"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            businessType === key 
                              ? "bg-white/20 text-white scale-110 rotate-12" 
                              : "bg-primary/5 text-primary group-hover:scale-110 group-hover:rotate-6"
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className={`font-black text-[10px] uppercase tracking-wider leading-tight ${
                            businessType === key ? "text-white" : "text-foreground"
                          }`}>{label}</span>
                          {businessType === key && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-lg border-2 border-primary">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-center shrink-0">
                    <button
                      disabled={!businessType}
                      onClick={() => setStep(2)}
                      className="group flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Next Dimension
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-8 flex-1 flex flex-col">
                  <div className="space-y-2 text-center shrink-0">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                      Equip your <span className="text-primary">Digital Arsenal</span>.
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Select high-impact sections for your initial build.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto scrollbar-hide py-2 px-1">
                    {ALL_SECTION_OPTIONS.map(({ id, label, description, icon: Icon, color, bg }) => (
                      <button
                        key={id}
                        onClick={() => toggleSection(id)}
                        className={`flex items-center gap-4 p-4 rounded-[1.5rem] border-2 transition-all text-left group relative ${
                          selectedSections.includes(id)
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                            : "border-border bg-card hover:border-primary/20 hover:bg-muted/30"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                          selectedSections.includes(id) 
                            ? "bg-primary text-primary-foreground scale-110" 
                            : `${bg} ${color} group-hover:scale-110 group-hover:rotate-3`
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pr-6">
                          <span className="font-black text-sm block mb-0.5">{label}</span>
                          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium line-clamp-1">{description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 absolute top-1/2 -translate-y-1/2 right-4 ${
                          selectedSections.includes(id) ? "bg-primary border-primary scale-110" : "border-border"
                        }`}>
                          {selectedSections.includes(id) && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between items-center gap-4 shrink-0">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-4 text-muted-foreground font-bold hover:text-foreground transition-colors text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="group flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      Forge Previews
                      <Sparkles className="w-5 h-5 group-hover:animate-spin-slow" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-8 flex-1 flex flex-col">
                  <div className="space-y-2 text-center shrink-0">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-balance">
                      Behold your <span className="text-primary">Curated Blueprints</span>.
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Optimized starting templates for maximum conversion.
                    </p>
                  </div>

                  <div className="grid gap-4 overflow-y-auto scrollbar-hide py-2 px-1">
                    {curatedPresets.slice(0, 5).map(({ key, label, preset }, idx) => (
                      <div 
                        key={key}
                        className={`relative group rounded-[2rem] border-2 p-5 transition-all duration-500 bg-card ${
                          idx === 0 
                            ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 ring-2 ring-primary/5" 
                            : "border-border hover:border-primary/20"
                        }`}
                      >
                        {idx === 0 && (
                          <div className="absolute -top-3 left-8 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                            Recommended
                          </div>
                        )}
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                                {React.createElement(BUSINESS_ICONS[key] || Layout, { className: "w-5 h-5" })}
                              </div>
                              <h3 className="text-xl font-black tracking-tight leading-none">
                                {label} <span className="text-muted-foreground font-light text-sm">Template</span>
                              </h3>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5">
                              {preset.activeSections.slice(0, 6).map(s => {
                                const isRequested = selectedSections.includes(s);
                                return (
                                  <span 
                                    key={s} 
                                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                                      isRequested 
                                        ? "bg-primary text-primary-foreground" 
                                        : "bg-muted text-muted-foreground/60"
                                    }`}
                                  >
                                    {s.replace(/-/g, ' ')}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          
                          <button
                            disabled={!!submittingKey}
                            onClick={() => handleApplyPreset(key)}
                            className={`w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${
                              idx === 0 
                                ? "bg-primary text-primary-foreground hover:scale-105 shadow-xl shadow-primary/20" 
                                : "bg-background border-2 border-border hover:border-primary hover:text-primary"
                            }`}
                          >
                            {submittingKey === key ? "Building..." : "Select Template"}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center shrink-0 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ArrowLeft className="w-3 h-3" />
                      </div>
                      Refine selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-4 border-t border-border/50 bg-muted/5 shrink-0">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 opacity-50 text-[10px] font-black uppercase tracking-[0.2em]">
          <span>© 2026 EstabWeb Inc.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
