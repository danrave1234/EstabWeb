"use client";

import { useState, useEffect } from "react";
import { Settings, X, ChevronRight, ChevronLeft, Download, Moon, Sun, Type, Layout, Palette, PanelTop, PanelBottom, Layers } from "lucide-react";
import { GENRE_PRESETS, GENRE_LABELS } from "@/config/presets";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "hero-emergency", label: "Emergency Hero" },
  { id: "awards", label: "Awards Strip" },
  { id: "features", label: "Features (Grid)" },
  { id: "features-modern", label: "Features (Side)" },
  { id: "practice-areas", label: "Practice Areas" },
  { id: "how-it-works", label: "How It Works" },
  { id: "feature-highlight", label: "Feature Highlight" },
  { id: "attorney-profile", label: "Attorney Profile" },
  { id: "team-carousel", label: "Team Carousel" },
  { id: "team-grid", label: "Team Grid" },
  { id: "testimonials", label: "Testimonials" },
  { id: "review-trust-bar", label: "Review Trust Bar" },
  { id: "reviews-grid", label: "Reviews Grid" },
  { id: "blog", label: "Blog" },
  { id: "pricing", label: "Pricing" },
  { id: "patient-faq", label: "Patient FAQ" },
  { id: "faq-two-column", label: "FAQ Two Column" },
  { id: "contact", label: "Contact" },
  { id: "contact-split", label: "Contact Split" },
  { id: "free-consultation", label: "Free Consultation" },
] as const;

const HERO_OPTIONS = [
  { value: "lawyer", label: "Lawyer" },
  { value: "startup", label: "Startup" },
  { value: "chiropractor", label: "Chiro" },
  { value: "dentist", label: "Dentist" },
  { value: "clinic", label: "Clinic" },
  { value: "cleaning", label: "Cleaning" },
  { value: "pool", label: "Pool" },
  { value: "pest-control", label: "Pest" },
];

const COLOR_THEMES = [
  { value: "partner", label: "Partner", primary: "#1a2b3c" },
  { value: "justice", label: "Justice", primary: "#2d3436" },
  { value: "modern", label: "Modern", primary: "#000000" },
  { value: "frost-fire", label: "Frost-Fire", primary: "#0984e3" },
  { value: "reliable", label: "Reliable", primary: "#2d3436" },
  { value: "eco-clean", label: "Eco-Clean", primary: "#00b894" },
  { value: "surgeon", label: "Surgeon", primary: "#0984e3" },
  { value: "wellness", label: "Wellness", primary: "#6c5ce7" },
  { value: "holistic", label: "Holistic", primary: "#218c74" },
  { value: "nebula", label: "Nebula", primary: "#6c5ce7" },
  { value: "flow", label: "Flow", primary: "#4834d4" },
  { value: "mono", label: "Mono", primary: "#000000" },
];

type SectionId = (typeof SECTIONS)[number]["id"];

