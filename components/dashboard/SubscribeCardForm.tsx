"use client"

import { useState } from "react"
import { CreditCard, Lock, Loader2, ShieldCheck, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Props {
  projectId: string
  subdomain: string
  isInitial: boolean
}

interface CardState {
  number: string
  expiry: string
  expMonth: string
  expYear: string
  cvc: string
  name: string
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(raw: string, prev: string): string {
  // Allow backspace: if shrinking, just strip trailing slash
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length === 0) return ''
  if (digits.length <= 2) {
    // Auto-insert slash after 2 digits unless user is deleting
    if (digits.length === 2 && raw.length > prev.length) return digits + '/'
    return digits
  }
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

export default function SubscribeCardForm({ projectId, subdomain, isInitial }: Props) {
  const [card, setCard] = useState<CardState>({ number: '', expiry: '', expMonth: '', expYear: '', cvc: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'processing' | 'redirect'>('form')

  const amount = isInitial ? '₱5,000' : '₱500'
  const label = isInitial ? 'Initial Setup + First Month' : 'Monthly Renewal'

  function handleCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
    setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))
  }

  function handleExpiry(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatExpiry(e.target.value, card.expiry)
    const parts = formatted.split('/')
    setCard(c => ({
      ...c,
      expiry: formatted,
      expMonth: parts[0] || '',
      expYear: parts[1] && parts[1].length === 2 ? '20' + parts[1] : '',
    }))
  }

  function handleCvc(e: React.ChangeEvent<HTMLInputElement>) {
    setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setStep('processing')

    try {
      // Step 1: Setup subscription server-side → get clientKey + paymentIntentId + publicKey
      const setupRes = await fetch('/api/paymongo/setup-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          successUrl: `${window.location.origin}/dashboard?projectId=${projectId}&payment_success=true`,
        }),
      })
      const setup = await setupRes.json()
      if (!setupRes.ok) throw new Error(setup.error || 'Setup failed')

      const { clientKey, paymentIntentId, publicKey, returnUrl } = setup

      // Step 2: Create PaymentMethod via PayMongo public API (card data never touches our server)
      const rawNumber = card.number.replace(/\s/g, '')
      const pmRes = await fetch('https://api.paymongo.com/v1/payment_methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(publicKey + ':')}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              type: 'card',
              details: {
                card_number: rawNumber,
                exp_month: parseInt(card.expMonth, 10),
                exp_year: parseInt(card.expYear, 10),
                cvc: card.cvc,
              },
              billing: {
                name: card.name,
              },
            },
          },
        }),
      })
      const pmJson = await pmRes.json()
      if (!pmRes.ok) {
        const msg = pmJson?.errors?.[0]?.detail || pmJson?.errors?.[0]?.title || 'Card error'
        throw new Error(String(msg))
      }
      const paymentMethodId = pmJson?.data?.id
      if (!paymentMethodId) throw new Error('No payment method ID returned')

      // Step 3: Attach payment method to payment intent (server-side, keeps secret key safe)
      const attachRes = await fetch('/api/paymongo/attach-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, paymentMethodId, returnUrl }),
      })
      const attachJson = await attachRes.json()
      if (!attachRes.ok) throw new Error(attachJson.error || 'Attach failed')

      const { status, nextActionUrl } = attachJson

      if (status === 'succeeded') {
        // Payment succeeded without 3DS
        setStep('redirect')
        window.location.href = returnUrl
        return
      }

      if (status === 'awaiting_next_action' && nextActionUrl) {
        // Redirect for 3DS authentication
        setStep('redirect')
        window.location.href = nextActionUrl
        return
      }

      throw new Error(`Unexpected payment status: ${status}`)
    } catch (e: any) {
      setError(e?.message || 'Payment failed. Please try again.')
      setStep('form')
      toast.error(e?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'redirect') {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-4 p-8">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto" />
        <p className="text-sm text-muted-foreground">Redirecting to secure authentication…</p>
      </div>
    )
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cardholder Name
            </label>
            <input
              type="text"
              required
              placeholder="Juan dela Cruz"
              value={card.name}
              onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={handleCardNumber}
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                disabled={loading}
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Expiry (MM/YY)
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={handleExpiry}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                disabled={loading}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                CVC
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="123"
                value={card.cvc}
                onChange={handleCvc}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-widest transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay {amount} Securely
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Card details are sent directly to PayMongo. We never store your card number.
          </div>
        </form>
      </div>
    </div>
  )
}
