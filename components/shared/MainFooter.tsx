import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MainFooter() {
  return (
    <footer className="py-24 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between md:gap-8 mb-10 sm:mb-0">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/Logo.svg"
                alt="EstabWeb Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold tracking-tight text-foreground">EstabWeb</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Building the next generation of local business websites.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col items-center gap-6 sm:flex-row sm:gap-x-12 sm:gap-y-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            <Link href="/" className="hover:text-primary transition-colors py-2 px-4">Home</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors py-2 px-4">Pricing</Link>
            <Link href="/contact" className="hover:text-primary transition-colors py-2 px-4">Contact</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors py-2 px-4 whitespace-nowrap">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors py-2 px-4 whitespace-nowrap">Terms of Service</Link>
          </nav>

          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 border-t border-border/50 pt-10 w-full md:w-auto md:border-0 md:pt-0 text-center">
            © {new Date().getFullYear()} EstabWeb. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
