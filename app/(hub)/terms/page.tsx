import type { Metadata } from "next";
import React from 'react';
import MainHeader from '@/components/shared/MainHeader';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules and guidelines for using the EstabWeb platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default async function TermsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MainHeader initialUser={user} />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>Last updated: February 11, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. Acceptance of Terms</h2>
            <p>
              By accessing and using EstabWeb (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. Description of Service</h2>
            <p>
              EstabWeb is a platform that provides website templates and hosting services for local businesses. We allow users to create, customize, and manage professional websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. User Accounts</h2>
            <p>
              To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of EstabWeb. Users retain ownership of the content they upload to the Service, but grant EstabWeb a license to host and display that content as part of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Prohibited Activities</h2>
            <p>
              You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service. This includes, but is not limited to, uploading malicious code, spamming, or violating the intellectual property rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">6. Limitation of Liability</h2>
            <p>
              In no event shall EstabWeb be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@estabweb.com.
            </p>
          </section>
        </div>
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
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 EstabWeb. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
