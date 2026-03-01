import * as React from "react"
import { createPortal } from "react-dom"
import { 
  ChevronRight, Trash2, Plus, Image as ImageIcon, X, CreditCard, Globe, Search, Layout, ChevronDown, Zap, CheckCircle2, AlertTriangle, RotateCcw
} from "lucide-react"
import ImageUpload from "@/components/shared/ImageUpload"
import AwardIconPicker from "@/components/dashboard/AwardIconPicker"
import MapPinPicker from "@/components/dashboard/MapPinPicker"
import SubscriptionSettings from "@/components/dashboard/SubscriptionSettings"
import ClientDomainSettings from "@/components/dashboard/ClientDomainSettings"
import { fieldLabel, sectionIdToKey, ensureStringArray, navigationToArray } from "@/config/dashboard-config"
import { BLOCK_MAP } from "@/lib/utils/block-registry"
import { slugify } from "@/lib/utils/blocks"
import { TITLE_MAX, DESC_MAX } from "@/lib/seo/seoAudit"
import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo"
import { toast } from "sonner"

const formatSectionLabel = (id: string) => BLOCK_MAP[id]?.label ?? id.replace(/[-_]/g, " ").replace(/--/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())

function getFieldLimits(key: string): { suggested: number; max: number } {
  const k = key.toLowerCase()
  if (k.includes('url') || k.includes('href') || k.includes('src') || k.includes('embed') || k.includes('map')) return { suggested: 300, max: 500 }
  if (k.includes('keyword')) return { suggested: 200, max: 300 }
  if (k.includes('headline') || k.includes('heading')) return { suggested: 80, max: 120 }
  if (k.includes('quotetitle') || k.includes('title')) return { suggested: 80, max: 120 }
  if (k.includes('tagline') || k.includes('subtitle') || k.includes('subheading') || k.includes('subtext') || k.includes('slogan')) return { suggested: 120, max: 180 }
  if (k.includes('description') || k.includes('body') || k.includes('content') || k.includes('summary') || k.includes('excerpt') || k.includes('bio') || k.includes('about') || k.includes('answer') || k.includes('text')) return { suggested: 400, max: 700 }
  if (k.includes('cta') || k.includes('button')) return { suggested: 40, max: 70 }
  if (k.includes('label') || k.includes('badge') || k.includes('tag') || k.includes('category')) return { suggested: 40, max: 70 }
  if (k.includes('phone') || k.includes('email')) return { suggested: 80, max: 120 }
  if (k.includes('address') || k.includes('location')) return { suggested: 120, max: 180 }
  if (k.includes('name') || k.includes('author') || k.includes('specialty') || k.includes('role')) return { suggested: 60, max: 100 }
  if (k.includes('question')) return { suggested: 160, max: 240 }
  if (k.includes('price') || k.includes('period') || k.includes('rate') || k.includes('number')) return { suggested: 20, max: 40 }
  if (k.includes('note') || k.includes('feature') || k.includes('service')) return { suggested: 100, max: 160 }
  return { suggested: 120, max: 180 }
}

interface EditorFormPanelProps {
    selectedSection: string | null;
    setSelectedSection: (s: string | null) => void;
    formValues: Record<string, any>;
    setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setModified: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    autoSaveSection: (section: string, values: any) => void;
    collapsedGroups: Record<string, boolean>;
    setCollapsedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    isSaving: boolean;
    project: any;
    initialPlansConfig: any;
    pages: any[];
    updatePages: (pages: any[]) => void;
    canUsePages: boolean;
    selectedPageIndex: number;
    setSelectedPageIndex: (i: number) => void;
    setAiSeoOpen: (b: boolean) => void;
    mergedConfig: Record<string, any>;
    globalConfig: Record<string, any>;
    activePage: any;
    setColorPaletteOpen: (b: boolean) => void;
    setTypographyOpen: (b: boolean) => void;
    setUpgradeLoading: (b: boolean) => void;
    backdropPointerDownRef: React.MutableRefObject<boolean>;
}

