import type { FooterSocial } from "./LeadMagnetFooter";
import Image from "next/image";

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
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:gap-12 px-4 sm:px-6 py-10 sm:py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-6 flex flex-col items-center text-center md:items-start md:text-left">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">{initials}</span>
              </div>
            )}
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              {brandName}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">{tagline}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            {navigation?.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-foreground"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-xl gap-10 sm:grid-cols-2">
          {social.showContact !== false && (
            <div className="space-y-4 text-sm text-muted-foreground flex flex-col items-center text-center sm:items-start sm:text-left">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                {contactLabel}
              </h3>
              <a href={`tel:${phoneHref}`} className="block hover:text-foreground">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block hover:text-foreground">
                {contact.email}
              </a>
              <p className="whitespace-pre-line">{contact.address}</p>
            </div>
          )}

          <div className="space-y-4 text-sm text-muted-foreground flex flex-col items-center text-center sm:items-start sm:text-left">
            {social.showSocial !== false && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  {followLabel}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  {social.facebook && social.facebookEnabled !== false && (
                    <a href={social.facebook} className="hover:text-foreground">
                      Facebook
                    </a>
                  )}
                  {social.twitter && social.twitterEnabled !== false && (
                    <a href={social.twitter} className="hover:text-foreground">
                      Twitter
                    </a>
                  )}
                  {social.linkedin && social.linkedinEnabled !== false && (
                    <a href={social.linkedin} className="hover:text-foreground">
                      LinkedIn
                    </a>
                  )}
                  {social.instagram && social.instagramEnabled !== false && (
                    <a href={social.instagram} className="hover:text-foreground">
                      Instagram
                    </a>
                  )}
                </div>
              </>
            )}

            <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 text-xs">
              <a href={privacyUrl} className="hover:text-foreground">
                {privacyLabel}
              </a>
              <a href={termsUrl} className="hover:text-foreground">
                {termsLabel}
              </a>
              <a href={cookieUrl} className="hover:text-foreground">
                {cookieLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-background px-4 sm:px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

