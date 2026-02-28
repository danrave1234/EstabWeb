import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sectionIdToKey } from '@/config/dashboard-config';
import {
    DEFAULT_FOOTER, DEFAULT_BLUEPRINT_CONFIG, DEFAULT_AWARDS_STRIP,
    DEFAULT_FAQ_ACCORDION, DEFAULT_BEFORE_AFTER_GALLERY, DEFAULT_BLOG,
    DEFAULT_HOW_IT_WORKS, DEFAULT_PRACTICE_AREAS, DEFAULT_TREATMENT_PROCESS,
    DEFAULT_COMMON_PESTS, DEFAULT_FEATURED_LISTINGS, DEFAULT_DEVELOPER_PARTNERS,
    DEFAULT_TESTIMONIALS, DEFAULT_REVIEW_TRUST_BAR, DEFAULT_FINANCING,
    DEFAULT_AC_TYPES, DEFAULT_PRICE_PREVIEW, DEFAULT_PRICING_TABLE,
    DEFAULT_MAINTENANCE_PLANS, DEFAULT_FACEBOOK_REVIEW_EMBED, DEFAULT_WHY_CHOOSE_ME,
    DEFAULT_SERVICE_AREA_MAP, DEFAULT_LOGO_CLOUD, DEFAULT_DELIVERY_COVERAGE,
    DEFAULT_CONTACT_WITH_MAP, DEFAULT_HERO_EMERGENCY, DEFAULT_CONTACT,
    DEFAULT_HERO, DEFAULT_TRUST_BADGES, DEFAULT_TEAM_CAROUSEL, DEFAULT_ATTORNEY_PROFILE,
    DEFAULT_CTA, DEFAULT_PROMO_STRIP, DEFAULT_FREE_CONSULTATION, DEFAULT_GUARANTEE,
    DEFAULT_FEATURES, navigationToArray
} from '@/config/dashboard-config';

// Imported from ClientDashboardPreview to keep it self-contained
const normalizeArrayItems = <T,>(value: unknown, fallback: T[]): T[] => {
    if (Array.isArray(value)) return value as T[];
    if (value && typeof value === 'object') {
        return Object.keys(value as Record<string, T>)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (value as Record<string, T>)[k]);
    }
    return fallback;
};

