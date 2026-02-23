"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Settings, X, ChevronRight, ChevronLeft, Download, Moon, Sun, Type, Layout, Palette, PanelTop, PanelBottom, Layers, Copy, Check, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { GENRE_PRESETS, GENRE_LABELS } from "@/config/presets";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import ImageUpload from "./ImageUpload";

const SECTIONS = [
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
  { id: "trust-badges-grid", label: "Trust Badges Grid" },
  { id: "reviews-grid", label: "Reviews Grid" },
  { id: "blog", label: "Blog" },
  { id: "pricing", label: "Pricing" },
  { id: "featured-properties-grid", label: "Featured Properties" },
  { id: "financing-section", label: "Financing Options" },
  { id: "developer-partners", label: "Developer Partners" },
  { id: "why-choose-me", label: "Agent Section" },
  { id: "services-grid", label: "Services Grid" },
  { id: "why-choose-us", label: "Why Choose Us" },
  { id: "before-after-gallery", label: "Before/After Gallery" },
  { id: "packages-pricing", label: "Packages & Pricing" },
  { id: "project-gallery", label: "Project Gallery" },
  { id: "certifications", label: "Certifications" },
  { id: "delivery-coverage", label: "Delivery Coverage" },
  { id: "programs-grid", label: "Programs Grid" },
  { id: "faculty-grid", label: "Faculty Grid" },
  { id: "enrollment-process", label: "Enrollment Process" },
  { id: "patient-faq", label: "Patient FAQ" },
  { id: "faq-two-column", label: "FAQ Two Column" },
  { id: "messenger-sticky-cta", label: "Messenger Sticky CTA" },
  { id: "service-area-map", label: "Service Area Map" },
  { id: "before-after-slider", label: "Before/After Slider" },
  { id: "promo-banner-strip", label: "Promo Banner Strip" },
  { id: "payment-options-strip", label: "Payment Options Strip" },
  { id: "facebook-review-embed", label: "Facebook Review Embed" },
  { id: "coverage-radius-block", label: "Coverage Radius Block" },
  { id: "common-pests", label: "Common Pests Grid" },
  { id: "treatment-process", label: "Treatment Process" },
  { id: "safety-section", label: "Safety Section" },
  { id: "warranty-block", label: "Warranty Block" },
  { id: "ac-types-grid", label: "AC Types Grid" },
  { id: "price-preview-strip", label: "Price Preview Strip" },
  { id: "emergency-cta-strip", label: "Emergency CTA Strip" },
  { id: "maintenance-plans", label: "Maintenance Plans" },
  { id: "product-grid", label: "Product Grid (Ecommerce)" },
  { id: "before-after-gallery-grid", label: "Before/After Gallery Grid" },
  { id: "promo-cta-section", label: "Promo CTA Section" },
  { id: "contact", label: "Contact" },
  { id: "contact-minimal", label: "Contact Minimal" },
  { id: "contact-with-map", label: "Contact With Map" },
  { id: "free-consultation", label: "Free Consultation" },
  { id: "booking-cta", label: "Booking CTA" },
] as const;

const HERO_OPTIONS = [
  { value: "lawyer", label: "Lawyer" },
  { value: "startup", label: "Startup" },
  { value: "chiropractor", label: "Chiro" },
  { value: "dentist", label: "Dentist" },
  { value: "clinic", label: "Clinic" },
  { value: "cleaning-fresh", label: "Cleaning" },
  { value: "pool", label: "Pool" },
  { value: "pest-control", label: "Pest" },
  { value: "before-after", label: "Auto" },
  { value: "real-estate-modern", label: "Real Estate" },
  { value: "before-after-split", label: "Auto Detailing" },
  { value: "industrial", label: "Construction" },
  { value: "clean-delivery", label: "Water Refilling" },
  { value: "luxury-soft", label: "Salon" },
  { value: "academic-clean", label: "School" },
  { value: "hvac-urgent", label: "HVAC" },
  { value: "ecommerce", label: "E-commerce" },
];

