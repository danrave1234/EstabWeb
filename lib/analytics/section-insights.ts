import { BLOCK_REGISTRY, type BlockDefinition } from "@/lib/utils/block-registry";

type SectionDatasetLike = Partial<
  Record<
    | "section"
    | "sectionId"
    | "sectionIndex"
    | "sectionFamily"
    | "sectionSlot"
    | "sectionVariant"
    | "sectionInstanceId"
    | "pageVersionId"
    | "sectionLabel"
    | "sectionPurpose"
    | "sectionGoal"
    | "sectionPosition"
    | "sectionIsHero"
    | "sectionIsInteractive"
    | "sectionInteractionType"
    | "sectionInteractionLabel",
    string | undefined
  >
>;

export type AnalyticsSectionMeta = {
  sectionKey: string;
  sectionSlot: string;
  sectionFamily: string;
  sectionVariant: string;
  sectionLabel: string;
  sectionPurpose?: string;
  sectionGoal: string;
  sectionPosition?: number;
  isHero: boolean;
  isInteractive: boolean;
  interactionType: string;
  interactionLabel: string;
};

type SectionInteractionMeta = {
  isInteractive: boolean;
  interactionType: string;
  interactionLabel: string;
};

const SECTION_GOALS: Record<string, string> = {
  announcement_bar: "awareness",
  blog: "education",
  booking: "lead",
  case_study: "trust",
  certifications: "trust",
  comparison: "consideration",
  contact: "lead",
  coverage: "trust",
  cta: "lead",
  custom_html: "custom",
  faq: "objection_handling",
  features: "consideration",
  free_consultation: "lead",
  gallery: "trust",
  guarantee: "trust",
  gym: "consideration",
  header: "navigation",
  hero: "conversion",
  lead_capture: "lead",
  logo_cloud: "trust",
  payment_options: "conversion",
  pricing: "conversion",
  process: "consideration",
  products: "conversion",
  service_area: "trust",
  services: "consideration",
  specialty_listings: "consideration",
  stats: "trust",
  team: "trust",
  testimonials: "trust",
  trust_badges: "trust",
};

