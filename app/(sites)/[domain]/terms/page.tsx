import { getSiteConfig } from "@/lib/utils/site-config";
import { headers } from "next/headers";
import LegalPageTemplate from "@/components/shared/LegalPageTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";

export const dynamic = "force-dynamic";

export default async function TermsPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const heads = await headers();
  const data = await getSiteConfig(domain, heads);
  const preview = heads.get('x-preview-mode') === 'true';

  const defaultContent = `Please read these terms and conditions carefully before using our service.

1. Agreement to Terms
By accessing or using our service, you agree to be bound by these terms.

2. Intellectual Property
The service and its original content, features, and functionality are and will remain the exclusive property of our company.

3. Termination
We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.

4. Limitation of Liability
In no event shall our company be liable for any indirect, incidental, special, consequential, or punitive damages.`;

  if (preview) {
    return (
      <LivePreviewProvider initialData={data}>
        <LegalPageTemplate 
          title="Terms of Service" 
          lastUpdated="February 14, 2026"
          content={defaultContent}
          serverData={data} 
        />
      </LivePreviewProvider>
    );
  }

  return (
    <LegalPageTemplate 
      title="Terms of Service" 
      lastUpdated="February 14, 2026"
      content={defaultContent}
      serverData={data} 
    />
  );
}
