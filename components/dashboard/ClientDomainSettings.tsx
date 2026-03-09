"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Globe, Loader2, ExternalLink, Info, CheckCircle2, XCircle, Clock, RefreshCw, Lock } from "lucide-react"

interface ClientDomainSettingsProps {
  projectId: string
  subdomain: string | null
  customDomain: string | null
  rootDomain?: string
  subscriptionStatus?: string | null
  subscriptionEnd?: string | null
}

export default function ClientDomainSettings({
  projectId,
  subdomain,
  customDomain,
  rootDomain = "estabweb.com",
  subscriptionStatus,
  subscriptionEnd,
}: ClientDomainSettingsProps) {
  const isPro = subscriptionStatus === 'active' || subscriptionStatus === 'trial' || subscriptionStatus === 'admin_granted'
  const isExpired = subscriptionEnd ? new Date(subscriptionEnd) < new Date() : false
  const hasProAccess = isPro && !isExpired
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [activated, setActivated] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [domainStatus, setDomainStatus] = useState<null | { status: 'verified' | 'pending' | 'invalid'; error?: string }>(null)
  const router = useRouter()

  const subdomainUrl = subdomain ? `https://${subdomain}.${rootDomain}` : null

  const handleCheckStatus = async () => {
    setStatusLoading(true)
    setDomainStatus(null)
    try {
      const res = await fetch(`/api/domain/status?projectId=${projectId}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setDomainStatus({ status: 'invalid', error: data.error || 'Could not fetch status' })
      } else {
        setDomainStatus({ status: data.status })
      }
    } catch {
      setDomainStatus({ status: 'invalid', error: 'Network error' })
    } finally {
      setStatusLoading(false)
    }
  }

  const handleActivate = async () => {
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
        toast.error(data.error || "Failed to activate domain")
        return
      }
      setActivated(true)
      toast.success("Custom domain activated successfully!")
      router.refresh()
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

        {customDomain && (
          <div className="space-y-2">
            <button
              onClick={handleCheckStatus}
              disabled={statusLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-border rounded-xl bg-background hover:bg-muted/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {statusLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Check Verification Status
            </button>
            {domainStatus && (
              <div className={`flex items-start gap-2 p-3 rounded-xl border text-xs ${domainStatus.status === 'verified'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : domainStatus.status === 'invalid'
                  ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                {domainStatus.status === 'verified' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                {domainStatus.status === 'invalid' && <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                {domainStatus.status === 'pending' && <Clock className="w-4 h-4 shrink-0 mt-0.5" />}
                <div>
                  {domainStatus.status === 'verified' && (
                    <p className="font-semibold">Domain verified! Your custom domain is active and properly configured.</p>
                  )}
                  {domainStatus.status === 'pending' && (
                    <p className="font-semibold">Pending — DNS records not yet detected. It can take up to 48 hours to propagate.</p>
                  )}
                  {domainStatus.status === 'invalid' && (
                    <>
                      <p className="font-semibold">Invalid configuration — DNS records are incorrect or missing.</p>
                      {domainStatus.error && <p className="mt-0.5 opacity-80">{domainStatus.error}</p>}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Set custom domain */}
      {!customDomain && (
        <div className="space-y-3">
          <div className="h-px bg-border" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Connect a Custom Domain</p>
            <p className="text-xs text-muted-foreground">
              Own a domain? Connect it to your site instantly.
            </p>
          </div>

          {!hasProAccess ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
              <Lock className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">
                Custom domains require an active paid plan. Upgrade to connect your own domain.
              </p>
            </div>
          ) : activated ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <Info className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">
                Domain activated! Point your domain's CNAME to{" "}
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
                onKeyDown={(e) => { if (e.key === "Enter") handleActivate() }}
                disabled={loading}
              />
              <button
                onClick={handleActivate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Activate"}
              </button>
            </div>
          )}

          {hasProAccess && <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <p className="text-[11px] font-semibold text-muted-foreground">DNS Records to add at your domain provider</p>
            </div>
            <table className="w-full text-[11px] text-muted-foreground">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-semibold pb-1 pr-2">Type</th>
                  <th className="text-left font-semibold pb-1 pr-2">Name / Host</th>
                  <th className="text-left font-semibold pb-1">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pt-1 pr-2 font-mono font-semibold">CNAME</td>
                  <td className="pt-1 pr-2 font-mono">www</td>
                  <td className="pt-1 font-mono">cname.vercel-dns.com</td>
                </tr>
                <tr>
                  <td className="pt-1 pr-2 font-mono font-semibold">A</td>
                  <td className="pt-1 pr-2 font-mono">@</td>
                  <td className="pt-1 font-mono">216.198.79.1</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-muted-foreground">Use the <span className="font-mono font-semibold">CNAME</span> for subdomains (e.g. www) and the <span className="font-mono font-semibold">A</span> record for apex/root domains (e.g. yourdomain.com).</p>
          </div>}
        </div>
      )}

      {customDomain && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <p className="text-[11px] font-semibold text-muted-foreground">Your custom domain is active. Ensure these DNS records are set:</p>
          </div>
          <table className="w-full text-[11px] text-muted-foreground">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold pb-1 pr-2">Type</th>
                <th className="text-left font-semibold pb-1 pr-2">Name / Host</th>
                <th className="text-left font-semibold pb-1">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pt-1 pr-2 font-mono font-semibold">CNAME</td>
                <td className="pt-1 pr-2 font-mono">www</td>
                <td className="pt-1 font-mono">cname.vercel-dns.com</td>
              </tr>
              <tr>
                <td className="pt-1 pr-2 font-mono font-semibold">A</td>
                <td className="pt-1 pr-2 font-mono">@</td>
                <td className="pt-1 font-mono">216.198.79.1</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* SEO Tip */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 space-y-2 mt-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-widest">Google Search Indexing (SEO)</h4>
        </div>
        <p className="text-xs leading-relaxed">
          <strong>Automatic Setup:</strong> We automatically generate a valid <code className="bg-blue-500/20 px-1 py-0.5 rounded">sitemap.xml</code> and <code className="bg-blue-500/20 px-1 py-0.5 rounded">robots.txt</code> file for your custom domain, so your website is technically capable of being crawled by search engines right out of the box.
        </p>
        <p className="text-xs leading-relaxed mt-2 border-t border-blue-500/20 pt-2">
          <strong>Best Practice:</strong> To ensure Google indexes your website quickly, we highly recommend claiming your domain on <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-600 dark:hover:text-blue-400">Google Search Console</a> and manually submitting your sitemap link (<code className="bg-blue-500/20 px-1 py-0.5 rounded">{customDomain ? `https://${customDomain}/sitemap.xml` : "https://yourdomain.com/sitemap.xml"}</code>).
        </p>
      </div>

    </div>
  )
}