export default function SiteEditorSidebar() {
  const [isOpen, setIsVisible] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"presets" | "style" | "sections">("presets");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const updateData = async (newData: any) => {
    setData(newData);
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    window.location.reload();
  };

  const toggleSection = (id: SectionId) => {
    if (!data) return;
    const current = data.activeSections || [];
    const next = current.includes(id)
      ? current.filter((s: string) => s !== id)
      : [...current, id];
    updateData({ ...data, activeSections: next });
  };

  if (loading || !data) return null;

  const activeSections = data.activeSections || ["hero"];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] bg-primary text-primary-foreground p-3 rounded-r-2xl shadow-2xl hover:pl-5 transition-all group"
        title="Developer Tools"
      >
        <Settings className="w-6 h-6 animate-spin-slow group-hover:scale-110 transition-transform" />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110]" 
          onClick={() => setIsVisible(false)} 
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed left-0 top-0 bottom-0 w-80 bg-background border-r border-border z-[120] shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Dev Builder
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Live configuration & DNA</p>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="/admin"
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                title="Back to Admin"
              >
                <ChevronLeft className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === "presets" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === "style" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Style
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === "sections" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sections
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            {activeTab === "presets" && (
              <>
                {/* Quick Actions */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Download className="w-3 h-3" /> Quick Actions
                  </h3>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `site-data.json`;
                      a.click();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Export DNA (JSON)
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Genre Presets */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Genre Presets
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(GENRE_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const updated = {
                            ...data,
                            theme: preset.theme,
                            colorTheme: preset.colorTheme,
                            typographyStyle: preset.typographyStyle || data.typographyStyle,
                            activeSections: preset.activeSections,
                            ...preset.content
                          };
                          updateData(updated);
                        }}
                        className={`text-left p-2 rounded-lg border text-[10px] font-medium transition-all ${data.theme === preset.theme && data.colorTheme === preset.colorTheme ? "bg-primary border-primary text-primary-foreground shadow-lg" : "bg-muted/30 border-transparent hover:border-primary/50"}`}
                      >
                        {GENRE_LABELS[key] || key}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "style" && (
              <>
                {/* Hero Style */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <PanelTop className="w-3 h-3" /> Hero Style
                  </h3>
                  <div className="grid grid-cols-4 gap-1">
                    {HERO_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateData({ ...data, theme: opt.value })}
                        className={`p-2 rounded-lg border text-[9px] font-bold transition-all ${data.theme === opt.value ? "bg-primary border-primary text-primary-foreground" : "bg-muted/30 border-transparent hover:border-primary/50"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Color Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_THEMES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => updateData({ ...data, colorTheme: t.value })}
                        className={`flex items-center gap-1.5 p-2 rounded-lg border text-[9px] font-bold transition-all ${data.colorTheme === t.value ? "bg-primary/10 border-primary" : "bg-muted/30 border-transparent hover:border-primary/40"}`}
                      >
                        <span
                          className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                          style={{ backgroundColor: t.primary }}
                        />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Header Style */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <PanelTop className="w-3 h-3" /> Header Style
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["solid", "floating"].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateData({ ...data, headerStyle: style })}
                        className={`p-2 rounded-lg border text-[10px] font-bold capitalize transition-all ${data.headerStyle === style ? "bg-primary border-primary text-primary-foreground" : "bg-muted/30 border-transparent hover:border-primary/50"}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Style */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <PanelBottom className="w-3 h-3" /> Footer Style
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["lead-magnet", "simple", "minimal"].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateData({ ...data, footerStyle: style })}
                        className={`p-2 rounded-lg border text-[9px] font-bold capitalize transition-all ${data.footerStyle === style ? "bg-primary border-primary text-primary-foreground" : "bg-muted/30 border-transparent hover:border-primary/50"}`}
                      >
                        {style.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appearance */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Moon className="w-3 h-3" /> Appearance
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateData({ ...data, darkMode: false })}
                      className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${!data.darkMode ? "bg-primary border-primary text-primary-foreground" : "bg-muted/30 border-transparent"}`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => updateData({ ...data, darkMode: true })}
                      className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border text-[10px] font-bold transition-all ${data.darkMode ? "bg-primary border-primary text-primary-foreground" : "bg-muted/30 border-transparent"}`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Type className="w-3 h-3" /> Typography
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "modern", label: "Modern" },
                      { id: "elegant", label: "Elegant" },
                      { id: "bold", label: "Bold" },
                      { id: "clinical", label: "Clinical" },
                      { id: "technical", label: "Technical" },
                      { id: "playful", label: "Playful" },
                      { id: "traditional", label: "Traditional" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateData({ ...data, typographyStyle: t.id })}
                        className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${data.typographyStyle === t.id ? "bg-primary border-primary text-primary-foreground" : "bg-muted/30 border-transparent hover:border-primary/30"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "sections" && (
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Page Sections
                </h3>
                <p className="text-[10px] text-muted-foreground mb-2">Toggle blocks on your homepage.</p>
                <div className="space-y-1">
                  {SECTIONS.map(({ id, label }) => (
                    <label
                      key={id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-transparent hover:bg-muted/30 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="checkbox"
                        checked={activeSections.includes(id)}
                        onChange={() => toggleSection(id)}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-[10px] font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 bg-muted/30 border-t border-border mt-auto">
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Changes trigger a live refresh. Export JSON to freeze DNA for production.
            </p>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
