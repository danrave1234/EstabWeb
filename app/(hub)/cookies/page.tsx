import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How EstabWeb uses cookies and similar technologies to run and improve the platform.",
  alternates: {
    canonical: "https://www.estabweb.com/cookies",
  },
};

export default async function CookiePage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <p>Last updated: March 7, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your browser or device when you visit a website. They help websites
            remember information about your visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. How We Use Cookies</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Keep your account sessions secure and working properly.</li>
            <li>Remember basic settings and preferences.</li>
            <li>Measure site usage and improve performance.</li>
            <li>Support core platform features such as login and dashboard access.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. Types of Cookies We May Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential cookies:</strong> needed for authentication, security, and core functionality.
            </li>
            <li>
              <strong>Preference cookies:</strong> used to remember selected settings and improve usability.
            </li>
            <li>
              <strong>Analytics cookies:</strong> used to understand usage trends and improve service quality.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Third-Party Technologies</h2>
          <p>
            Some cookies or similar technologies may be set by third-party providers that support hosting,
            authentication, analytics, or payments. These providers may have their own policies and controls.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Consent and Cookie Choices</h2>
          <p>
            Essential cookies are used because they are needed for core features. For optional cookies, we request your
            consent where required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">6. Managing Cookies</h2>
          <p>
            You can manage cookies through your browser settings. You may block or delete cookies, but some parts of
            the platform may not work correctly if essential cookies are disabled.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">7. Policy Updates</h2>
          <p>
            We may update this Cookie Policy when needed to reflect legal, technical, or service changes. Updates will
            be posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">8. Contact Us</h2>
          <p>
            For cookie-related questions, contact us at{" "}
            <a href="mailto:contact@estabweb.com">contact@estabweb.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
