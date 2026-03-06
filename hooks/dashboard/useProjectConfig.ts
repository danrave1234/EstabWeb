import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { sectionIdToKey, ensureStringArray, deepMerge } from '@/config/dashboard-config';
import { slugify, categoryLabelForSection } from '@/lib/utils/blocks';
import { buildAutoSeoDefaults } from '@/lib/seo/autoSeo';
import { BLOCK_MAP } from '@/lib/utils/block-registry';

const formatSectionLabel = (id: string) =>
    BLOCK_MAP[id]?.label ?? id.replace(/[-_]/g, " ").replace(/--/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

export function useProjectConfig({ project }: { project: any }) {
    const LOCAL_KEY = `ew_local_draft_${project.id}`;

    const [modified, setModified] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const discardInProgressRef = useRef(false);

    useEffect(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null;
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    console.log('[dashboard-preview] loaded local draft from storage', {
                        projectId: project.id,
                        keys: Object.keys(parsed || {}),
                    });
                    setModified(parsed);
                }
            }
        } catch { }
    }, [LOCAL_KEY]);

    const [localDraftConfig, setLocalDraftConfig] = useState<Record<string, any> | null>(
        (project.draft_config && Object.keys(project.draft_config).length > 0)
            ? (project.draft_config as Record<string, any>)
            : null
    );

    useEffect(() => {
        if (project.draft_config && Object.keys(project.draft_config).length > 0) {
            setLocalDraftConfig(project.draft_config as Record<string, any>);
        } else {
            setLocalDraftConfig(null);
        }
    }, [project.draft_config]);

    const hasDraft = !!localDraftConfig && Object.keys(localDraftConfig).length > 0;
    const baseConfig = hasDraft ? localDraftConfig : (project.current_config || {});
    const hasLocalChanges = Object.keys(modified).length > 0;

    const mergedConfig = useMemo(() => deepMerge(baseConfig, modified), [baseConfig, modified]);
    const globalConfig = mergedConfig;

    const normalizedPages = useMemo(() => {
        const rawPages = Array.isArray(globalConfig.pages) ? globalConfig.pages : [];
        return rawPages.map((page: Record<string, any>, index: number) => {
            const payload = (page || {}) as Record<string, any>;
            const rawSlug = typeof payload.slug === 'string' ? payload.slug : '';
            const slug = rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
            const rawLabel = typeof payload.label === 'string' ? payload.label : '';
            const rawSections = Array.isArray(payload.activeSections) ? payload.activeSections : [];
            const firstSection = typeof rawSections[0] === 'string' ? rawSections[0] : '';
            const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : '';

            const label = rawLabel || categoryLabel || (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : `Page ${index + 1}`);
            const nextSlug = label.toLowerCase() === 'home' ? '' : (slug || slugify(label));

            const autoSeo = buildAutoSeoDefaults({
                config: globalConfig as Record<string, any>,
                page: { ...payload, slug: nextSlug, label, activeSections: rawSections },
                pageSlug: nextSlug,
                pageLabel: label,
                domain: project?.custom_domain || project?.subdomain || 'website',
            });

            const existingSeo = payload.seo && typeof payload.seo === 'object' ? payload.seo : {};

            return {
                slug: nextSlug,
                label,
                activeSections: rawSections,
                seo: {
                    ...autoSeo,
                    ...existingSeo,
                    og: {
                        ...(autoSeo.og || {}),
                        ...(existingSeo.og && typeof existingSeo.og === 'object' ? existingSeo.og : {}),
                    },
                    robots: autoSeo.robots,
                    structuredData: autoSeo.structuredData,
                },
            };
        });
    }, [globalConfig, project?.custom_domain, project?.subdomain]);

    const pages = useMemo(() => {
        if (normalizedPages.length > 0) return normalizedPages;
        const autoHomeSeo = buildAutoSeoDefaults({
            config: globalConfig as Record<string, any>,
            page: { slug: '', label: 'Home', activeSections: ensureStringArray(globalConfig.activeSections).length > 0 ? ensureStringArray(globalConfig.activeSections) : ['hero'] },
            pageSlug: '',
            pageLabel: 'Home',
            domain: project?.custom_domain || project?.subdomain || 'website',
        });
        return [{
            slug: '',
            label: 'Home',
            activeSections: ensureStringArray(globalConfig.activeSections).length > 0 ? ensureStringArray(globalConfig.activeSections) : ['hero'],
            seo: autoHomeSeo,
        }];
    }, [normalizedPages, globalConfig, project?.custom_domain, project?.subdomain]);

    const [selectedPageIndex, setSelectedPageIndex] = useState(0);

    useEffect(() => {
        if (selectedPageIndex > pages.length - 1) {
            setSelectedPageIndex(0);
        }
    }, [pages.length, selectedPageIndex]);

    const activePage = pages[selectedPageIndex] ?? pages[0];
    const isHomePage = !activePage?.slug;
    const activeSections = ensureStringArray(activePage?.activeSections ?? globalConfig.activeSections)
        .filter((section) => isHomePage || !section.startsWith('hero'));

    const autoSaveSection = useCallback((sectionId: string, values: any) => {
        if (discardInProgressRef.current) return;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        setIsSaving(true);

        if (sectionId === 'seo') {
            setModified((prev: any) => {
                const currentPages: any[] = Array.isArray(prev.pages) ? prev.pages : pages;
                const nextPages = currentPages.map((page: any, idx: number) =>
                    idx === selectedPageIndex ? { ...page, seo: values } : page
                );
                const next = { ...prev, pages: nextPages };
                if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
                return next;
            });
            saveTimer.current = setTimeout(() => setIsSaving(false), 300);
            return;
        }

        const key = sectionIdToKey(sectionId);
        setModified((prev: any) => {
            const next = { ...prev, [key]: values };
            if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
            return next;
        });

        saveTimer.current = setTimeout(() => setIsSaving(false), 300);
    }, [LOCAL_KEY, pages, selectedPageIndex]);

    const updatePages = useCallback((nextPages: any[]) => {
        const sanitizedPages = nextPages.map((page) => {
            const slug = typeof page?.slug === 'string' ? page.slug : '';
            if (!slug) return page;
            const sections = Array.isArray(page?.activeSections) ? page.activeSections : [];
            return {
                ...page,
                activeSections: sections.filter((section: string) => !section.startsWith('hero')),
            };
        });
        autoSaveSection('pages', sanitizedPages);
        const homePage = sanitizedPages.find((page) => !page?.slug);
        if (homePage?.activeSections) {
            autoSaveSection('activeSections', homePage.activeSections);
        }
    }, [autoSaveSection]);

    const updateActivePage = useCallback((patch: Record<string, any>) => {
        const nextPages = pages.map((page: Record<string, any>, idx: number) => {
            if (idx !== selectedPageIndex) return page;
            return { ...page, ...patch };
        });
        updatePages(nextPages);
    }, [pages, selectedPageIndex, updatePages]);

    const updateActivePageSections = useCallback((nextSections: string[]) => {
        const cleaned = isHomePage
            ? nextSections
            : nextSections.filter((section) => !section.startsWith('hero'));

        if (!isHomePage && !pages[selectedPageIndex]?.label) {
            const firstSection = nextSections.find((section) => typeof section === 'string' && section.length > 0);
            if (firstSection) {
                const nextLabel = categoryLabelForSection(firstSection) || formatSectionLabel(firstSection);
                updateActivePage({ activeSections: cleaned, label: nextLabel });
                return;
            }
        }

        updateActivePage({ activeSections: cleaned });
    }, [isHomePage, pages, selectedPageIndex, updateActivePage]);

    const moveToSectionIndex = useCallback((fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        const next = [...activeSections];
        const [removed] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, removed);
        updateActivePageSections(next);
    }, [activeSections, updateActivePageSections]);

    const removeSectionAtIndex = useCallback((idx: number) => {
        const next = [...activeSections];
        const removed = next[idx];
        next.splice(idx, 1);
        updateActivePageSections(next);
        return removed; // helpful for caller to know what was removed
    }, [activeSections, updateActivePageSections]);

    const addSection = useCallback((id: string, defaultData: any) => {
        if (activeSections.includes(id)) return;
        const next = [...activeSections, id];
        updateActivePageSections(next);
        autoSaveSection(id, defaultData);
        return next.length - 1; // helpful for caller to scroll
    }, [activeSections, autoSaveSection, updateActivePageSections]);

    return {
        LOCAL_KEY,
        modified,
        setModified,
        isSaving,
        setIsSaving,
        saveTimer,
        discardInProgressRef,
        localDraftConfig,
        baseConfig,
        hasDraft,
        hasLocalChanges,
        mergedConfig,
        globalConfig,
        normalizedPages,
        pages,
        selectedPageIndex,
        setSelectedPageIndex,
        activePage,
        isHomePage,
        activeSections,
        autoSaveSection,
        updatePages,
        updateActivePage,
        updateActivePageSections,
        moveToSectionIndex,
        removeSectionAtIndex,
        addSection,
    };
}