const COLOR_THEMES = [
  { value: "partner", label: "Partner", primary: "#1a2b3c" },
  { value: "justice", label: "Justice", primary: "#2d3436" },
  { value: "modern", label: "Modern", primary: "#000000" },
  { value: "frost-fire", label: "Frost-Fire", primary: "#0984e3", swatch: "linear-gradient(90deg,#0984e3 0%,#e17055 100%)" },
  { value: "reliable", label: "Reliable", primary: "#2d3436", swatch: "linear-gradient(90deg,#2d3436 0%,#fdcb6e 100%)" },
  { value: "eco-clean", label: "Eco-Clean", primary: "#00b894", swatch: "linear-gradient(90deg,#00b894 0%,#00cec9 100%)" },
  { value: "surgeon", label: "Surgeon", primary: "#0984e3", swatch: "linear-gradient(90deg,#0984e3 0%,#74b9ff 100%)" },
  { value: "wellness", label: "Wellness", primary: "#6c5ce7", swatch: "linear-gradient(90deg,#6c5ce7 0%,#a29bfe 100%)" },
  { value: "holistic", label: "Holistic", primary: "#218c74", swatch: "linear-gradient(90deg,#218c74 0%,#f7f1e3 100%)" },
  { value: "clinical-gold", label: "Clinical Gold", primary: "#eab308", swatch: "linear-gradient(90deg,#0d0f14 0%,#f0c674 50%,#eab308 100%)" },
  { value: "red-crimson", label: "Red Crimson", primary: "#d63031" },
  { value: "cyan-ocean", label: "Cyan Ocean", primary: "#00a8ff" },
  { value: "orange-amber", label: "Orange Amber", primary: "#f39c12" },
  // New requested themes with multi-color swatches
  { value: "dark-pink-white", label: "Dark Pink + White", primary: "#b00063", swatch: "linear-gradient(90deg,#b00063 0%,#ff4d94 50%,#ffffff 100%)" },
  { value: "blue-mint", label: "Blue + Mint", primary: "#2563eb", swatch: "linear-gradient(90deg,#2563eb 0%,#2dd4bf 100%)" },
  { value: "red-black", label: "Red + Black", primary: "#e11d48", swatch: "linear-gradient(90deg,#e11d48 0%,#111111 100%)" },
  { value: "dark-green-ivory-yellow", label: "Dark Green + Ivory + Yellow", primary: "#14532d", swatch: "linear-gradient(90deg,#14532d 0%,#fffff0 50%,#eab308 100%)" },
  { value: "bright-green-hot-pink", label: "Bright Green + Hot Pink", primary: "#10b981", swatch: "linear-gradient(90deg,#10b981 0%,#ff1493 100%)" },
  { value: "dark-grey-yellowgreen", label: "Dark Grey + Yellow-Green", primary: "#1f2937", swatch: "linear-gradient(90deg,#1f2937 0%,#9acd32 100%)" },
  { value: "blue-shades-white", label: "Blue Shades + White", primary: "#1d4ed8", swatch: "linear-gradient(90deg,#1d4ed8 0%,#60a5fa 50%,#ffffff 100%)" },
  { value: "white-lime", label: "White + Lime Green", primary: "#84cc16", swatch: "linear-gradient(90deg,#ffffff 0%,#84cc16 100%)" },
  { value: "beige-dark-grey", label: "Beige + Dark Grey", primary: "#2d3436", swatch: "linear-gradient(90deg,#f5f5dc 0%,#2d3436 100%)" },
  { value: "pastel-purple-neutral", label: "Pastel Purple + Neutral", primary: "#c4b5fd", swatch: "linear-gradient(90deg,#c4b5fd 0%,#a3a3a3 100%)" },
  { value: "navy-electric-blue", label: "Navy + Electric Blue", primary: "#0a1a44", swatch: "linear-gradient(90deg,#0a1a44 0%,#00c2ff 100%)" },
  { value: "gradient-white-dark-blue", label: "Gradient + White + Dark Blue", primary: "#0c2340", swatch: "linear-gradient(90deg,#ffffff 0%,#3b82f6 50%,#0c2340 100%)" },
  { value: "white-blue-grey", label: "White + Blue-Grey", primary: "#64748b", swatch: "linear-gradient(90deg,#ffffff 0%,#64748b 100%)" },
  { value: "bright-red-white", label: "Bright Red + White", primary: "#ef4444", swatch: "linear-gradient(90deg,#ef4444 0%,#ffffff 100%)" },
  { value: "classic-blue-turquoise-gold", label: "Classic Blue + Turquoise + Gold", primary: "#0f4c81", swatch: "linear-gradient(90deg,#0f4c81 0%,#40e0d0 50%,#c5a059 100%)" },
  { value: "dark-royal-blue-gold", label: "Dark Royal Blue + Gold", primary: "#0b1a4a", swatch: "linear-gradient(90deg,#0b1a4a 0%,#d4af37 100%)" },
  { value: "white-purple", label: "White + Purple", primary: "#8b5cf6", swatch: "linear-gradient(90deg,#ffffff 0%,#8b5cf6 100%)" },
  { value: "blue-shades-white-red-violet", label: "Blue Shades + White + Red-Violet", primary: "#2563eb", swatch: "linear-gradient(90deg,#2563eb 0%,#ffffff 50%,#c71585 100%)" },
  { value: "light-reddish-orange", label: "Light + Reddish Orange", primary: "#ff8c42", swatch: "linear-gradient(90deg,#ff8c42 0%,#ff4500 100%)" },
  { value: "white-purple-orange", label: "White + Purple + Orange", primary: "#9333ea", swatch: "linear-gradient(90deg,#ffffff 0%,#9333ea 50%,#fb923c 100%)" },
  { value: "deep-purple-orange-red-pink", label: "Deep Purple + Orange + Red + Pink", primary: "#6d28d9", swatch: "linear-gradient(90deg,#6d28d9 0%,#f97316 33%,#ef4444 66%,#ec4899 100%)" },
  { value: "brown-beige", label: "Brown + Beige", primary: "#8b5e3c", swatch: "linear-gradient(90deg,#8b5e3c 0%,#f5f5dc 100%)" },
  { value: "navy-electric", label: "Navy + Electric", primary: "#0a1a44", swatch: "linear-gradient(90deg,#0a1a44 0%,#00c2ff 100%)" },
  { value: "dark-green-ivory", label: "Dark Green + Ivory", primary: "#14532d", swatch: "linear-gradient(90deg,#14532d 0%,#fffff0 100%)" },
  { value: "fiesta-red-yellow", label: "Fiesta Red + Yellow", primary: "#c1121f", swatch: "linear-gradient(90deg,#c1121f 0%,#ffbe0b 100%)" },
  { value: "barangay-blue", label: "Barangay Blue", primary: "#1d3557", swatch: "linear-gradient(90deg,#1d3557 0%,#457b9d 100%)" },
  { value: "tropical-teal", label: "Tropical Teal", primary: "#008080", swatch: "linear-gradient(90deg,#008080 0%,#f4a261 100%)" },
  { value: "luxury-black-gold", label: "Luxury Black + Gold", primary: "#111111", swatch: "linear-gradient(90deg,#111111 0%,#c6a75e 100%)" },
  { value: "facebook-blue", label: "Facebook Blue", primary: "#1877f2", swatch: "linear-gradient(90deg,#1877f2 0%,#42a5f5 100%)" },
  { value: "nebula", label: "Nebula", primary: "#6c5ce7" },
  { value: "flow", label: "Flow", primary: "#4834d4" },
  { value: "mono", label: "Mono", primary: "#000000" },
];

