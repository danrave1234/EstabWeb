import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How EstabWeb collects, uses, stores, and protects personal data for clients and visitors in the Philippines.",
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p>Last updated: March 7, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. Introduction</h2>
          <p>
            EstabWeb (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal data.
            This Privacy Policy explains what we collect, how we use it, how we protect it, and your rights when you
            use our platform and services.
          </p>
          <p>
            This Policy follows applicable Philippine privacy laws, including Republic Act No. 10173 (Data Privacy Act
            of 2012) and related National Privacy Commission (NPC) issuances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account data:</strong> name, email address, login credentials, and profile information.
            </li>
            <li>
              <strong>Business and site data:</strong> business details, contact info, logos, photos, text content,
              and other materials you upload.
            </li>
            <li>
              <strong>Subscription and billing data:</strong> selected plan, billing status, and payment-related
              references from our payment provider.
            </li>
            <li>
              <strong>Technical and usage data:</strong> IP address, browser/device information, logs, and feature
              usage (for example edits, publishes, and requests).
            </li>
            <li>
              <strong>Support and communication data:</strong> messages, support tickets, and other communications
              with us.
            </li>
            <li>
              <strong>Lead and analytics data:</strong> form submissions and interaction data captured for websites
              created on the platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and manage your account.</li>
            <li>To build, host, and maintain your website and dashboard.</li>
            <li>To process subscriptions, recurring charges, and billing-related operations.</li>
            <li>To provide support and respond to inquiries or design requests.</li>
            <li>To monitor security, prevent fraud/abuse, and improve platform performance.</li>
            <li>To send essential service notifications (for example billing, security, and policy updates).</li>
            <li>To comply with legal obligations and enforce our Terms of Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Legal Basis for Processing</h2>
          <p>We process personal data based on one or more of the following:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your consent.</li>
            <li>Performance of a contract with you.</li>
            <li>Compliance with legal obligations.</li>
            <li>Legitimate business interests, where allowed by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Sharing of Information</h2>
          <p>We may share information with trusted service providers to operate the platform, such as:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authentication, database, and storage providers.</li>
            <li>Hosting and deployment providers.</li>
            <li>Payment processors for subscriptions and transactions.</li>
            <li>AI providers when you use AI content or SEO tools.</li>
            <li>Analytics and monitoring services.</li>
          </ul>
          <p>
            We may also disclose information when required by law, legal process, or to protect our rights, users, and
            the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">6. Data Processors and Transfers</h2>
          <p>
            Some service providers may process data outside the Philippines. When this happens, we use reasonable
            safeguards and contractual protections appropriate for those transfers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">7. Data Retention</h2>
          <p>
            We keep personal data only as long as needed for service delivery, legal compliance, dispute resolution,
            and legitimate business purposes. Retention may vary depending on account status, billing records, and
            support history.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">8. Data Security</h2>
          <p>
            We use administrative, technical, and organizational safeguards to protect personal data from unauthorized
            access, use, disclosure, or loss. No system is completely risk-free, but we continuously improve our
            controls.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">9. Your Privacy Rights</h2>
          <p>Subject to applicable law, you may request:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To be informed about how your data is used.</li>
            <li>Access to your personal data.</li>
            <li>Correction of inaccurate or incomplete data.</li>
            <li>Deletion or blocking of data where legally allowed.</li>
            <li>Withdrawal of consent (for consent-based processing).</li>
            <li>Data portability, where applicable.</li>
          </ul>
          <p>
            You may also file a complaint with the National Privacy Commission (NPC) if you believe your rights were
            violated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">10. Personal Data Breach Response</h2>
          <p>
            If we reasonably believe a personal data breach occurred, we will investigate, contain, and document it.
            When required by law, we will notify the NPC and affected data subjects within applicable periods.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">11. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to keep sessions secure, remember preferences, and improve service
            performance. Please refer to our Cookie Policy for full details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material updates will be posted on this page with a
            revised &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">13. Contact Us</h2>
          <p>
            For privacy-related concerns, contact us at{" "}
            <a href="mailto:privacy@estabweb.com">privacy@estabweb.com</a> or{" "}
            <a href="mailto:support@estabweb.com">support@estabweb.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
