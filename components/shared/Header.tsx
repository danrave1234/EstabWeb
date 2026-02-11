"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
};

export type HeaderProps = {
  brandName: string;
  logoUrl?: string;
  navigation: NavItem[];
  ctaText?: string;
  ctaHref?: string;
  headerStyle?: "solid" | "floating";
};

export default function Header({
  brandName,
  logoUrl,
  navigation,
  ctaText = "Contact",
  ctaHref = "#contact",
  headerStyle = "solid",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isFloating = headerStyle === "floating";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isFloating
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5"
          : "bg-background/95 backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 shrink-0 group">
            {logoUrl ? (
              logoUrl.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={brandName}
                  width={40}
                  height={40}
                  className="rounded-xl object-contain w-10 h-10"
                />
              ) : (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={40}
                  height={40}
                  className="rounded-xl object-contain"
                />
              )
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {initials}
                </span>
              </div>
            )}
            <span className="font-bold text-lg tracking-tight text-foreground hidden sm:inline">
              {brandName}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors rounded-lg"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {ctaText && (
              <a
                href={ctaHref}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-foreground hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            {ctaText && (
              <a
                href={ctaHref}
                onClick={() => setMobileOpen(false)}
                className="mt-2 py-3 px-4 bg-primary text-primary-foreground text-center font-semibold rounded-xl hover:bg-primary/90"
              >
                {ctaText}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
