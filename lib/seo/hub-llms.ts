import { buildLlmsDocuments } from "@/lib/seo/llms";

function asText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

export function getHubOrigin(host: string): string {
  const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "estabweb.com").toLowerCase();
  const cleanHost = asText(host).toLowerCase().split(":")[0];
  const isLocalhost = cleanHost.includes("localhost") || cleanHost.includes("127.0.0.1");
  if (isLocalhost) {
    return `https://${cleanHost || "localhost:3000"}`;
  }
  if (cleanHost === ROOT_DOMAIN || cleanHost === `www.${ROOT_DOMAIN}`) {
    return `https://www.${ROOT_DOMAIN}`;
  }
  return `https://${cleanHost || `www.${ROOT_DOMAIN}`}`;
}

export function buildHubLlmsPayload(host: string): {
  origin: string;
  llmsTxt: string;
  llmsFullTxt: string;
} {
  const origin = getHubOrigin(host);

  const docs = buildLlmsDocuments({
    siteName: "EstabWeb",
    siteDescription:
      "EstabWeb is a managed website platform for local businesses in the Philippines, offering template-based website setup, editing, hosting, subscriptions, and support.",
    origin,
    pages: [
      {
        slug: "",
        label: "Home",
        description: "Overview of EstabWeb, platform benefits, workflow, and template previews.",
      },
      {
        slug: "pricing",
        label: "Pricing",
        description: "Plan comparisons for website setup, subscriptions, and publishing capabilities.",
      },
      {
        slug: "website-design-price-philippines",
        label: "Website Design Price Philippines Guide",
        description:
          "Practical guide covering setup cost, monthly website pricing, maintenance, and launch timelines for local businesses.",
      },
      {
        slug: "faq",
        label: "FAQ",
        description: "Answers about setup, plans, domains, publishing, and support.",
      },
      {
        slug: "contact",
        label: "Contact",
        description: "Direct support and sales contact channels for new and existing clients.",
      },
      {
        slug: "privacy",
        label: "Privacy Policy",
        description: "How EstabWeb handles personal information and analytics data.",
      },
      {
        slug: "terms",
        label: "Terms of Service",
        description: "Terms governing EstabWeb website services, subscriptions, and platform usage.",
      },
      {
        slug: "cookies",
        label: "Cookie Policy",
        description: "Cookie usage details and visitor choices for analytics and platform functionality.",
      },
    ],
    contact: {
      email: asText(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) || "support@estabweb.com",
    },
    services: [
      "Template-based website setup",
      "Client dashboard editing",
      "Custom domain mapping",
      "AI section editing",
      "AI SEO optimization",
      "Lead and analytics tracking",
    ],
    location: "Philippines",
    keyFacts: [
      "Audience: local businesses in the Philippines",
      "Product Model: multi-tenant website platform",
      "Subscription Plans: basic, pro, ecommerce, custom",
    ],
  });

  return {
    origin,
    llmsTxt: docs.llmsTxt,
    llmsFullTxt: docs.llmsFullTxt,
  };
}
