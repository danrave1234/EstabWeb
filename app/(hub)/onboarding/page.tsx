import OnboardingPage from "@/components/dashboard/OnboardingPage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/onboarding",
  },
};

export default function OnboardingRoute() {
  return <OnboardingPage />;
}
