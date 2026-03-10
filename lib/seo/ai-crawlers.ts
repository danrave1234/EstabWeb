export type GeoRobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
};

export type GeoCrawlerPolicyMode = "max-visibility" | "training-restricted";

const AI_SEARCH_CRAWLERS_BASE: readonly string[] = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
];

const AI_DISCOVERY_CRAWLERS: readonly string[] = [
  "GPTBot",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "Amazonbot",
  "FacebookBot",
];

const AI_TRAINING_CRAWLERS: readonly string[] = [
  "anthropic-ai",
  "cohere-ai",
  "CCBot",
];

const AI_AGGRESSIVE_LOW_VALUE_BLOCKED_CRAWLERS: readonly string[] = [
  "Bytespider",
];

export function resolveGeoCrawlerPolicyMode(): GeoCrawlerPolicyMode {
  const raw = (process.env.GEO_CRAWLER_POLICY_MODE || "").trim().toLowerCase();
  if (raw === "training-restricted") return "training-restricted";
  return "max-visibility";
}

function getPolicy(mode: GeoCrawlerPolicyMode): {
  allowedCrawlers: string[];
  blockedCrawlers: string[];
} {
  if (mode === "training-restricted") {
    return {
      // Keep search/discovery surfaces available while blocking known training-focused agents.
      allowedCrawlers: [...AI_SEARCH_CRAWLERS_BASE],
      blockedCrawlers: [...AI_DISCOVERY_CRAWLERS, ...AI_TRAINING_CRAWLERS, ...AI_AGGRESSIVE_LOW_VALUE_BLOCKED_CRAWLERS],
    };
  }

  return {
    allowedCrawlers: [...AI_SEARCH_CRAWLERS_BASE, ...AI_DISCOVERY_CRAWLERS, ...AI_TRAINING_CRAWLERS],
    blockedCrawlers: [...AI_AGGRESSIVE_LOW_VALUE_BLOCKED_CRAWLERS],
  };
}

function toList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function buildGeoRobotsRules(wildcardRule: GeoRobotsRule): GeoRobotsRule[] {
  const mode = resolveGeoCrawlerPolicyMode();
  const policy = getPolicy(mode);
  const allowRules: GeoRobotsRule[] = policy.allowedCrawlers.map((crawler) => ({
    userAgent: crawler,
    allow: "/",
  }));
  const blockedRules: GeoRobotsRule[] = policy.blockedCrawlers.map((crawler) => ({
    userAgent: crawler,
    disallow: "/",
  }));

  return [...allowRules, ...blockedRules, wildcardRule];
}

function pushPlainTextRule(lines: string[], rule: GeoRobotsRule) {
  const userAgents = toList(rule.userAgent);
  const allows = toList(rule.allow);
  const disallows = toList(rule.disallow);

  for (const userAgent of userAgents) {
    lines.push(`User-agent: ${userAgent}`);
  }
  for (const allow of allows) {
    lines.push(`Allow: ${allow}`);
  }
  for (const disallow of disallows) {
    lines.push(`Disallow: ${disallow}`);
  }
  lines.push("");
}

export function buildGeoRobotsTxt(input: {
  wildcardAllow?: string | string[];
  wildcardDisallow?: string | string[];
  sitemapUrl: string;
}): string {
  const mode = resolveGeoCrawlerPolicyMode();
  const policy = getPolicy(mode);
  const lines: string[] = [];

  lines.push("# AI search crawlers");
  lines.push("");
  for (const crawler of policy.allowedCrawlers) {
    pushPlainTextRule(lines, { userAgent: crawler, allow: "/" });
  }

  lines.push("# Blocked crawlers");
  lines.push("");
  for (const crawler of policy.blockedCrawlers) {
    pushPlainTextRule(lines, { userAgent: crawler, disallow: "/" });
  }

  lines.push("# Default policy");
  lines.push("");
  pushPlainTextRule(lines, {
    userAgent: "*",
    allow: input.wildcardAllow ?? "/",
    disallow: input.wildcardDisallow,
  });

  lines.push(`Sitemap: ${input.sitemapUrl}`);
  lines.push("");

  return `${lines.join("\n").trim()}\n`;
}
