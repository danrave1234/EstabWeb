"use client";

import type { FooterSocial } from "./LeadMagnetFooter";
import Image from "next/image";
import { trackLead } from "@/components/shared/Analytics";

type MinimalFooterProps = {
  brandName: string;
  logoUrl?: string;
  tagline: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: FooterSocial;
  privacyUrl: string;
  termsUrl: string;
  cookieUrl: string;
};

export default function MinimalFooter({
  brandName,
  logoUrl,
  tagline,
  contact,
  social,
  privacyUrl,
  termsUrl,
  cookieUrl,
}: MinimalFooterProps) {
  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <footer className="w-full border-t border-border bg-background/95">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 sm:px-6 py-10 sm:py-12 text-center">
        <div className="flex items-center space-x-2">
          {logoUrl ? (
            logoUrl.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={brandName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
              />
            ) : (
              <Image
                src={logoUrl}
                alt={brandName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
              />
            )
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">{initials}</span>
            </div>
          )}
          <span className="text-base font-semibold tracking-tight text-foreground">
            {brandName}
          </span>
        </div>

        <p className="max-w-2xl text-sm text-muted-foreground">
          {tagline}
        </p>

        {social.showContact !== false && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
            {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, "")}`} onClick={() => trackLead('call')} className="hover:text-primary transition-colors">{contact.phone}</a>}
            {contact.email && <a href={`mailto:${contact.email}`} onClick={() => trackLead('form')} className="hover:text-primary transition-colors">{contact.email}</a>}
            {contact.address && <span>{contact.address}</span>}
          </div>
        )}

        {social.showSocial !== false && (
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {social.facebook && social.facebookEnabled !== false && <a href={social.facebook} className="hover:text-primary transition-colors">Facebook</a>}
            {social.twitter && social.twitterEnabled !== false && <a href={social.twitter} className="hover:text-primary transition-colors">Twitter</a>}
            {social.linkedin && social.linkedinEnabled !== false && <a href={social.linkedin} className="hover:text-primary transition-colors">LinkedIn</a>}
            {social.instagram && social.instagramEnabled !== false && <a href={social.instagram} className="hover:text-primary transition-colors">Instagram</a>}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
          <a href={privacyUrl} className="hover:text-foreground">
            Privacy
          </a>
          <a href={termsUrl} className="hover:text-foreground">
            Terms
          </a>
          <a href={cookieUrl} className="hover:text-foreground">
            Cookies
          </a>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

