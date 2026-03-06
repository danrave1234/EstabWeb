"use client";

import Image from "next/image";
import { StarIcon } from "@phosphor-icons/react";

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
    <section id="testimonials" className="bg-background reveal">
      {/* Trusted By strip — subtle, matches light theme */}
      <div className="bg-transparent border-y border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="font-serif text-center text-xs sm:text-sm text-muted-foreground mb-8 tracking-widest uppercase">
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

          <div className="group relative bg-background border border-border/40 rounded-[3rem] p-10 sm:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] max-w-4xl mx-auto overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex justify-center gap-1.5 mb-10 sm:mb-16 relative z-10">
              {[...Array(testimonial.rating)].map((_, i) => (
                <StarIcon
                  key={i}
                  weight="fill"
                  className="w-6 h-6 sm:w-10 sm:h-10 text-primary transform group-hover:scale-110 transition-transform duration-500 delay-[calc(i*100ms)]"
                  aria-hidden
                />
              ))}
            </div>

            <blockquote className="text-center mb-12 sm:mb-16 relative z-10">
              <p className="font-serif text-xl sm:text-3xl md:text-4xl font-black text-foreground leading-[1.3] tracking-tight italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </blockquote>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {isExternalAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] object-cover border-4 border-background shadow-2xl relative z-10"
                  />
                ) : (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={96}
                    height={96}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] object-cover border-4 border-background shadow-2xl relative z-10"
                  />
                )}
              </div>
              <div className="text-center sm:text-left">
                <div className="font-serif text-xl sm:text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {testimonial.author}
                </div>
                <div className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mt-1">
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
