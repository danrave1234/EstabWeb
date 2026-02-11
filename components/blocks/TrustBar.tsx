"use client";

import Image from "next/image";

export type TrustBarLogo = {
  name: string;
  width?: number;
  logoUrl?: string;
};

export type TrustBarTestimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
};

export type TrustBarProps = {
  label: string;
  logos: TrustBarLogo[];
  testimonial: TrustBarTestimonial;
};

function LogoPlaceholder({ width = 120 }: { width?: number }) {
  return (
    <svg
      width={width}
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
      aria-hidden
    >
      <rect x="10" y="8" width="24" height="24" fill="currentColor" />
      <rect x="38" y="12" width="16" height="16" fill="currentColor" />
      <circle cx="70" cy="20" r="12" fill="currentColor" />
      <path d="M85 8 L97 8 L91 32 L79 32 Z" fill="currentColor" />
    </svg>
  );
}

export default function TrustBar({
  label,
  logos,
  testimonial,
}: TrustBarProps) {
  // Use public images only; avatar should be e.g. /images/avatar.jpg
  const isExternalAvatar = testimonial.avatar.startsWith("http");

  return (
    <section id="testimonials" className="bg-background">
      {/* Trusted By strip — subtle, matches light theme */}
      <div className="bg-muted/50 border-y border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-8 tracking-widest uppercase">
            {label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-16 sm:gap-y-8">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="grayscale opacity-70 hover:opacity-90 transition-opacity h-6 sm:h-8 flex items-center"
              >
                {logo.logoUrl ? (
                  logo.logoUrl.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.logoUrl}
                      alt={logo.name}
                      width={logo.width ?? 120}
                      height={24}
                      className="h-6 sm:h-8 w-auto max-h-6 sm:max-h-8 object-contain object-center"
                    />
                  ) : (
                    <Image
                      src={logo.logoUrl}
                      alt={logo.name}
                      width={logo.width ?? 120}
                      height={32}
                      className="h-6 sm:h-8 w-auto object-contain"
                    />
                  )
                ) : (
                  <span className="text-muted-foreground scale-75 sm:scale-100">
                    <LogoPlaceholder width={logo.width} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured testimonial */}
      <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mx-auto">

        <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <i
                key={i}
                className="fa-solid fa-star text-primary text-xl w-5 h-5 opacity-90"
                aria-hidden
              />
            ))}
          </div>

          <blockquote className="text-center mb-8">
            <p className="text-lg sm:text-xl md:text-2xl text-foreground leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            {isExternalAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            )}
            <div className="text-left">
              <div className="font-semibold text-foreground">
                {testimonial.author}
              </div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
