"use client"

import * as React from "react"
import {
    ChevronRight, Layout, Plus, Trash2, GripVertical,
    Image as ImageIcon, Zap, X, FileText
} from "lucide-react"
import { BLOCK_MAP } from "@/lib/utils/block-registry"
import { slugify } from "@/lib/utils/blocks"
import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo"

interface SidebarContentTabProps {
    setAiEditorOpen: (b: boolean) => void;
    aiHasPending: boolean;
    selectedSection: string | null;
    setSelectedSection: (s: string | null) => void;
    activePreviewSection: string | null;
    setActivePreviewSection: (s: string | null) => void;
    lockPreviewHighlight: (s: string | null) => void;
    scrollToSection: (id: string, idx: number) => void;
    canUsePages: boolean;
    pages: any[];
    selectedPageIndex: number;
    setSelectedPageIndex: (i: number) => void;
    updatePages: (pages: any[]) => void;
    isHomePage: boolean;
    activeSections: string[];
    sectionSearchQuery: string;
    setSectionSearchQuery: (s: string) => void;
    dragSectionIndex: number | null;
    setDragSectionIndex: (i: number | null) => void;
    dropSectionIndex: number | null;
    setDropSectionIndex: (i: number | null) => void;
    moveToSectionIndex: (from: number, to: number) => void;
    removeSectionAtIndex: (i: number) => void;
    setAddSectionOpen: (b: boolean) => void;
    project: any;
    mergedConfig: any;
}

