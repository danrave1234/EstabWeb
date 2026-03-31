export type TemplateGenerationLogStatus = "pending" | "active" | "success" | "error";

export type TemplateGenerationLogEntry = {
  id: string;
  label: string;
  detail: string;
  status: TemplateGenerationLogStatus;
};

type TemplateGenerationActivityContext = {
  useSearch?: boolean;
  businessPageUrl?: string;
  businessImageName?: string;
};

type TemplateGenerationActivityResult = {
  sources?: unknown;
  searchEnabled?: boolean;
  searchFallbackUsed?: boolean;
  businessPageUrl?: string;
  usedInlineImage?: boolean;
  pageSignals?: {
    pagePhotos?: unknown;
    recentPosts?: unknown;
  };
  activeSections?: unknown;
};

export const TEMPLATE_GENERATION_ACTIVITY_STORAGE_KEY = "admin-template-generation-activity";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function countItems(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function createTemplateGenerationLogEntries(
  context: TemplateGenerationActivityContext,
): TemplateGenerationLogEntry[] {
  const hasBusinessPageUrl = normalizeText(context.businessPageUrl).length > 0;
  const businessImageName = normalizeText(context.businessImageName);

  const stages: Omit<TemplateGenerationLogEntry, "status">[] = [
    {
      id: "prepare",
      label: "Preparing your brief",
      detail: "Packaging your prompt, current sections, and approved design options for the generator.",
    },
  ];

  if (hasBusinessPageUrl) {
    stages.push({
      id: "scrape",
      label: "Reviewing the business page",
      detail: "Pulling public branding, contact, and image signals from the URL you provided.",
    });
  }

  if (context.useSearch) {
    stages.push({
      id: "search",
      label: "Checking public web context",
      detail: "Grounding the template with current public business details when the model can use search.",
    });
  }

  if (businessImageName) {
    stages.push({
      id: "vision",
      label: "Reading your uploaded image",
      detail: `Reviewing ${businessImageName} for logo, color, and brand cues.`,
    });
  }

  stages.push(
    {
      id: "plan",
      label: "Planning the template",
      detail: "Choosing the copy direction, section order, and visual style that best fit the business.",
    },
    {
      id: "generate",
      label: "Generating with AI",
      detail: "Drafting the hero, contact content, design selections, and recommended sections.",
    },
    {
      id: "assets",
      label: "Preparing images",
      detail: "Downloading and hosting logo, hero, and supporting section photos when available.",
    },
    {
      id: "apply",
      label: "Applying it to the editor",
      detail: "Merging the generated template back into the admin builder.",
    },
  );

  return setActiveTemplateGenerationLogEntry(
    stages.map((stage) => ({ ...stage, status: "pending" as const })),
    0,
  );
}

export function setActiveTemplateGenerationLogEntry(
  entries: TemplateGenerationLogEntry[],
  activeIndex: number,
): TemplateGenerationLogEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    status: index < activeIndex ? "success" : index === activeIndex ? "active" : "pending",
  }));
}

export function completeTemplateGenerationLogEntries(
  entries: TemplateGenerationLogEntry[],
): TemplateGenerationLogEntry[] {
  return entries.map((entry) => ({ ...entry, status: "success" }));
}

export function failTemplateGenerationLogEntries(
  entries: TemplateGenerationLogEntry[],
): TemplateGenerationLogEntry[] {
  let markedError = false;

  return entries.map((entry) => {
    if (entry.status === "active" && !markedError) {
      markedError = true;
      return { ...entry, status: "error" };
    }

    if (entry.status === "success") {
      return entry;
    }

    return { ...entry, status: "pending" };
  });
}

export function buildTemplateGenerationSummary(
  result: TemplateGenerationActivityResult,
  context: TemplateGenerationActivityContext,
): string[] {
  const notes: string[] = [];
  const businessPageUrl = normalizeText(result.businessPageUrl) || normalizeText(context.businessPageUrl);
  const businessImageName = normalizeText(context.businessImageName);
  const sourceCount = countItems(result.sources);
  const pagePhotoCount = countItems(result.pageSignals?.pagePhotos);
  const postImageCount = countItems(result.pageSignals?.recentPosts);
  const sectionCount = countItems(result.activeSections);

  if (businessPageUrl) {
    notes.push("Reviewed the linked business page for public branding, contact, and media signals.");
  }

  if (result.searchFallbackUsed) {
    notes.push("Tried grounded web search first, then fell back to direct generation when search mode was unavailable.");
  } else if (result.searchEnabled && sourceCount > 0) {
    notes.push(`Used grounded web research and kept ${pluralize(sourceCount, "source")} in the final result.`);
  } else if (result.searchEnabled) {
    notes.push("Used grounded web research to cross-check the business details before generating the template.");
  }

  if (result.usedInlineImage || businessImageName) {
    notes.push(
      businessImageName
        ? `Reviewed your uploaded image (${businessImageName}) for extra brand cues.`
        : "Reviewed your uploaded image for extra brand cues.",
    );
  }

  if (pagePhotoCount > 0 || postImageCount > 0) {
    notes.push(
      `Compiled ${pluralize(pagePhotoCount + postImageCount, "public image signal")} for hero and section photo suggestions.`,
    );
  }

  if (sectionCount > 0) {
    notes.push(`Applied ${pluralize(sectionCount, "recommended section")} to the template draft.`);
  }

  if (!notes.length) {
    notes.push("Updated the template draft with AI-generated copy, styling, and layout suggestions.");
  }

  return notes.slice(0, 4);
}