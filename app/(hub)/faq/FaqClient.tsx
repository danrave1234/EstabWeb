"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, Zap } from "lucide-react";

const FAQ_CATEGORIES = [
    {
        label: "General",
        questions: [
            {
                q: "What is EstabWeb?",
                a: "EstabWeb is an affordable website service built for local businesses in the Philippines. We provide ready-made, professionally designed templates that you can customize with your own content, photos, and branding — all managed through a simple dashboard.",
            },
            {
                q: "Do I need technical skills to use EstabWeb?",
                a: "Not at all. Our editor is designed for business owners, not developers. You can update your business name, photos, services, contact info, and more with just a few clicks — no coding required.",
            },
            {
                q: "How is EstabWeb different from website builders like Wix or Squarespace?",
                a: "EstabWeb is managed for you. Instead of building everything yourself from a blank page, you start with a professionally designed template tailored to your industry. We also handle hosting, deployment, and technical maintenance — you just focus on your business.",
            },
            {
                q: "What kinds of businesses is EstabWeb designed for?",
                a: "EstabWeb works for a wide range of local businesses — law firms, dental clinics, salons, gyms, restaurants, pest control companies, real estate agents, auto shops, and more. We offer industry-specific templates for each.",
            },
        ],
    },
    {
        label: "Pricing & Plans",
        questions: [
            {
                q: "How much does EstabWeb cost?",
                a: "There's a one-time setup fee to get your website built, plus a recurring monthly or yearly care plan to keep it live, maintained, and editable. Visit our Pricing page for the latest plan details and prices.",
            },
            {
                q: "Are there any hidden fees?",
                a: "No hidden fees. The setup price and monthly care plan are all you pay. Domain registration (if you want a custom domain like yourbusiness.com) is the only additional cost, and we guide you through that.",
            },
            {
                q: "Can I cancel anytime?",
                a: "Yes. You can cancel before your next billing cycle to stop future charges. Your website will remain live until the end of your paid period.",
            },
            {
                q: "Do you offer a free trial or free plan?",
                a: "We offer a free plan with limited features so you can explore the dashboard. To publish your site and access all features, a paid plan is required.",
            },
            {
                q: "What happens if I don't pay my monthly subscription?",
                a: "If payment fails or is not renewed, your website may be downgraded to free-tier limits — this can include restricted publishing and removal of features like custom domains. Your data is kept safe and you can reactivate anytime.",
            },
        ],
    },
    {
        label: "Website & Features",
        questions: [
            {
                q: "Can I use my own domain name (e.g. mybusiness.com)?",
                a: "Yes! On paid plans, you can connect your own custom domain. We provide step-by-step DNS instructions, and once set up, your site goes live on your domain within minutes.",
            },
            {
                q: "Can I have multiple pages on my website?",
                a: "Yes, multi-page websites are available on eligible plans. You can add pages like About, Gallery, Services, Blog, and more depending on your subscription.",
            },
            {
                q: "Can I update my website content myself?",
                a: "Absolutely. Through your dashboard's editor, you can update text, images, contact details, opening hours, promos, and more — anytime, without waiting for a developer.",
            },
            {
                q: "Are the websites mobile-friendly?",
                a: "Yes. All EstabWeb sites are fully responsive and optimized for mobile phones, tablets, and desktops out of the box.",
            },
            {
                q: "Will my website show up on Google?",
                a: "Yes. Every site includes a sitemap, robots.txt, and SEO fields (title, description, keywords) you can fill in. We also support Google Search Console verification and Bing Webmaster Tools to help search engines discover your site faster.",
            },
        ],
    },
    {
        label: "Support & Requests",
        questions: [
            {
                q: "Can I request design changes or new features?",
                a: "Yes. Depending on your plan, you can submit design update requests and our team will implement them for you. This covers layout adjustments, section additions, color changes, and more.",
            },
            {
                q: "How long does it take to get my website set up?",
                a: "Initial setup typically takes 1–3 business days after we receive your content (logo, photos, business details). Many sites go live even faster with complete information.",
            },
            {
                q: "What if I need something completely custom?",
                a: "We can accommodate fully custom designs and features beyond our standard templates. Contact us with your requirements and we'll provide a tailored proposal.",
            },
            {
                q: "How do I get support?",
                a: "You can reach us via the Contact page, email, or through your dashboard. We're available Monday to Friday, 9AM–6PM Philippine time.",
            },
        ],
    },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${open ? "bg-primary/5 border-primary/30" : "bg-background hover:border-border/80"}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open}
            >
                <span className={`text-sm font-semibold leading-snug transition-colors ${open ? "text-primary" : "text-foreground"}`}>
                    {q}
                </span>
                <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-5">
                    <div className="h-px bg-border/60 mb-4" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
            </div>
        </div>
    );
}

export default function FaqClient() {
    const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].label);
    const currentFaqs = FAQ_CATEGORIES.find((c) => c.label === activeCategory)?.questions ?? [];

    return (
        <main className="flex-1 container mx-auto px-4 py-24 lg:py-32 min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-14 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border bg-primary/10 border-primary/20">
                        Frequently Asked Questions
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
                        Got Questions? <span className="text-primary">We Have Answers.</span>
                    </h1>
                    <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Everything you need to know about EstabWeb, our plans, and how we work with local businesses in the Philippines.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {FAQ_CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveCategory(cat.label)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${activeCategory === cat.label
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-3">
                    {currentFaqs.map((item) => (
                        <FaqItem key={item.q} q={item.q} a={item.a} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 p-8 bg-muted/30 rounded-[32px] border border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg">Still have questions?</h3>
                            <p className="text-sm text-muted-foreground">Our team is ready to help you out.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/contact"
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-6 py-2.5 bg-background border border-border text-foreground rounded-full font-bold text-sm hover:bg-muted/50 transition-all flex items-center gap-2"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            View Pricing
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
