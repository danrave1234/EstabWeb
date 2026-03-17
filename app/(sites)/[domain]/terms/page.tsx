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
    title: `Terms of Service | ${brandName}`,
    description: `Review the terms and conditions for using ${brandName}.`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://${preferredHost}/terms`,
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const heads = await headers();
  const data = await getSiteConfig(domain, heads);
  const preview = heads.get('x-preview-mode') === 'true';

  const defaultContent = `Please read these Terms of Service carefully before using this website.

1. Acceptance
By accessing or using this website, you agree to these Terms.

2. Use of Website
You agree to use this website only for lawful purposes and not to interfere with website operations or security.

3. Content and Intellectual Property
Unless otherwise stated, website content and branding are protected by applicable intellectual property laws. You may not copy or distribute protected content without permission.

4. Accuracy of Information
We aim to keep information accurate and updated, but we do not guarantee that all content is complete, current, or error-free at all times.

5. Third-Party Links
This website may include links to third-party websites. We are not responsible for their content, policies, or services.

6. Limitation of Liability
To the extent permitted by law, we are not liable for indirect, incidental, or consequential damages related to your use of this website.

7. Updates to Terms
We may update these Terms from time to time. Continued use after updates means you accept the revised Terms.

8. Governing Law
These Terms are governed by the laws of the Republic of the Philippines, unless another law is required by your location.

9. Contact
For questions about these Terms, please contact us through the contact details on this website.`;

  if (preview) {
    return (
      <LivePreviewProvider initialData={data}>
        <LegalPageTemplate 
          title="Terms of Service" 
          lastUpdated="March 7, 2026"
          content={defaultContent}
          serverData={data} 
        />
      </LivePreviewProvider>
    );
  }

  return (
    <LegalPageTemplate 
      title="Terms of Service" 
      lastUpdated="March 7, 2026"
      content={defaultContent}
      serverData={data} 
    />
  );
}
