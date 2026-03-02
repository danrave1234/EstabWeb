"use client";

import * as React from "react"
import { useRouter } from "next/navigation"
import { Eye, FileText, RotateCcw, Send, Layout } from "lucide-react"
import { toast } from "sonner"
import UpgradeButton from "@/components/dashboard/UpgradeButton"
import { canPublishDirectly, canPublishNow, getPublishStats } from "@/lib/subscription"

interface EditorHeaderProps {
    project: any;
    setMobileSidebarOpen: (b: boolean) => void;
    isSaving: boolean;
    refreshPreview: () => void;
    modified: Record<string, any>;
    setIsSubmitting: (b: boolean) => void;
    mergedConfig: Record<string, any>;
    setLocalDraftConfig: (draft: any) => void;
    setModified: (m: any) => void;
    LOCAL_KEY: string;
    discardInProgressRef: React.MutableRefObject<boolean>;
    hasDraft: boolean;
    setSelectedSection: (s: string | null) => void;
    setActivePreviewSection: (s: string | null) => void;
    setSelectedPageIndex: (i: number) => void;
    setFormValues: (v: any) => void;
    baseConfig: Record<string, any>;
    sendFullPreview: (c: any) => void;
    isSubmitting: boolean;
    isPublishing: boolean;
    setIsPublishing: (b: boolean) => void;
    hasLocalChanges: boolean;
    isQueueing: boolean;
    setIsQueueing: (b: boolean) => void;
    hasPendingRequest: boolean;
    setHasPendingRequest: (b: boolean) => void;
}

