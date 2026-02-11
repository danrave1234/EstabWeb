"use client";

import { useState } from "react";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram, Phone, MapPin, Mail } from "lucide-react";

export type FooterSocial = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
          {/* Left - Logo & Social (Font Awesome icons) */}
          <div className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
            <div className="flex items-center space-x-2">
              {logoUrl ? (
                logoUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain w-10 h-10"
                  />
                ) : (
                  <Image
                    src={logoUrl}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain"
                  />
                )
              ) : (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">
                    {initials}
                  </span>
                </div>
              )}
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {brandName}
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {tagline}
            </p>

            <div className="flex justify-center lg:justify-start space-x-4">
              {social.facebook && (
                <a
                  href={social.facebook}
                  className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" aria-hidden />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" aria-hidden />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" aria-hidden />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" aria-hidden />
                </a>
              )}
            </div>
          </div>

          {/* Center - Lead form */}
          <div className="flex flex-col space-y-5 bg-muted/30 p-5 rounded-2xl lg:bg-transparent lg:p-0">
            <h3 className="text-lg font-bold tracking-tight text-foreground text-center lg:text-left">
              {formHeading}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 max-w-sm mx-auto lg:mx-0">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all duration-200"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all duration-200"
              />
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full min-h-[40px] sm:min-h-[44px] px-6 py-2 sm:py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
              >
                {isSubmitted ? formThankYouText : formSubmitText}
              </button>
            </form>
          </div>

          {/* Right - Contact (Font Awesome icons) */}
          <div className="flex flex-col space-y-8">
            <h3 className="text-xl font-bold tracking-tight text-foreground text-center lg:text-left">
              Contact Us
            </h3>

            <a href={`tel:${phoneHref}`} className="group block w-full max-w-[280px] sm:max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Call us now</p>
                  <p className="text-lg sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {contact.phone}
                  </p>
                </div>
              </div>
            </a>

            <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden />
                </div>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line pt-1">
                  {contact.address}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-muted-foreground" aria-hidden />
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors pt-1"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
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
                Privacy Policy
              </a>
              <a
                href={termsUrl}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href={cookieUrl}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
