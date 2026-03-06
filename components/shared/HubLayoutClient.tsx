"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import MainHeader from "@/components/shared/MainHeader";
import MainFooter from "@/components/shared/MainFooter";
import { User } from "@supabase/supabase-js";
import NetworkOfflineBanner from "@/components/shared/NetworkOfflineBanner";
import SupportSystem from "@/components/shared/SupportSystem";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface HubLayoutClientProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export default function HubLayoutClient({ children, initialUser }: HubLayoutClientProps) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // On the server or during initial hydration, mounted is false.
  // We use stable defaults (marketing layout) to avoid hydration mismatches.
  // Once mounted on the client, we adjust to the dashboard layout if needed.
  const isDashboard = mounted ? (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) : false;
  const isOnboarding = mounted ? (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) : false;
  const isAuthPage = mounted ? (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/auth/") || isOnboarding) : false;

  return (
    <>
      <NetworkOfflineBanner />
      <div className="flex flex-col min-h-screen">
        {!isAuthPage && (
          <MainHeader
            initialUser={initialUser}
            variant={isDashboard ? "client" : undefined}
          />
        )}
        <div className="flex-1 flex flex-col">
          <div className={`flex-1${!isAuthPage && !isDashboard ? " pt-16" : ""}`}>
            <ScrollReveal />
            {children}
          </div>
        </div>

        {!isAuthPage && !isDashboard && <MainFooter />}
      </div>
      <SupportSystem user={initialUser} />
    </>
  );
}
