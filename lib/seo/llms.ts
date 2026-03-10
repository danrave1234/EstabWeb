export type LlmsPage = {
  slug: string;
  label: string;
  description?: string;
};

export type LlmsContact = {
  email?: string;
  phone?: string;
  address?: string;
};

type BuildLlmsInput = {
  siteName: string;
  siteDescription: string;
  origin: string;
  pages: LlmsPage[];
  contact?: LlmsContact;
  services?: string[];
  location?: string;
  keyFacts?: string[];
};

function asText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function truncateAtWord(value: string, max: number): string {
  const text = asText(value);
  if (text.length <= max) return text;
  const sliced = text.slice(0, max + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > 20) return sliced.slice(0, lastSpace).trim();
  return text.slice(0, max).trim();
}

function normalizeOrigin(origin: string): string {
  const clean = asText(origin).replace(/\/+$/g, "");
  return clean || "https://example.com";
}

function normalizeSlug(slug: string): string {
  return asText(slug).replace(/^\/+|\/+$/g, "").toLowerCase();
}

function pageUrl(origin: string, slug: string): string {
  const cleanSlug = normalizeSlug(slug);
  return cleanSlug ? `${origin}/${cleanSlug}` : `${origin}/`;
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const id = key(item);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}

function renderLink(page: LlmsPage, origin: string, includeDescription: boolean): string {
  const title = asText(page.label) || "Untitled";
  const url = pageUrl(origin, page.slug);
  if (!includeDescription) {
    return `- [${title}](${url})`;
  }
  const desc = truncateAtWord(asText(page.description), 220);
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`;
}

function renderSection(title: string, lines: string[]): string[] {
  if (lines.length === 0) return [];
  return [`## ${title}`, ...lines, ""];
}

function renderFactSection(facts: string[]): string[] {
  if (facts.length === 0) return [];
  return ["## Key Facts", ...facts.map((fact) => `- ${fact}`), ""];
}

function renderContactSection(origin: string, contact?: LlmsContact): string[] {
  const lines = [`- Website: ${origin}`];
  if (asText(contact?.email)) lines.push(`- Email: ${asText(contact?.email)}`);
  if (asText(contact?.phone)) lines.push(`- Phone: ${asText(contact?.phone)}`);
  if (asText(contact?.address)) lines.push(`- Address: ${asText(contact?.address)}`);
  lines.push(`- Sitemap: ${origin}/sitemap.xml`);
  lines.push(`- Robots: ${origin}/robots.txt`);
  return renderSection("Contact", lines);
}

function buildFacts(input: BuildLlmsInput): string[] {
  const facts: string[] = [];
  if (asText(input.siteName)) facts.push(`Business Name: ${asText(input.siteName)}`);
  if (asText(input.location)) facts.push(`Primary Location: ${truncateAtWord(asText(input.location), 120)}`);

  const serviceList = uniqueBy(
    (input.services || []).map((item) => asText(item)).filter(Boolean),
    (item) => item.toLowerCase()
  ).slice(0, 8);
  if (serviceList.length > 0) {
    facts.push(`Primary Services: ${serviceList.join(", ")}`);
  }

  const extraFacts = uniqueBy(
    (input.keyFacts || []).map((item) => asText(item)).filter(Boolean),
    (item) => item.toLowerCase()
  ).slice(0, 6);
  for (const fact of extraFacts) {
    facts.push(fact);
  }
  return facts;
}

function buildPageGroups(pages: LlmsPage[]) {
  const deduped = uniqueBy(
    pages.map((page) => ({
      slug: normalizeSlug(page.slug),
      label: asText(page.label) || (normalizeSlug(page.slug) ? normalizeSlug(page.slug) : "Home"),
      description: asText(page.description),
    })),
    (page) => page.slug
  );
  const legalSet = new Set(["privacy", "terms", "cookies"]);
  const legalPages = deduped.filter((page) => legalSet.has(page.slug));
  const mainPages = deduped.filter((page) => !legalSet.has(page.slug));
  return { mainPages, legalPages };
}

function buildDocument(input: BuildLlmsInput, includeDescriptions: boolean): string {
  const origin = normalizeOrigin(input.origin);
  const siteName = asText(input.siteName) || "Business Website";
  const siteDescription =
    truncateAtWord(asText(input.siteDescription), includeDescriptions ? 300 : 180) ||
    `Official website of ${siteName}.`;
  const { mainPages, legalPages } = buildPageGroups(input.pages);
  const facts = buildFacts(input);

  const lines: string[] = [
    `# ${siteName}`,
    `> ${siteDescription}`,
    "",
    ...renderSection(
      "Main Pages",
      mainPages.map((page) => renderLink(page, origin, includeDescriptions))
    ),
    ...renderSection(
      "Legal & Policies",
      legalPages.map((page) => renderLink(page, origin, includeDescriptions))
    ),
    ...renderFactSection(facts),
    ...renderContactSection(origin, input.contact),
  ];

  return `${lines.join("\n").trim()}\n`;
}

export function buildLlmsDocuments(input: BuildLlmsInput): {
  llmsTxt: string;
  llmsFullTxt: string;
} {
  return {
    llmsTxt: buildDocument(input, false),
    llmsFullTxt: buildDocument(input, true),
  };
}
