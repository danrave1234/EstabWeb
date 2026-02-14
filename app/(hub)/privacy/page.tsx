import type { Metadata } from "next";
import React from 'react';
import MainHeader from '@/components/shared/MainHeader';
import MainFooter from '@/components/shared/MainFooter';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our commitment to protecting your data and privacy at EstabWeb.",
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>Last updated: February 11, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. Introduction</h2>
            <p>
              At EstabWeb, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register you as a new customer.</li>
              <li>To provide and manage the Service.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing, and customer relationships.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Cookies</h2>
            <p>
              We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">6. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">7. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">8. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@estabweb.com.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
