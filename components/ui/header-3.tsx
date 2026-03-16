"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { createPortal } from "react-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { LucideIcon } from "lucide-react";

export type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export type Header3Props = {
  brandName: string;
  logoUrl?: string;
  logoHref?: string;
  linkItems: LinkItem[];
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
};

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
}

function MegamenuListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    <NavigationMenuLink
      className={cn(
        "w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2",
        className,
      )}
      {...props}
      asChild
    >
      <Link href={href}>
        <div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
          <Icon className="text-foreground size-5" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          {description && (
            <span className="text-muted-foreground text-xs">{description}</span>
          )}
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function Header3({
  brandName,
  logoUrl,
  logoHref = "/",
  linkItems,
  ctaText = "Get Started",
  ctaHref = "#contact",
  secondaryCtaText,
  secondaryCtaHref,
}: Header3Props) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasLinks = linkItems.length > 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent",
        {
          "bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg":
            scrolled,
        },
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link
            href={logoHref}
            className="hover:bg-accent rounded-md p-2 flex items-center gap-2"
            aria-label={brandName}
          >
            {logoUrl ? (
              logoUrl.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={brandName}
                  width={32}
                  height={32}
                  className="object-contain h-8 w-auto"
                />
              ) : (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={32}
                  height={32}
                  className="object-contain h-8 w-auto"
                />
              )
            ) : (
              <div className="w-8 h-8 border-2 border-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xs">{initials}</span>
              </div>
            )}
            <span className="font-semibold text-sm hidden sm:inline">
              {brandName}
            </span>
          </Link>
          {hasLinks && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Menu
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background p-1 pr-1.5">
                    <ul className="bg-popover grid w-lg grid-cols-2 gap-2 rounded-md border p-2 shadow">
                      {linkItems.map((item, i) => (
                        <li key={i}>
                          <MegamenuListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    {ctaText && (
                      <div className="p-2">
                        <p className="text-muted-foreground text-sm">
                          Ready?{" "}
                          <Link
                            href={ctaHref}
                            className="text-foreground font-medium hover:underline"
                          >
                            {ctaText}
                          </Link>
                        </p>
                      </div>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {secondaryCtaText && secondaryCtaHref && (
            <Button variant="outline" asChild>
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
          {ctaText && (
            <Button asChild>
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>
          )}
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>
      <MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-2">
            {hasLinks && (
              <>
                <span className="text-sm font-medium">Menu</span>
                {linkItems.map((link) => (
                  <MegamenuListItem key={link.title} {...link} />
                ))}
              </>
            )}
          </div>
        </NavigationMenu>
        <div className="flex flex-col gap-2">
          {secondaryCtaText && secondaryCtaHref && (
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={secondaryCtaHref}>{secondaryCtaText}</Link>
            </Button>
          )}
          {ctaText && (
            <Button className="w-full" asChild>
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>
          )}
        </div>
      </MobileMenu>
    </header>
  );
}
