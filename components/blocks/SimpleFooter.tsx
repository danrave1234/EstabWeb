"use client";

import type { FooterSocial } from "./LeadMagnetFooter";
import Image from "next/image";
import { trackLead } from "@/components/shared/Analytics";

type SimpleFooterProps = {
  brandName: string;
  logoUrl?: string;
  tagline: string;
  navigation?: { name: string; href: string }[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: FooterSocial;
  privacyUrl: string;
  termsUrl: string;
  cookieUrl: string;
  contactLabel?: string;
  followLabel?: string;
  privacyLabel?: string;
  termsLabel?: string;
  cookieLabel?: string;
};

export default function SimpleFooter({
  brandName,
  logoUrl,
  tagline,
  navigation = [],
  contact,
  social,
  privacyUrl,
  termsUrl,
  cookieUrl,
  contactLabel = "Contact",
  followLabel = "Follow",
  privacyLabel = "Privacy Policy",
  termsLabel = "Terms of Service",
  cookieLabel = "Cookie Policy",
}: SimpleFooterProps) {
  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const phoneHref = contact.phone.replace(/\s/g, "");

  return (
    <footer className="w-full border-t border-border bg-background/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center text-center md:col-span-4 md:items-start md:text-left space-y-6">
            <div className="flex items-center space-x-2">
              {logoUrl ? (
                logoUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-contain"
                  />
                ) : (
                  <Image
                    src={logoUrl}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-contain"
                  />
                )
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary/20">
                  <span className="text-xl font-bold text-primary">{initials}</span>
                </div>
              )}
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                {brandName}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              {tagline}
            </p>
            <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
              {navigation?.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:col-span-8 md:gap-8">
            {social.showContact !== false && (
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-4">
                <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-foreground">
                  {contactLabel}
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <a href={`tel:${phoneHref}`} onClick={() => trackLead('call')} className="block hover:text-foreground transition-colors">
                    {contact.phone}
                  </a>
                  <a href={`mailto:${contact.email}`} onClick={() => trackLead('form')} className="block hover:text-foreground transition-colors">
                    {contact.email}
                  </a>
                  <p className="whitespace-pre-line leading-relaxed">{contact.address}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-4">
              {social.showSocial !== false && (
                <>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-foreground">
                    {followLabel}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
                    {social.facebook && social.facebookEnabled !== false && (
                      <a href={social.facebook} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Facebook
                      </a>
                    )}
                    {social.twitter && social.twitterEnabled !== false && (
                      <a href={social.twitter} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Twitter
                      </a>
                    )}
                    {social.linkedin && social.linkedinEnabled !== false && (
                      <a href={social.linkedin} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        LinkedIn
                      </a>
                    )}
                    {social.instagram && social.instagramEnabled !== false && (
                      <a href={social.instagram} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Instagram
                      </a>
                    )}
                  </div>
                </>
              )}

              <nav aria-label="Legal" className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:justify-start">
                <a href={privacyUrl} className="hover:text-foreground transition-colors">
                  {privacyLabel}
                </a>
                <a href={termsUrl} className="hover:text-foreground transition-colors">
                  {termsLabel}
                </a>
                <a href={cookieUrl} className="hover:text-foreground transition-colors">
                  {cookieLabel}
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
