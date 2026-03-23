"use client"

import { useState } from "react"
import { toast } from "sonner"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { submitFormLead } from "@/components/shared/Analytics"

type BackgroundBeamsCTABlockProps = {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  inputPlaceholder?: string
  showEmailInput?: boolean
}

export default function BackgroundBeamsCTABlock({
  title = "Ready to get started?",
  subtitle = "Join hundreds of local businesses that launched their site with us. Fast setup, professional results.",
  ctaText = "Get Started",
  ctaHref = "#contact",
  inputPlaceholder = "Enter your email",
  showEmailInput = false,
}: BackgroundBeamsCTABlockProps) {
  const [email, setEmail] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showEmailInput) return
    const trimmed = email.trim()
    if (!trimmed) return
    setErr(null)
    setSubmitting(true)
    const result = await submitFormLead(
      undefined,
      { email: trimmed, name: "CTA beams signup" },
      "cta--beams",
    )
    setSubmitting(false)
    if (result.ok) {
      setDone(true)
      setEmail("")
      toast.success("Successfully joined!")
    } else {
      setErr(result.error || "Could not send. Try again.")
    }
  }

  return (
    <div className="relative w-full min-h-[36rem] flex flex-col items-center justify-center antialiased overflow-hidden bg-background">
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 className="mb-6 break-words bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mb-8 max-w-lg break-words text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
        {showEmailInput ? (
          <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-2">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder={inputPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setDone(false)
                }}
                required
                disabled={submitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-72"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 text-center text-sm font-medium text-primary-foreground transition-colors whitespace-normal hover:bg-primary/90 sm:w-auto sm:whitespace-nowrap disabled:opacity-60"
              >
                {done ? "Thanks!" : submitting ? "Sending…" : ctaText}
              </button>
            </div>
            {err && (
              <p className="text-center text-sm text-destructive" role="alert">
                {err}
              </p>
            )}
          </form>
        ) : (
          <a
            href={ctaHref}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 text-center text-sm font-medium text-primary-foreground transition-colors whitespace-normal hover:bg-primary/90 sm:w-auto"
          >
            {ctaText}
          </a>
        )}
      </div>
      <BackgroundBeams />
    </div>
  )
}