export function EditorFormPanel({
    selectedSection, setSelectedSection, formValues, setFormValues, setModified, autoSaveSection, collapsedGroups, setCollapsedGroups, isSaving, project, initialPlansConfig, pages, updatePages, canUsePages, selectedPageIndex, setSelectedPageIndex, setAiSeoOpen, mergedConfig, globalConfig, activePage, setColorPaletteOpen, setTypographyOpen, setUpgradeLoading, backdropPointerDownRef,
}: EditorFormPanelProps) {
    if (!selectedSection) return null;

    return createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                aria-hidden
                onPointerDown={() => {
                  backdropPointerDownRef.current = true
                }}
                onClick={() => {
                  if (backdropPointerDownRef.current) setSelectedSection(null)
                  backdropPointerDownRef.current = false
                }}
              />
              <div
                className="relative z-[210] p-0 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] min-h-0 border border-border/60 bg-background shadow-[0_32px_80px_-12px_rgba(0,0,0,0.35)] w-full sm:w-[95vw] sm:max-w-[840px] rounded-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                {/* Premium header */}
                <div className="relative overflow-hidden shrink-0 bg-gradient-to-br from-background via-background to-muted/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-primary/3 to-transparent" aria-hidden />
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" aria-hidden />
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-primary/70 to-transparent" aria-hidden />
                  <div className="relative p-5 sm:p-6 sm:pb-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10 flex items-center justify-center">
                        {selectedSection === 'subscription' ? (
                          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        ) : selectedSection === 'domain' ? (
                          <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        ) : selectedSection === 'seo' ? (
                          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        ) : (
                          <Layout className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pr-10">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.15em]">
                            {selectedSection === 'subscription' ? 'Billing' : selectedSection === 'domain' ? 'Domain' : selectedSection === 'seo' ? 'SEO' : 'Section'}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                          {selectedSection === 'subscription'
                            ? 'Subscription & Plan'
                            : selectedSection === 'domain'
                              ? 'Domain Settings'
                              : formatSectionLabel(selectedSection || '')}
                        </h2>
                        <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
                          {selectedSection === 'subscription'
                            ? 'View your current plan, billing status, and auto-renewal settings.'
                            : selectedSection === 'domain'
                              ? 'Manage your subdomain and connect a custom domain.'
                              : selectedSection === 'seo'
                                ? 'Set your page title, meta description, and keywords for search engines.'
                                : 'Edit the content, text, and images for this section.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Close button — premium styled */}
                  <button
                    type="button"
                    onClick={() => setSelectedSection(null)}
                    className="absolute right-4 top-4 z-20 w-8 h-8 rounded-xl bg-muted/60 hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>

                <div
                  className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar"
                  onScroll={() => { setColorPaletteOpen(false); setTypographyOpen(false) }}
                >
                  {selectedSection === 'subscription' ? (
                    <SubscriptionSettings project={project as any} initialPlansConfig={initialPlansConfig} />
                  ) : selectedSection === 'domain' ? (
                    <ClientDomainSettings
                      projectId={project.id}
                      subdomain={project.subdomain ?? null}
                      customDomain={(project as any).custom_domain ?? null}
                      subscriptionStatus={project.subscription_status ?? null}
                      subscriptionEnd={(project as any).subscription_end ?? null}
                    />
                  ) : (
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Fields</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setCollapsedGroups({})}
                            className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                          >
                            Expand All
                          </button>
                          <span className="text-border">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              const allKeys: Record<string, boolean> = {};
                              Object.entries(formValues).forEach(([key, value]) => {
                                if (typeof value === 'object' && value !== null) {
                                  allKeys[`${selectedSection}-${key}`] = true;
                                }
                              });
                              setCollapsedGroups(allKeys);
                            }}
                            className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                          >
                            Collapse All
                          </button>
                        </div>
                      </div>

                      {selectedSection === 'hero' && (
                        <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden">
                          <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
                            <label className="text-xs font-bold uppercase tracking-widest text-primary">Layout Theme</label>
                            <p className="text-[10px] text-muted-foreground mt-1">This controls the hero layout style for your site.</p>
                          </div>
                          <div className="p-4">
                            <select
                              className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
                              value={globalConfig.theme || 'lawyer'}
                              onChange={(e) => {
                                const val = e.target.value
                                setModified((m) => ({ ...m, theme: val }))
                                autoSaveSection('theme', val)
                              }}
                            >
                              {['lawyer', 'startup', 'chiropractor', 'dentist', 'clinic', 'cleaning', 'pool', 'pest-control', 'real-estate-modern', 'before-after-split', 'industrial', 'clean-delivery', 'luxury-soft', 'academic-clean', 'hvac', 'hvac-blue', 'generic'].map((t) => (
                                <option key={t} value={t}>
                                  {t.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* ── Navigation Hub (Pages) ── */}
                      {selectedSection === 'navigation' && (
                        <div className="space-y-6">
                          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Manage your site's structure here. You can rename pages as they appear in the menu, change their web addresses, and drag or reorder them.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Pages ({pages.length})</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!canUsePages) return
                                  const baseLabel = `Page ${pages.length + 1}`
                                  let slug = slugify(baseLabel)
                                  let counter = 1
                                  while (pages.some((p: any) => p.slug === slug)) {
                                    slug = `${slugify(baseLabel)}-${counter}`
                                    counter += 1
                                  }
                                  const autoSeo = buildAutoSeoDefaults({
                                    config: mergedConfig as Record<string, any>,
                                    page: { slug, label: baseLabel, activeSections: [] },
                                    pageSlug: slug,
                                    pageLabel: baseLabel,
                                    domain: project?.custom_domain || project?.subdomain || 'website',
                                  })
                                  const next = [...pages, { slug, label: baseLabel, activeSections: [], seo: autoSeo }]
                                  updatePages(next)
                                  setSelectedPageIndex(next.length - 1)
                                }}
                                disabled={!canUsePages}
                                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline disabled:text-muted-foreground"
                              >
                                + Add Page
                              </button>
                            </div>

                            <div className="space-y-3">
                              {pages.map((page: any, idx: number) => {
                                const isSeoOpen = !!collapsedGroups[`page-seo-${idx}`]
                                return (
                                  <div key={idx} className={`rounded-xl border transition-all p-4 relative group ${selectedPageIndex === idx ? 'border-primary/30 bg-primary/5 ring-1 ring-primary/20' : 'border-border/60 bg-muted/10 hover:border-primary/20'}`}>
                                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (idx > 0) {
                                            const next = [...pages];
                                            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                            updatePages(next);
                                            if (selectedPageIndex === idx) setSelectedPageIndex(idx - 1);
                                            else if (selectedPageIndex === idx - 1) setSelectedPageIndex(idx);
                                          }
                                        }}
                                        disabled={idx === 0}
                                        className="p-1.5 rounded hover:bg-background text-muted-foreground disabled:opacity-30"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (idx < pages.length - 1) {
                                            const next = [...pages];
                                            [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                                            updatePages(next);
                                            if (selectedPageIndex === idx) setSelectedPageIndex(idx + 1);
                                            else if (selectedPageIndex === idx + 1) setSelectedPageIndex(idx);
                                          }
                                        }}
                                        disabled={idx === pages.length - 1}
                                        className="p-1.5 rounded hover:bg-background text-muted-foreground disabled:opacity-30"
                                      >
                                        ↓
                                      </button>
                                      {page.slug && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const next = pages.filter((_: any, i: number) => i !== idx)
                                            updatePages(next)
                                            if (selectedPageIndex === idx) setSelectedPageIndex(0)
                                            else if (selectedPageIndex > idx) setSelectedPageIndex(selectedPageIndex - 1)
                                          }}
                                          className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>

                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                                          {idx + 1}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                          {idx === 0 ? 'Main Homepage' : 'Sub-page'}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                          <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center justify-between">
                                            <span>Menu Name (Navbar)</span>
                                            {(() => { const len = (page.label || '').length; return <span className={`text-[9px] font-bold ${len >= 30 ? 'text-red-500' : len >= 20 ? 'text-amber-500' : 'text-muted-foreground/60'}`}>{len}<span className="font-normal opacity-60">/20</span></span> })()}
                                          </label>
                                          <input
                                            value={page.label || ''}
                                            maxLength={30}
                                            onChange={(e) => {
                                              const next = [...pages]
                                              next[idx] = { ...page, label: e.target.value }
                                              updatePages(next)
                                            }}
                                            placeholder="e.g. Home, Services"
                                            className="w-full p-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30"
                                          />
                                        </div>
                                        <div className="space-y-1.5">
                                          <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Web Address (URL)</label>
                                          <div className="flex items-center gap-1.5 p-2.5 bg-background border border-border rounded-lg">
                                            <span className="text-xs text-muted-foreground">/</span>
                                            <input
                                              value={page.slug || ''}
                                              disabled={!page.slug}
                                              onChange={(e) => {
                                                const next = [...pages]
                                                next[idx] = { ...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
                                                updatePages(next)
                                              }}
                                              placeholder="home"
                                              className="flex-1 text-xs bg-transparent outline-none disabled:opacity-50"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* SEO Section (Collapsible) */}
                                      <div className="mt-4 border-t border-border/40 pt-4">
                                        <button
                                          type="button"
                                          onClick={() => setCollapsedGroups(prev => ({ ...prev, [`page-seo-${idx}`]: !isSeoOpen }))}
                                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                                        >
                                          <Search className="w-3 h-3" />
                                          SEO & Meta Tags
                                          <ChevronDown className={`w-3 h-3 transition-transform ${isSeoOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isSeoOpen && (
                                          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="grid grid-cols-1 gap-4">
                                              <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                  <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">SEO Title</label>
                                                  <span className={`text-[9px] font-bold ${(page.seo?.title?.length || 0) > TITLE_MAX ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                    {(page.seo?.title?.length || 0)} / {TITLE_MAX}
                                                  </span>
                                                </div>
                                                <input
                                                  value={page.seo?.title || ''}
                                                  onChange={(e) => {
                                                    const next = [...pages]
                                                    next[idx] = { ...page, seo: { ...(page.seo || {}), title: e.target.value } }
                                                    updatePages(next)
                                                  }}
                                                  placeholder="e.g. Best Services | Company Name"
                                                  className="w-full p-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30"
                                                />
                                              </div>

                                              <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                  <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Meta Description</label>
                                                  <span className={`text-[9px] font-bold ${(page.seo?.description?.length || 0) > DESC_MAX ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                    {(page.seo?.description?.length || 0)} / {DESC_MAX}
                                                  </span>
                                                </div>
                                                <textarea
                                                  value={page.seo?.description || ''}
                                                  onChange={(e) => {
                                                    const next = [...pages]
                                                    next[idx] = { ...page, seo: { ...(page.seo || {}), description: e.target.value } }
                                                    updatePages(next)
                                                  }}
                                                  rows={2}
                                                  placeholder="Brief summary for search engines..."
                                                  className="w-full p-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                                                />
                                              </div>

                                              <div className="space-y-1.5">
                                                <label className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Keywords (comma separated)</label>
                                                <input
                                                  value={Array.isArray(page.seo?.keywords) ? page.seo.keywords.join(', ') : page.seo?.keywords || ''}
                                                  onChange={(e) => {
                                                    const next = [...pages]
                                                    next[idx] = { ...page, seo: { ...(page.seo || {}), keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }
                                                    updatePages(next)
                                                  }}
                                                  placeholder="service, keyword, location"
                                                  className="w-full p-2.5 text-xs bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30"
                                                />
                                              </div>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedPageIndex(idx);
                                                setAiSeoOpen(true);
                                              }}
                                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-lg text-[10px] font-bold text-primary transition-all"
                                            >
                                              <Zap className="w-3 h-3" />
                                              AI Optimize for this Page
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {!canUsePages && (
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
                              <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Upgrade for more pages</p>
                                <p className="text-[10px] text-amber-600/80 mt-0.5 leading-relaxed">Your current plan includes 1 page. Upgrade to Pro to add unlimited landing pages and sub-pages.</p>
                                <button onClick={() => setUpgradeLoading(true)} className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:underline">See Pro Features</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── Full SEO Editor ── */}
                      {selectedSection === 'seo' && (() => {
                        const seoTitle = (formValues.title as string) || ''
                        const seoDesc = (formValues.description as string) || ''
                        const titleLen = seoTitle.length
                        const descLen = seoDesc.length
                        const titleTooLong = titleLen > TITLE_MAX
                        const descTooLong = descLen > DESC_MAX

                        const pageSlug = (activePage?.slug as string) || ''

                        const RESERVED_SLUGS = ['privacy', 'terms', 'cookies']
                        // Normalize: lowercase, strip spaces/uppercase/trailing slash, collapse dashes
                        const slugifyLocal = (v: string) => v.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/\/$/, '')

                        const updateSeo = (patch: Record<string, any>) => {
                          const next = { ...formValues, ...patch }
                          setFormValues(next)
                          autoSaveSection('seo', next)
                        }

                        const autoSeoDefaults = buildAutoSeoDefaults({
                          config: mergedConfig as Record<string, any>,
                          page: activePage as Record<string, any>,
                          pageSlug,
                          pageLabel: (activePage?.label as string) || 'Home',
                          domain: project?.custom_domain || project?.subdomain || 'website',
                        })

                        const updateSlug = (newSlug: string) => {
                          const normalized = slugifyLocal(newSlug).slice(0, 60)
                          const isDuplicate = pages.some((p: any, idx: number) => idx !== selectedPageIndex && p.slug === normalized)
                          const isReserved = RESERVED_SLUGS.includes(normalized)
                          if (isDuplicate || isReserved) {
                            toast.error(isReserved ? `"/${normalized}" is a reserved URL` : `Slug "/${normalized}" is already used by another page`)
                            return
                          }
                          const nextPages = pages.map((p: any, idx: number) => idx === selectedPageIndex ? { ...p, slug: normalized } : p)
                          autoSaveSection('pages', nextPages)
                        }

                        const ogOpen = !collapsedGroups['seo-og']
                        const seoKeywords = Array.isArray(formValues.keywords) ? formValues.keywords as string[] : []
                        const seoCanonical = autoSeoDefaults.canonical || (pageSlug ? `/${pageSlug}` : '/')
                        const ogTitle = ((formValues.og as any)?.title as string) || ''
                        const ogDescription = ((formValues.og as any)?.description as string) || ''
                        const effectiveOgTitle = ogTitle.trim() || seoTitle.trim()
                        const effectiveOgDescription = ogDescription.trim() || seoDesc.trim()
                        const checklistItems = [
                          { key: 'title', label: 'SEO title in recommended range (30-60)', done: titleLen >= 30 && titleLen <= TITLE_MAX, hint: 'Use a specific service + location + brand title.' },
                          { key: 'desc', label: 'Meta description in recommended range (80-160)', done: descLen >= 80 && descLen <= DESC_MAX, hint: 'Add a local intent CTA and service details.' },
                          { key: 'keywords', label: 'At least 3 focused keywords', done: seoKeywords.length >= 3, hint: 'Include service + city phrases clients search.' },
                          { key: 'og', label: 'Open Graph title and description set', done: effectiveOgTitle.length > 0 && effectiveOgDescription.length > 0, hint: 'Set OG fields below or rely on SEO title/description fallback.' },
                        ]
                        const checklistDone = checklistItems.filter((item) => item.done).length
                        const checklistComplete = checklistDone === checklistItems.length

                        return (
                          <div className="space-y-5">
                            <div className={`rounded-xl border px-4 py-3 ${checklistComplete ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/10'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[11px] font-black uppercase tracking-widest">SEO Settings Checklist</p>
                                <span className="text-[11px] font-black">{checklistDone}/{checklistItems.length} complete</span>
                              </div>
                              <div className="space-y-1.5">
                                {checklistItems.map((item) => (
                                  <div key={item.key} className="flex items-start gap-2">
                                    {item.done ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                                    ) : (
                                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 text-amber-500 shrink-0" />
                                    )}
                                    <div>
                                      <p className={`text-xs font-medium ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</p>
                                      {!item.done && <p className="text-[10px] text-muted-foreground">{item.hint}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* AI Optimize Button */}
                            <button
                              type="button"
                              onClick={() => setAiSeoOpen(true)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-xs font-bold text-primary transition-all"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              Optimize SEO
                            </button>


                            {/* Title */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO Title</label>
                                </div>
                                <span className={`text-[10px] font-bold tabular-nums ${titleTooLong ? 'text-red-500' : titleLen >= 30 ? 'text-emerald-500' : 'text-muted-foreground'}`}>{titleLen} / {TITLE_MAX}</span>
                              </div>
                              <input
                                type="text"
                                value={seoTitle}
                                maxLength={TITLE_MAX + 10}
                                onChange={(e) => updateSeo({ title: e.target.value })}
                                placeholder="e.g. Expert Pest Control | Fast & Reliable"
                                className={`w-full p-3 text-sm bg-muted/20 border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${titleTooLong ? 'border-red-400' : 'border-border'}`}
                              />
                              {titleTooLong && <p className="text-[10px] text-red-500">Title is too long — keep it under {TITLE_MAX} characters for best results.</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                                </div>
                                <span className={`text-[10px] font-bold tabular-nums ${descTooLong ? 'text-red-500' : descLen >= 80 ? 'text-emerald-500' : 'text-muted-foreground'}`}>{descLen} / {DESC_MAX}</span>
                              </div>
                              <textarea
                                value={seoDesc}
                                maxLength={DESC_MAX + 10}
                                rows={3}
                                onChange={(e) => updateSeo({ description: e.target.value })}
                                placeholder="e.g. Get rid of pests fast with our certified exterminators. Same-day service available."
                                className={`w-full p-3 text-sm bg-muted/20 border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 transition-colors resize-none ${descTooLong ? 'border-red-400' : 'border-border'}`}
                              />
                              {descTooLong && <p className="text-[10px] text-red-500">Description is too long — keep it under {DESC_MAX} characters for best results.</p>}
                            </div>

                            {/* Keywords */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Keywords <span className="normal-case font-normal opacity-60">(optional)</span></label>
                              </div>
                              <div className="flex flex-wrap gap-2 p-3 bg-muted/20 border border-border rounded-lg min-h-[48px]">
                                {(Array.isArray(formValues.keywords) ? formValues.keywords as string[] : []).map((kw: string, i: number) => (
                                  <span key={i} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                                    {kw}
                                    <button type="button" onClick={() => updateSeo({ keywords: (formValues.keywords as string[]).filter((_: string, j: number) => j !== i) })} className="ml-1 text-primary/60 hover:text-primary">×</button>
                                  </span>
                                ))}
                                <input
                                  type="text"
                                  placeholder="Add keyword, press Enter"
                                  className="flex-1 min-w-[140px] bg-transparent text-xs outline-none"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                      e.preventDefault()
                                      const val = (e.target as HTMLInputElement).value.trim()
                                      if (!val) return
                                      updateSeo({ keywords: [...(Array.isArray(formValues.keywords) ? formValues.keywords as string[] : []), val] });
                                      (e.target as HTMLInputElement).value = ''
                                    }
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-muted-foreground">Press Enter or comma to add. Keywords have minimal direct ranking impact.</p>
                            </div>

                            {/* Open Graph — collapsible */}
                            <div className="rounded-xl border border-border/80 overflow-hidden">
                              <button type="button" onClick={() => setCollapsedGroups(prev => ({ ...prev, 'seo-og': !prev['seo-og'] }))} className="w-full px-4 py-3 bg-muted/10 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Open Graph (Social Sharing)</span>
                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${ogOpen ? 'rotate-90' : ''}`} />
                              </button>
                              {ogOpen && (
                                <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <p className="text-[10px] text-muted-foreground">Controls how your page looks when shared on social media. Leave blank to use your SEO title/description.</p>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">OG Title</label>
                                    </div>
                                    <input type="text" value={(formValues.og as any)?.title || ''} onChange={(e) => updateSeo({ og: { ...((formValues.og as any) || {}), title: e.target.value } })} placeholder="Defaults to SEO Title" className="w-full p-3 text-sm bg-muted/20 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/30" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">OG Description</label>
                                    </div>
                                    <textarea rows={2} value={(formValues.og as any)?.description || ''} onChange={(e) => updateSeo({ og: { ...((formValues.og as any) || {}), description: e.target.value } })} placeholder="Defaults to Meta Description" className="w-full p-3 text-sm bg-muted/20 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">OG Image</label>
                                    <ImageUpload value={(formValues.og as any)?.image || ''} onChange={(url) => updateSeo({ og: { ...((formValues.og as any) || {}), image: url } })} />
                                    <p className="text-[10px] text-muted-foreground">Defaults to your brand logo if empty.</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="rounded-xl border border-border/80 bg-muted/10 px-4 py-3">
                              <p className="text-xs font-bold uppercase tracking-widest text-primary">Structured Data (Schema)</p>
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                Automatically enabled based on page content.
                                Type: <span className="font-semibold text-foreground">{(autoSeoDefaults.structuredData as any)?.type || 'localbusiness'}</span>.
                              </p>
                            </div>
                          </div>
                        )
                      })()}

                      {/* 1) Text, Boolean, and Nested Object fields - use grid for horizontal layout */}
                      {selectedSection !== 'seo' && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {Object.entries(formValues)
                          .filter(([key]) => {
                            if (selectedSection === 'hero') {
                              return !['trustbadges', 'trustsignals'].includes(key.toLowerCase());
                            }
                            return true;
                          })
                          .map(([key, value]) => {
                            const isPageLinkUrl = ['privacyurl', 'termsurl', 'cookieurl'].includes(key.toLowerCase());
                            const isImage = !isPageLinkUrl && (key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key.toLowerCase().includes('logo'));
                            const isDatetime = typeof value === 'string' && (key.toLowerCase().includes('countdown') || key.toLowerCase().includes('enddate'));
                            const isTextarea = !isDatetime && typeof value === 'string' && value.length > 80;
                            const isBoolean = typeof value === 'boolean';
                            const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

                            if (isObject) {
                              const isCollapsed = collapsedGroups[`${selectedSection}-${key}`]
                              return (
                                <div key={key} className="col-span-2 rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden transition-all duration-300">
                                  <button
                                    type="button"
                                    onClick={() => setCollapsedGroups(prev => ({ ...prev, [`${selectedSection}-${key}`]: !isCollapsed }))}
                                    className="w-full px-4 py-3 border-b border-border/60 bg-muted/10 flex items-center justify-between hover:bg-muted/20 transition-colors"
                                  >
                                    <label className="text-xs font-bold uppercase tracking-widest text-primary cursor-pointer">{fieldLabel(key)}</label>
                                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isCollapsed ? "" : "rotate-90"}`} />
                                  </button>
                                  <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 ${isCollapsed ? "hidden" : "animate-in fade-in slide-in-from-top-2 duration-300"}`}>
                                    {Object.entries(value as object)
                                      .sort(([ka], [kb]) => {
                                        // Images last
                                        const isImgA = ka.toLowerCase().includes('url') || ka.toLowerCase().includes('image');
                                        const isImgB = kb.toLowerCase().includes('url') || kb.toLowerCase().includes('image');
                                        if (isImgA && !isImgB) return 1;
                                        if (!isImgA && isImgB) return -1;
                                        return 0;
                                      })
                                      .map(([subKey, subVal]) => {
                                        const isSubPageLinkUrl = ['privacyurl', 'termsurl', 'cookieurl'].includes(subKey.toLowerCase());
                                        const isSubImage = !isSubPageLinkUrl && (subKey.toLowerCase().includes('url') || subKey.toLowerCase().includes('image') || subKey.toLowerCase().includes('logo'));
                                        const isSubTextarea = typeof subVal === 'string' && subVal.length > 80;
                                        const isSubBoolean = typeof subVal === 'boolean';
                                        return (
                                          <div key={subKey} className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between">
                                              <span>{fieldLabel(subKey)}</span>
                                              {!isSubBoolean && !isSubImage && typeof subVal === 'string' && (() => { const { suggested: sg, max: mx } = getFieldLimits(subKey); const len = (subVal as string).length; return <span className={`text-[9px] font-bold ${len >= mx ? 'text-red-500' : len >= sg ? 'text-amber-500' : 'text-muted-foreground/60'}`}>{len}<span className="font-normal opacity-60">/{sg}</span></span> })()}
                                            </label>
                                            {isSubBoolean ? (
                                              <div className="flex flex-col gap-2 p-3 bg-muted/20 border border-border rounded-lg">
                                                <div className="flex gap-4">
                                                  <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                      type="radio"
                                                      name={`${key}-${subKey}`}
                                                      checked={subVal === true}
                                                      onChange={() => {
                                                        const sectionKey = sectionIdToKey(selectedSection!)
                                                        const nextObj = { ...(value as object), [subKey]: true }
                                                        const nextForm = { ...formValues, [key]: nextObj }
                                                        setFormValues(nextForm)
                                                        setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                        autoSaveSection(selectedSection!, nextForm)
                                                      }}
                                                      className="h-4 w-4 border-border text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-foreground">Yes</span>
                                                  </label>
                                                  <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                      type="radio"
                                                      name={`${key}-${subKey}`}
                                                      checked={subVal === false}
                                                      onChange={() => {
                                                        const sectionKey = sectionIdToKey(selectedSection!)
                                                        const nextObj = { ...(value as object), [subKey]: false }
                                                        const nextForm = { ...formValues, [key]: nextObj }
                                                        setFormValues(nextForm)
                                                        setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                        autoSaveSection(selectedSection!, nextForm)
                                                      }}
                                                      className="h-4 w-4 border-border text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-foreground">No</span>
                                                  </label>
                                                </div>
                                              </div>
                                            ) : isSubImage ? (
                                              <ImageUpload
                                                value={subVal as string}
                                                onChange={(url) => {
                                                  const sectionKey = sectionIdToKey(selectedSection!)
                                                  const nextObj = { ...(value as object), [subKey]: url }
                                                  const nextForm = { ...formValues, [key]: nextObj }
                                                  setFormValues(nextForm)
                                                  setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                  autoSaveSection(selectedSection!, nextForm)
                                                }}
                                              />
                                            ) : isSubTextarea ? (
                                              <textarea
                                                value={subVal as string}
                                                maxLength={getFieldLimits(subKey).max}
                                                onChange={(e) => {
                                                  const sectionKey = sectionIdToKey(selectedSection!)
                                                  const nextObj = { ...(value as object), [subKey]: e.target.value }
                                                  const nextForm = { ...formValues, [key]: nextObj }
                                                  setFormValues(nextForm)
                                                  setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                  autoSaveSection(selectedSection!, nextForm)
                                                }}
                                                className="w-full min-h-[100px] px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                              />
                                            ) : (
                                              <input
                                                value={subVal as string}
                                                maxLength={getFieldLimits(subKey).max}
                                                onChange={(e) => {
                                                  const sectionKey = sectionIdToKey(selectedSection!)
                                                  const nextObj = { ...(value as object), [subKey]: e.target.value }
                                                  const nextForm = { ...formValues, [key]: nextObj }
                                                  setFormValues(nextForm)
                                                  setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                  autoSaveSection(selectedSection!, nextForm)
                                                }}
                                                className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                              />
                                            )}
                                          </div>
                                        )
                                      })}
                                  </div>
                                </div>
                              )

                            }

                            if (Array.isArray(value)) return null;

                            return (
                              <div key={key} className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                  <span>{fieldLabel(key).toLowerCase()}</span>
                                  {isImage ? <ImageIcon className="w-3 h-3 opacity-50" /> : (!isBoolean && !isDatetime && typeof value === 'string') && (() => { const { suggested: sg, max: mx } = getFieldLimits(key); const len = (value as string).length; return <span className={`text-[9px] font-bold ${len >= mx ? 'text-red-500' : len >= sg ? 'text-amber-500' : 'text-muted-foreground/60'}`}>{len}<span className="font-normal opacity-60">/{sg}</span></span> })()}
                                </label>

                                {isBoolean ? (
                                  <div className="flex flex-col gap-2 p-3 bg-muted/20 border border-border rounded-lg">
                                    <div className="flex gap-4">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`section-${key}`}
                                          checked={(value as boolean) === true}
                                          onChange={() => {
                                            const sectionKey = sectionIdToKey(selectedSection!)
                                            setFormValues(prev => {
                                              const next = { ...prev, [key]: true }
                                              setModified(m => ({ ...m, [sectionKey]: next }))
                                              autoSaveSection(selectedSection!, next)
                                              return next
                                            })
                                          }}
                                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-foreground">Yes</span>
                                      </label>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`section-${key}`}
                                          checked={(value as boolean) === false}
                                          onChange={() => {
                                            const sectionKey = sectionIdToKey(selectedSection!)
                                            setFormValues(prev => {
                                              const next = { ...prev, [key]: false }
                                              setModified(m => ({ ...m, [sectionKey]: next }))
                                              autoSaveSection(selectedSection!, next)
                                              return next
                                            })
                                          }}
                                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-foreground">No</span>
                                      </label>
                                    </div>
                                  </div>
                                ) : key === 'mapEmbedUrl' ? (
                                  <MapPinPicker
                                    value={value as string}
                                    onChange={(url) => {
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: url }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                  />
                                ) : isImage ? (
                                  <ImageUpload
                                    value={value as string}
                                    onChange={(url) => {
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: url }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                  />
                                ) : isDatetime ? (
                                  <input
                                    type="datetime-local"
                                    value={value ? (value as string).slice(0, 16) : ''}
                                    onChange={(e) => {
                                      const val = e.target.value ? new Date(e.target.value).toISOString() : ''
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: val }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                    className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                ) : isTextarea ? (
                                  <textarea
                                    value={value as string}
                                    maxLength={getFieldLimits(key).max}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: val }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                    className="w-full min-h-[100px] px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={value as string}
                                    maxLength={getFieldLimits(key).max}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: val }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                    className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                )}
                              </div>
                            )
                          })}
                      </div>)}

                      {/* 2) Array Items detection (the powerful part) */}
                      {selectedSection !== 'seo' && Object.entries(formValues)
                        .filter(([key, v]) => {
                          if (selectedSection === 'hero') {
                            return Array.isArray(v) && !['trustbadges', 'trustsignals'].includes(key.toLowerCase());
                          }
                          return Array.isArray(v);
                        })
                        .map(([key, items]) => {
                          const typedItems = items as any[]
                          const firstItem = typedItems[0]

                          const updateItems = (nextItems: any[]) => {
                            const sectionKey = sectionIdToKey(selectedSection!)
                            setFormValues(prev => {
                              const next = { ...prev, [key]: nextItems }
                              setModified(m => ({ ...m, [sectionKey]: next }))
                              autoSaveSection(selectedSection!, next)
                              return next
                            })
                          }


                          return (
                            <div key={key} className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden pt-0 transition-all duration-300">
                              <button
                                type="button"
                                onClick={() => setCollapsedGroups(prev => ({ ...prev, [`${selectedSection}-${key}`]: !collapsedGroups[`${selectedSection}-${key}`] }))}
                                className="w-full px-4 py-3 border-b border-border/60 bg-muted/10 flex items-center justify-between hover:bg-muted/20 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                    {typedItems.length} {typedItems.length === 1 ? 'item' : 'items'}
                                  </span>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${collapsedGroups[`${selectedSection}-${key}`] ? "" : "rotate-90"}`} />
                              </button>
                              <div className={`p-4 space-y-4 ${collapsedGroups[`${selectedSection}-${key}`] ? "hidden" : "animate-in fade-in slide-in-from-top-2 duration-300"}`}>
                                <div className={(() => {
                                  const first = firstItem !== null && firstItem !== undefined && typeof firstItem === 'object' && !Array.isArray(firstItem) ? (firstItem as Record<string, unknown>) : null
                                  const has = (o: Record<string, unknown> | null, p: string) => o !== null && p in o
                                  if (key === 'steps' && first && (has(first, 'number') || has(first, 'title'))) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                  if (key === 'items' && first && (has(first, 'beforeImage') || has(first, 'afterImage'))) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                  if (key === 'items' && first && (has(first, 'location') || has(first, 'price')) && (has(first, 'title') || has(first, 'imageUrl'))) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                  if (key === 'items' && first && has(first, 'name') && (has(first, 'logoUrl') || has(first, 'icon')) && !has(first, 'label') && !has(first, 'title')) return 'grid grid-cols-2 sm:grid-cols-3 gap-6'
                                  if (key === 'items' && first && has(first, 'name') && has(first, 'description') && !has(first, 'title')) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                  if (key === 'items' && first && Array.isArray(first.features) && has(first, 'title') && has(first, 'description')) return 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                                  if (key === 'items' && first && has(first, 'title') && has(first, 'description') && !has(first, 'question') && !has(first, 'beforeImage')) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                  if (key === 'items' && first && (has(first, 'icon') || has(first, 'label') || has(first, 'imageUrl') || has(first, 'name'))) return 'grid grid-cols-2 sm:grid-cols-4 gap-6'
                                  if (key === 'items' && first && (has(first, 'service') || has(first, 'price'))) return 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                                  if (key === 'posts' && first && has(first, 'title') && has(first, 'excerpt')) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                  if (key === 'members' && first && (has(first, 'name') || has(first, 'imageUrl'))) return 'grid grid-cols-2 sm:grid-cols-3 gap-6'
                                  if (key === 'testimonials' && first && (has(first, 'quoteTitle') || has(first, 'body') || has(first, 'customerName'))) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
                                  if (key === 'reviews' && first && (has(first, 'author') || has(first, 'text'))) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                  if (key === 'plans' && first && (has(first, 'name') || has(first, 'price'))) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                  if (key === 'trustSignals' && first && (has(first, 'label') || has(first, 'icon'))) return 'grid grid-cols-2 sm:grid-cols-4 gap-6'
                                  if (key === 'cities' || key === 'areas') return 'space-y-2'
                                  return 'space-y-4'
                                })()}>
                                  {typedItems.map((item, idx) => {
                                    const isObject = item !== null && typeof item === 'object' && !Array.isArray(item);
                                    const itemObj: Record<string, unknown> = isObject ? (item as Record<string, unknown>) : {}
                                    const hasProp = (o: unknown, p: string) => o !== null && typeof o === 'object' && p in (o as object)
                                    const hasImageUrl = typeof itemObj.imageUrl === 'string' && (itemObj.imageUrl as string).length > 0
                                    const iconName = (typeof itemObj.icon === 'string' ? (itemObj.icon as string) : null) || 'Award'
                                    const hasAwardsStructure = (hasProp(itemObj, 'icon') || hasProp(itemObj, 'imageUrl')) && (hasProp(itemObj, 'label') || hasProp(itemObj, 'title') || hasProp(itemObj, 'name'))
                                    const hasBlogStructure = key === 'posts' && isObject && (hasProp(itemObj, 'title') || hasProp(itemObj, 'excerpt'))
                                    const hasFaqStructure = key === 'items' && isObject && (hasProp(itemObj, 'question') || hasProp(itemObj, 'answer'))
                                    const hasTeamStructure = key === 'members' && isObject && (hasProp(itemObj, 'name') || hasProp(itemObj, 'specialty') || hasProp(itemObj, 'imageUrl'))
                                    const hasBeforeAfterStructure = key === 'items' && isObject && (hasProp(itemObj, 'beforeImage') || hasProp(itemObj, 'afterImage'))
                                    const hasStepsStructure = isObject && (key === 'steps' || hasProp(itemObj, 'number')) && (hasProp(itemObj, 'title') || hasProp(itemObj, 'number') || hasProp(itemObj, 'description'))
                                    const hasFeaturedListingsStructure = key === 'items' && isObject && (hasProp(itemObj, 'location') || hasProp(itemObj, 'price')) && (hasProp(itemObj, 'title') || hasProp(itemObj, 'imageUrl'))
                                    const hasDeveloperPartnersStructure = key === 'items' && isObject && hasProp(itemObj, 'name') && (hasProp(itemObj, 'logoUrl') || hasProp(itemObj, 'icon')) && !hasProp(itemObj, 'label') && !hasProp(itemObj, 'title') && !hasProp(itemObj, 'location')
                                    const hasTestimonialsStructure = key === 'testimonials' && isObject && (hasProp(itemObj, 'quoteTitle') || hasProp(itemObj, 'body') || hasProp(itemObj, 'customerName'))
                                    const hasFinancingStructure = key === 'items' && isObject && Array.isArray(itemObj.features) && hasProp(itemObj, 'title') && hasProp(itemObj, 'description')
                                    const hasPricePreviewStructure = key === 'items' && isObject && (hasProp(itemObj, 'service') || hasProp(itemObj, 'price'))
                                    const hasAcTypesStructure = key === 'items' && isObject && hasProp(itemObj, 'name') && hasProp(itemObj, 'description') && !hasProp(itemObj, 'title') && !hasProp(itemObj, 'question')
                                    const hasPlanStructure = key === 'plans' && isObject && (hasProp(itemObj, 'name') || hasProp(itemObj, 'price'))
                                    const hasFacebookReviewsStructure = key === 'reviews' && isObject && (hasProp(itemObj, 'author') || hasProp(itemObj, 'text') || hasProp(itemObj, 'rating'))
                                    const hasTrustSignalsStructure = key === 'trustSignals' && isObject && (hasProp(itemObj, 'label') || hasProp(itemObj, 'icon'))
                                    const hasPracticeAreasStructure = key === 'items' && isObject && !hasStepsStructure && !hasFinancingStructure && !hasAcTypesStructure && hasProp(itemObj, 'title') && hasProp(itemObj, 'description') && !hasProp(itemObj, 'question') && !hasProp(itemObj, 'beforeImage')
                                    const hasSafetyStructure = key === 'items' && isObject && hasProp(itemObj, 'title') && hasProp(itemObj, 'description') && (hasProp(itemObj, 'icon') || hasProp(itemObj, 'imageUrl')) && selectedSection === 'safety-section'
                                    const hasPageStyle = key === 'items' && isObject && hasAwardsStructure && !hasPracticeAreasStructure && !hasBeforeAfterStructure && !hasFeaturedListingsStructure && !hasDeveloperPartnersStructure && !hasAcTypesStructure && !hasPricePreviewStructure

                                    if (hasSafetyStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                                {hasImageUrl ? (
                                                  <img src={itemObj.imageUrl as string} alt="" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                  <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                              </div>
                                            </div>
                                            <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasBlogStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="rounded-t-xl">
                                            <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                          </div>
                                          <div className="p-4 flex flex-col gap-2 shrink-0">
                                            <input value={(itemObj.date as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, date: e.target.value }; updateItems(next) }} placeholder="Date" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                            <input value={(itemObj.category as string) || ''} maxLength={45} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, category: e.target.value }; updateItems(next) }} placeholder="Category (max 45)" className="w-full px-2 py-1 text-[10px] font-bold uppercase text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                            <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <textarea value={(itemObj.excerpt as string) || ''} maxLength={300} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, excerpt: e.target.value }; updateItems(next) }} placeholder="Excerpt (suggested 150, max 300)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <input value={(itemObj.href as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, href: e.target.value }; updateItems(next) }} placeholder="Link URL" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasFaqStructure) {
                                      return (
                                        <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <input value={(itemObj.question as string) || ''} maxLength={160} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, question: e.target.value }; updateItems(next) }} placeholder="Question (suggested 120, max 160)" className="w-full px-3 py-2 text-xs font-medium bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <textarea value={(itemObj.answer as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, answer: e.target.value }; updateItems(next) }} placeholder="Answer (suggested 300, max 500)" rows={2} className="w-full px-3 py-2 text-[10px] text-muted-foreground bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                        </div>
                                      )
                                    }
                                    if (hasTeamStructure) {
                                      const memberImg = typeof itemObj.imageUrl === 'string' && (itemObj.imageUrl as string).length > 0
                                      return (
                                        <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="w-16 h-16 rounded-full bg-background border border-border overflow-hidden flex items-center justify-center shrink-0">
                                            {memberImg ? <img src={itemObj.imageUrl as string} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted/30" />}
                                          </div>
                                          <div className="w-full">
                                            <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                          </div>
                                          <input value={(itemObj.name as string) || ''} maxLength={70} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Name (max 70)" className="w-full px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                          <input value={(itemObj.specialty as string) || ''} maxLength={70} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, specialty: e.target.value }; updateItems(next) }} placeholder="Role / Specialty (max 70)" className="w-full px-2 py-1.5 text-center text-[10px] text-muted-foreground bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                        </div>
                                      )
                                    }
                                    if (hasStepsStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary text-[10px] font-black">
                                                {((itemObj.number as string) || String(idx + 1).padStart(2, '0'))}
                                              </div>
                                              <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                                <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                              </div>
                                            </div>
                                            <input value={(itemObj.number as string) || ''} maxLength={10} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, number: e.target.value }; updateItems(next) }} placeholder="Step # (e.g. 01)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasBeforeAfterStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <div className="grid grid-cols-2 gap-3">
                                              <div>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Before</span>
                                                <ImageUpload value={(itemObj.beforeImage as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, beforeImage: url }; updateItems(next) }} />
                                              </div>
                                              <div>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">After</span>
                                                <ImageUpload value={(itemObj.afterImage as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, afterImage: url }; updateItems(next) }} />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasPracticeAreasStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                                {hasImageUrl ? (
                                                  <img src={itemObj.imageUrl as string} alt="" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                  <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                              </div>
                                            </div>
                                            <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <input value={(itemObj.href as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, href: e.target.value }; updateItems(next) }} placeholder="Link URL (optional)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasFeaturedListingsStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="relative aspect-[4/3] min-h-[120px] bg-muted/30 overflow-visible">
                                            <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                          </div>
                                          <div className="p-4 space-y-2">
                                            <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <input value={(itemObj.location as string) || ''} maxLength={140} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, location: e.target.value }; updateItems(next) }} placeholder="Location (max 140)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <input value={(itemObj.price as string) || ''} maxLength={30} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, price: e.target.value }; updateItems(next) }} placeholder="Price (max 30)" className="w-full px-2 py-1 text-[10px] font-medium text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <div className="flex gap-2 flex-wrap">
                                              <input type="number" value={Number(itemObj.beds) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, beds: parseInt(e.target.value) || 0 }; updateItems(next) }} placeholder="Beds" className="w-14 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                              <input type="number" value={Number(itemObj.baths) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, baths: parseInt(e.target.value) || 0 }; updateItems(next) }} placeholder="Baths" className="w-14 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                              <input type="number" value={Number(itemObj.sqm) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, sqm: parseInt(e.target.value) || 0 }; updateItems(next) }} placeholder="Sqm" className="w-14 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                              <input value={(itemObj.tag as string) || ''} maxLength={45} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, tag: e.target.value }; updateItems(next) }} placeholder="Tag (max 45)" className="flex-1 min-w-0 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasDeveloperPartnersStructure) {
                                      const hasLogo = typeof itemObj.logoUrl === 'string' && (itemObj.logoUrl as string).length > 0
                                      return (
                                        <div key={idx} className="flex flex-col items-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="w-full aspect-[2/1] max-h-16 bg-transparent border border-border/40 rounded-lg overflow-visible flex items-center justify-center mb-2 relative z-10 transition-colors">
                                            {hasLogo ? (
                                              <ImageUpload value={itemObj.logoUrl as string} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, logoUrl: url }; updateItems(next) }} />
                                            ) : (
                                              <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                            )}
                                          </div>
                                          <input value={(itemObj.name as string) || ''} maxLength={70} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Partner name (max 70)" className="w-full px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                        </div>
                                      )
                                    }
                                    if (hasTestimonialsStructure) {
                                      return (
                                        <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <input value={(itemObj.quoteTitle as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, quoteTitle: e.target.value }; updateItems(next) }} placeholder="Quote title (max 80)" className="w-full px-3 py-2 text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <textarea value={(itemObj.body as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, body: e.target.value }; updateItems(next) }} placeholder="Testimonial body (suggested 300, max 500)" rows={3} className="w-full px-3 py-2 text-[10px] text-muted-foreground bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <input value={(itemObj.customerName as string) || ''} maxLength={70} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, customerName: e.target.value }; updateItems(next) }} placeholder="Customer name (max 70)" className="w-full px-3 py-2 text-[10px] bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <label className="flex items-center gap-2 text-[10px]">
                                            <input type="checkbox" checked={(itemObj.verified as boolean) ?? false} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, verified: e.target.checked }; updateItems(next) }} className="h-3 w-3 rounded border-border text-primary" />
                                            Verified
                                          </label>
                                        </div>
                                      )
                                    }
                                    if (hasFinancingStructure) {
                                      const featuresArr = Array.isArray(itemObj.features) ? itemObj.features as string[] : []
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                                <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                              </div>
                                              <input value={(itemObj.title as string) || ''} maxLength={80} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title (max 80)" className="flex-1 px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            </div>
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            <div>
                                              <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Features</span>
                                              {featuresArr.map((f, fi) => (
                                                <div key={fi} className="flex gap-2 mb-1">
                                                  <input value={f} maxLength={90} onChange={(e) => { const nextF = [...featuresArr]; nextF[fi] = e.target.value; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="flex-1 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" placeholder="Feature (max 90)" />
                                                  <button type="button" onClick={() => { const nextF = featuresArr.filter((_, i) => i !== fi); const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                                </div>
                                              ))}
                                              <button type="button" onClick={() => { const nextF = [...featuresArr, '']; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="text-[10px] text-primary font-bold hover:underline">+ Add feature</button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasPricePreviewStructure) {
                                      return (
                                        <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-2 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <input value={(itemObj.service as string) || ''} maxLength={90} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, service: e.target.value }; updateItems(next) }} placeholder="Service (max 90)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                          <input value={(itemObj.price as string) || ''} maxLength={30} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, price: e.target.value }; updateItems(next) }} placeholder="Price (max 30)" className="w-full px-2 py-1 text-[10px] font-medium text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <input value={(itemObj.note as string) || ''} maxLength={90} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, note: e.target.value }; updateItems(next) }} placeholder="Note (max 90)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                        </div>
                                      )
                                    }
                                    if (hasAcTypesStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                                <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                              </div>
                                              <input value={(itemObj.name as string) || ''} maxLength={70} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Name (max 70)" className="flex-1 px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            </div>
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasPlanStructure) {
                                      const planFeatures = Array.isArray(itemObj.features) ? itemObj.features : []
                                      const f0 = planFeatures[0]
                                      const isPricingStyle = planFeatures.length > 0 && (hasProp(f0, 'text') || hasProp(f0, 'included'))
                                      return (
                                        <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="p-4 space-y-3">
                                            <label className="flex items-center gap-2 text-[10px]">
                                              <input type="checkbox" checked={(itemObj.isPopular as boolean) ?? false} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, isPopular: e.target.checked }; updateItems(next) }} className="h-3 w-3 rounded border-border text-primary" />
                                              Most Popular
                                            </label>
                                            <input value={(itemObj.name as string) || ''} maxLength={60} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Plan name (max 60)" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                            <div className="flex gap-2">
                                              <input value={(itemObj.price as string) || ''} maxLength={30} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, price: e.target.value }; updateItems(next) }} placeholder="Price (max 30)" className="flex-1 px-2 py-1.5 text-sm font-bold text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                              {hasProp(itemObj, 'period') && <input value={(itemObj.period as string) || ''} maxLength={20} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, period: e.target.value }; updateItems(next) }} placeholder="/year" className="w-20 px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />}
                                            </div>
                                            <textarea value={(itemObj.description as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description (suggested 300, max 500)" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                            {hasProp(itemObj, 'buttonText') && <input value={(itemObj.buttonText as string) || ''} maxLength={45} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, buttonText: e.target.value }; updateItems(next) }} placeholder="Button text (max 45)" className="w-full px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />}
                                            <div>
                                              <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Features</span>
                                              {isPricingStyle ? (
                                                (planFeatures as { text?: string; included?: boolean }[]).map((f, fi) => (
                                                  <div key={fi} className="flex gap-2 items-center mb-1">
                                                    <input value={f.text || ''} maxLength={90} onChange={(e) => { const nextF = [...(planFeatures as any[])]; nextF[fi] = { ...f, text: e.target.value }; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="flex-1 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" placeholder="Feature (max 90)" />
                                                    <label className="flex items-center gap-1 shrink-0">
                                                      <input type="checkbox" checked={f.included !== false} onChange={(e) => { const nextF = [...(planFeatures as any[])]; nextF[fi] = { ...f, included: e.target.checked }; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="h-3 w-3 rounded border-border text-primary" />
                                                      <span className="text-[9px]">incl.</span>
                                                    </label>
                                                    <button type="button" onClick={() => { const nextF = (planFeatures as any[]).filter((_, i) => i !== fi); const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                                  </div>
                                                ))
                                              ) : (
                                                (planFeatures as string[]).map((f, fi) => (
                                                  <div key={fi} className="flex gap-2 mb-1">
                                                    <input value={f} maxLength={90} onChange={(e) => { const nextF = [...(planFeatures as string[])]; nextF[fi] = e.target.value; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="flex-1 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" placeholder="Feature (max 90)" />
                                                    <button type="button" onClick={() => { const nextF = (planFeatures as string[]).filter((_, i) => i !== fi); const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                                  </div>
                                                ))
                                              )}
                                              <button type="button" onClick={() => {
                                                const newF = isPricingStyle ? { text: '', included: true } : ''
                                                const nextF = [...(planFeatures as any[]), newF]
                                                const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next)
                                              }} className="text-[10px] text-primary font-bold hover:underline">+ Add feature</button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                    if (hasFacebookReviewsStructure) {
                                      return (
                                        <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <textarea value={(itemObj.text as string) || ''} maxLength={500} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, text: e.target.value }; updateItems(next) }} placeholder="Review text (suggested 300, max 500)" rows={3} className="w-full px-3 py-2 text-[10px] text-muted-foreground bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <input value={(itemObj.author as string) || ''} maxLength={70} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, author: e.target.value }; updateItems(next) }} placeholder="Author name (max 70)" className="w-full px-3 py-2 text-[10px] bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <input value={(itemObj.date as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, date: e.target.value }; updateItems(next) }} placeholder="Date (e.g. 2 weeks ago)" className="w-full px-3 py-2 text-[10px] bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                          <input type="number" min={1} max={5} value={Number(itemObj.rating) || 5} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) }; updateItems(next) }} className="w-16 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                        </div>
                                      )
                                    }
                                    if (hasTrustSignalsStructure) {
                                      return (
                                        <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="w-12 h-12 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                            <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                          </div>
                                          <input value={(itemObj.label as string) || ''} maxLength={45} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, label: e.target.value }; updateItems(next) }} placeholder="Label (max 45)" className="w-full min-h-[36px] px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                        </div>
                                      )
                                    }
                                    if (hasPageStyle) {
                                      return (
                                        <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                          <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          <div className="w-12 h-12 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                            {hasImageUrl ? (
                                              <img src={itemObj.imageUrl as string} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                              <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                            )}
                                          </div>
                                          <div className="w-full space-y-1">
                                            <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                            {hasImageUrl && (
                                              <button type="button" onClick={() => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: '' }; updateItems(next) }} className="text-[10px] text-primary hover:underline">Use icon instead</button>
                                            )}
                                          </div>
                                          <input
                                            value={(itemObj.label ?? itemObj.title ?? itemObj.name ?? '') as string}
                                            maxLength={80}
                                            onChange={(e) => {
                                              const val = e.target.value
                                              const next = [...typedItems]
                                              if (hasProp(itemObj, 'name')) next[idx] = { ...item, name: val }
                                              else if (hasProp(itemObj, 'label')) next[idx] = { ...item, label: val }
                                              else next[idx] = { ...item, title: val }
                                              updateItems(next)
                                            }}
                                            placeholder="Enter label (max 80)..."
                                            className="w-full min-h-[36px] px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60"
                                          />
                                          <input
                                            value={(itemObj.sublabel ?? itemObj.description ?? '') as string}
                                            maxLength={120}
                                            onChange={(e) => {
                                              const val = e.target.value
                                              const next = [...typedItems]
                                              next[idx] = hasProp(itemObj, 'description') ? { ...item, description: val } : { ...item, sublabel: val }
                                              updateItems(next)
                                            }}
                                            placeholder="Enter sublabel (max 120)..."
                                            className="w-full min-h-[36px] px-2 py-1.5 text-center text-[10px] text-muted-foreground bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                                          />
                                        </div>
                                      )
                                    }

                                    return (
                                      <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-4 relative group hover:border-primary/15 transition-colors">
                                        <div className="flex justify-between items-start">
                                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Item #{idx + 1}</span>
                                          <div className="flex gap-2">
                                            <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems];[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[10px]">Up</button>
                                            <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems];[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[10px]">Down</button>
                                            <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                          {isObject ? (
                                            Object.entries(item).map(([iKey, iVal]) => {
                                              const isIArray = Array.isArray(iVal);
                                              const isBioOrProfileLink = iKey.toLowerCase() === 'biourl';
                                              const isIImage = !isBioOrProfileLink && (iKey.toLowerCase().includes('url') || iKey.toLowerCase().includes('image') || iKey.toLowerCase().includes('logo') || iKey.toLowerCase().includes('before') || iKey.toLowerCase().includes('after'));
                                              const isIIcon = iKey.toLowerCase().includes('icon');
                                              const isITextarea = typeof iVal === 'string' && iVal.length > 50;
                                              const fieldLabelStr = fieldLabel(iKey);

                                              const spanClass = (isIArray || isIImage || isITextarea) ? "col-span-2 sm:col-span-3" : ""
                                              return (
                                                <div key={iKey} className={`space-y-1.5 ${spanClass}`}>
                                                  <label className="text-[10px] font-bold text-muted-foreground/70 uppercase">{fieldLabelStr}</label>

                                                  {isIArray ? (
                                                    <div className="space-y-3">
                                                      {(iVal as any[]).map((subVal, subIdx) => {
                                                        const isSubObject = typeof subVal === 'object' && subVal !== null;
                                                        return (
                                                          <div key={subIdx} className="flex flex-col gap-2 p-2 bg-background border border-border rounded-lg">
                                                            <div className="flex gap-2">
                                                              <input
                                                                className="flex-1 px-3 py-1.5 bg-muted/20 border border-border rounded text-xs outline-none"
                                                                value={isSubObject ? (subVal as any).text || '' : subVal as string}
                                                                onChange={(e) => {
                                                                  const nextSub = [...(iVal as any[])]
                                                                  if (isSubObject) {
                                                                    nextSub[subIdx] = { ...subVal, text: e.target.value }
                                                                  } else {
                                                                    nextSub[subIdx] = e.target.value
                                                                  }
                                                                  const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                                }}
                                                              />
                                                              <button type="button" onClick={() => {
                                                                const nextSub = (iVal as any[]).filter((_, i) => i !== subIdx)
                                                                const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                              }} className="p-1 text-muted-foreground hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                            </div>
                                                            {isSubObject && (
                                                              <label className="flex items-center gap-2 px-1">
                                                                <input
                                                                  type="checkbox"
                                                                  checked={(subVal as any).included !== false}
                                                                  onChange={(e) => {
                                                                    const nextSub = [...(iVal as any[])]
                                                                    nextSub[subIdx] = { ...subVal, included: e.target.checked }
                                                                    const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                                  }}
                                                                  className="h-3 w-3 rounded border-border text-primary"
                                                                />
                                                                <span className="text-[10px] text-muted-foreground font-medium uppercase">Included in plan</span>
                                                              </label>
                                                            )}
                                                          </div>
                                                        );
                                                      })}
                                                      <button type="button" onClick={() => {
                                                        const firstSub = (iVal as any[])[0]
                                                        const newSub = typeof firstSub === 'object' ? { text: '', included: true } : ''
                                                        const nextSub = [...(iVal as any[]), newSub]
                                                        const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                      }} className="text-[10px] text-primary font-bold hover:underline transition-all">+ Add Item to {iKey}</button>
                                                    </div>
                                                  ) : isIImage ? (
                                                    <ImageUpload
                                                      value={iVal as string}
                                                      onChange={(url) => {
                                                        const next = [...typedItems]; next[idx] = { ...item, [iKey]: url }; updateItems(next)
                                                      }}
                                                    />
                                                  ) : isIIcon ? (
                                                    <AwardIconPicker
                                                      value={iVal as string || 'Award'}
                                                      onChange={(val) => {
                                                        const next = [...typedItems]; next[idx] = { ...item, [iKey]: val }; updateItems(next)
                                                      }}
                                                    />
                                                  ) : isITextarea ? (
                                                    <textarea
                                                      className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30 min-h-[60px] placeholder:text-muted-foreground/50"
                                                      value={iVal as string}
                                                      maxLength={getFieldLimits(iKey).max}
                                                      onChange={(e) => {
                                                        const next = [...typedItems]; next[idx] = { ...item, [iKey]: e.target.value }; updateItems(next)
                                                      }}
                                                      placeholder={`Enter ${fieldLabelStr.toLowerCase()} (max ${getFieldLimits(iKey).suggested})...`}
                                                    />
                                                  ) : (
                                                    <input
                                                      className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                                                      value={iVal as string}
                                                      maxLength={getFieldLimits(iKey).max}
                                                      onChange={(e) => {
                                                        const next = [...typedItems]; next[idx] = { ...item, [iKey]: e.target.value }; updateItems(next)
                                                      }}
                                                      placeholder={`Enter ${fieldLabelStr.toLowerCase()} (max ${getFieldLimits(iKey).suggested})...`}
                                                    />
                                                  )}
                                                </div>
                                              )
                                            })
                                          ) : (
                                            <div className="space-y-1.5">
                                              <input
                                                className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                                value={item as string}
                                                onChange={(e) => {
                                                  const next = [...typedItems]; next[idx] = e.target.value; updateItems(next)
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    let newItem: any;
                                    if (firstItem !== null && typeof firstItem === 'object' && !Array.isArray(firstItem)) {
                                      newItem = { ...firstItem };
                                      Object.keys(newItem).forEach(k => {
                                        if (typeof newItem[k] === 'string') newItem[k] = '';
                                        if (typeof newItem[k] === 'number') newItem[k] = 0;
                                        if (Array.isArray(newItem[k])) newItem[k] = [];
                                        if (typeof newItem[k] === 'boolean') newItem[k] = true;
                                      });
                                    } else {
                                      newItem = typeof firstItem === 'string' ? '' : {};
                                    }
                                    updateItems([...typedItems, newItem]);
                                  }}
                                  className="w-full py-3.5 border-2 border-dashed border-border/80 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-4 h-4" /> Add New Item
                                </button>
                              </div>
                            </div>
                          )
                        })}
                    </form>
                  )}
                </div>

                {/* Polished footer - shrink-0 keeps it always visible */}
                <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-muted/20 border-t border-border/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`shrink-0 w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">
                      {isSaving ? 'Syncing...' : 'Saved'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="shrink-0 px-5 sm:px-6 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>,
    document.body
  );
}