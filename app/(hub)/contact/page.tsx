import type { Metadata } from "next";
import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@phosphor-icons/react/ssr";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the EstabWeb team for support, sales, or partnership inquiries.",
  alternates: {
    canonical: "https://www.estabweb.com/contact",
  },
};

export default async function ContactPage() {
  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-24 lg:py-32 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          {/* Header Area */}
          <div className="lg:col-span-12 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20 mb-3">
              Get in Touch
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Let&apos;s Build Something <span className="text-primary">Great.</span>
            </h1>
          </div>

          {/* Contact Info Bento Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-5 bg-primary text-primary-foreground rounded-[24px] flex flex-col justify-between min-h-[120px] shadow-lg shadow-primary/10">
              <EnvelopeIcon weight="duotone" className="w-6 h-6 opacity-60" />
              <div>
                <h3 className="text-xs font-bold">Email Us</h3>
                <p className="text-[11px] opacity-90 font-medium truncate">contact@estabweb.com</p>
              </div>
            </div>

            <div className="p-5 bg-muted/30 border border-border rounded-[24px] flex flex-col justify-between min-h-[120px]">
              <PhoneIcon weight="duotone" className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xs font-bold">Call Us</h3>
                <p className="text-[11px] text-muted-foreground font-medium">09999834196</p>
              </div>
            </div>

            <div className="p-5 bg-muted/30 border border-border rounded-[24px] flex flex-col justify-between min-h-[120px]">
              <MapPinIcon weight="duotone" className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xs font-bold">Location</h3>
                <p className="text-[11px] text-muted-foreground font-medium">Philippines</p>
              </div>
            </div>

            <div className="p-5 bg-muted/30 border border-border rounded-[24px] flex flex-col justify-between min-h-[120px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Office</h3>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold">Mon - Fri</p>
                <p className="text-[10px] text-muted-foreground">9AM - 6PM</p>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7 bg-background border border-border p-5 lg:p-7 rounded-[24px] shadow-sm flex flex-col">
            <form className="flex-1 flex flex-col h-full">
              <div className="flex-1 grid grid-cols-2 gap-3 mb-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 px-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/20 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 px-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/20 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div className="col-span-2 flex-1 flex flex-col min-h-[150px]">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 px-1">Message</label>
                  <textarea className="flex-1 w-full px-4 py-2.5 text-sm rounded-xl bg-muted/20 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" placeholder="How can we help you today?"></textarea>
                </div>
              </div>
              <div className="mt-auto pt-2">
                <button type="submit" className="w-auto px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
