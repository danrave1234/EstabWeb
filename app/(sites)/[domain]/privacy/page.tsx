import type { Metadata } from "next";
import { getSiteConfig, getSiteConfigWithProject } from "@/lib/utils/site-config";
import { headers } from "next/headers";
import LegalPageTemplate from "@/components/shared/LegalPageTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";
import { isProPlan } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const heads = await headers();
  const host = (heads.get("host") || domain).toLowerCase();
  const config = await getSiteConfig(domain, heads);
  const { project } = await getSiteConfigWithProject(domain, heads);
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
  const preferredHost =
    project?.custom_domain && isProPlan(project)
      ? project.custom_domain.toLowerCase()
      : project?.subdomain
        ? `${project.subdomain}.${ROOT_DOMAIN}`.toLowerCase()
        : host;
  const brandName = config?.brand?.name || domain;

  return {
    title: `Privacy Policy | ${brandName}`,
    description: `Read how ${brandName} collects, uses, and protects your personal data.`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://${preferredHost}/privacy`,
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const heads = await headers();
  const data = await getSiteConfig(domain, heads);
  const preview = heads.get('x-preview-mode') === 'true';

  const defaultContent = `We respect your privacy and are committed to protecting your personal data when you use this website.

1. Information We Collect
We may collect personal details you submit (such as name, email, phone number, and message), as well as technical data like browser type and IP address.

2. How We Use Information
We use your information to respond to inquiries, provide requested services, improve website experience, and maintain security.

3. Sharing of Data
We do not sell personal data. We may share data with trusted service providers only when needed to run this website or comply with legal obligations.

4. Data Security and Retention
We apply reasonable security measures and keep data only for as long as needed for service, legal, or operational purposes.

5. Your Rights
Subject to applicable law, you may request access, correction, or deletion of your personal data.

6. Philippine Privacy Law
If this website is operated in the Philippines, personal data handling is intended to align with Republic Act No. 10173 (Data Privacy Act of 2012) and related regulations.

7. Contact
For privacy concerns, please contact us through the contact details on this website.`;

  if (preview) {
    return (
      <LivePreviewProvider initialData={data}>
        <LegalPageTemplate 
          title="Privacy Policy" 
          lastUpdated="March 7, 2026"
          content={defaultContent}
          serverData={data} 
        />
      </LivePreviewProvider>
    );
  }

  return (
    <LegalPageTemplate 
      title="Privacy Policy" 
      lastUpdated="March 7, 2026"
      content={defaultContent}
      serverData={data} 
    />
  );
}
