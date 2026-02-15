"use client"

import * as React from 'react'
import { Key } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function NoProjectRedeem() {
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

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
      toast.success('Template applied! Redirecting...')
      router.push(`/dashboard?projectId=${json.projectId}`)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to apply code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full sm:max-w-sm bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xl shadow-foreground/5 text-left relative overflow-hidden group transition-all hover:border-primary/20">
      <div className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 mb-2 sm:mb-3">
        <Key className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" /> 
        Redeem Design Code
      </div>
      <form onSubmit={handleApply} className="flex flex-row gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CODE"
          className="flex-1 px-3 py-2.5 text-[10px] sm:text-xs border border-border rounded-xl bg-muted/30 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none uppercase transition-all font-bold tracking-widest placeholder:text-muted-foreground/30"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-foreground text-background rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all shadow-lg active:scale-95 whitespace-nowrap"
        >
          {loading ? '...' : 'Activate'}
        </button>
      </form>
    </div>
  )
}