export function useDashboardUI({ project, baseConfig, modified, mergedConfig }: any) {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [activePreviewSection, setActivePreviewSection] = useState<string | null>(null);

    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({ 'seo-og': true });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isQueueing, setIsQueueing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);

    const [colorPaletteOpen, setColorPaletteOpen] = useState(false);
    const [typographyOpen, setTypographyOpen] = useState(false);
    const [colorPaletteQuery, setColorPaletteQuery] = useState("");

    const [historyOpen, setHistoryOpen] = useState(false);
    const [aiEditorOpen, setAiEditorOpen] = useState(false);
    const [aiHasPending, setAiHasPending] = useState(false);
    const [aiSeoOpen, setAiSeoOpen] = useState(false);

    const [versions, setVersions] = useState<{ id: string; version: number; createdAt: string; isCurrent: boolean }[]>([]);
    const [versionsLoading, setVersionsLoading] = useState(false);
    const [rollbackLoading, setRollbackLoading] = useState<number | null>(null);
    const [upgradeLoading, setUpgradeLoading] = useState(false);

    const [dragSectionIndex, setDragSectionIndex] = useState<number | null>(null);
    const [dropSectionIndex, setDropSectionIndex] = useState<number | null>(null);
    const [addSectionOpen, setAddSectionOpen] = useState(false);
    const [sectionSearchQuery, setSectionSearchQuery] = useState("");

    const [activeTab, setActiveTab] = useState<"content" | "design" | "advanced">("content");
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [globalSettingsModalTab, setGlobalSettingsModalTab] = useState<"theme" | "sections">("theme");

    const colorPaletteRef = useRef<HTMLButtonElement>(null);
    const typographyRef = useRef<HTMLButtonElement>(null);

    const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
    if (!supabaseRef.current) supabaseRef.current = createClient();
    const supabase = supabaseRef.current;

    // URL initialization
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section') || params.get('tab');
        if (section) setSelectedSection(section);
    }, []);

    // Keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedSection) setSelectedSection(null);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedSection]);

    // Click outside palettes
    useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as Node;
            const inColorPalette = colorPaletteRef.current?.contains(target) || (e.target as Element)?.closest?.("[data-dropdown=color-palette]");
            const inTypography = typographyRef.current?.contains(target) || (e.target as Element)?.closest?.("[data-dropdown=typography]");
            if (!inColorPalette) {
                setColorPaletteOpen(false);
                setColorPaletteQuery("");
            }
            if (!inTypography) setTypographyOpen(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    // Pending change requests
    useEffect(() => {
        const checkPending = async () => {
            const { data } = await supabase
                .from('change_requests')
                .select('id')
                .eq('project_id', project.id)
                .eq('status', 'pending')
                .limit(1)
                .maybeSingle();
            setHasPendingRequest(!!data);
        };
        checkPending();
    }, [project.id, supabase]);

    const lastCollapsedSectionRef = useRef<string | null>(null);

    // Load section into form values
    useEffect(() => {
        if (selectedSection) {
            const sectionChanged = lastCollapsedSectionRef.current !== selectedSection;
            const setFormWithCollapsed = (values: Record<string, any>) => {
                setFormValues(values);
                if (sectionChanged) {
                    lastCollapsedSectionRef.current = selectedSection;
                    const nextCollapsed: Record<string, boolean> = {};
                    Object.entries(values).forEach(([key, value]) => {
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            nextCollapsed[`${selectedSection}-${key}`] = true;
                        }
                    });
                    if (selectedSection === 'seo') nextCollapsed['seo-og'] = true;
                    setCollapsedGroups(nextCollapsed);
                }
            };

            if (selectedSection === 'global_settings') {
                setFormWithCollapsed({});
                return;
            }

            const sectionKey = sectionIdToKey(selectedSection);
            const local = (modified as any)?.[sectionKey];
            const base = local ?? baseConfig[sectionKey] ?? {};

            if (sectionKey === 'footer') {
                setFormWithCollapsed({
                    ...DEFAULT_FOOTER,
                    ...base,
                    social: { ...DEFAULT_FOOTER.social, ...(base?.social ?? {}) },
                });
            } else if (sectionKey === 'navigation') {
                setFormWithCollapsed(navigationToArray(base) as unknown as Record<string, any>);
            } else if (sectionKey === 'legal') {
                setFormWithCollapsed({
                    privacypolicy: { ...DEFAULT_BLUEPRINT_CONFIG.privacy, ...(base?.privacypolicy ?? {}) },
                    termsofservice: { ...DEFAULT_BLUEPRINT_CONFIG.termsofservice, ...(base?.termsofservice ?? {}) },
                    cookiepolicy: { ...DEFAULT_BLUEPRINT_CONFIG.cookiepolicy, ...(base?.cookiepolicy ?? {}) },
                });
            } else if (sectionKey === 'pages') {
                // Form load logic for pages usually isn't as critical for formValues directly
                setFormWithCollapsed({ pages: Array.isArray(base) ? base : [] });
            } else {
                // Generic fallback for other sections
                setFormWithCollapsed({ ...base });
            }
        } else {
            setFormValues({});
        }
    }, [selectedSection, modified, baseConfig, mergedConfig]);

    return {
        selectedSection, setSelectedSection,
        activePreviewSection, setActivePreviewSection,
        formValues, setFormValues,
        collapsedGroups, setCollapsedGroups,
        isSubmitting, setIsSubmitting,
        isQueueing, setIsQueueing,
        isPublishing, setIsPublishing,
        hasPendingRequest, setHasPendingRequest,
        colorPaletteOpen, setColorPaletteOpen,
        typographyOpen, setTypographyOpen,
        colorPaletteQuery, setColorPaletteQuery,
        historyOpen, setHistoryOpen,
        aiEditorOpen, setAiEditorOpen,
        aiHasPending, setAiHasPending,
        aiSeoOpen, setAiSeoOpen,
        versions, setVersions,
        versionsLoading, setVersionsLoading,
        rollbackLoading, setRollbackLoading,
        upgradeLoading, setUpgradeLoading,
        dragSectionIndex, setDragSectionIndex,
        dropSectionIndex, setDropSectionIndex,
        addSectionOpen, setAddSectionOpen,
        sectionSearchQuery, setSectionSearchQuery,
        activeTab, setActiveTab,
        mobileSidebarOpen, setMobileSidebarOpen,
        globalSettingsModalTab, setGlobalSettingsModalTab,
        colorPaletteRef, typographyRef
    };
}
