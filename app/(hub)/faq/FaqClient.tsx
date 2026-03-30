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
                a: "EstabWeb gives you a ready to use website for your business. We handle the design, setup, and hosting, and you can update your content anytime without needing technical skills.",
            },
            {
                q: "Do I need technical skills to use EstabWeb?",
                a: "No. It is made for business owners. You can change your text, photos, contact details, and other content in a few clicks without coding.",
            },
            {
                q: "How is EstabWeb different from website builders?",
                a: "With website builders, you usually set up everything yourself. With EstabWeb, your website starts with a ready setup and built in hosting, so you can focus on running your business while still editing your content anytime.",
            },
            {
                q: "What kinds of businesses is EstabWeb for?",
                a: "EstabWeb is built for local businesses like clinics, salons, restaurants, real estate, gyms, law firms, and more. We use business specific templates so you do not have to start from zero.",
            },
            {
                q: "Do you build the website for me?",
                a: "Yes. We set up the website for you so you do not start from scratch. After that, you can update your own content anytime from the dashboard.",
            },
        ],
    },
    {
        label: "Pricing & Plans",
        questions: [
            {
                q: "How much does EstabWeb cost?",
                a: "There is a one time setup fee to build your website, then a monthly or yearly plan to keep it live and maintained. You can check the Pricing page for the latest plan details.",
            },
            {
                q: "Are there any hidden fees?",
                a: "No. You only pay the setup and the plan you choose. A custom domain is optional and paid separately, and we guide you through that process.",
            },
            {
                q: "Can I cancel anytime?",
                a: "Yes. You can cancel before your next billing cycle to stop future charges. Your website stays live until the end of your current paid period.",
            },
            {
                q: "Do you offer a free plan?",
                a: "Yes. There is a free plan with limited features so you can explore the dashboard. To publish more and unlock paid features, you will need a paid plan.",
            },
            {
                q: "What happens if I do not continue my subscription?",
                a: "If your paid plan ends, your project can be downgraded to free plan limits. That can include losing custom domain access and lower publishing limits, but your data stays saved so you can continue again later.",
            },
        ],
    },
    {
        label: "Website & Features",
        questions: [
            {
                q: "Can I use my own domain name?",
                a: "Yes. On paid plans, you can use your own custom domain. We guide you through the setup.",
            },
            {
                q: "Can I have multiple pages on my website?",
                a: "Yes. Multi page websites are available on paid plans, so you can add pages like About, Services, Gallery, and more depending on your subscription.",
            },
            {
                q: "Can I update my website myself?",
                a: "Yes. You can update your content anytime through your dashboard. There is no need to hire a developer just to change text, photos, or business details.",
            },
            {
                q: "Are the websites mobile friendly?",
                a: "Yes. EstabWeb websites are built to work properly on phones, tablets, and computers.",
            },
            {
                q: "Will my website show up on Google?",
                a: "Yes. Your website includes search friendly basics like sitemap support, robots rules, and editable SEO fields such as page titles and descriptions. That helps search engines discover your site more easily.",
            },
        ],
    },
    {
        label: "Support & Requests",
        questions: [
            {
                q: "Can I request changes to my website?",
                a: "Yes. If you need help with updates or want something adjusted, you can contact us and we can guide you based on your plan and the kind of change you need.",
            },
            {
                q: "How long does it take to set up my website?",
                a: "Website setup time depends on the content and details you provide, but many projects can be prepared quickly once we have what we need. Contact us if you want to confirm the timeline for your business.",
            },
            {
                q: "How fast can I go live?",
                a: "Many businesses can go live quickly once the setup details are complete, especially when the content is ready. The exact timeline depends on the information, revisions, and domain setup involved.",
            },
            {
                q: "What if I need something custom?",
                a: "If you need something beyond the standard setup, contact us with your requirements. We can review custom design or feature requests and recommend the right next step.",
            },
            {
                q: "How do I get support?",
                a: "You can reach us through the contact page or by email. Support hours shown on our contact page are Monday to Friday, 9AM to 6PM.",
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
