import { useEffect, useCallback, useRef } from 'react';
import { navigationToArray, ensureStringArray } from '@/config/dashboard-config';

interface UseLivePreviewProps {
    project: any;
    mergedConfig: Record<string, any>;
    activePage: any;
    activeSections: string[];
    pages: any[];
    setSelectedPageIndex: React.Dispatch<React.SetStateAction<number>>;
    setActivePreviewSection: React.Dispatch<React.SetStateAction<string | null>>;
    resolvePageIndexFromPath: (pathname: string) => number;
}

export function useLivePreview({
    project,
    mergedConfig,
    activePage,
    activeSections,
    setSelectedPageIndex,
    setActivePreviewSection,
    resolvePageIndexFromPath
}: UseLivePreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const manualScrollLockRef = useRef(false);
    const manualScrollTargetRef = useRef<string | null>(null);
    const manualScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastPreviewPayloadRef = useRef<string | null>(null);

    const sendToIframe = useCallback((message: any) => {
        try {
            const win = iframeRef.current?.contentWindow;
            if (!win) return;
            win.postMessage(message, '*');
        } catch { }
    }, []);

    const sendFullPreview = useCallback((payload: Record<string, any>) => {
        try {
            const next = JSON.stringify(payload);
            if (lastPreviewPayloadRef.current === next) return;
            lastPreviewPayloadRef.current = next;
            sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: payload });
        } catch {
            sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: payload });
        }
    }, [sendToIframe]);

    const scrollToSection = useCallback((sectionId: string, sectionIndex?: number) => {
        sendToIframe({ type: 'SCROLL_TO_SECTION', sectionId, sectionIndex });
    }, [sendToIframe]);

    const lockPreviewHighlight = useCallback((sectionId: string | null) => {
        manualScrollLockRef.current = true;
        manualScrollTargetRef.current = sectionId;
        if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
        manualScrollTimeoutRef.current = setTimeout(() => {
            manualScrollLockRef.current = false;
            manualScrollTargetRef.current = null;
        }, 1200);
    }, []);

    const refreshPreview = useCallback(() => {
        if (iframeRef.current) {
            const src = iframeRef.current.src;
            iframeRef.current.src = src;
        }
    }, []);

    const buildPreviewData = useCallback((fullConfig: Record<string, any>) => {
        const next = { ...fullConfig };
        if (activePage) {
            next.activeSections = activePage.activeSections ?? next.activeSections;
            next.seo = activePage.seo ?? next.seo;
        }
        if (next.navigation !== undefined) next.navigation = navigationToArray(next.navigation);
        if (next.activeSections !== undefined) next.activeSections = ensureStringArray(next.activeSections);
        return next;
    }, [activePage]);

    // Sync changes efficiently
    useEffect(() => {
        const timer = setTimeout(() => {
            // Check modified via mergedConfig changes
            sendFullPreview(buildPreviewData(mergedConfig));
        }, 150);

        return () => clearTimeout(timer);
    }, [mergedConfig, sendFullPreview, buildPreviewData]);

    // Initial ready
    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if ((e.data as any)?.type === 'LIVE_PREVIEW_READY') {
                sendFullPreview(buildPreviewData(mergedConfig));
            }
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [mergedConfig, sendFullPreview, buildPreviewData]);

    // Section highlight sync
    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if ((e.data as any)?.type !== 'PREVIEW_ACTIVE_SECTION') return;
            const sectionId = (e.data as any)?.sectionId as string | undefined;
            if (!sectionId) return;
            if (!activeSections.includes(sectionId) && sectionId !== 'footer') return;

            if (manualScrollLockRef.current) {
                const target = manualScrollTargetRef.current;
                if (target && sectionId !== target) return;
                manualScrollLockRef.current = false;
                manualScrollTargetRef.current = null;
                if (manualScrollTimeoutRef.current) {
                    clearTimeout(manualScrollTimeoutRef.current);
                    manualScrollTimeoutRef.current = null;
                }
            }
            setActivePreviewSection(sectionId);
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [activeSections, setActivePreviewSection]);

    // Route sync
    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if ((e.data as any)?.type !== 'PREVIEW_ROUTE_CHANGED') return;
            const pathname = (e.data as any)?.pathname as string | undefined;
            const search = (e.data as any)?.search as string | undefined;
            if (!pathname) return;
            if (search && !search.includes(`projectId=${project.id}`)) return;

            const nextIndex = resolvePageIndexFromPath(pathname);
            setSelectedPageIndex((current: number) => (current === nextIndex ? current : nextIndex));
        };
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [project.id, resolvePageIndexFromPath, setSelectedPageIndex]);

    return {
        iframeRef,
        sendToIframe,
        sendFullPreview,
        scrollToSection,
        lockPreviewHighlight,
        refreshPreview,
        buildPreviewData
    };
}
