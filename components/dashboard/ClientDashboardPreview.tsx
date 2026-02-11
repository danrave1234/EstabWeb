"use client"

import * as React from "react"
import { ChevronRight, FileText, Settings, Eye, Layout, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import MainHeader from "@/components/shared/MainHeader"

interface DashboardClientProps {
  project: any
  user: any
}

export default function ClientDashboardPreview({ project, user }: DashboardClientProps) {
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null)
  const [formValues, setFormValues] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const supabase = createClient()

  const currentConfig = project.current_config || {}
  const activeSections = currentConfig.activeSections || []

  // Extract fields for the selected section
  React.useEffect(() => {
    if (selectedSection) {
      // Find the section data in currentConfig
      // Section IDs in activeSections usually match keys in the JSON (mostly)
      // e.g., 'hero' matches 'hero' key. 'features' matches 'features' key.
      const sectionKey = selectedSection === 'hero-emergency' ? 'heroEmergency' : 
                         selectedSection === 'practice-areas' ? 'practiceAreas' :
                         selectedSection === 'attorney-profile' ? 'attorneyProfile' :
                         selectedSection === 'free-consultation' ? 'freeConsultation' :
                         selectedSection === 'how-it-works' ? 'howItWorks' :
                         selectedSection === 'review-trust-bar' ? 'reviewTrustBar' :
                         selectedSection === 'feature-highlight' ? 'featureHighlight' :
                         selectedSection === 'team-carousel' ? 'teamCarousel' :
                         selectedSection === 'patient-faq' ? 'patientFaq' :
                         selectedSection === 'pricing' ? 'pricingTable' :
                         selectedSection === 'awards' ? 'awardsStrip' :
                         selectedSection;

      const sectionData = currentConfig[sectionKey] || {}
      
      // We only care about simple string fields for now
      const initialValues: Record<string, string> = {}
      Object.entries(sectionData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          initialValues[key] = value
        }
      })
      setFormValues(initialValues)
    }
  }, [selectedSection, currentConfig])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSection) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('change_requests').insert({
        project_id: project.id,
        user_id: user.id,
        section_id: selectedSection,
        requested_changes: formValues,
        status: 'pending',
      })

      if (error) throw error

      toast.success("Your request has been sent to our team for approval.")
      setSelectedSection(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <MainHeader initialUser={user} variant="client" />

      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
            Site Editor
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Preview and request changes
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Site Sections
            </div>
            {activeSections.length > 0 ? (
              activeSections.map((section: string) => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
                >
                  <span className="capitalize">{section.replace(/-/g, ' ')}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground italic">No sections defined</p>
            )}
          </div>

          <div className="mt-8 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </div>
            <Link 
              href="/dashboard/requests"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground transition-colors"
            >
              <FileText className="w-4 h-4 text-primary" />
              Change Requests
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <form action="/auth/signout" method="post">
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content (Stage) */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-muted/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Preview
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm active:scale-95">
              <Eye className="w-3.5 h-3.5" />
              Refresh Preview
            </button>
          </div>
        </header>

        <div className="flex-1 relative bg-muted/10 p-4 lg:p-8">
          <div className="w-full h-full rounded-xl border border-border shadow-2xl bg-background overflow-hidden flex flex-col">
            <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background border border-border rounded px-3 py-0.5 text-[10px] text-muted-foreground min-w-[200px] text-center truncate">
                  {process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/preview
                </div>
              </div>
            </div>
            <iframe 
              src="/admin/preview" 
              className="flex-1 w-full h-full border-none"
              title="Project Preview"
            />
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={!!selectedSection} onOpenChange={(open) => !open && setSelectedSection(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Edit {selectedSection?.replace(/-/g, ' ')}
            </DialogTitle>
            <DialogDescription>
              Suggest changes to this section. Our team will review and apply them shortly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="max-h-[60vh] overflow-y-auto space-y-4 px-1">
              {Object.keys(formValues).length > 0 ? (
                Object.entries(formValues).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium capitalize text-foreground">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    {value.length > 100 ? (
                      <textarea
                        value={value}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full min-h-[100px] px-3 py-2 bg-muted/30 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No editable text fields found in this section.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
