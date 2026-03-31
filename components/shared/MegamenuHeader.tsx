"use client";

import { useEffect, useState } from "react";
import {
  type LucideIcon,
  Home,
  Info,
  Phone,
  Star,
  FileText,
  LayoutTemplate,
  Menu,
} from "lucide-react";
import { Header3, type LinkItem } from "@/components/ui/header-3";

export type MegamenuNavItem = {
  name: string;
  href: string;
};

export type MegamenuHeaderProps = {
  brandName: string;
  logoUrl?: string;
  navigation: MegamenuNavItem[];
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
  const isPreview =
    query.includes("preview=true") ||
    query.includes("projectId=") ||
    query.includes("requestId=");
  let basePrefix = "";
  if (
    isPreview &&
    (query.includes("projectId=") || query.includes("requestId="))
  ) {
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

export default function MegamenuHeader({
  brandName,
  logoUrl,
  navigation,
  ctaText = "Get Started",
  ctaHref = "#contact",
}: MegamenuHeaderProps) {
  const [previewState, setPreviewState] = useState<PreviewState>({
    query: "",
    isPreview: false,
    basePrefix: "",
  });

  useEffect(() => {
    setPreviewState(derivePreviewState());
  }, []);

  const buildHref = (href: string) => {
    const effectiveState = previewState;
    if (!href || href.startsWith("#")) return href;
    const basePrefix =
      effectiveState.basePrefix &&
      href.startsWith("/") &&
      !href.startsWith(effectiveState.basePrefix)
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

  const linkItems: LinkItem[] = normalizedNavigation.map((item) => ({
    title: item.name,
    href: buildHref(item.href),
    icon: getIconForNav(item.name),
  }));

  return (
    <Header3
      brandName={brandName}
      logoUrl={logoUrl}
      logoHref={buildHref("/")}
      linkItems={linkItems}
      ctaText={ctaText}
      ctaHref={buildHref(ctaHref)}
    />
  );
}
