import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for local business websites in the Philippines. Setup fee plus affordable monthly plans — no hidden costs.",
  alternates: {
    canonical: "https://www.estabweb.com/pricing",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
