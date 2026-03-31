"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { type LucideIcon, Home, Info, Phone, Star, FileText, LayoutTemplate, Menu } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { cn } from "@/lib/utils";

export type TubelightNavItem = {
  name: string;
  href: string;
};

export type TubelightHeaderProps = {
  brandName: string;
  logoUrl?: string;
  navigation: TubelightNavItem[];
  ctaText?: string;
  ctaHref?: string;
};

type PreviewState = {
  query: string;
  isPreview: boolean;
  basePrefix: string;
};

function derivePreviewState(): PreviewState {
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
}

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  services: LayoutTemplate,
  service: LayoutTemplate,
  about: Info,
  "about us": Info,
  testimonials: Star,
  reviews: Star,
  contact: Phone,
  pricing: FileText,
  blog: FileText,
};

function normalizeNavField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getIconForNav(name: string): LucideIcon {
  const key = normalizeNavField(name).toLowerCase();
  return NAV_ICON_MAP[key] ?? Menu;
}

export default function TubelightHeader({
  brandName,
  logoUrl,
  navigation,
  ctaText = "Contact",
  ctaHref = "#contact",
}: TubelightHeaderProps) {
  const [previewState, setPreviewState] = useState<PreviewState>({ query: "", isPreview: false, basePrefix: "" });

  useEffect(() => {
    setPreviewState(derivePreviewState());
  }, []);

  const buildHref = (href: string) => {
    const effectiveState = previewState;
    if (!href || href.startsWith("#")) return href;
    const basePrefix =
      effectiveState.basePrefix && href.startsWith("/") && !href.startsWith(effectiveState.basePrefix)
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

  const normalizedNavigation = Array.isArray(navigation)
    ? navigation.map((item) => ({
        name: normalizeNavField(item?.name),
        href: normalizeNavField(item?.href),
      }))
    : [];

  const navItems = normalizedNavigation.map((item) => ({
    name: item.name,
    url: buildHref(item.href),
    icon: getIconForNav(item.name),
  }));

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header data-section-id="brand" className="sr-only">
        <span>{brandName}</span>
      </header>
      <Link
        href={buildHref("/")}
        className={cn(
          "fixed z-50 top-6 left-6 flex items-center gap-2 shrink-0 group",
          "text-foreground hover:text-primary transition-colors"
        )}
        aria-label={brandName}
      >
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
              className="object-contain w-10 h-10"
              style={{ background: "transparent" }}
            />
          )
        ) : (
          <div className="w-10 h-10 border-2 border-primary/20 rounded-xl flex items-center justify-center group-hover:border-primary/40 transition-colors">
            <span className="text-primary font-bold text-sm">{initials}</span>
          </div>
        )}
        <span className="font-semibold text-sm hidden sm:inline">{brandName}</span>
      </Link>
      <NavBar items={navItems} />
      {ctaText && (
        <Link
          href={buildHref(ctaHref)}
          className={cn(
            "fixed z-50 top-6 right-6 sm:top-6 sm:right-6",
            "inline-flex items-center justify-center rounded-full px-5 py-2.5",
            "text-sm font-semibold bg-primary text-primary-foreground",
            "hover:bg-primary/90 shadow-lg border border-border/50 backdrop-blur-sm",
            "transition-colors"
          )}
        >
          {ctaText}
        </Link>
      )}
    </>
  );
}

