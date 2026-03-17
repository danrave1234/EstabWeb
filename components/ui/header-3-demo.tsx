"use client";

import React from "react";
import { Header3 } from "@/components/ui/header-3";
import type { LinkItem } from "@/components/ui/header-3";
import {
  GlobeIcon,
  LayersIcon,
  UserPlusIcon,
  BarChart,
  PlugIcon,
  CodeIcon,
  Users,
  Star,
  Handshake,
  FileText,
  Shield,
  RotateCcw,
  Leaf,
  HelpCircle,
} from "lucide-react";

const productLinks: LinkItem[] = [
  {
    title: "Website Builder",
    href: "#",
    description: "Create responsive websites with ease",
    icon: GlobeIcon,
  },
  {
    title: "Cloud Platform",
    href: "#",
    description: "Deploy and scale apps in the cloud",
    icon: LayersIcon,
  },
  {
    title: "Team Collaboration",
    href: "#",
    description: "Tools to help your teams work better together",
    icon: UserPlusIcon,
  },
  {
    title: "Analytics",
    href: "#",
    description: "Track and analyze your website traffic",
    icon: BarChart,
  },
  {
    title: "Integrations",
    href: "#",
    description: "Connect your apps and services",
    icon: PlugIcon,
  },
  {
    title: "API",
    href: "#",
    description: "Build custom integrations with our API",
    icon: CodeIcon,
  },
];

const companyLinks: LinkItem[] = [
  {
    title: "About Us",
    href: "#",
    description: "Learn more about our story and team",
    icon: Users,
  },
  {
    title: "Customer Stories",
    href: "#",
    description: "See how we've helped our clients succeed",
    icon: Star,
  },
  {
    title: "Partnerships",
    href: "#",
    icon: Handshake,
    description: "Collaborate with us for mutual growth",
  },
  {
    title: "Terms of Service",
    href: "#",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    href: "#",
    icon: Shield,
  },
  {
    title: "Refund Policy",
    href: "#",
    icon: RotateCcw,
  },
  {
    title: "Blog",
    href: "#",
    icon: Leaf,
  },
  {
    title: "Help Center",
    href: "#",
    icon: HelpCircle,
  },
];

export default function Header3Demo() {
  const allLinks = [...productLinks, ...companyLinks];

  return (
    <div className="w-full">
      <Header3
        brandName="Acme"
        linkItems={allLinks}
        ctaText="Get Started"
        ctaHref="#"
        secondaryCtaText="Sign In"
        secondaryCtaHref="#"
      />

      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
        <div className="space-y-2 mb-4">
          <div className="bg-accent h-6 w-4/6 rounded-md border" />
          <div className="bg-accent h-6 w-1/2 rounded-md border" />
        </div>
        <div className="flex gap-2 mb-8">
          <div className="bg-accent h-3 w-14 rounded-md border" />
          <div className="bg-accent h-3 w-12 rounded-md border" />
        </div>

        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="space-y-2 mb-8">
            <div className="bg-accent h-4 w-full rounded-md border" />
            <div className="bg-accent h-4 w-full rounded-md border" />
            <div className="bg-accent h-4 w-full rounded-md border" />
            <div className="bg-accent h-4 w-1/2 rounded-md border" />
          </div>
        ))}
      </main>
    </div>
  );
}
