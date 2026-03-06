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
    title: `Cookie Policy | ${brandName}`,
    description: `Learn how ${brandName} uses cookies and similar technologies.`,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://${preferredHost}/cookies`,
    },
  };
}

export default async function CookiesPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const heads = await headers();
  const data = await getSiteConfig(domain, heads);
  const preview = heads.get('x-preview-mode') === 'true';

  const defaultContent = `This Cookie Policy explains how we use cookies and similar technologies on this website.

1. What Are Cookies
Cookies are small text files saved on your browser or device to help websites function and remember your preferences.

2. Why We Use Cookies
We use cookies to support essential website functionality, improve user experience, and understand site performance.

3. Types of Cookies
We may use essential cookies, preference cookies, and analytics cookies depending on enabled features.

4. Consent and Choices
Essential cookies may be used automatically because they are needed for the website to work. For optional cookies, we ask for consent where required by law.

5. Managing Cookies
You can control or delete cookies through your browser settings. Some website features may not work properly if essential cookies are disabled.

6. Updates
We may revise this Cookie Policy from time to time. Updated versions will be posted on this page.`;

  if (preview) {
    return (
      <LivePreviewProvider initialData={data}>
        <LegalPageTemplate 
          title="Cookie Policy" 
          lastUpdated="March 7, 2026"
          content={defaultContent}
          serverData={data} 
        />
      </LivePreviewProvider>
    );
  }

  return (
    <LegalPageTemplate 
      title="Cookie Policy" 
      lastUpdated="March 7, 2026"
      content={defaultContent}
      serverData={data} 
    />
  );
}