function SectionToggle({ id, label, activeSections, onToggle }: { id: string, label: string, activeSections: string[], onToggle: (id: any) => void }) {
  return (
    <label className="flex items-center gap-2 p-1.5 rounded-lg border border-transparent hover:bg-muted/30 cursor-pointer transition-colors has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
      <input
        type="checkbox"
        checked={activeSections.includes(id)}
        onChange={() => onToggle(id)}
        className="h-3 w-3 rounded border-border text-primary focus:ring-primary"
      />
      <span className="text-[10px] font-medium truncate">{label}</span>
    </label>
  );
}

type SectionId = (typeof SECTIONS)[number]["id"];

const configFetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SiteEditorSidebar() {
  const [isOpen, setIsVisible] = useState(false);
  const { data: swrData, isLoading: loading } = useSWR<any>("/api/config", configFetcher);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (swrData) setData(swrData);
  }, [swrData]);
  const [activeTab, setActiveTab] = useState<"presets" | "design" | "layout" | "content" | "brand" | "team" | "contact">("presets");
  const [prefix, setPrefix] = useState("");
  const [maxUses, setMaxUses] = useState<number>(1);
  const [expireDays, setExpireDays] = useState<number>(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

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
    const current = [...(data.activeSections || [])];
    
    if (current.includes(id)) {
      // Find the index of the first occurrence and remove it
      const idx = current.indexOf(id);
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    updateData({ ...data, activeSections: current });
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
      <aside className={`fixed left-0 top-0 bottom-0 w-[600px] bg-background border-r border-border z-[120] shadow-2xl transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
              <Link 
                href="/admin"
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                title="Back to Admin"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-muted/20">
            {[
              { id: "presets", label: "Presets", icon: Layout },
              { id: "layout", label: "Layout", icon: Layers },
              { id: "design", label: "Design", icon: Palette },
              { id: "content", label: "Content", icon: Type },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-all ${activeTab === tab.id ? "bg-background text-primary border-b-2 border-primary shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" : "text-muted-foreground hover:text-foreground hover:bg-background/50"}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            {activeTab === "content" && (
              <div className="space-y-8">
                {/* Brand & Hero */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> Brand Identity
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Business Name</label>
                        <input
                          value={data.brand?.name || ""}
                          onChange={(e) => {
                            setData({ ...data, brand: { ...data.brand, name: e.target.value } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Logo Image</label>
                        <ImageUpload
                          value={data.brand?.logoUrl || ""}
                          onChange={(url) => {
                            updateData({ ...data, brand: { ...data.brand, logoUrl: url } });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <PanelTop className="w-4 h-4 text-primary" /> Hero Content
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Main Title</label>
                        <input
                          value={data.hero?.title || ""}
                          onChange={(e) => {
                            setData({ ...data, hero: { ...data.hero, title: e.target.value } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Subtitle</label>
                        <textarea
                          value={data.hero?.subtitle || ""}
                          onChange={(e) => {
                            setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } });
                          }}
                          onBlur={() => updateData(data)}
                          rows={2}
                          className="w-full p-2 text-xs border rounded bg-background resize-none focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" /> Contact & Location
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Email</label>
                      <input
                        value={data.contact?.email || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, email: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone</label>
                      <input
                        value={data.contact?.phone || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, phone: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Location</label>
                      <input
                        value={data.hero?.localCoverage || ""}
                        onChange={(e) => {
                          setData({ ...data, hero: { ...data.hero, localCoverage: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        placeholder="e.g. Metro Manila"
                        className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layout className="w-4 h-4 text-primary" /> Team Members
                    </h3>
                    <button
                      onClick={() => {
                        const newMember = {
                          name: "New Member",
                          specialty: "Position / Role",
                          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
                          bioUrl: "#",
                        };
                        const currentMembers = data.teamCarousel?.members || [];
                        updateData({
                          ...data,
                          teamCarousel: {
                            ...data.teamCarousel,
                            members: [...currentMembers, newMember]
                          }
                        });
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Member
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(data.teamCarousel?.members || []).map((member: any, index: number) => (
                      <div key={index} className="p-4 border border-border rounded-xl bg-muted/20 space-y-3 relative group/member shadow-sm">
                        <button
                          onClick={() => {
                            const members = [...data.teamCarousel.members];
                            members.splice(index, 1);
                            updateData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/member:opacity-100 transition shadow-md z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex gap-4">
                          <div className="w-20 h-20 shrink-0">
                            <ImageUpload
                              value={member.imageUrl}
                              onChange={(url) => {
                                const members = [...data.teamCarousel.members];
                                members[index] = { ...member, imageUrl: url };
                                updateData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-muted-foreground">Name</label>
                              <input
                                value={member.name}
                                onChange={(e) => {
                                  const members = [...data.teamCarousel.members];
                                  members[index] = { ...member, name: e.target.value };
                                  setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                                }}
                                onBlur={() => updateData(data)}
                                className="w-full p-1.5 text-[11px] border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-muted-foreground">Role</label>
                              <input
                                value={member.specialty}
                                onChange={(e) => {
                                  const members = [...data.teamCarousel.members];
                                  members[index] = { ...member, specialty: e.target.value };
                                  setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                                }}
                                onBlur={() => updateData(data)}
                                className="w-full p-1.5 text-[11px] border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="space-y-8">
                {/* Brand & Hero */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> Brand Identity
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Business Name</label>
                        <input
                          value={data.brand?.name || ""}
                          onChange={(e) => {
                            setData({ ...data, brand: { ...data.brand, name: e.target.value } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Logo Image</label>
                        <ImageUpload
                          value={data.brand?.logoUrl || ""}
                          onChange={(url) => {
                            updateData({ ...data, brand: { ...data.brand, logoUrl: url } });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <PanelTop className="w-4 h-4 text-primary" /> Hero Content
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Main Title</label>
                        <input
                          value={data.hero?.title || ""}
                          onChange={(e) => {
                            setData({ ...data, hero: { ...data.hero, title: e.target.value } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Subtitle</label>
                        <textarea
                          value={data.hero?.subtitle || ""}
                          onChange={(e) => {
                            setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } });
                          }}
                          onBlur={() => updateData(data)}
                          rows={2}
                          className="w-full p-2 text-xs border rounded bg-background resize-none focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" /> Contact & Location
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Email</label>
                      <input
                        value={data.contact?.email || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, email: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone</label>
                      <input
                        value={data.contact?.phone || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, phone: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Location</label>
                      <input
                        value={data.hero?.localCoverage || ""}
                        onChange={(e) => {
                          setData({ ...data, hero: { ...data.hero, localCoverage: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        placeholder="e.g. Metro Manila"
                        className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layout className="w-4 h-4 text-primary" /> Team Members
                    </h3>
                    <button
                      onClick={() => {
                        const newMember = {
                          name: "New Member",
                          specialty: "Position / Role",
                          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
                          bioUrl: "#",
                        };
                        const currentMembers = data.teamCarousel?.members || [];
                        updateData({
                          ...data,
                          teamCarousel: {
                            ...data.teamCarousel,
                            members: [...currentMembers, newMember]
                          }
                        });
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Member
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(data.teamCarousel?.members || []).map((member: any, index: number) => (
                      <div key={index} className="p-4 border border-border rounded-xl bg-muted/20 space-y-3 relative group/member shadow-sm">
                        <button
                          onClick={() => {
                            const members = [...data.teamCarousel.members];
                            members.splice(index, 1);
                            updateData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/member:opacity-100 transition shadow-md z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex gap-4">
                          <div className="w-20 h-20 shrink-0">
                            <ImageUpload
                              value={member.imageUrl}
                              onChange={(url) => {
                                const members = [...data.teamCarousel.members];
                                members[index] = { ...member, imageUrl: url };
                                updateData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-muted-foreground">Name</label>
                              <input
                                value={member.name}
                                onChange={(e) => {
                                  const members = [...data.teamCarousel.members];
                                  members[index] = { ...member, name: e.target.value };
                                  setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                                }}
                                onBlur={() => updateData(data)}
                                className="w-full p-1.5 text-[11px] border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase text-muted-foreground">Role</label>
                              <input
                                value={member.specialty}
                                onChange={(e) => {
                                  const members = [...data.teamCarousel.members];
                                  members[index] = { ...member, specialty: e.target.value };
                                  setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                                }}
                                onBlur={() => updateData(data)}
                                className="w-full p-1.5 text-[11px] border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "presets" && (
              <div className="space-y-6">
                {/* Genre Presets */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" /> Genre Presets
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(GENRE_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const updated = {
                            ...data,
                            theme: preset.theme,
                            colorTheme: preset.colorTheme,
                            typographyStyle: preset.typographyStyle || data.typographyStyle,
                            footerStyle: 'minimal',
                            activeSections: preset.activeSections,
                            ...preset.content
                          };
                          updateData(updated);
                        }}
                        className={`text-center p-3 rounded-xl border-2 text-[10px] font-bold transition-all flex items-center justify-center min-h-[50px] ${data.theme === preset.theme && data.colorTheme === preset.colorTheme ? "bg-primary/5 border-primary text-primary shadow-sm scale-[1.02]" : "bg-muted/30 border-muted hover:border-primary/30"}`}
                      >
                        {GENRE_LABELS[key] || key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 p-6 bg-muted/20 rounded-2xl border border-border">
                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Download className="w-4 h-4 text-primary" /> Quick Actions
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
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md"
                    >
                      Export DNA (JSON)
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Share Code Generation */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Copy className="w-4 h-4 text-primary" /> Share Code
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-muted-foreground block">Prefix</label>
                          <input 
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            placeholder="e.g. ACME"
                            className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase text-muted-foreground block">Uses</label>
                          <input
                            type="number"
                            min={1}
                            value={maxUses}
                            onChange={(e) => setMaxUses(Math.max(1, Number(e.target.value) || 1))}
                            className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-bold uppercase text-muted-foreground block">Expires (days)</label>
                          <input
                            type="number"
                            min={1}
                            value={expireDays}
                            onChange={(e) => setExpireDays(Math.max(1, Number(e.target.value) || 7))}
                            className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <button
                          disabled={isGenerating}
                          onClick={async () => {
                            setIsGenerating(true);
                            try {
                              const days = Math.max(1, Number(expireDays) || 7);
                              const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                              const res = await fetch('/api/codes', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                  prefix,
                                  payload: data,
                                  max_uses: Math.max(1, Number(maxUses) || 1),
                                  expires_at: expiresAt
                                })
                              });
                              const { code, error } = await res.json();
                              if (error) throw new Error(error);
                              
                              try { await navigator.clipboard.writeText(code); } catch {}
                              setGeneratedCode(code);
                              setCopied(true);
                              setIsCodeModalOpen(true);
                              toast.success('Share Code created and copied to clipboard');
                            } catch (err: any) {
                              console.error(err);
                              toast.error(err?.message || 'Failed to create code');
                            } finally {
                              setIsGenerating(false);
                              setTimeout(() => setCopied(false), 1500);
                            }
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold disabled:opacity-50 shadow-md h-[38px]"
                        >
                          {isGenerating ? "..." : "Create"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "design" && (
              <div className="space-y-8">
                {/* Hero Style */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <PanelTop className="w-4 h-4 text-primary" /> Hero Visual Style
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {HERO_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateData({ ...data, theme: opt.value })}
                        className={`group relative p-3 rounded-xl border-2 transition-all text-left overflow-hidden ${data.theme === opt.value ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-muted/20 hover:border-primary/30 hover:bg-muted/40"}`}
                      >
                        <div className={`text-[10px] font-bold ${data.theme === opt.value ? "text-primary" : "text-foreground"}`}>
                          {opt.label}
                        </div>
                        <div className="text-[8px] text-muted-foreground mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          Layout Style
                        </div>
                        {data.theme === opt.value && (
                          <div className="absolute top-1 right-1">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Color Palette
                  </h3>
                  <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {COLOR_THEMES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => updateData({ ...data, colorTheme: t.value })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${data.colorTheme === t.value ? "border-primary bg-primary/5 shadow-md" : "border-muted bg-muted/20 hover:border-primary/30 hover:bg-muted/40"}`}
                      >
                        <div
                          className="h-8 w-8 shrink-0 rounded-lg shadow-inner border border-black/5"
                          style={{ background: (t as any).swatch || t.primary }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className={`text-[11px] font-bold truncate ${data.colorTheme === t.value ? "text-primary" : "text-foreground"}`}>
                            {t.label}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">
                            {t.primary}
                          </span>
                        </div>
                        {data.colorTheme === t.value && (
                          <Check className="w-4 h-4 text-primary ml-auto shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Appearance */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Moon className="w-4 h-4 text-primary" /> Appearance
                    </h3>
                    <div className="flex p-1 bg-muted/30 rounded-xl border border-border">
                      <button
                        onClick={() => updateData({ ...data, darkMode: false })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold transition-all ${!data.darkMode ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Sun className="w-4 h-4" /> Light
                      </button>
                      <button
                        onClick={() => updateData({ ...data, darkMode: true })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold transition-all ${data.darkMode ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" /> Typography
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
                        { id: "lucky", label: "Lucky Guy" },
                        { id: "display", label: "Display" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => updateData({ ...data, typographyStyle: t.id })}
                          className={`py-2 rounded-lg border-2 text-[10px] font-bold transition-all ${data.typographyStyle === t.id ? "border-primary bg-primary/5 text-primary" : "border-muted bg-muted/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout Controls */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <PanelTop className="w-4 h-4 text-primary" /> Header Style
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["solid", "floating"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateData({ ...data, headerStyle: style })}
                          className={`py-2 rounded-lg border-2 text-[10px] font-bold capitalize transition-all ${data.headerStyle === style ? "border-primary bg-primary/5 text-primary" : "border-muted bg-muted/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"}`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <PanelBottom className="w-4 h-4 text-primary" /> Footer Style
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["lead-magnet", "simple", "minimal"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateData({ ...data, footerStyle: style })}
                          className={`py-2 rounded-lg border-2 text-[10px] font-bold capitalize transition-all ${data.footerStyle === style ? "border-primary bg-primary/5 text-primary" : "border-muted bg-muted/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"}`}
                        >
                          {style.split("-")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "layout" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> Page Sections
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">Enable or disable blocks on your landing page.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { title: "Hero & Identity", filter: (s: any) => s.id.includes('hero') || s.id === 'brand' },
                    { title: "Trust & Social", filter: (s: any) => s.id.includes('trust') || s.id.includes('review') || s.id.includes('award') || s.id.includes('certifications') || s.id.includes('facebook') },
                    { title: "Services & Features", filter: (s: any) => s.id.includes('feature') || s.id.includes('service') || s.id.includes('practice') || s.id.includes('program') || s.id.includes('project') || s.id.includes('package') || s.id === 'ac-types-grid' || s.id === 'financing-section' || s.id === 'developer-partners' },
                    { title: "Process & Info", filter: (s: any) => s.id.includes('how-it-works') || s.id.includes('delivery') || s.id.includes('enrollment') || s.id.includes('faq') || s.id.includes('blog') || s.id === 'why-choose-us' || s.id === 'treatment-process' },
                    { title: "Team & Profiles", filter: (s: any) => s.id.includes('team') || s.id.includes('attorney') || s.id.includes('faculty') || s.id === 'why-choose-me' },
                    { title: "Conversion & Contact", filter: (s: any) => s.id.includes('contact') || s.id.includes('booking') || s.id.includes('consultation') || s.id.includes('messenger') || s.id.includes('pricing') || s.id.includes('promo') || s.id.includes('payment') || s.id.includes('area-map') || s.id.includes('coverage-radius') || s.id === 'emergency-cta-strip' || s.id === 'price-preview-strip' || s.id === 'maintenance-plans' || s.id === 'promo-cta-section' },
                  ].map((group) => (
                    <div key={group.title} className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase text-primary/70 tracking-widest px-2 py-1 bg-primary/5 rounded border-l-2 border-primary">
                        {group.title}
                      </h4>
                      <div className="grid gap-1.5">
                        {SECTIONS.filter(group.filter).map(({ id, label }) => (
                          <SectionToggle key={id} id={id} label={label} activeSections={activeSections} onToggle={toggleSection} />
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Gallery & Others */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase text-primary/70 tracking-widest px-2 py-1 bg-primary/5 rounded border-l-2 border-primary">Visuals & Others</h4>
                    <div className="grid gap-1.5">
                      {SECTIONS.filter(s => 
                        s.id.includes('gallery') || 
                        s.id === 'before-after-slider' || 
                        s.id === 'before-after-gallery-grid' ||
                        s.id === 'common-pests' ||
                        s.id === 'safety-section'
                      ).map(({ id, label }) => (
                        <SectionToggle key={id} id={id} label={label} activeSections={activeSections} onToggle={toggleSection} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "brand" && (
              <div className="space-y-6">
                <div className="space-y-4 p-3 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Brand Identity
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Business Name</label>
                    <input
                      value={data.brand?.name || ""}
                      onChange={(e) => {
                        setData({ ...data, brand: { ...data.brand, name: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      className="w-full p-2 text-xs border rounded bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Logo</label>
                    <ImageUpload
                      value={data.brand?.logoUrl || ""}
                      onChange={(url) => {
                        updateData({ ...data, brand: { ...data.brand, logoUrl: url } });
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4 p-3 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Hero Content
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Hero Title</label>
                    <input
                      value={data.hero?.title || ""}
                      onChange={(e) => {
                        setData({ ...data, hero: { ...data.hero, title: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      className="w-full p-2 text-xs border rounded bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Hero Subtitle</label>
                    <textarea
                      value={data.hero?.subtitle || ""}
                      onChange={(e) => {
                        setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      rows={3}
                      className="w-full p-2 text-xs border rounded bg-background resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Benefit Tag</label>
                      <input
                        value={data.hero?.benefitText || ""}
                        onChange={(e) => {
                          setData({ ...data, hero: { ...data.hero, benefitText: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        placeholder="e.g. Quality Service"
                        className="w-full p-2 text-xs border rounded bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Local Coverage</label>
                      <input
                        value={data.hero?.localCoverage || ""}
                        onChange={(e) => {
                          setData({ ...data, hero: { ...data.hero, localCoverage: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        placeholder="e.g. Metro Manila"
                        className="w-full p-2 text-xs border rounded bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Hero Background Image</label>
                    <ImageUpload
                      value={data.hero?.backgroundImage || ""}
                      onChange={(url) => {
                        updateData({ ...data, hero: { ...data.hero, backgroundImage: url } });
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Hero Layout</label>
                    <select
                      value={data.hero?.layout || "split"}
                      onChange={(e) => {
                        updateData({ ...data, hero: { ...data.hero, layout: e.target.value } });
                      }}
                      className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="split">Split (Original)</option>
                      <option value="full-screen">Full Screen (Real Estate)</option>
                      <option value="industrial">Industrial (Construction)</option>
                      <option value="bright-clean">Bright Clean (Water)</option>
                      <option value="soft-luxury">Soft Luxury (Salon)</option>
                      <option value="structured-split">Structured Split (School)</option>
                      <option value="hvac-urgent">HVAC Urgent (Split)</option>
                      <option value="hvac-blue">HVAC Blue (Modern)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Promo Text (Salon/Luxury)</label>
                    <input
                      value={data.hero?.promoText || ""}
                      onChange={(e) => {
                        setData({ ...data, hero: { ...data.hero, promoText: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      placeholder="e.g. Valentine’s Promo"
                      className="w-full p-2 text-xs border rounded bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-3 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Footer Settings
                  </h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.footer?.showContact !== false}
                        onChange={(e) => {
                          updateData({ ...data, footer: { ...data.footer, showContact: e.target.checked } });
                        }}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      Show Contact Info
                    </label>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Social Links & Visibility</label>
                    <div className="space-y-3">
                      {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                        <div key={platform} className="space-y-1.5 p-2 rounded-lg bg-muted/30 border border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">{platform}</span>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={data.footer?.social?.[`${platform}Enabled`] !== false}
                                onChange={(e) => {
                                  const social = { ...data.footer?.social, [`${platform}Enabled`]: e.target.checked };
                                  updateData({ ...data, footer: { ...data.footer, social } });
                                }}
                                className="h-3 w-3 rounded border-border text-primary focus:ring-primary"
                              />
                              <span className="text-[9px] font-bold uppercase text-muted-foreground">Show</span>
                            </label>
                          </div>
                          <input
                            placeholder={`https://${platform}.com/yourpage`}
                            value={data.footer?.social?.[platform] || ""}
                            onChange={(e) => {
                              const social = { ...data.footer?.social, [platform]: e.target.value };
                              setData({ ...data, footer: { ...data.footer, social } });
                            }}
                            onBlur={() => updateData(data)}
                            className="w-full p-1.5 text-[10px] border rounded bg-background focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-4">
                <div className="space-y-4 p-3 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Team Section Header
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Section Title</label>
                    <input
                      value={data.teamCarousel?.title || ""}
                      onChange={(e) => {
                        setData({ ...data, teamCarousel: { ...data.teamCarousel, title: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      className="w-full p-2 text-xs border rounded bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Section Subtitle</label>
                    <textarea
                      value={data.teamCarousel?.subtitle || ""}
                      onChange={(e) => {
                        setData({ ...data, teamCarousel: { ...data.teamCarousel, subtitle: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      rows={2}
                      className="w-full p-2 text-xs border rounded bg-background resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Team Members
                  </h3>
                  <button
                    onClick={() => {
                      const newMember = {
                        name: "New Member",
                        specialty: "Position / Role",
                        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
                        bioUrl: "#",
                      };
                      const currentMembers = data.teamCarousel?.members || [];
                      updateData({
                        ...data,
                        teamCarousel: {
                          ...data.teamCarousel,
                          members: [...currentMembers, newMember]
                        }
                      });
                    }}
                    className="p-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition shadow-sm"
                    title="Add Member"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {(data.teamCarousel?.members || []).map((member: any, index: number) => (
                    <div key={index} className="p-3 border border-border rounded-xl bg-muted/20 space-y-3 relative group/member">
                      <button
                        onClick={() => {
                          const members = [...data.teamCarousel.members];
                          members.splice(index, 1);
                          updateData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/member:opacity-100 transition shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Name</label>
                        <input
                          value={member.name}
                          onChange={(e) => {
                            const members = [...data.teamCarousel.members];
                            members[index] = { ...member, name: e.target.value };
                            setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Specialty / Role</label>
                        <input
                          value={member.specialty}
                          onChange={(e) => {
                            const members = [...data.teamCarousel.members];
                            members[index] = { ...member, specialty: e.target.value };
                            setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Bio Link</label>
                        <input
                          value={member.bioUrl || ""}
                          onChange={(e) => {
                            const members = [...data.teamCarousel.members];
                            members[index] = { ...member, bioUrl: e.target.value };
                            setData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                          }}
                          onBlur={() => updateData(data)}
                          className="w-full p-2 text-xs border rounded bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Photo</label>
                        <ImageUpload
                          value={member.imageUrl}
                          onChange={(url) => {
                            const members = [...data.teamCarousel.members];
                            members[index] = { ...member, imageUrl: url };
                            updateData({ ...data, teamCarousel: { ...data.teamCarousel, members } });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4">
                <div className="space-y-4 p-3 border border-border rounded-xl bg-muted/20">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Contact Section Content
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Form Heading</label>
                    <input
                      value={data.contact?.formHeading || ""}
                      onChange={(e) => {
                        setData({ ...data, contact: { ...data.contact, formHeading: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      className="w-full p-2 text-xs border rounded bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Tagline</label>
                    <textarea
                      value={data.contact?.tagline || ""}
                      onChange={(e) => {
                        setData({ ...data, contact: { ...data.contact, tagline: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      rows={2}
                      className="w-full p-2 text-xs border rounded bg-background resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Email</label>
                      <input
                        value={data.contact?.email || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, email: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone</label>
                      <input
                        value={data.contact?.phone || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, phone: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Address</label>
                    <textarea
                      value={data.contact?.address || ""}
                      onChange={(e) => {
                        setData({ ...data, contact: { ...data.contact, address: e.target.value } });
                      }}
                      onBlur={() => updateData(data)}
                      rows={2}
                      className="w-full p-2 text-xs border rounded bg-background resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Submit Button</label>
                      <input
                        value={data.contact?.formSubmitText || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, formSubmitText: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Thank You Text</label>
                      <input
                        value={data.contact?.formThankYouText || ""}
                        onChange={(e) => {
                          setData({ ...data, contact: { ...data.contact, formThankYouText: e.target.value } });
                        }}
                        onBlur={() => updateData(data)}
                        className="w-full p-2 text-xs border rounded bg-background"
                      />
                    </div>
                  </div>
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

      {/* Share Code Modal */}
      <Dialog open={isCodeModalOpen} onOpenChange={(o) => { setIsCodeModalOpen(o); if (!o) setCopied(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Code Created</DialogTitle>
            <DialogDescription>
              Give this code to your client. They can paste it in their dashboard to import the template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                value={generatedCode}
                readOnly
                className="flex-1 p-2 text-sm bg-muted/30 border border-border rounded"
              />
              <button
                onClick={async () => {
                  try { await navigator.clipboard.writeText(generatedCode); setCopied(true); toast.success('Copied'); } catch { toast.error('Copy failed'); }
                }}
                className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-bold"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">Format supports optional prefixes (e.g., ACME-XXXXXX). Keep it private if the template is limited-use.</p>
          </div>
        </DialogContent>
      </Dialog>

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
