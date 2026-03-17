"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackLead } from "@/components/shared/Analytics";

export type NavItem = {
  name: string;
  href: string;
  icon?: string;
};

export type HeaderProps = {
  brandName: string;
  logoUrl?: string;
  navigation: NavItem[];
  ctaText?: string;
  ctaHref?: string;
  headerStyle?: "sticky" | "static" | "solid" | "floating";
};

export default function Header({
  brandName,
  logoUrl,
  navigation,
  ctaText = "Contact",
  ctaHref = "#contact",
  headerStyle = "sticky",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewState, setPreviewState] = useState({ query: "", isPreview: false, basePrefix: "" });

  const derivePreviewState = () => {
    if (typeof window === "undefined") {
      return { query: "", isPreview: false, basePrefix: "" };
    }
    const query = window.location.search || "";
    const isPreview = query.includes("preview=true") || query.includes("projectId=") || query.includes("requestId=");
    let basePrefix = "";
    if (isPreview && (query.includes("projectId=") || query.includes("requestId="))) {
      const segments = window.location.pathname.split("/").filter(Boolean);
      if (segments.length >= 1) {
        basePrefix = `/${segments[0]}`;
      }
    }
    return { query, isPreview, basePrefix };
  };

  useEffect(() => {
    setPreviewState(derivePreviewState());
  }, []);

  const buildHref = (href: string) => {
    const effectiveState = previewState;
    if (!href || href.startsWith("#")) return href;
    const basePrefix = effectiveState.basePrefix && href.startsWith("/") && !href.startsWith(effectiveState.basePrefix)
      ? effectiveState.basePrefix
      : "";
    if (!effectiveState.isPreview && basePrefix) return `${basePrefix}${href}`;
    if (!effectiveState.isPreview) return href;
    if (href.startsWith("/")) {
      const [path, hash] = `${basePrefix}${href}`.split("#");
      const hasQuery = path.includes("?");
      const next = `${path}${hasQuery ? "&" : "?"}${effectiveState.query.replace(/^\?/, "")}`;
      return hash ? `${next}#${hash}` : next;
    }
    return href;
  };

  const isInternalRoute = (href: string) => href.startsWith("/");

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const mobileNavId = "site-mobile-nav";

  const LogoContent = () => (
    <Link href={buildHref("/")} className="flex items-center gap-3 shrink-0 group">
      {logoUrl ? (
        logoUrl.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={brandName}
            width={40}
            height={40}
            className="object-contain w-10 h-10"
            style={{ background: "transparent" }}
          />
        ) : (
          <Image
            src={logoUrl}
            alt={brandName}
            width={40}
            height={40}
            className="object-contain"
            style={{ background: "transparent" }}
          />
        )
      ) : (
        <div className="w-10 h-10 border-2 border-primary/20 rounded-xl flex items-center justify-center group-hover:border-primary/40 transition-colors">
          <span className="text-primary font-bold text-sm">
            {initials}
          </span>
        </div>
      )}
      <span className="font-serif font-bold text-lg tracking-tight text-foreground hidden sm:inline">
        {brandName}
      </span>
    </Link>
  );

  const DesktopNav = () => (
    <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
      {navigation.map((item) => (
        isInternalRoute(item.href) ? (
          <Link
            key={item.name}
            href={buildHref(item.href)}
            className="font-serif px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors rounded-lg flex items-center gap-2"
          >
            {item.icon && <DynamicIcon name={item.icon} className="w-4 h-4" />}
            {item.name}
          </Link>
        ) : (
          <a
            key={item.name}
            href={buildHref(item.href)}
            className="font-serif px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors rounded-lg flex items-center gap-2"
          >
            {item.icon && <DynamicIcon name={item.icon} className="w-4 h-4" />}
            {item.name}
          </a>
        )
      ))}
    </nav>
  );

  const CtaButton = ({ className }: { className?: string }) => {
    if (!ctaText) return null;
    const base = `font-serif px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors ${className ?? ""}`;
    return isInternalRoute(ctaHref) ? (
      <Link href={buildHref(ctaHref)} className={base}>
        {ctaText}
      </Link>
    ) : (
      <a
        href={buildHref(ctaHref)}
        onClick={() => {
          if (ctaHref.startsWith("tel:")) trackLead("call");
        }}
        className={base}
      >
        {ctaText}
      </a>
    );
  };

  const MobileMenuButton = () => (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label={mobileOpen ? "Close menu" : "Open menu"}
      aria-expanded={mobileOpen}
      aria-controls={mobileNavId}
      className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-foreground hover:bg-muted transition-colors"
    >
      {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  const MobileNav = ({ extraClass }: { extraClass?: string }) => (
    mobileOpen ? (
      <div className={`md:hidden ${extraClass ?? "border-t border-border bg-background"}`}>
        <nav id={mobileNavId} aria-label="Mobile Primary" className="px-4 py-4 flex flex-col gap-1">
          {navigation.map((item) => (
            isInternalRoute(item.href) ? (
              <Link
                key={item.name}
                href={buildHref(item.href)}
                onClick={() => setMobileOpen(false)}
                className="font-serif py-3 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {item.icon && <DynamicIcon name={item.icon} className="w-4 h-4" />}
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={buildHref(item.href)}
                onClick={() => setMobileOpen(false)}
                className="font-serif py-3 px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {item.icon && <DynamicIcon name={item.icon} className="w-4 h-4" />}
                {item.name}
              </a>
            )
          ))}
          {ctaText && (
            isInternalRoute(ctaHref) ? (
              <Link
                href={buildHref(ctaHref)}
                onClick={() => setMobileOpen(false)}
                className="font-serif mt-2 py-3 px-4 bg-primary text-primary-foreground text-center font-semibold rounded-xl hover:bg-primary/90"
              >
                {ctaText}
              </Link>
            ) : (
              <a
                href={buildHref(ctaHref)}
                onClick={() => {
                  setMobileOpen(false);
                  if (ctaHref.startsWith("tel:")) trackLead("call");
                }}
                className="font-serif mt-2 py-3 px-4 bg-primary text-primary-foreground text-center font-semibold rounded-xl hover:bg-primary/90"
              >
                {ctaText}
              </a>
            )
          )}
        </nav>
      </div>
    ) : null
  );

  /* ── Resolve sticky vs static (support legacy "solid"/"floating" values) */
  const isSticky = headerStyle === "sticky" || headerStyle === "solid" || headerStyle === "floating";

  /* ── Unified header bar ───────────────────────────────────────────── */
  return (
    <header
      data-section-id="brand"
      className={`z-50 w-full bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 ${
        isSticky ? "sticky top-0" : "relative"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <LogoContent />
          <DesktopNav />
          <div className="hidden md:flex items-center gap-3">
            <CtaButton />
          </div>
          <MobileMenuButton />
        </div>
      </div>
      <MobileNav />
    </header>
  );
}
