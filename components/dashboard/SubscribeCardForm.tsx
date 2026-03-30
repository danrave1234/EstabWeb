"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, Loader2, ShieldCheck, AlertCircle, ExternalLink, ArrowLeft, Tag, CheckCircle2, X } from "lucide-react"
import { toast } from "sonner"
import { resolveAmountFromPlans } from "@/lib/plans-config"

interface Props {
  projectId: string
  subdomain: string
  isInitial: boolean
  planId: string
  interval?: string
  initialPlansConfig: {
    PLANS: any
    ENABLE_ANNUAL_PLANS: boolean
  }
}

interface AppliedPromo {
  id: string
  code: string
  description: string | null
  plan_id: string
  months: number
}

const PLAN_LABELS: Record<string, string> = {
  basic: "Starter",
  pro: "Business",
  ecommerce: "Ecommerce",
  custom: "Custom",
}

export default function SubscribeCardForm({ projectId, subdomain, isInitial, planId, interval = 'monthly', initialPlansConfig }: Props) {
  const { PLANS } = initialPlansConfig
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Promo state
  const [promoInput, setPromoInput] = useState("")
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null)

  // Resolve pricing from shared config
  const plan = PLANS[planId] || PLANS.basic
  const amountVal = resolveAmountFromPlans(PLANS, planId, !isInitial, interval as any)
  const amount = `₱${(amountVal / 100).toLocaleString()}`
  const label = isInitial ? `Initial Setup + 1 ${interval === 'yearly' ? 'Year' : 'Month'}` : `${interval === 'yearly' ? 'Annual' : 'Monthly'} Renewal`

  async function handleValidatePromo() {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    setPromoError(null)
    setPromoLoading(true)
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, projectId }),
      })
      const data = await res.json()
      if (!res.ok) { setPromoError(data.error || 'Invalid promo code.'); return }
      setAppliedPromo(data.promo)
      setPromoInput("")
      toast.success(`Promo applied: ${data.promo.months} month${data.promo.months > 1 ? 's' : ''} of ${PLAN_LABELS[data.promo.plan_id] ?? data.promo.plan_id}`)
    } catch {
      setPromoError('Failed to validate promo code.')
    } finally {
      setPromoLoading(false)
    }
  }

  async function handlePromoRedeem() {
    if (!appliedPromo) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: appliedPromo.code, projectId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to redeem promo.')
      toast.success('Promo redeemed! Your subscription is now active.')
      router.push(`/dashboard?projectId=${projectId}`)
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.')
      toast.error(e?.message || 'Promo redemption failed')
      setLoading(false)
    }
  }

  async function handleSubscribe() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/paymongo/setup-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, planId, interval }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
      window.location.href = data.checkoutUrl
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.')
      toast.error(e?.message || 'Payment setup failed')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border border-border rounded-2xl bg-card shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium opacity-80 uppercase tracking-widest">Subscribe</p>
              <p className="font-bold text-lg">{subdomain}.estabweb.com</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              {appliedPromo ? (
                <>
                  <p className="text-3xl font-black">Free</p>
                  <p className="text-xs opacity-75 mt-0.5">{appliedPromo.months} month{appliedPromo.months > 1 ? 's' : ''} · {PLAN_LABELS[appliedPromo.plan_id] ?? appliedPromo.plan_id} plan</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-black">{amount}</p>
                  <p className="text-xs opacity-75 mt-0.5">{label}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs opacity-75">
              <Lock className="w-3 h-3" />
              {appliedPromo ? 'Promo applied' : 'Secured by PayMongo'}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Promo Code Section */}
          {!appliedPromo ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 bg-muted/50 border rounded-lg text-sm uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none placeholder:normal-case placeholder:tracking-normal"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidatePromo()}
                  disabled={promoLoading}
                />
                <button
                  type="button"
                  onClick={handleValidatePromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-4 py-2 text-sm font-semibold bg-muted hover:bg-muted/80 border rounded-lg transition-colors disabled:opacity-50 shrink-0"
                >
                  {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {promoError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 font-mono">{appliedPromo.code}</p>
                  {appliedPromo.description && <p className="text-xs text-muted-foreground">{appliedPromo.description}</p>}
                </div>
              </div>
              <button
                onClick={() => setAppliedPromo(null)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Remove promo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="border-t pt-4 space-y-3">
            {appliedPromo ? (
              <>
                <button
                  onClick={handlePromoRedeem}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Activating…</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Activate with Promo</>
                  )}
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  No payment required — promo covers {appliedPromo.months} month{appliedPromo.months > 1 ? 's' : ''} of {PLAN_LABELS[appliedPromo.plan_id] ?? appliedPromo.plan_id}.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  You will be redirected to PayMongo&apos;s secure checkout page to complete your payment.
                  Accepted: <span className="font-medium text-foreground">Card, GCash, Maya</span>
                </p>
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Preparing checkout…</>
                  ) : (
                    <><ExternalLink className="w-4 h-4" /> Pay {amount} via PayMongo</>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Your payment is processed securely by PayMongo.
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => router.push(`/dashboard?projectId=${projectId}`)}
            disabled={loading}
            className="w-full py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-sm text-muted-foreground font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
