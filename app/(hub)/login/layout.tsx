import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Sign in to your EstabWeb dashboard and manage your websites.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role === 'admin') redirect('/admin');
    else redirect('/dashboard');
  }

  return children;
}
