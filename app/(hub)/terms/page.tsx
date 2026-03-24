import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using EstabWeb website services, subscriptions, and dashboard tools.",
  alternates: {
    canonical: "https://www.estabweb.com/terms",
  },
};

export default async function TermsPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p>Last updated: March 7, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. Acceptance of Terms</h2>
          <p>
            By creating an account, accessing, or using EstabWeb, you agree to these Terms of Service. If you do not
            agree, please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. Service Overview</h2>
          <p>
            EstabWeb provides template-based website services for local businesses in the Philippines, including
            website setup, editing tools, hosting support, subscriptions, and optional design/content assistance.
          </p>
          <p>Features may include code redemption, template presets, dashboard editing, AI tools, and domain setup.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. Account Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate and updated account information.</li>
            <li>You are responsible for your login credentials and all activity under your account.</li>
            <li>You must immediately notify us of unauthorized access or security concerns.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Redemption Codes and Project Access</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Some onboarding flows require a valid redemption code.</li>
            <li>Codes may have usage limits, expiration dates, and plan restrictions.</li>
            <li>Misuse, resale, or unauthorized sharing of codes may result in suspension.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Plans, Billing, and Subscriptions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Paid plans may include a one-time setup fee and recurring subscription charges.</li>
            <li>Subscription details, inclusions, and pricing are shown on the pricing page at time of purchase.</li>
            <li>Payments are processed by third-party payment providers.</li>
            <li>You authorize recurring charges if you enroll in a recurring plan.</li>
            <li>You can cancel before the next billing cycle to stop future recurring charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">6. Non-Payment and Downgrades</h2>
          <p>
            If recurring payment fails, expires, or remains unpaid, your project may be downgraded to free-tier
            limits, which may include reduced publishing limits and removal of paid-only features such as custom domain
            usage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">7. Publishing, Editing, and Requests</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publishing limits and dashboard capabilities depend on your current plan/status.</li>
            <li>Some changes may require review/approval depending on subscription conditions.</li>
            <li>You are responsible for reviewing your content before publishing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">8. Content Ownership and License</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You retain ownership of content you provide (text, images, logos, business data).</li>
            <li>
              You grant us a limited license to host, process, display, and transmit your content to operate and
              support the service.
            </li>
            <li>You are responsible for ensuring your content does not violate third-party rights or laws.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">9. AI-Assisted Features</h2>
          <p>
            AI tools may generate suggestions for content or SEO fields. You are responsible for reviewing and
            validating AI-generated output before use. We do not guarantee the accuracy, legality, or fitness of AI
            output for your specific business.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">10. Prohibited Uses</h2>
          <p>You agree not to use the platform for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Illegal, harmful, fraudulent, or abusive activities.</li>
            <li>Distribution of malware, spam, phishing, or unauthorized tracking tools.</li>
            <li>Infringement of intellectual property or privacy rights.</li>
            <li>Attempts to disrupt platform integrity, security, or availability.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">11. Third-Party Services</h2>
          <p>
            The platform relies on third-party providers for hosting, payments, analytics, domains, and related
            services. Their services and downtime are outside our direct control and may be subject to their own terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">12. Consumer Protection and E-Commerce</h2>
          <p>
            We aim to provide clear and truthful information about pricing, inclusions, and service limits, consistent
            with applicable Philippine consumer and e-commerce rules. If you have billing or service complaints, you
            may contact our support team first for resolution.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">13. Electronic Records and Notices</h2>
          <p>
            You agree that electronic records, notices, invoices, and confirmations are valid and may be used as proof
            of transactions, subject to applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">14. Suspension and Termination</h2>
          <p>
            We may suspend or terminate access if these Terms are violated, if payment obligations are not met, or if
            necessary to protect the platform, other users, or legal compliance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">15. Warranty Disclaimer</h2>
          <p>
            Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the extent permitted by
            law, we do not guarantee uninterrupted or error-free operation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">16. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, EstabWeb will not be liable for indirect, incidental, special, or
            consequential damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">17. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Republic of the Philippines, including applicable consumer,
            e-commerce, and data privacy laws, without prejudice to mandatory protections under law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">18. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material updates will be posted on this page with a revised
            &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">19. Contact Us</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href="mailto:contact@estabweb.com">contact@estabweb.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
