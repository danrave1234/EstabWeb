import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Smartphone, Shield, Layout, Globe, CheckCircle2, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import MainHeader from '@/components/shared/MainHeader'
import StructuredData from '@/components/shared/StructuredData'

export default async function EstabWebLanding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const faqs = [
    {
      q: "How fast can I really launch a website?",
      a: "Once you choose a template and provide your basic business info, our system generates your site instantly. You can be live on a custom domain in less than an hour."
    },
    {
      q: "Do I need to know how to code?",
      a: "Not at all. EstabWeb is built for business owners, not developers. We handle all the technical details, hosting, and updates so you can focus on your business."
    },
    {
      q: "Can I use my own domain name?",
      a: "Yes! Our plans support custom domains (like yourbusiness.com). We even help you with the DNS setup."
    },
    {
      q: "Is the hosting included?",
      a: "Yes, high-performance managed hosting is included in every plan. Your site is deployed to a global CDN for lightning-fast speeds."
    },
    {
      q: "How does the SEO optimization work?",
      a: "We automatically generate technical SEO elements like sitemaps, meta tags, and JSON-LD structured data. Our templates are also built with clean, semantic HTML that search engines love."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }}
      />
      <MainHeader initialUser={user} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden reveal">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--primary)/10,transparent)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                The Future of Local Business Web
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Launch Your Professional <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Website in Minutes.</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stop fighting with complex builders. EstabWeb provides high-performance, industry-specific sites that are fully managed and optimized for growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  href="/login?mode=signup" 
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Start Building Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="w-full sm:w-auto px-8 py-4 bg-background border border-border rounded-full text-lg font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  See How it Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats/Social Proof */}
        <section className="py-12 border-y border-border bg-muted/30 reveal">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Speed Score', value: '99/100' },
                { label: 'Time to Live', value: '< 1 Hour' },
                { label: 'Industries', value: '12+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-background reveal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Built for <span className="text-primary">Performance.</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to dominate your local market without the technical headache.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: 'Lightning Fast',
                  desc: 'Next.js 15 powered sites that load instantly, boosting your SEO and user experience.'
                },
                {
                  icon: <Smartphone className="w-6 h-6" />,
                  title: 'Mobile First',
                  desc: 'Perfectly responsive designs that look incredible on every device, from phones to desktops.'
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Secure & Managed',
                  desc: 'No plugins to update or databases to hack. We handle the hosting and security for you.'
                },
                {
                  icon: <Layout className="w-6 h-6" />,
                  title: 'Proven Presets',
                  desc: 'Start with layouts engineered for conversions in your specific industry.'
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: 'Global Delivery',
                  desc: 'Your site is deployed to the edge, ensuring sub-second load times anywhere in the world.'
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  title: 'SEO Optimized',
                  desc: 'Automatic sitemaps, meta tags, and structured data to help you rank higher on Google.'
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-muted/30 rounded-2xl border border-border hover:border-primary/20 transition-colors group">
                  <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center text-primary mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-muted/30 reveal">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-center mb-16">Frequently Asked <span className="text-primary">Questions.</span></h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                      <span className="text-primary">Q:</span>
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-8">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 reveal">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-12 lg:p-20 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to transform your online presence?</h2>
                <p className="text-lg opacity-90">Join the next generation of local businesses building with EstabWeb.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link 
                    href="/login?mode=signup" 
                    className="w-full sm:w-auto px-10 py-4 bg-white text-primary rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/contact" 
                    className="w-full sm:w-auto px-10 py-4 bg-primary-foreground/10 border border-white/20 rounded-full text-lg font-bold hover:bg-white/20 transition-all"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
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
              <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 EstabWeb. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
