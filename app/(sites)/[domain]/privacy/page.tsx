import { getSiteConfig } from "@/lib/utils/site-config";
import { headers } from "next/headers";
import LegalPageTemplate from "@/components/shared/LegalPageTemplate";
import LivePreviewProvider from "@/components/shared/LivePreviewProvider";

export const dynamic = "force-dynamic";

export default async function PrivacyPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const heads = await headers();
  const data = await getSiteConfig(domain, heads);
  const preview = heads.get('x-preview-mode') === 'true';

  const defaultContent = `At our company, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.

1. Introduction
We respect your privacy and are committed to protecting your personal data.

2. Data We Collect
We may collect, use, store and transfer different kinds of personal data about you including Identity Data, Contact Data, Technical Data, and Usage Data.

3. How We Use Your Data
We will only use your personal data when the law allows us to.

4. Data Security
We have put in place appropriate security measures to prevent your personal data from being accidentally lost or used in an unauthorized way.`;

  if (preview) {
    return (
      <LivePreviewProvider initialData={data}>
        <LegalPageTemplate 
          title="Privacy Policy" 
          lastUpdated="February 14, 2026"
          content={defaultContent}
          serverData={data} 
        />
      </LivePreviewProvider>
    );
  }

  return (
    <LegalPageTemplate 
      title="Privacy Policy" 
      lastUpdated="February 14, 2026"
      content={defaultContent}
      serverData={data} 
    />
  );
}
