"use client"

import { useState } from "react"
import { CreditCard, Lock, Loader2, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Props {
  projectId: string
  subdomain: string
  isInitial: boolean
}

export default function SubscribeCardForm({ projectId, subdomain, isInitial }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amount = isInitial ? '₱5,000' : '₱500'
  const label = isInitial ? 'Initial Setup + First Month' : 'Monthly Renewal'

  async function handleSubscribe() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/paymongo/setup-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
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
              <p className="text-3xl font-black">{amount}</p>
              <p className="text-xs opacity-75 mt-0.5">{label}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs opacity-75">
              <Lock className="w-3 h-3" />
              Secured by PayMongo
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

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
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing checkout…
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Pay {amount} via PayMongo
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Your payment is processed securely by PayMongo.
          </div>
        </div>
      </div>
    </div>
  )
}
