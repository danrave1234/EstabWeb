import React from "react"
import { sanitizeCustomSectionCss, sanitizeCustomSectionHtml } from "@/lib/security/custom-section-sanitizer"

interface CustomHtmlSectionProps {
  title?: string
  subtitle?: string
  html?: string
  css?: string
}

export default function CustomHtmlSection({
  title,
  subtitle,
  html,
  css,
}: CustomHtmlSectionProps) {
  const safeHtml = sanitizeCustomSectionHtml(html)
  const safeCss = sanitizeCustomSectionCss(css)

  if (!safeHtml) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground">Custom section is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate this section with AI, then review and publish.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {(title || subtitle) && (
          <header className="max-w-3xl">
            {title ? <h2 className="text-3xl font-black tracking-tight text-foreground">{title}</h2> : null}
            {subtitle ? <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p> : null}
          </header>
        )}

        {safeCss ? <style dangerouslySetInnerHTML={{ __html: safeCss }} /> : null}

        <div
          className="custom-html-section text-foreground"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </section>
  )
}
