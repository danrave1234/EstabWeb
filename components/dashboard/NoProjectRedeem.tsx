"use client"

import * as React from 'react'
import { Key } from 'lucide-react'
import { toast } from 'sonner'

export default function NoProjectRedeem() {
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/codes/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to redeem')
      toast.success('Template applied! Creating your project...')
      window.location.reload()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to apply code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-muted/30 border border-border rounded-2xl p-4 text-left">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-2">
        <Key className="w-3 h-3" /> Apply Template Code
      </div>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ENTER-CODE-HERE"
          className="flex-1 p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none uppercase"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded text-[10px] font-bold disabled:opacity-50"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </form>
    </div>
  )
}
