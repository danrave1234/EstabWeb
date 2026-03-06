import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare EstabWeb plans for launching and scaling your business website.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
