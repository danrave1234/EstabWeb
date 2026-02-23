"use client"

import { useState } from "react"
import { CreditCard, Calendar, ShieldCheck, AlertCircle, RefreshCw, XCircle } from "lucide-react"
import { toggleAutoRenew, cancelSubscription } from "@/app/actions/subscription"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import UpgradeButton from "@/components/dashboard/UpgradeButton"

interface SubscriptionSettingsProps {
  project: {
    id: string
    subscription_status?: string | null
    subscription_ends_at?: string | null
    auto_renew?: boolean
    has_paid_initial?: boolean
    renewal_link?: string | null
    renewal_link_created_at?: string | null
  }
}

export default function SubscriptionSettings({ project }: SubscriptionSettingsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const status = project.subscription_status || "free"
  const isPaid = status === "active" || status === "admin_granted"
  const endsAt = project.subscription_ends_at ? new Date(project.subscription_ends_at) : null
  const autoRenew = project.auto_renew ?? true
  const hasPaidInitial = project.has_paid_initial ?? false

  const handleToggleAutoRenew = async () => {
    setLoading(true)
    const result = await toggleAutoRenew(project.id, !autoRenew)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(autoRenew ? "Auto-renew disabled" : "Auto-renew enabled")
      router.refresh()
    }
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.")) {
      return
    }
    setLoading(true)
    const result = await cancelSubscription(project.id)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Subscription cancelled. Auto-renew is now off.")
      router.refresh()
    }
  }

  const renewalLink = project.renewal_link

  return (
    <div className="space-y-6">
      {renewalLink && (
        <div className="p-4 border border-blue-500/30 bg-blue-500/5 rounded-xl flex gap-3 items-start">
          <RefreshCw className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-blue-700">Your subscription is expiring soon</p>
            <p className="text-xs text-blue-600/80 leading-relaxed">
              Your auto-renew payment link is ready. Click below to complete your monthly renewal and keep your site active.
            </p>
            <button
              onClick={() => { window.location.href = `/subscribe/${project.id}` }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Renew Subscription
            </button>
          </div>
        </div>
      )}
      <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPaid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold capitalize">
                {status === 'active' ? (hasPaidInitial ? 'Pro Monthly Plan' : 'Pro Setup Plan') : status === 'free' ? 'Free Plan' : status.replace('_', ' ')}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {hasPaidInitial ? '₱500 / month' : '₱5,000 Setup Fee'}
              </p>
            </div>
          </div>
          {isPaid && (
             <div className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
               Active
             </div>
          )}
        </div>

        {isPaid && endsAt && (
          <div className="pt-4 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-muted-foreground" />
               <span className="text-xs text-muted-foreground">
                 {autoRenew ? 'Next billing date:' : 'Expires on:'} <b>{endsAt.toLocaleDateString()}</b>
               </span>
             </div>
             {autoRenew && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  Auto-renews
                </div>
             )}
          </div>
        )}
      </div>

      {isPaid && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
            <div className="space-y-1">
              <p className="text-sm font-bold">Auto-Subscription</p>
              <p className="text-xs text-muted-foreground">Automatically charge your payment method when the period ends.</p>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoRenew ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRenew ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-700">Cancel Subscription</p>
              <p className="text-xs text-amber-600/80 leading-relaxed">
                If you cancel, your site will remain active until <b>{endsAt?.toLocaleDateString()}</b>. 
                After that, it will revert to the Free plan and publishing will require admin approval.
              </p>
              <button
                onClick={handleCancel}
                disabled={loading || !autoRenew}
                className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-3 h-3" />
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {!isPaid && (
        <div className="p-6 text-center space-y-4 border border-dashed border-border rounded-xl">
          <Sparkles className="w-8 h-8 text-primary mx-auto opacity-20" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Unlock Direct Publishing</p>
            <p className="text-xs text-muted-foreground">
              {hasPaidInitial 
                ? "Continue with our recurring plan for only ₱500/month." 
                : "Get started with our Pro plan for ₱5,000 (Initial Setup)."}
            </p>
          </div>
          <UpgradeButton 
            projectId={project.id} 
            subscriptionStatus={status} 
            variant="inline"
          />
        </div>
      )}
    </div>
  )
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
