export type SupportRequestType = 'bug' | 'problem' | 'template_request' | 'help' | 'other'
export type SupportRequestStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export const SUPPORT_TYPE_LABELS: Record<SupportRequestType, string> = {
  bug: 'Bug Report',
  problem: 'Problem',
  template_request: 'Template Request',
  help: 'Help',
  other: 'Other',
}

export const SUPPORT_STATUS_LABELS: Record<SupportRequestStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const SUPPORT_STATUS_STYLES: Record<SupportRequestStatus, string> = {
  open: 'bg-amber-500/10 text-amber-700',
  in_progress: 'bg-blue-500/10 text-blue-700',
  resolved: 'bg-emerald-500/10 text-emerald-700',
  closed: 'bg-zinc-500/10 text-zinc-700',
}

export const SUPPORT_STATUS_ORDER: SupportRequestStatus[] = ['open', 'in_progress', 'resolved', 'closed']
