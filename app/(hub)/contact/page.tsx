import type { Metadata } from "next";
import React from 'react';
import MainHeader from '@/components/shared/MainHeader';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the EstabWeb team for support, sales, or partnership inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MainHeader initialUser={user} />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">We&apos;re here to help you build the perfect website for your business.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Email Us</h3>
                <p className="text-muted-foreground">danravekeh123@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Call Us</h3>
                <p className="text-muted-foreground">09999834196</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Location</h3>
                <p className="text-muted-foreground">Philippines</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
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
              <span className="font-bold tracking-tight">EstabWeb</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 EstabWeb. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
