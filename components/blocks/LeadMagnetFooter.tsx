"use client";

import { useState } from "react";
import Image from "next/image";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@phosphor-icons/react";
import { SocialIcon } from "@/components/shared/SocialIcon";

export type FooterSocial = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebookEnabled?: boolean;
  twitterEnabled?: boolean;
  linkedinEnabled?: boolean;
  instagramEnabled?: boolean;
  showSocial?: boolean;
  showContact?: boolean;
};

export type LeadMagnetFooterProps = {
  brandName: string;
  logoUrl?: string;
  tagline: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  formHeading: string;
  formSubmitText: string;
  formThankYouText: string;
  social: FooterSocial;
  privacyUrl: string;
  termsUrl: string;
  cookieUrl: string;
  contactUsLabel?: string;
  callUsNowLabel?: string;
  privacyLabel?: string;
  termsLabel?: string;
  cookieLabel?: string;
};

export default function LeadMagnetFooter({
  brandName,
  logoUrl,
  tagline,
  contact,
  formHeading,
  formSubmitText,
  formThankYouText,
  social,
  privacyUrl,
  termsUrl,
  cookieUrl,
  contactUsLabel = "Contact Us",
  callUsNowLabel = "Call us now",
  privacyLabel = "Privacy Policy",
  termsLabel = "Terms of Service",
  cookieLabel = "Cookie Policy",
}: LeadMagnetFooterProps) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "" });
    }, 3000);
  };

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const phoneHref = contact.phone.replace(/\s/g, "");

  return (
    <footer id="contact" className="w-full bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16 lg:gap-8">
          {/* Left - Logo & Social (Font Awesome icons) */}
          <div className="flex flex-col items-center lg:items-start space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="flex items-center space-x-2">
              {logoUrl ? (
                logoUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={brandName}
                    width={32}
                    height={32}
                    className="rounded-lg object-contain w-8 h-8 sm:w-10 sm:h-10"
                  />
                ) : (
                  <Image
                    src={logoUrl}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain w-8 h-8 sm:w-10 sm:h-10"
                  />
                )
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    {initials}
                  </span>
                </div>
              )}
              <span className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                {brandName}
              </span>
            </div>

            <p className="text-muted-foreground text-[10px] sm:text-sm leading-relaxed max-w-xs">
              {tagline}
            </p>

            {social.showSocial !== false && (
              <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
                {social.facebook && social.facebookEnabled !== false && (
                  <a
                    href={social.facebook}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <SocialIcon brand="facebook" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
                  </a>
                )}
                {social.twitter && social.twitterEnabled !== false && (
                  <a
                    href={social.twitter}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                    aria-label="Twitter"
                  >
                    <SocialIcon brand="twitter" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
                  </a>
                )}
                {social.linkedin && social.linkedinEnabled !== false && (
                  <a
                    href={social.linkedin}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <SocialIcon brand="linkedin" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
                  </a>
                )}
                {social.instagram && social.instagramEnabled !== false && (
                  <a
                    href={social.instagram}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <SocialIcon brand="instagram" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Center - Lead form */}
          <div className="flex flex-col space-y-4 sm:space-y-5 bg-muted/30 p-4 sm:p-5 rounded-2xl lg:bg-transparent lg:p-0">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground text-center lg:text-left uppercase tracking-widest text-xs">
              {formHeading}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 w-full max-w-sm mx-auto lg:mx-0">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full min-h-[36px] sm:min-h-[44px] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all duration-200"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full min-h-[36px] sm:min-h-[44px] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all duration-200"
              />
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full min-h-[36px] sm:min-h-[44px] px-6 py-2 sm:py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-xs sm:text-base"
              >
                {isSubmitted ? formThankYouText : formSubmitText}
              </button>
            </form>
          </div>

          {/* Right - Contact (Font Awesome icons) */}
          {social.showContact !== false && (
            <div className="flex flex-col space-y-6 sm:space-y-8">
              <h3 className="text-base sm:text-xl font-bold tracking-tight text-foreground text-center lg:text-left uppercase tracking-widest text-xs">
                {contactUsLabel}
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-6">
                <a href={`tel:${phoneHref}`} className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/20 border border-border hover:border-primary transition-all">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{callUsNowLabel}</p>
                    <p className="text-[9px] sm:text-base font-bold text-foreground truncate">{contact.phone}</p>
                  </div>
                </a>

                <a href={`mailto:${contact.email}`} className="group flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/20 border border-border hover:border-primary transition-all">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <EnvelopeIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email us</p>
                    <p className="text-[9px] sm:text-base font-bold text-foreground truncate">{contact.email}</p>
                  </div>
                </a>

                <div className="col-span-2 lg:col-span-1 flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/10 border border-border/50">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPinIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[7px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Our office</p>
                    <p className="text-[9px] sm:text-sm font-medium text-foreground line-clamp-1">{contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <a
                href={privacyUrl}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {privacyLabel}
              </a>
              <a
                href={termsUrl}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {termsLabel}
              </a>
              <a
                href={cookieUrl}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {cookieLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
