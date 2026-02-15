import React from 'react'
import { Eye, Info } from 'lucide-react'

export default function PreviewBanner() {
  return (
    <div className="bg-emerald-600 text-white py-2 px-4 flex items-center justify-center gap-4 text-sm font-medium sticky top-0 z-[100] shadow-md">
      <div className="flex items-center gap-2 shrink-0">
        <Eye className="w-4 h-4 shrink-0" />
        <span className="truncate">Preview Mode: Viewing unsaved changes</span>
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-emerald-700/50 px-3 py-0.5 rounded-full text-[11px] border border-emerald-500/30 min-w-0">
        <Info className="w-3 h-3 shrink-0" />
        <span className="truncate">Changes here are local to your browser until you click "Save Draft" in the dashboard.</span>
      </div>
    </div>
  )
}
