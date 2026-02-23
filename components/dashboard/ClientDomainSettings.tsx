"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Globe, Loader2, ExternalLink, Info } from "lucide-react"

interface ClientDomainSettingsProps {
  projectId: string
  subdomain: string | null
  customDomain: string | null
  rootDomain?: string
}

export default function ClientDomainSettings({
  projectId,
  subdomain,
  customDomain,
  rootDomain = "estabweb.com",
}: ClientDomainSettingsProps) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const subdomainUrl = subdomain ? `https://${subdomain}.${rootDomain}` : null

  const handleRequest = async () => {
    const trimmed = value.trim().toLowerCase().replace(/^https?:\/\//, "")
    if (!trimmed) {
      toast.error("Please enter a domain name")
      return
    }
    // Basic domain format validation
    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/.test(trimmed)) {
      toast.error("Invalid domain format. Example: myrestaurant.com")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/domain/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, customDomain: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to submit request")
        return
      }
      setSubmitted(true)
      toast.success("Domain request submitted! The admin will review it shortly.")
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Domain Settings</h3>
          <p className="text-xs text-muted-foreground">Manage your website's domain</p>
        </div>
      </div>

      {/* Current domains */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-foreground">Subdomain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {subdomain ? `${subdomain}.${rootDomain}` : "Not assigned yet"}
            </span>
            {subdomainUrl && (
              <a href={subdomainUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${customDomain ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
            <span className="text-xs font-medium text-foreground">Custom Domain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {customDomain || "Not set"}
            </span>
            {customDomain && (
              <a href={`https://${customDomain}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Request custom domain */}
      {!customDomain && (
        <div className="space-y-3">
          <div className="h-px bg-border" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Request a Custom Domain</p>
            <p className="text-xs text-muted-foreground">
              Own a domain? Connect it to your site. Your admin will review and activate it.
            </p>
          </div>

          {submitted ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <Info className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">
                Request submitted! Once approved, point your domain's CNAME to{" "}
                <span className="font-mono">cname.vercel-dns.com</span>.
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="myrestaurant.com"
                className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                onKeyDown={(e) => { if (e.key === "Enter") handleRequest() }}
                disabled={loading}
              />
              <button
                onClick={handleRequest}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request"}
              </button>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 border border-border">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              After approval, add a <span className="font-mono font-semibold">CNAME</span> record at your DNS provider pointing to{" "}
              <span className="font-mono font-semibold">cname.vercel-dns.com</span>. For apex domains, use an <span className="font-mono font-semibold">A</span> record pointing to{" "}
              <span className="font-mono font-semibold">76.76.21.21</span>.
            </p>
          </div>
        </div>
      )}

      {customDomain && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 border border-border">
          <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your custom domain is active. Make sure your DNS has a <span className="font-mono font-semibold">CNAME</span> record pointing to{" "}
            <span className="font-mono font-semibold">cname.vercel-dns.com</span>. Contact support to change your domain.
          </p>
        </div>
      )}
    </div>
  )
}
