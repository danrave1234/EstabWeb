import type { Metadata } from "next";
import React from 'react';
import MainHeader from '@/components/shared/MainHeader';
import MainFooter from '@/components/shared/MainFooter';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How we use cookies to improve your experience on EstabWeb.",
  alternates: {
    canonical: "/cookies",
  },
};

export default async function CookiePage() {
  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>Last updated: February 11, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. How EstabWeb Uses Cookies</h2>
            <p>
              When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To enable certain functions of the Service.</li>
              <li>To provide analytics.</li>
              <li>To store your preferences.</li>
              <li>To enable advertisement delivery, including behavioral advertising.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. Types of Cookies We Use</h2>
            <p>
              We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
              <li><strong>Preferences cookies:</strong> We may use preferences cookies to remember information that changes the way the Service behaves or looks, such as the &quot;remember me&quot; functionality.</li>
              <li><strong>Analytics cookies:</strong> We may use analytics cookies to track information how the Service is used so that we can make improvements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Your Choices Regarding Cookies</h2>
            <p>
              If you&apos;d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at support@estabweb.com.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
