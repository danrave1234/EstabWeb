"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight, FileText, Settings, Layout, Palette
} from "lucide-react"
import { SidebarContentTab } from "./tabs/EditorSidebarContent"
import { SidebarDesignTab } from "./tabs/EditorSidebarDesign"
import { SidebarAdvancedTab } from "./tabs/EditorSidebarAdvanced"

interface EditorSidebarProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (b: boolean) => void;
  activeTab: "content" | "design" | "advanced";
  setActiveTab: (t: "content" | "design" | "advanced") => void;
  pages: any[];
  canUsePages: boolean;
  selectedPageIndex: number;
  setSelectedPageIndex: (i: number) => void;
  updatePages: (pages: any[]) => void;
  isHomePage: boolean;
  activeSections: string[];
  moveToSectionIndex: (from: number, to: number) => void;
  removeSectionAtIndex: (i: number) => void;
  scrollToSection: (id: string, idx: number) => void;
  addSection: (id: string) => void;
  setAddSectionOpen: (b: boolean) => void;
  selectedSection: string | null;
  setSelectedSection: (s: string | null) => void;
  setActivePreviewSection: (s: string | null) => void;
  lockPreviewHighlight: (s: string | null) => void;
  activePreviewSection: string | null;
  refreshPreview: () => void;
  project: any;
  globalConfig: any;
  mergedConfig: any;
  setColorPaletteOpen: (open: boolean) => void;
  setTypographyOpen: (open: boolean) => void;
  colorPaletteOpen: boolean;
  typographyOpen: boolean;
  colorPaletteQuery: string;
  setColorPaletteQuery: (s: string) => void;
  setAiEditorOpen: (b: boolean) => void;
  aiHasPending: boolean;
  sectionSearchQuery: string;
  setSectionSearchQuery: (s: string) => void;
  dragSectionIndex: number | null;
  setDragSectionIndex: (i: number | null) => void;
  dropSectionIndex: number | null;
  setDropSectionIndex: (i: number | null) => void;
  setHistoryOpen: (b: boolean) => void;
  setVersionsLoading: (b: boolean) => void;
  setVersions: (v: any[]) => void;
  autoSaveSection: (section: string, value: any) => void;
  setModified: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  colorPaletteRef: React.RefObject<HTMLButtonElement | null>;
  colorPaletteRectRef: React.MutableRefObject<DOMRect | null>;
  typographyRef: React.RefObject<HTMLButtonElement | null>;
  typographyRectRef: React.MutableRefObject<DOMRect | null>;
}

export function EditorSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  activeTab,
  setActiveTab,
  pages,
  canUsePages,
  selectedPageIndex,
  setSelectedPageIndex,
  updatePages,
  isHomePage,
  activeSections,
  moveToSectionIndex,
  removeSectionAtIndex,
  scrollToSection,
  addSection,
  setAddSectionOpen,
  selectedSection,
  setSelectedSection,
  setActivePreviewSection,
  lockPreviewHighlight,
  activePreviewSection,
  refreshPreview,
  project,
  globalConfig,
  mergedConfig,
  setColorPaletteOpen,
  setTypographyOpen,
  colorPaletteOpen,
  typographyOpen,
  colorPaletteQuery,
  setColorPaletteQuery,
  setAiEditorOpen,
  aiHasPending,
  sectionSearchQuery,
  setSectionSearchQuery,
  dragSectionIndex,
  setDragSectionIndex,
  dropSectionIndex,
  setDropSectionIndex,
  setHistoryOpen,
  setVersionsLoading,
  setVersions,
  autoSaveSection,
  setModified,
  colorPaletteRef,
  colorPaletteRectRef,
  typographyRef,
  typographyRectRef,
}: EditorSidebarProps) {

  return (
    <aside className={`fixed top-16 left-0 w-[280px] sm:w-[320px] bottom-0 border-r border-border bg-background flex flex-col shrink-0 shadow-xl z-[48] transition-transform duration-300 lg:translate-x-0 lg:static lg:z-20 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-border space-y-4 bg-muted/20">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
        <div>
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <Layout className="w-6 h-6 text-primary" />
            Site Editor
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-70">
            Personalize your presence
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/10">
        {[
          { id: "content", label: "Content", icon: FileText },
          { id: "design", label: "Design", icon: Palette },
          { id: "advanced", label: "Advanced", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold tracking-[0.08em] transition-all ${activeTab === tab.id ? "bg-background text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-background/50"}`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {activeTab === "content" && (
          <SidebarContentTab
            setAiEditorOpen={setAiEditorOpen}
            aiHasPending={aiHasPending}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            activePreviewSection={activePreviewSection}
            setActivePreviewSection={setActivePreviewSection}
            lockPreviewHighlight={lockPreviewHighlight}
            scrollToSection={scrollToSection}
            canUsePages={canUsePages}
            pages={pages}
            selectedPageIndex={selectedPageIndex}
            setSelectedPageIndex={setSelectedPageIndex}
            updatePages={updatePages}
            isHomePage={isHomePage}
            activeSections={activeSections}
            sectionSearchQuery={sectionSearchQuery}
            setSectionSearchQuery={setSectionSearchQuery}
            dragSectionIndex={dragSectionIndex}
            setDragSectionIndex={setDragSectionIndex}
            dropSectionIndex={dropSectionIndex}
            setDropSectionIndex={setDropSectionIndex}
            moveToSectionIndex={moveToSectionIndex}
            removeSectionAtIndex={removeSectionAtIndex}
            setAddSectionOpen={setAddSectionOpen}
            project={project}
            mergedConfig={mergedConfig}
          />
        )}

        {activeTab === "design" && (
          <SidebarDesignTab
            colorPaletteOpen={colorPaletteOpen}
            setColorPaletteOpen={setColorPaletteOpen}
            colorPaletteQuery={colorPaletteQuery}
            setColorPaletteQuery={setColorPaletteQuery}
            typographyOpen={typographyOpen}
            setTypographyOpen={setTypographyOpen}
            setModified={setModified}
            autoSaveSection={autoSaveSection}
            globalConfig={globalConfig}
            colorPaletteRef={colorPaletteRef}
            colorPaletteRectRef={colorPaletteRectRef}
            typographyRef={typographyRef}
            typographyRectRef={typographyRectRef}
          />
        )}

        {activeTab === "advanced" && (
          <SidebarAdvancedTab
            setHistoryOpen={setHistoryOpen}
            setVersionsLoading={setVersionsLoading}
            setVersions={setVersions}
            project={project}
            setSelectedSection={setSelectedSection}
            refreshPreview={refreshPreview}
          />
        )}
      </div>
    </aside>
  )
}
