'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, LightningIcon, DeviceMobileIcon, ShieldCheckIcon, LayoutIcon, GlobeIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useAuth } from '@/components/providers/AuthProvider'
import MainHeader from '@/components/shared/MainHeader'

export default function LandingPageClient({ initialUser }: { initialUser: SupabaseUser | null }) {
  const { user, loading } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden reveal">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--primary)/10,transparent)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                The Future of Local Business Web
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Launch Your Professional <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Website in Minutes.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Stop fighting with complex builders. EstabWeb provides high-performance, industry-specific sites that are fully managed and optimized for growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-sm mx-auto">
                <Link
                  href="/login?mode=signup"
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Start Building
                  <ArrowRightIcon weight="duotone" className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex-1 px-6 py-3 bg-background border border-border rounded-full text-sm font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  See How
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats/Social Proof */}
        <section className="py-12 sm:py-24 border-y border-border bg-muted/30 reveal">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {[
                { label: 'Time to Live', value: '< 1 Hour', color: 'text-primary' },
                { label: 'Industries', value: '12+', color: 'text-amber-500' },
                { label: 'Uptime', value: '99.9%', color: 'text-blue-500' },
              ].map((stat) => (
                <div 
                  key={stat.label} 
                  className="p-3 sm:p-6 bg-background border border-border rounded-2xl flex flex-col justify-center items-center text-center shadow-sm"
                >
                  <div className={`text-2xl sm:text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground line-clamp-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 sm:py-32 bg-background reveal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Built for <span className="text-primary">Performance.</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">Everything you need to dominate your local market without the technical headache.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[
                {
                  icon: <LightningIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Lightning Fast',
                  desc: 'Next.js 15 powered sites that load instantly, boosting your SEO and user experience.',
                  className: 'col-span-1'
                },
                {
                  icon: <DeviceMobileIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Mobile First',
                  desc: 'Perfectly responsive designs that look incredible on every device, from phones to desktops.',
                  className: 'col-span-1'
                },
                {
                  icon: <ShieldCheckIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Secure & Managed',
                  desc: 'No plugins to update or databases to hack. We handle the hosting and security for you.',
                  className: 'col-span-1'
                },
                {
                  icon: <LayoutIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Proven Presets',
                  desc: 'Start with layouts engineered for conversions in your specific industry.',
                  className: 'col-span-1'
                },
                {
                  icon: <GlobeIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Global Delivery',
                  desc: 'Your site is deployed to the edge, ensuring sub-second load times anywhere in the world.',
                  className: 'col-span-1'
                },
                {
                  icon: <CheckCircleIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'SEO Optimized',
                  desc: 'Automatic sitemaps, meta tags, and structured data to help you rank higher on Google.',
                  className: 'col-span-1'
                }
              ].map((feature, i) => (
                <div key={i} className={`p-4 sm:p-6 bg-muted/30 rounded-2xl border border-border hover:border-primary/20 transition-all group flex flex-col justify-between ${feature.className}`}>
                  <div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-background rounded-lg sm:rounded-xl flex items-center justify-center text-primary mb-3 sm:mb-4 shadow-sm border border-border group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-primary leading-tight">{feature.title}</h3>
                    <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-40 reveal">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to transform your online presence?</h2>
                <p className="text-lg opacity-90">Join the next generation of local businesses building with EstabWeb.</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-sm mx-auto">
                  <Link
                    href="/login?mode=signup"
                    className="flex-1 px-6 py-3 bg-white text-primary rounded-full text-sm font-bold hover:scale-105 transition-all shadow-xl flex items-center justify-center"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 px-6 py-3 bg-primary-foreground/10 border border-white/20 rounded-full text-sm font-bold hover:bg-white/20 transition-all flex items-center justify-center"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
