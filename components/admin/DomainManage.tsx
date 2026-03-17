"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Globe, Loader2, X, Check } from "lucide-react"
import { setCustomDomain } from "@/app/actions/admin"

interface DomainManageProps {
  project: {
    id: string
    subdomain: string | null
    custom_domain?: string | null
  }
}

export default function DomainManage({ project }: DomainManageProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(project.custom_domain || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    const trimmed = value.trim().toLowerCase().replace(/^https?:\/\//, "")
    setLoading(true)
    const result = await setCustomDomain(project.id, trimmed || null)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(trimmed ? `Custom domain set: ${trimmed}` : "Custom domain removed")
    setEditing(false)
    router.refresh()
  }

  const handleRemove = async () => {
    setLoading(true)
    const result = await setCustomDomain(project.id, null)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    setValue("")
    toast.success("Custom domain removed")
    setEditing(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <div className="flex flex-col gap-1 py-1">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {project.custom_domain || <span className="italic">No custom domain</span>}
          </span>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="self-start px-2 py-0.5 text-[10px] rounded border border-border bg-background hover:bg-muted"
        >
          {project.custom_domain ? "Change" : "Set domain"}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 py-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="acmecorp.com"
        className="w-full px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
        onKeyDown={(e) => { if (e.key === "Enter") handleSave() }}
        autoFocus
      />
      <div className="flex items-center gap-1">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          Save
        </button>
        {project.custom_domain && (
          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50"
          >
            <X className="w-3 h-3" />
            Remove
          </button>
        )}
        <button
          onClick={() => { setEditing(false); setValue(project.custom_domain || "") }}
          className="px-2 py-0.5 text-[10px] rounded border border-border bg-background hover:bg-muted"
        >
          Cancel
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Enter the bare domain (e.g. <span className="font-mono">acmecorp.com</span>). The client must set <span className="font-mono">A @</span> to <span className="font-mono">76.76.21.21</span> and <span className="font-mono">CNAME www</span> to <span className="font-mono">cname.vercel-dns.com</span>.
      </p>
    </div>
  )
}