function prettifySlug(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function fallbackVariant(sectionKey: string) {
  if (sectionKey.includes("--")) return sectionKey.split("--")[1] || "standard";
  return "standard";
}

function fallbackFamily(sectionKey: string) {
  if (sectionKey.includes("--")) return sectionKey.split("--")[0] || sectionKey;
  return sectionKey;
}

function findBlock(sectionKey: string): BlockDefinition | undefined {
  return BLOCK_REGISTRY.find((entry) => entry.id === sectionKey);
}

function getSectionInteractionMeta(sectionFamily: string, sectionVariant: string): SectionInteractionMeta {
  if (sectionFamily === "gym") {
    if (sectionVariant === "faq") {
      return {
        isInteractive: true,
        interactionType: "faq",
        interactionLabel: "Questions people expand",
      };
    }

    if (sectionVariant === "memberships") {
      return {
        isInteractive: true,
        interactionType: "cta",
        interactionLabel: "Membership call-to-action",
      };
    }

    if (sectionVariant === "results") {
      return {
        isInteractive: true,
        interactionType: "gallery",
        interactionLabel: "Story or gallery interaction",
      };
    }
  }

  if (sectionFamily === "hero") {
    return {
      isInteractive: true,
      interactionType: "cta",
      interactionLabel: "Main call-to-action",
    };
  }

  if (["booking", "contact", "free_consultation", "lead_capture"].includes(sectionFamily)) {
    return {
      isInteractive: true,
      interactionType: "form",
      interactionLabel: "Contact or booking form",
    };
  }

  if (["cta", "payment_options", "pricing"].includes(sectionFamily)) {
    return {
      isInteractive: true,
      interactionType: "cta",
      interactionLabel: "Call-to-action",
    };
  }

  if (sectionFamily === "faq") {
    return {
      isInteractive: true,
      interactionType: "faq",
      interactionLabel: "Questions people expand",
    };
  }

  if (sectionFamily === "gallery") {
    return {
      isInteractive: true,
      interactionType: "gallery",
      interactionLabel: "Gallery interaction",
    };
  }

  if (sectionFamily === "comparison") {
    return {
      isInteractive: true,
      interactionType: "comparison",
      interactionLabel: "Comparison interaction",
    };
  }

  if (sectionFamily === "custom_html") {
    return {
      isInteractive: true,
      interactionType: "custom",
      interactionLabel: "Custom interaction",
    };
  }

  if (sectionFamily === "services" && sectionVariant === "vertical-tabs") {
    return {
      isInteractive: true,
      interactionType: "tabs",
      interactionLabel: "Tabs or switches",
    };
  }

  return {
    isInteractive: false,
    interactionType: "view_only",
    interactionLabel: "View-only section",
  };
}

export function getSectionAnalyticsMeta(sectionKey: string, sectionPosition?: number): AnalyticsSectionMeta {
  const block = findBlock(sectionKey);
  const sectionFamily = block?.sectionType ?? fallbackFamily(sectionKey);
  const sectionVariant = block?.variant ?? fallbackVariant(sectionKey);
  const sectionLabel = block?.label ?? prettifySlug(sectionKey);
  const sectionGoal = SECTION_GOALS[sectionFamily] ?? SECTION_GOALS[fallbackFamily(sectionKey)] ?? "engagement";
  const interactionMeta = getSectionInteractionMeta(sectionFamily, sectionVariant);

  return {
    sectionKey,
    sectionSlot: sectionFamily,
    sectionFamily,
    sectionVariant,
    sectionLabel,
    sectionPurpose: block?.purpose,
    sectionGoal,
    sectionPosition,
    isHero: sectionFamily === "hero",
    isInteractive: interactionMeta.isInteractive,
    interactionType: interactionMeta.interactionType,
    interactionLabel: interactionMeta.interactionLabel,
  };
}

export function getSectionAnalyticsMetaFromDataset(dataset: SectionDatasetLike): AnalyticsSectionMeta | null {
  const sectionKey = dataset.section || dataset.sectionId;
  if (!sectionKey) return null;

  const fallback = getSectionAnalyticsMeta(
    sectionKey,
    Number(dataset.sectionPosition ?? dataset.sectionIndex ?? "") || undefined
  );

  return {
    sectionKey,
    sectionSlot: dataset.sectionSlot || fallback.sectionSlot,
    sectionFamily: dataset.sectionFamily || fallback.sectionFamily,
    sectionVariant: dataset.sectionVariant || fallback.sectionVariant,
    sectionLabel: dataset.sectionLabel || fallback.sectionLabel,
    sectionPurpose: dataset.sectionPurpose || fallback.sectionPurpose,
    sectionGoal: dataset.sectionGoal || fallback.sectionGoal,
    sectionPosition:
      Number(dataset.sectionPosition ?? dataset.sectionIndex ?? "") || fallback.sectionPosition,
    isHero:
      dataset.sectionIsHero != null ? dataset.sectionIsHero === "true" : fallback.isHero,
    isInteractive:
      dataset.sectionIsInteractive != null ? dataset.sectionIsInteractive === "true" : fallback.isInteractive,
    interactionType: dataset.sectionInteractionType || fallback.interactionType,
    interactionLabel: dataset.sectionInteractionLabel || fallback.interactionLabel,
  };
}

export function sectionMetaToEventMetadata(
  meta: AnalyticsSectionMeta | null | undefined,
  metadata?: Record<string, unknown>
) {
  if (!meta) return metadata ?? {};

  return {
    ...(metadata ?? {}),
    section_family: meta.sectionFamily,
    section_slot: meta.sectionSlot,
    section_variant: meta.sectionVariant,
    section_label: meta.sectionLabel,
    section_purpose: meta.sectionPurpose,
    section_goal: meta.sectionGoal,
    section_position: meta.sectionPosition,
    is_hero_section: meta.isHero,
    section_is_interactive: meta.isInteractive,
    section_interaction_type: meta.interactionType,
    section_interaction_label: meta.interactionLabel,
  };
}

export function readSectionMetaFromEvent(
  sectionKey: string | null | undefined,
  metadata?: Record<string, any> | null
) {
  if (!sectionKey) return null;

  const fallback = getSectionAnalyticsMeta(
    sectionKey,
    typeof metadata?.section_position === "number" ? metadata.section_position : undefined
  );

  return {
    sectionKey,
    sectionSlot:
      typeof metadata?.section_slot === "string" ? metadata.section_slot : fallback.sectionSlot,
    sectionFamily:
      typeof metadata?.section_family === "string" ? metadata.section_family : fallback.sectionFamily,
    sectionVariant:
      typeof metadata?.section_variant === "string" ? metadata.section_variant : fallback.sectionVariant,
    sectionLabel:
      typeof metadata?.section_label === "string" ? metadata.section_label : fallback.sectionLabel,
    sectionPurpose:
      typeof metadata?.section_purpose === "string" ? metadata.section_purpose : fallback.sectionPurpose,
    sectionGoal:
      typeof metadata?.section_goal === "string" ? metadata.section_goal : fallback.sectionGoal,
    sectionPosition:
      typeof metadata?.section_position === "number" ? metadata.section_position : fallback.sectionPosition,
    isHero:
      typeof metadata?.is_hero_section === "boolean" ? metadata.is_hero_section : fallback.isHero,
    isInteractive:
      typeof metadata?.section_is_interactive === "boolean"
        ? metadata.section_is_interactive
        : fallback.isInteractive,
    interactionType:
      typeof metadata?.section_interaction_type === "string"
        ? metadata.section_interaction_type
        : fallback.interactionType,
    interactionLabel:
      typeof metadata?.section_interaction_label === "string"
        ? metadata.section_interaction_label
        : fallback.interactionLabel,
  } satisfies AnalyticsSectionMeta;
}