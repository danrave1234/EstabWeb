"use client"

import * as React from "react"
import {
    History, RotateCcw, CreditCard, Globe, ChevronRight, Settings
} from "lucide-react"

interface SidebarAdvancedTabProps {
    setHistoryOpen: (open: boolean) => void;
    setVersionsLoading: (loading: boolean) => void;
    setVersions: (versions: any[]) => void;
    project: any;
    setSelectedSection: (s: string | null) => void;
    refreshPreview: () => void;
}

export function SidebarAdvancedTab({
    setHistoryOpen,
    setVersionsLoading,
    setVersions,
    project,
    setSelectedSection,
    refreshPreview
}: SidebarAdvancedTabProps) {
    return (
        <div className="space-y-4">
            <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em] opacity-70">
                Site Management
            </div>
            <div className="space-y-1">
                <button
                    onClick={async () => {
                        setVersionsLoading(true)
                        setHistoryOpen(true)
                        try {
                            const res = await fetch(`/api/versions?projectId=${project.id}`)
                            const json = await res.json()
                            if (!res.ok) throw new Error(json.error || 'Failed to fetch')
                            setVersions(json.versions || [])
                        } catch (e) {
                            console.error('Versions fetch error:', e)
                        } finally {
                            setVersionsLoading(false)
                        }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-all border border-transparent group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <History className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-bold block">Version History</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">Restore past stages</span>
                        </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={() => {
                        refreshPreview()
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-all border border-transparent group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <RotateCcw className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-bold block">Hard Refresh Preview</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">Force iframe reload</span>
                        </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={() => setSelectedSection('subscription')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-all border border-transparent group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-bold block">Subscription</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">Manage Plan</span>
                        </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                    onClick={() => setSelectedSection('domain')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-all border border-transparent group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-bold block">Custom Domain</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">Connected URLs</span>
                        </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
    )
}
