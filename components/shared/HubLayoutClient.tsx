"use client";

import { usePathname } from "next/navigation";
import MainHeader from "@/components/shared/MainHeader";
import MainFooter from "@/components/shared/MainFooter";
import { User } from "@supabase/supabase-js";
import { AuthProvider } from "@/components/providers/AuthProvider";
import NetworkOfflineBanner from "@/components/shared/NetworkOfflineBanner";

interface HubLayoutClientProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export default function HubLayoutClient({ children, initialUser }: HubLayoutClientProps) {
  const pathname = usePathname();
  
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isOnboarding = pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname.startsWith("/auth/") || isOnboarding;

  return (
    <AuthProvider initialUser={initialUser}>
    <NetworkOfflineBanner />
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <MainHeader 
          initialUser={initialUser} 
          variant={isDashboard ? "client" : undefined} 
        />
      )}
      <div className={isDashboard ? "flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col"}>
        {children}
      </div>
      
      {!isAuthPage && !isDashboard && <MainFooter />}
    </div>
    </AuthProvider>
  );
}
