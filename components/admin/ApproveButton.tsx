"use client"

import * as React from 'react'
import { toast } from 'sonner'

export default function ApproveButton({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false)
  return (
    <button
      onClick={async () => {
        setLoading(true)
        try {
          const res = await fetch(`/api/change-requests/${id}/approve`, { method: 'POST' })
          const json = await res.json().catch(() => ({}))
          if (!res.ok) throw new Error(json.error || 'Approval failed')
          toast.success('Approved and published')
          window.location.reload()
        } catch (e: any) {
          toast.error(e?.message || 'Approval failed')
        } finally {
          setLoading(false)
        }
      }}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-50"
    >
      {loading ? 'Approving…' : 'Approve'}
    </button>
  )
}
