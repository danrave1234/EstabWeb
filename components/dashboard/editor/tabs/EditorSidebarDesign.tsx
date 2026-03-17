"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
    Sun, Moon, Search, ChevronDown
} from "lucide-react"
import { COLOR_THEME_SWATCHES, TYPOGRAPHY_OPTIONS } from "@/config/dashboard-config"

interface SidebarDesignTabProps {
    colorPaletteOpen: boolean;
    setColorPaletteOpen: (open: boolean) => void;
    colorPaletteQuery: string;
    setColorPaletteQuery: (query: string) => void;
    typographyOpen: boolean;
    setTypographyOpen: (open: boolean) => void;
    setModified: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    autoSaveSection: (section: string, value: any) => void;
    globalConfig: any;
    colorPaletteRef: React.RefObject<HTMLButtonElement | null>;
    colorPaletteRectRef: React.MutableRefObject<DOMRect | null>;
    typographyRef: React.RefObject<HTMLButtonElement | null>;
    typographyRectRef: React.MutableRefObject<DOMRect | null>;
}

export function SidebarDesignTab({
    colorPaletteOpen,
    setColorPaletteOpen,
    colorPaletteQuery,
    setColorPaletteQuery,
    typographyOpen,
    setTypographyOpen,
    setModified,
    autoSaveSection,
    globalConfig,
    colorPaletteRef,
    colorPaletteRectRef,
    typographyRef,
    typographyRectRef,
}: SidebarDesignTabProps) {

    const paletteEntries = React.useMemo(() => {
        return Object.keys(COLOR_THEME_SWATCHES).map(key => ({
            key,
            swatches: COLOR_THEME_SWATCHES[key],
            tags: [key.toLowerCase(), key.replace(/-/g, ' ')]
        }));
    }, []);

    const filteredPalettes = React.useMemo(() => {
        if (!colorPaletteQuery) return paletteEntries
        const q = colorPaletteQuery.toLowerCase()
        return paletteEntries.filter(p => p.tags.some(t => t.includes(q)))
    }, [paletteEntries, colorPaletteQuery])

    const isDark = !!globalConfig.darkMode

    // ── Helpers: write design settings to ROOT of modified so the preview picks them up ──
    // LivePreviewProvider reads data.colorTheme / data.darkMode / data.typographyStyle at root level.
    // We must also write to localStorage since autoSaveSection does it inline (not via a useEffect).
    const localKey = React.useMemo(() => `ew_local_draft_${(globalConfig as any).id || ''}`, [])
    const applyDesignSetting = React.useCallback((patch: Record<string, any>) => {
        setModified((prev) => {
            const next = { ...prev, ...patch }
            if (typeof window !== 'undefined') {
                // find the ew_local_draft_ key in localStorage
                const draftKey = Object.keys(localStorage).find(k => k.startsWith('ew_local_draft_'))
                if (draftKey) {
                    try {
                        const existing = JSON.parse(localStorage.getItem(draftKey) || '{}')
                        localStorage.setItem(draftKey, JSON.stringify({ ...existing, ...patch }))
                    } catch { /* ignore */ }
                }
            }
            return next
        })
    }, [setModified])

    return (
        <div className="space-y-1 pb-4">
            <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em] opacity-70">
                Visual Style
            </div>

            {/* ── Appearance ── */}
            <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block mb-2">
                    Appearance
                </label>
                <div className="flex p-1 bg-muted/30 rounded-xl border border-border gap-1">
                    <button
                        type="button"
                        onClick={() => applyDesignSetting({ darkMode: false })}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all ${!isDark ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Sun className="w-3.5 h-3.5" /> Light
                    </button>
                    <button
                        type="button"
                        onClick={() => applyDesignSetting({ darkMode: true })}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-all ${isDark ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Moon className="w-3.5 h-3.5" /> Dark
                    </button>
                </div>
            </div>

            {/* ── Header Layout ── */}
            <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block mb-2">
                    Header Layout
                </label>
                <p className="text-[10px] text-muted-foreground mb-3">
                    Choose how the main navigation appears at the top of your site.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                    {[
                        { value: "sticky", label: "Sticky", desc: "Stays at top while scrolling" },
                        { value: "static", label: "Static", desc: "Scrolls away with page" },
                        { value: "tubelight", label: "Tubelight", desc: "Glow active link" },
                        { value: "megamenu", label: "Megamenu", desc: "Wide dropdown" },
                    ].map(({ value, label, desc }) => {
                        const raw = globalConfig.headerStyle || "sticky";
                        // normalize legacy values
                        const normalized = raw === "solid" || raw === "floating" ? "sticky" : raw;
                        const isActive = normalized === value
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => applyDesignSetting({ headerStyle: value })}
                                className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-all ${
                                    isActive
                                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                                        : "border-border bg-background hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                                }`}
                            >
                                <span className="text-[11px] font-bold leading-tight">{label}</span>
                                <span className={`text-[9px] leading-tight mt-0.5 ${isActive ? "text-primary/70" : "text-muted-foreground/70"}`}>{desc}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── Color Palette — inline expandable ── */}
            <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block mb-2">
                    Color Palette
                </label>
                <button
                    type="button"
                    ref={colorPaletteRef}
                    onClick={() => setColorPaletteOpen(!colorPaletteOpen)}
                    className="w-full flex items-center justify-between gap-2 p-1.5 rounded-lg bg-background border border-border hover:border-primary/50 transition-all shadow-sm"
                >
                    <div className="flex -space-x-1.5 overflow-hidden p-0.5">
                        {(COLOR_THEME_SWATCHES[globalConfig.colorTheme] || COLOR_THEME_SWATCHES['partner'] || []).slice(0, 5).map((color, i) => (
                            <div key={i} className="w-5 h-5 rounded-md border-2 border-background shadow-sm shrink-0" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {(globalConfig.colorTheme || 'partner').replace(/-/g, ' ')}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${colorPaletteOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {/* Inline expanded palette list — no floating, scrolls with sidebar */}
                {colorPaletteOpen && (
                    <div className="mt-2 rounded-xl border border-border bg-background overflow-hidden shadow-md">
                        <div className="p-2 border-b border-border bg-muted/20">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                <input
                                    autoFocus
                                    value={colorPaletteQuery}
                                    onChange={(e) => setColorPaletteQuery(e.target.value)}
                                    placeholder="Search palettes…"
                                    className="w-full pl-7 pr-2 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto p-1.5 grid grid-cols-1 gap-0.5 custom-scrollbar">
                            {filteredPalettes.map((p) => (
                                <button
                                    key={p.key}
                                    onClick={() => {
                                        applyDesignSetting({ colorTheme: p.key })
                                        setColorPaletteOpen(false)
                                        setColorPaletteQuery('')
                                    }}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg transition-all text-left ${globalConfig.colorTheme === p.key ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50 border border-transparent'}`}
                                >
                                    <div className="flex -space-x-1 p-0.5 bg-background rounded-md border border-border shadow-sm shrink-0">
                                        {p.swatches.slice(0, 4).map((c, i) => (
                                            <div key={i} className="w-3.5 h-3.5 rounded border border-background" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground truncate flex-1">{p.key.replace(/-/g, ' ')}</span>
                                    {globalConfig.colorTheme === p.key && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Typography — inline expandable ── */}
            <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground block mb-2">
                    Typography
                </label>
                <button
                    type="button"
                    ref={typographyRef}
                    onClick={() => setTypographyOpen(!typographyOpen)}
                    className="w-full flex items-center justify-between gap-2 p-1.5 rounded-lg bg-background border border-border hover:border-primary/50 transition-all shadow-sm"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shrink-0">Ag</div>
                        <span
                            className="text-[11px] font-medium text-foreground truncate"
                            style={{ fontFamily: TYPOGRAPHY_OPTIONS.find(o => o.value === (globalConfig.typographyStyle || 'elegant'))?.fontFamily || 'inherit' }}
                        >
                            {TYPOGRAPHY_OPTIONS.find(o => o.value === (globalConfig.typographyStyle || 'elegant'))?.label || 'Elegant'}
                        </span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-muted-foreground shrink-0 transition-transform ${typographyOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Inline expanded typography list */}
                {typographyOpen && (
                    <div className="mt-2 rounded-xl border border-border bg-background overflow-hidden shadow-md">
                        <div className="max-h-[240px] overflow-y-auto p-1.5 grid grid-cols-1 gap-0.5 custom-scrollbar">
                            {TYPOGRAPHY_OPTIONS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => {
                                        applyDesignSetting({ typographyStyle: f.value })
                                        setTypographyOpen(false)
                                    }}
                                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all text-left ${(globalConfig.typographyStyle || 'elegant') === f.value
                                        ? 'bg-primary/5 border border-primary/20'
                                        : 'hover:bg-muted/50 border border-transparent'
                                        }`}
                                >
                                    <div className="min-w-0 flex flex-col gap-0.5">
                                        <span className="text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: f.fontFamily }}>
                                            {f.label}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground leading-tight" style={{ fontFamily: f.fontFamily }}>
                                            Aa 123 — The quick brown fox
                                        </span>
                                    </div>
                                    {(globalConfig.typographyStyle || 'elegant') === f.value && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
