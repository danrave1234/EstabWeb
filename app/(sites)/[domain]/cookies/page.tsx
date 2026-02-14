import { getSiteConfig } from "@/lib/utils/site-config";
import { headers } from "next/headers";
import LegalPageTemplate from "@/components/shared/LegalPageTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";

export const dynamic = "force-dynamic";

export default async function CookiesPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const heads = await headers();
  const data = await getSiteConfig(domain, heads);
  const preview = heads.get('x-preview-mode') === 'true';

  const defaultContent = `This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our website.

1. What are cookies?
Cookies are small data files that are placed on your computer or mobile device when you visit a website.

2. Why do we use cookies?
We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our website to operate.

3. How can I control cookies?
You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.`;

  if (preview) {
    return (
      <LivePreviewProvider initialData={data}>
        <LegalPageTemplate 
          title="Cookie Policy" 
          lastUpdated="February 14, 2026"
          content={defaultContent}
          serverData={data} 
        />
      </LivePreviewProvider>
    );
  }

  return (
    <LegalPageTemplate 
      title="Cookie Policy" 
      lastUpdated="February 14, 2026"
      content={defaultContent}
      serverData={data} 
    />
  );
}