export function SidebarContentTab({
    setAiEditorOpen,
    aiHasPending,
    selectedSection,
    setSelectedSection,
    activePreviewSection,
    setActivePreviewSection,
    lockPreviewHighlight,
    scrollToSection,
    canUsePages,
    pages,
    selectedPageIndex,
    setSelectedPageIndex,
    updatePages,
    isHomePage,
    activeSections,
    sectionSearchQuery,
    setSectionSearchQuery,
    dragSectionIndex,
    setDragSectionIndex,
    dropSectionIndex,
    setDropSectionIndex,
    moveToSectionIndex,
    removeSectionAtIndex,
    setAddSectionOpen,
    project,
    mergedConfig
}: SidebarContentTabProps) {
    return (
        <div className="space-y-1">
            {/* AI Editor Banner */}
            <button
                onClick={() => setAiEditorOpen(true)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left group shadow-sm ${aiHasPending
                    ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/40 hover:border-amber-500/60'
                    : 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 hover:from-primary/15 hover:to-primary/10'
                    }`}
            >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-primary-foreground shrink-0 group-hover:scale-110 transition-transform shadow-sm ${aiHasPending ? 'bg-amber-500' : 'bg-primary'
                    }`}>
                    <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${aiHasPending ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}`}>AI Editor</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-80">
                        {aiHasPending ? 'Pending changes — tap to apply' : 'Edit your site with AI'}
                    </p>
                </div>
                {aiHasPending
                    ? <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-full shrink-0 animate-pulse">Pending</span>
                    : <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">New</span>
                }
            </button>

            <div className="px-2 pt-2 pb-0.5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                Core Identity
            </div>
            <button
                onClick={() => setSelectedSection('brand')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left group ${selectedSection === 'brand' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
            >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Brand & Logo</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Identity & Name</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
                onClick={() => setSelectedSection('navigation')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left group ${selectedSection === 'navigation' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
            >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <Layout className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Pages & SEO</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Menu & Meta Tags</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="pt-2 px-2 pb-0.5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50 flex items-center justify-between">
                Pages
                <div className="flex items-center gap-2">
                    {!canUsePages && (
                        <span className="text-[9px] text-amber-600 font-semibold whitespace-nowrap normal-case tracking-normal hidden sm:inline-block">
                            Upgrade for Multi-Page
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            if (!canUsePages) return
                            const baseLabel = `Page ${pages.length + 1}`
                            let slug = slugify(baseLabel)
                            let counter = 1
                            while (pages.some((page: { slug?: string | null }) => page.slug === slug)) {
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
                            setSelectedSection(null)
                            setActivePreviewSection(null)
                        }}
                        disabled={!canUsePages}
                        className="p-1 hover:bg-primary/10 text-primary rounded transition-colors disabled:text-muted-foreground disabled:hover:bg-transparent group relative"
                        title={!canUsePages ? "Upgrade for Multi-page" : "Add Page"}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="space-y-0.5">
                {pages.map((page: Record<string, any>, idx: number) => (
                    <div key={`${page.slug || 'home'}-${idx}`} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedPageIndex(idx)
                                setSelectedSection(null)
                                setActivePreviewSection(null)
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left group border \${selectedPageIndex === idx ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted border-transparent'}`}
                        >
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform">
                                <Layout className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{page.label || (page.slug ? page.slug.replace(/-/g, ' ') : 'Home')}</p>
                                <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">
                                    {page.slug ? `/${page.slug}` : 'Home'}
                                </p>
                            </div>
                        </button>
                        {page.slug && (
                            <button
                                type="button"
                                onClick={() => {
                                    const next = pages.filter((_: Record<string, any>, i: number) => i !== idx)
                                    updatePages(next)
                                    if (selectedPageIndex === idx) {
                                        setSelectedPageIndex(0)
                                        setSelectedSection(null)
                                        setActivePreviewSection(null)
                                    } else if (selectedPageIndex > idx) {
                                        setSelectedPageIndex(selectedPageIndex - 1)
                                    }
                                }}
                                className="absolute right-1.5 top-1 p-1 opacity-40 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                                title="Remove Page"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-2 px-2 pb-0.5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50 flex items-center justify-between">
                Page Sections
                <button
                    type="button"
                    onClick={() => setAddSectionOpen(true)}
                    className="p-1 hover:bg-primary/10 text-primary rounded transition-colors"
                    title="Add Section"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>
            {(() => {
                const heroIndex = activeSections.findIndex(s => s === 'hero' || s.startsWith('hero') || s === 'trust_badges');
                const heroId = heroIndex !== -1 ? activeSections[heroIndex] : null;
                if (!heroId) return null;

                const isSpecialActive = selectedSection === heroId || activePreviewSection === heroId;

                return (
                    <button
                        onClick={() => {
                            setSelectedSection(heroId)
                            setActivePreviewSection(heroId)
                            lockPreviewHighlight(heroId)
                            scrollToSection(heroId, heroIndex)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left group border border-transparent ${isSpecialActive ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
                    >
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                            <Zap className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{BLOCK_MAP[heroId]?.label || 'Hero Section'}</p>
                            <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">
                                {BLOCK_MAP[heroId]?.variant || 'Main Banner'}
                            </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                );
            })()}

            <div className="px-0.5">
                <div className="relative">
                    <input
                        type="text"
                        value={sectionSearchQuery}
                        onChange={(e) => setSectionSearchQuery(e.target.value)}
                        placeholder="Filter sections..."
                        className="w-full px-3 pr-8 py-1.5 bg-muted/40 border border-border/50 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
                    />
                    {sectionSearchQuery && (
                        <button
                            type="button"
                            onClick={() => setSectionSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                            title="Clear"
                        >
                            <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>

            {activeSections.map((section: string, sectionIndex: number) => {
                const heroIndex = activeSections.findIndex(s => s === 'hero' || s.startsWith('hero') || s === 'trust_badges');
                if (sectionIndex === heroIndex) return null;

                const sectionDisplayLabel = BLOCK_MAP[section]?.label ?? section.replace(/[-_]/g, ' ')
                if (sectionSearchQuery && !sectionDisplayLabel.toLowerCase().includes(sectionSearchQuery.toLowerCase())) return null

                const isDragging = dragSectionIndex === sectionIndex
                const isDropTarget = dropSectionIndex === sectionIndex

                return (
                    <div
                        key={`${section}-${sectionIndex}`}
                        draggable
                        onDragStart={() => setDragSectionIndex(sectionIndex)}
                        onDragEnd={() => { setDragSectionIndex(null); setDropSectionIndex(null) }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            if (dragSectionIndex !== null && dragSectionIndex !== sectionIndex) setDropSectionIndex(sectionIndex)
                        }}
                        onDragLeave={() => setDropSectionIndex(null)}
                        onDrop={(e) => {
                            e.preventDefault()
                            if (dragSectionIndex !== null && dragSectionIndex !== sectionIndex) {
                                moveToSectionIndex(dragSectionIndex, sectionIndex)
                            }
                            setDragSectionIndex(null)
                            setDropSectionIndex(null)
                        }}
                        className={`relative group w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left border ${isDragging ? 'opacity-40 bg-muted border-dashed' : (selectedSection === section || activePreviewSection === section) ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted border-transparent'} ${isDropTarget ? 'border-t-primary border-t-2' : ''}`}
                    >
                        <div
                            className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 transition-transform cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary z-10"
                            title="Drag to reorder"
                        >
                            <GripVertical className="w-3.5 h-3.5" />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedSection(section)
                                setActivePreviewSection(section)
                                lockPreviewHighlight(section)
                                scrollToSection(section, sectionIndex)
                            }}
                            className="flex-1 min-w-0 text-left"
                        >
                            <p className="text-xs font-bold truncate">{BLOCK_MAP[section]?.label ?? section.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                            <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">{BLOCK_MAP[section]?.variant ?? 'Block'}</p>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeSectionAtIndex(sectionIndex)
                            }}
                            className="p-1 opacity-40 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                            title="Remove Section"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )
            })}

            <div className="mt-1 px-0.5">
                <button
                    type="button"
                    onClick={() => setAddSectionOpen(true)}
                    className="w-full py-2 flex items-center justify-center gap-1.5 border border-dashed border-border hover:border-primary/30 hover:bg-primary/5 rounded-lg text-[11px] font-bold text-muted-foreground hover:text-primary transition-all group"
                >
                    <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                    Add New Block
                </button>
            </div>

            <button
                onClick={() => setSelectedSection('legal')}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left group border border-transparent ${selectedSection === 'legal' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
            >
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Legal Pages</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Privacy & Terms</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
                onClick={() => {
                    setSelectedSection('footer')
                    setActivePreviewSection('footer')
                    lockPreviewHighlight('footer')
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left group border border-transparent ${(selectedSection === 'footer' || activePreviewSection === 'footer') ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
            >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <Layout className="w-3.5 h-3.5 rotate-180" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Footer</p>
                    <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Social & Legal</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
    )
}
