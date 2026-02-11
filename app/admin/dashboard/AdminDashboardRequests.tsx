"use client"

import * as React from "react"
import { format } from "date-fns"
import { Eye, Check, X, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { processChangeRequest } from "@/app/actions/admin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

interface AdminRequestsClientProps {
  initialRequests: any[]
}

export default function AdminDashboardRequests({ initialRequests }: AdminRequestsClientProps) {
  const [requests, setRequests] = React.useState(initialRequests)
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [adminNote, setAdminNote] = React.useState("")
  const [showRejectForm, setShowRejectForm] = React.useState(false)

  const handleAction = async (requestId: string, action: 'approved' | 'rejected') => {
    if (action === 'rejected' && !showRejectForm) {
      setShowRejectForm(true)
      return
    }

    setIsProcessing(true)
    try {
      const result = await processChangeRequest(requestId, action, adminNote)

      if (result.error) throw new Error(result.error)

      toast.success(`Request ${action} successfully`)
      setRequests(prev => prev.filter(r => r.id !== requestId))
      setSelectedRequest(null)
      setAdminNote("")
      setShowRejectForm(false)
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} request`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="rounded-md border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client / Email</TableHead>
              <TableHead>Project Subdomain</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No pending requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} className="cursor-pointer" onClick={() => setSelectedRequest(request)}>
                  <TableCell>
                    <div className="font-medium text-foreground">{request.projects?.name || 'Unknown Project'}</div>
                    <div className="text-xs text-muted-foreground">{request.profiles?.email}</div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                      {request.projects?.subdomain || 'no-subdomain'}
                    </code>
                  </TableCell>
                  <TableCell className="capitalize">
                    {request.section_id.replace(/-/g, ' ')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(request.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      className="p-2 hover:bg-muted rounded-full transition-colors text-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRequest(request)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => {
        if (!open) {
          setSelectedRequest(null)
          setShowRejectForm(false)
          setAdminNote("")
        }
      }}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Review Change Request</DialogTitle>
            <DialogDescription>
              Comparing current live content with the requested changes.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="flex-1 overflow-y-auto py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Current Live Content
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-4">
                    {(() => {
                      const sectionId = selectedRequest.section_id
                      const sectionKey = sectionId === 'hero-emergency' ? 'heroEmergency' : 
                                         sectionId === 'practice-areas' ? 'practiceAreas' :
                                         sectionId === 'attorney-profile' ? 'attorneyProfile' :
                                         sectionId === 'free-consultation' ? 'freeConsultation' :
                                         sectionId === 'how-it-works' ? 'howItWorks' :
                                         sectionId === 'review-trust-bar' ? 'reviewTrustBar' :
                                         sectionId === 'feature-highlight' ? 'featureHighlight' :
                                         sectionId === 'team-carousel' ? 'teamCarousel' :
                                         sectionId === 'patient-faq' ? 'patientFaq' :
                                         sectionId === 'pricing' ? 'pricingTable' :
                                         sectionId === 'awards' ? 'awardsStrip' :
                                         sectionId;
                      const currentSectionData = selectedRequest.projects?.current_config?.[sectionKey] || {}
                      
                      return Object.entries(selectedRequest.requested_changes).map(([key, _]) => (
                        <div key={key} className="space-y-1">
                          <div className="text-[10px] font-bold uppercase text-muted-foreground">{key}</div>
                          <div className="text-sm line-through opacity-50">{currentSectionData[key] || '(empty)'}</div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>

                {/* Requested Changes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md text-xs font-bold uppercase tracking-wider text-primary">
                    Requested Changes
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-4">
                    {Object.entries(selectedRequest.requested_changes).map(([key, value]: [string, any]) => (
                      <div key={key} className="space-y-1">
                        <div className="text-[10px] font-bold uppercase text-primary/70">{key}</div>
                        <div className="text-sm font-medium text-foreground">{value || '(empty)'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {showRejectForm && (
                <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-bold text-red-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Reason for Rejection (Optional)
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. Please provide a higher quality image or check the spelling."
                    className="w-full min-h-[100px] p-3 text-sm border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-border mt-auto">
            {showRejectForm ? (
              <>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-6 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => handleAction(selectedRequest.id, 'rejected')}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAction(selectedRequest.id, 'rejected')}
                  className="flex items-center gap-2 px-6 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-all"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleAction(selectedRequest.id, 'approved')}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
                >
                  {isProcessing ? 'Approving...' : (
                    <>
                      <Check className="w-4 h-4" />
                      Approve & Go Live
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
