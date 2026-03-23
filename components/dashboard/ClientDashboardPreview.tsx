"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { EditorFormPanel } from "@/components/dashboard/editor/EditorFormPanel"
import { AddSectionModal } from "@/components/dashboard/AddSectionModal"
import { VersionHistoryModal } from "@/components/dashboard/VersionHistoryModal"
import { AiEditorModal } from "@/components/dashboard/AiEditorModal"
import { AiSeoModal } from "@/components/dashboard/AiSeoModal"
import { EditorHeader } from "@/components/dashboard/editor/EditorHeader"
import { EditorSidebar } from "@/components/dashboard/editor/EditorSidebar"
import PreviewFrame from "@/components/dashboard/PreviewFrame"
import { PreviewOverlay } from "@/components/dashboard/PreviewOverlay"
import { useEditorState } from "@/hooks/dashboard/useEditorState"
import { Layout, Eye, Layers } from "lucide-react"
import { hasProOrHigher } from "@/lib/subscription"

interface DashboardClientProps {
  project: any
  user: any
  initialPlansConfig: {
    PLANS: any
    ENABLE_ANNUAL_PLANS: boolean
  }
}

export default function ClientDashboardPreview({ project, user, initialPlansConfig }: DashboardClientProps) {
  const [overlayEnabled, setOverlayEnabled] = React.useState(false)
  const canUseProPlusFeatures = React.useMemo(() => hasProOrHigher(project), [project])
  const isPaidAiPlan = React.useMemo(() => {
    const status = (project?.subscription_status || "").toLowerCase()
    return status === "active" || status === "trial" || status === "admin_granted"
  }, [project])
  const {
    iframeRef,
    selectedSection, setSelectedSection,
    activePreviewSection, setActivePreviewSection,
    formValues, setFormValues,
    isSubmitting, setIsSubmitting,
    isQueueing, setIsQueueing,
    isPublishing, setIsPublishing,
    isSaving, setIsSaving,
    modified, setModified,
    hasPendingRequest, setHasPendingRequest,
    colorPaletteOpen, setColorPaletteOpen,
    typographyOpen, setTypographyOpen,
    colorPaletteQuery, setColorPaletteQuery,
    historyOpen, setHistoryOpen,
    aiEditorOpen, setAiEditorOpen,
    aiHasPending, setAiHasPending,
    versions, setVersions,
    versionsLoading, setVersionsLoading,
    rollbackLoading, setRollbackLoading,
    upgradeLoading, setUpgradeLoading,
    dragSectionIndex, setDragSectionIndex,
    dropSectionIndex, setDropSectionIndex,
    addSectionOpen, setAddSectionOpen,
    sectionSearchQuery, setSectionSearchQuery,
    activeTab, setActiveTab,
    selectedPageIndex, setSelectedPageIndex,
    heroEditor,
    collapsedGroups, setCollapsedGroups,
    aiSeoOpen, setAiSeoOpen,
    mobileSidebarOpen, setMobileSidebarOpen,
    sectionRects,
    colorPaletteRef,
    typographyRef,
    colorPaletteRectRef,
    typographyRectRef,
    discardInProgressRef,
    backdropPointerDownRef,
    hasDraft,
    baseConfig,
    mergedConfig,
    globalConfig,
    pages,
    activePage,
    isHomePage,
    activeSections,
    canUsePages,
    refreshPreview,
    sendFullPreview,
    autoSaveSection,
    localDraftConfig, setLocalDraftConfig,
    LOCAL_KEY,
    scrollToSection,
    lockPreviewHighlight,
    moveToSectionIndex,
    removeSectionAtIndex,
    addSection,
    updatePages,
    updateActivePage,
    updateActivePageSections,
  } = useEditorState(project);

  const router = useRouter();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background overflow-hidden selection:bg-primary/20">
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile backdrop — closes sidebar on tap */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[47] lg:hidden"
            aria-hidden
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <EditorSidebar
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pages={pages}
          canUsePages={canUsePages}
          selectedPageIndex={selectedPageIndex}
          setSelectedPageIndex={setSelectedPageIndex}
          updatePages={updatePages}
          isHomePage={isHomePage}
          activeSections={activeSections}
          moveToSectionIndex={moveToSectionIndex}
          removeSectionAtIndex={removeSectionAtIndex}
          scrollToSection={scrollToSection}
          addSection={addSection}
          setAddSectionOpen={setAddSectionOpen}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setActivePreviewSection={setActivePreviewSection}
          lockPreviewHighlight={lockPreviewHighlight}
          activePreviewSection={activePreviewSection}
          refreshPreview={refreshPreview}
          project={project}
          globalConfig={globalConfig}
          mergedConfig={mergedConfig}
          setColorPaletteOpen={setColorPaletteOpen}
          setTypographyOpen={setTypographyOpen}
          colorPaletteOpen={colorPaletteOpen}
          typographyOpen={typographyOpen}
          colorPaletteQuery={colorPaletteQuery}
          setColorPaletteQuery={setColorPaletteQuery}
          setAiEditorOpen={setAiEditorOpen}
          aiHasPending={aiHasPending}
          sectionSearchQuery={sectionSearchQuery}
          setSectionSearchQuery={setSectionSearchQuery}
          heroEditor={heroEditor}
          dragSectionIndex={dragSectionIndex}
          setDragSectionIndex={setDragSectionIndex}
          dropSectionIndex={dropSectionIndex}
          setDropSectionIndex={setDropSectionIndex}
          setHistoryOpen={setHistoryOpen}
          setVersionsLoading={setVersionsLoading}
          setVersions={setVersions}
          autoSaveSection={autoSaveSection}
          setModified={setModified}
          colorPaletteRef={colorPaletteRef}
          colorPaletteRectRef={colorPaletteRectRef}
          typographyRef={typographyRef}
          typographyRectRef={typographyRectRef}
        />

        {/* Add Section Modal */}
        <AddSectionModal
          open={addSectionOpen}
          onOpenChange={setAddSectionOpen}
          activeSections={activeSections}
          addSection={addSection}
          isProOrHigher={canUseProPlusFeatures}
        />

        {/* Main Content (Stage) */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-background relative">
          <EditorHeader
            project={project}
            setMobileSidebarOpen={setMobileSidebarOpen}
            isSaving={isSaving}
            refreshPreview={refreshPreview}
            modified={modified}
            setIsSubmitting={setIsSubmitting}
            mergedConfig={mergedConfig}
            setLocalDraftConfig={setLocalDraftConfig}
            setModified={setModified}
            LOCAL_KEY={LOCAL_KEY}
            discardInProgressRef={discardInProgressRef}
            hasDraft={hasDraft}
            setSelectedSection={setSelectedSection}
            setActivePreviewSection={setActivePreviewSection}
            setSelectedPageIndex={setSelectedPageIndex}
            setFormValues={setFormValues}
            baseConfig={baseConfig}
            sendFullPreview={sendFullPreview}
            isSubmitting={isSubmitting}
            isPublishing={isPublishing}
            setIsPublishing={setIsPublishing}
            hasLocalChanges={Object.keys(modified).length > 0}
            isQueueing={isQueueing}
            setIsQueueing={setIsQueueing}
            hasPendingRequest={hasPendingRequest}
            setHasPendingRequest={setHasPendingRequest}
          />

          <div className="flex-1 overflow-hidden relative group/stage flex flex-col">
            <EditorFormPanel
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              formValues={formValues}
              setFormValues={setFormValues}
              setModified={setModified}
              autoSaveSection={autoSaveSection}
              collapsedGroups={collapsedGroups}
              setCollapsedGroups={setCollapsedGroups}
              isSaving={isSaving}
              project={project}
              initialPlansConfig={initialPlansConfig}
              pages={pages}
              updatePages={updatePages}
              updateActivePageSections={updateActivePageSections}
              toggleHeroVisibility={heroEditor.toggleVisibility}
              canUsePages={canUsePages}
              selectedPageIndex={selectedPageIndex}
              setSelectedPageIndex={setSelectedPageIndex}
              setAiSeoOpen={setAiSeoOpen}
              mergedConfig={mergedConfig}
              globalConfig={globalConfig}
              activePage={activePage}
              activeSections={activeSections}
              setColorPaletteOpen={setColorPaletteOpen}
              setTypographyOpen={setTypographyOpen}
              setUpgradeLoading={setUpgradeLoading}
              backdropPointerDownRef={backdropPointerDownRef}
            />

            <PreviewFrame
              previewPath={`/preview/${project.id}${activePage?.slug ? ('?path=' + activePage.slug) : ''}`}
              iframeRef={iframeRef}
              className="pt-14 lg:pt-14"
              chromeActions={
                <button
                  onClick={() => setOverlayEnabled((v) => !v)}
                  title={overlayEnabled ? "Hide section controls" : "Show section controls"}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition-all duration-150 ${
                    overlayEnabled
                      ? "bg-primary text-primary-foreground border-primary/40 hover:bg-primary/85"
                      : "bg-muted text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  {overlayEnabled ? "Controls On" : "Controls Off"}
                </button>
              }
              overlayContent={
                overlayEnabled ? <PreviewOverlay
                  sectionRects={sectionRects}
                  activeSections={activeSections}
                  activePreviewSection={activePreviewSection}
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  setActivePreviewSection={setActivePreviewSection}
                  lockPreviewHighlight={lockPreviewHighlight}
                  scrollToSection={scrollToSection}
                  removeSectionAtIndex={removeSectionAtIndex}
                  moveToSectionIndex={moveToSectionIndex}
                  setAddSectionOpen={setAddSectionOpen}
                /> : null
              }
            />
          </div>
        </main>

        {/* AI Editor Modal */}
        <AiEditorModal
          open={aiEditorOpen}
          onOpenChange={setAiEditorOpen}
          projectId={project.id}
          currentConfig={mergedConfig}
          onPreview={sendFullPreview}
          isPro={isPaidAiPlan}
          canUseCustomHtml={canUseProPlusFeatures}
          onPendingChange={setAiHasPending}
          onApplied={(newDraft) => {
            setLocalDraftConfig(newDraft)
            setModified({})
            setAiHasPending(false)
            if (typeof window !== 'undefined') {
              localStorage.removeItem(LOCAL_KEY)
            }
          }}
        />

        {/* AI SEO Modal */}
        <AiSeoModal
          open={aiSeoOpen}
          onOpenChange={setAiSeoOpen}
          projectId={project.id}
          pageIndex={selectedPageIndex}
          businessType={project.business_type || "criminal defense"}
          currentSeo={activePage?.seo || { title: "", description: "" }}
          onApplied={(newSeo) => {
            autoSaveSection('seo', newSeo)
            setAiSeoOpen(false)
          }}
        />

        {/* Version History / Rollback Modal */}
        <VersionHistoryModal
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          versions={versions}
          versionsLoading={versionsLoading}
          rollbackLoading={rollbackLoading}
          onRestore={async (version) => {
            setRollbackLoading(version)
            try {
              const res = await fetch('/api/rollback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project.id, version }),
              })
              const json = await res.json()
              if (!res.ok) throw new Error(json.error || 'Rollback failed')
              toast.success(`Restored to version ${version}`)
              setHistoryOpen(false)
              router.refresh()
              setTimeout(() => refreshPreview(), 100)
            } catch (e: any) {
              toast.error(e?.message || 'Rollback failed')
            } finally {
              setRollbackLoading(null)
            }
          }}
        />
      </div>

      {/* Mobile bottom tab bar — Edit / Preview toggle */}
      <div className="lg:hidden flex shrink-0 border-t border-border bg-background/95 backdrop-blur-md z-[45]">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
            mobileSidebarOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layout className="w-5 h-5" />
          Edit
        </button>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
            !mobileSidebarOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-5 h-5" />
          Preview
        </button>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
      <style jsx global>{`
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
    </div>
  )
}
