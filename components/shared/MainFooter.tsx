import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MainFooter() {
  return (
    <footer className="py-12 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EstabWeb. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