export function EditorHeader({
    project,
    setMobileSidebarOpen,
    isSaving,
    refreshPreview,
    modified,
    setIsSubmitting,
    mergedConfig,
    setLocalDraftConfig,
    setModified,
    LOCAL_KEY,
    discardInProgressRef,
    hasDraft,
    setSelectedSection,
    setActivePreviewSection,
    setSelectedPageIndex,
    setFormValues,
    baseConfig,
    sendFullPreview,
    isSubmitting,
    isPublishing,
    setIsPublishing,
    hasLocalChanges,
    isQueueing,
    setIsQueueing,
    hasPendingRequest,
    setHasPendingRequest,
}: EditorHeaderProps) {
    const router = useRouter()
    const canPublish = canPublishDirectly(project)
    const publishStats = getPublishStats(project)

    const publishDisabledReason = React.useMemo(() => {
        if (canPublish) {
            if (isPublishing) return 'Publishing in progress.'
            if (!canPublishNow(project)) {
                if (publishStats.remaining <= 0) {
                    return `Period limit reached (${publishStats.used}/${publishStats.limit}).`
                }
                if (publishStats.remainingToday <= 0) {
                    return `Daily limit reached (${publishStats.usedToday}/${publishStats.limitDaily} today).`
                }
                return 'Publishing is temporarily unavailable.'
            }
            if (!hasDraft && !hasLocalChanges) return 'Save a draft before publishing.'
            return null
        }

        if (isQueueing) return 'Submitting for approval.'
        if (hasPendingRequest) return 'A change request is already pending.'
        return null
    }, [canPublish, isPublishing, isQueueing, hasPendingRequest, publishStats.limit, publishStats.limitDaily, publishStats.remaining, publishStats.remainingToday, publishStats.used, publishStats.usedToday, project, hasDraft, hasLocalChanges])


    const saveDraft = async () => {
        if (Object.keys(modified).length === 0) {
            toast.info('No local changes to save')
            return
        }
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/project-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project.id, fullConfig: mergedConfig })
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Failed to save draft')
            toast.success('Draft saved')
            if (json?.draft && typeof json.draft === 'object') {
                setLocalDraftConfig(json.draft)
            }
            setModified({})
            if (typeof window !== 'undefined') {
                localStorage.removeItem(LOCAL_KEY)
            }
            router.refresh()
            setTimeout(() => refreshPreview(), 100)
        } catch (e: any) {
            toast.error(e?.message || 'Failed to save draft')
        } finally {
            setIsSubmitting(false)
        }
    }

    const discardChanges = () => {
        discardInProgressRef.current = true
        setModified({})
        if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCAL_KEY)
        }
        setSelectedSection(null)
        setActivePreviewSection(null)
        setSelectedPageIndex(0)
        setFormValues({})
        // We rely on the parent triggering a form value reset in useEffect when selectedSection is null.
        // send preview after discard
        sendFullPreview(baseConfig)
        router.refresh()
        toast.success('Local changes discarded')
        window.setTimeout(() => {
            discardInProgressRef.current = false
        }, 0)
    }

    const handlePublish = async () => {
        if (!canPublishNow(project)) {
            toast.error(`Publish limit reached (${publishStats.used}/${publishStats.limit} this period).`)
            return
        }
        setIsPublishing(true)
        try {
            if (Object.keys(modified).length > 0) {
                const saveRes = await fetch('/api/project-config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, fullConfig: mergedConfig })
                })
                const saveJson = await saveRes.json()
                if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to save draft')
                if (saveJson?.draft && typeof saveJson.draft === 'object') {
                    setLocalDraftConfig(saveJson.draft)
                }
                setModified({})
                if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY)
                router.refresh()
            }
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project.id })
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Failed to publish')
            const remaining = (json as { remaining?: number; remainingToday?: number })?.remaining ?? publishStats.remaining - 1
            const remainingToday = (json as { remainingToday?: number })?.remainingToday ?? publishStats.remainingToday - 1
            toast.success(`Published! ${remaining} left this period, ${remainingToday} today.`)
            setLocalDraftConfig(null)
            router.refresh()
            setTimeout(() => refreshPreview(), 100)
        } catch (e: any) {
            toast.error(e?.message || 'Failed to publish')
        } finally {
            setIsPublishing(false)
        }
    }

    const handleSubmitApproval = async () => {
        if (hasPendingRequest) {
            toast.error('A change request is already pending. Please wait for it to be reviewed.')
            return
        }
        setIsQueueing(true)
        try {
            if (Object.keys(modified).length > 0) {
                const saveRes = await fetch('/api/project-config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, fullConfig: mergedConfig })
                })
                const saveJson = await saveRes.json()
                if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to auto-save draft before submission')
                setModified({})
                if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY)
                router.refresh()
            }
            const res = await fetch('/api/change-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project.id })
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Failed to submit for approval')
            toast.success('Draft saved and submitted for approval')
            setHasPendingRequest(true)
            router.refresh()
            setTimeout(() => refreshPreview(), 100)
        } catch (e: any) {
            toast.error(e?.message || 'Failed to submit for approval')
        } finally {
            setIsQueueing(false)
        }
    }

    return (
        <header className="fixed lg:absolute top-16 lg:top-0 left-0 lg:left-0 right-0 h-14 border-b border-border flex items-center justify-between px-3 sm:px-6 bg-muted/20 backdrop-blur-md z-[46] gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 flex-1">
                <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="lg:hidden p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors shrink-0"
                >
                    <Layout className="w-5 h-5" />
                </button>
                <div className="hidden min-[400px]:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20 shrink-0">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                </div>
                <div className="hidden md:flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground leading-none truncate">Preview Mode: Viewing unsaved changes</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 truncate">Changes here are local to your browser until you click &quot;Save Draft&quot; in the dashboard.</span>
                </div>
                <div className="min-[350px]:flex xs:hidden shrink-0 scale-75 origin-left">
                    <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} />
                </div>
                <div className="hidden xs:block shrink-0">
                    <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} />
                </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
                <button onClick={refreshPreview} className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm active:scale-95 shrink-0" title={isSaving ? 'Saving...' : 'Refresh'}>
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline shrink-0">{isSaving ? 'Saving...' : 'Refresh'}</span>
                </button>
                <button
                    onClick={saveDraft}
                    disabled={isSubmitting || Object.keys(modified).length === 0}
                    className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                    title={isSubmitting ? 'Saving...' : 'Save Draft'}
                >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline shrink-0">{isSubmitting ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                    onClick={discardChanges}
                    className="hidden xs:flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm shrink-0"
                    title="Discard changes"
                >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline shrink-0">Discard</span>
                </button>
                {canPublish ? (
                    <div className="flex flex-col items-end">
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing || !canPublishNow(project) || (!hasDraft && !hasLocalChanges)}
                            title={publishDisabledReason || (isPublishing ? 'Publishing...' : 'Publish')}
                            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                        >
                            <Send className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden xs:inline shrink-0">{isPublishing ? 'Publishing...' : 'Publish'}</span>
                        </button>
                        {publishDisabledReason && (
                            <span className="mt-1 text-[10px] text-muted-foreground text-right max-w-[180px]">
                                {publishDisabledReason}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-end">
                        <button
                            onClick={handleSubmitApproval}
                            disabled={isQueueing || hasPendingRequest}
                            title={publishDisabledReason || (isQueueing ? 'Submitting...' : hasPendingRequest ? 'Pending Review' : 'Submit for Approval')}
                            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                        >
                            <Send className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden xs:inline shrink-0">{isQueueing ? 'Submitting...' : hasPendingRequest ? 'Pending Review' : 'Submit'}</span>
                        </button>
                        {publishDisabledReason && (
                            <span className="mt-1 text-[10px] text-muted-foreground text-right max-w-[180px]">
                                {publishDisabledReason}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}
