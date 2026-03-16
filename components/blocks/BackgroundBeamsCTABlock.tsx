import { BackgroundBeams } from "@/components/ui/background-beams"

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
  return (
    <div className="relative w-full min-h-[36rem] flex flex-col items-center justify-center antialiased overflow-hidden bg-background">
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground mb-6">
          {title}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-8">
          {subtitle}
        </p>
        {showEmailInput ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <input
              type="email"
              placeholder={inputPlaceholder}
              className="flex h-10 w-full sm:w-72 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 h-10 text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {ctaText}
            </a>
          </div>
        ) : (
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-8 h-11 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
      <BackgroundBeams />
    </div>
  )
}
