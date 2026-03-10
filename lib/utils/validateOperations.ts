/**
 * Validation Layer for AI Operations
 * Validates operations before showing them to the user.
 * Rejects unknown section keys and enforces guardrails.
 */

import { BLOCK_REGISTRY } from "@/lib/utils/block-registry"
import type { Operation } from "@/lib/utils/applyOperations"
import { isLegalPageSlug } from "@/lib/utils/site-pages"
import { sanitizeCustomSectionCss, sanitizeCustomSectionHtml } from "@/lib/security/custom-section-sanitizer"

/** All valid section IDs (canonical + legacy) */
export const ALL_SECTION_IDS = new Set(BLOCK_REGISTRY.map((b) => b.id))

/** Sections that can never be removed */
const PROTECTED_SECTIONS = new Set(["hero"])

/**
 * Keys that are never allowed inside update_section.changes regardless of section.
 * Prevents AI from injecting structural config fields via section updates.
 */
const BLOCKED_SECTION_CHANGE_KEYS = new Set([
  "activeSections",
  "pages",
  "colorTheme",
  "typographyStyle",
  "darkMode",
  "domain",
  "subdomain",
  "subscription_status",
  "subscription_ends_at",
  "trial_ends_at",
  "plan",
  "publish_count",
  "publish_count_daily",
  "last_published_at",
])

/** Hard limits to prevent abuse */
const MAX_OPERATIONS = 10
const MAX_STRING_LENGTH = 500

export interface ValidationResult {
  valid: boolean
  errors: string[]
  sanitizedOperations: Operation[]
}

export interface ValidationOptions {
  /** Section IDs disallowed by plan/feature gating. */
  disallowedSectionIds?: Set<string>
}

export function validateOperations(
  operations: Operation[],
  currentActiveSections: string[],
  maxSections: number = 20,
  maxPages: number = 1,
  currentPageCount: number = 1,
  options?: ValidationOptions
): ValidationResult {
  const errors: string[] = []
  const sanitized: Operation[] = []
  const disallowedSectionIds = options?.disallowedSectionIds ?? new Set<string>()

  if (operations.length > MAX_OPERATIONS) {
    errors.push(
      `Too many operations (${operations.length}). Maximum allowed is ${MAX_OPERATIONS}.`
    )
    operations = operations.slice(0, MAX_OPERATIONS)
  }

  // Simulate activeSections as we process ops to catch duplicates.
  const simulated = [...currentActiveSections]

  for (const op of operations) {
    switch (op.type) {
      case "add_section": {
        if (disallowedSectionIds.has(op.sectionKey)) {
          errors.push(`Section "${op.sectionKey}" is not available on your current plan.`)
          continue
        }
        if (!ALL_SECTION_IDS.has(op.sectionKey)) {
          errors.push(`Unknown section key: "${op.sectionKey}" - rejected.`)
          continue
        }
        const isRoot = !op.pageSlug || op.pageSlug === "index" || op.pageSlug === "/"
        if (!isRoot) {
          sanitized.push(op)
          continue
        }

        if (simulated.includes(op.sectionKey)) {
          continue
        }
        if (simulated.length >= maxSections) {
          errors.push(`Section limit reached (${maxSections}). Cannot add "${op.sectionKey}".`)
          continue
        }

        const rawPos = op.position ?? simulated.length
        const safePos = Math.min(Math.max(rawPos, 0), simulated.length)
        simulated.splice(safePos, 0, op.sectionKey)
        sanitized.push({ ...op, position: safePos })
        break
      }

      case "remove_section": {
        if (disallowedSectionIds.has(op.sectionKey)) {
          errors.push(`Section "${op.sectionKey}" is not available on your current plan.`)
          continue
        }
        const isRoot = !op.pageSlug || op.pageSlug === "index" || op.pageSlug === "/"
        if (isRoot && PROTECTED_SECTIONS.has(op.sectionKey)) {
          errors.push(`Cannot remove protected section: "${op.sectionKey}" from homepage.`)
          continue
        }
        if (isLegalPageSlug(op.sectionKey)) {
          errors.push(`Cannot remove legal page section: "${op.sectionKey}".`)
          continue
        }
        if (!isRoot) {
          sanitized.push(op)
          continue
        }

        const idx = simulated.indexOf(op.sectionKey)
        if (idx !== -1) simulated.splice(idx, 1)
        sanitized.push(op)
        break
      }

      case "update_section": {
        if (disallowedSectionIds.has(op.sectionKey)) {
          errors.push(`Section "${op.sectionKey}" is not available on your current plan.`)
          continue
        }
        if (!ALL_SECTION_IDS.has(op.sectionKey)) {
          errors.push(`Unknown section key in update: "${op.sectionKey}" - rejected.`)
          continue
        }

        const filteredChanges: Record<string, any> = {}
        for (const [k, v] of Object.entries(op.changes)) {
          if (BLOCKED_SECTION_CHANGE_KEYS.has(k)) {
            errors.push(`update_section: field "${k}" is a protected key - stripped.`)
          } else {
            filteredChanges[k] = v
          }
        }

        if (Object.keys(filteredChanges).length === 0) {
          errors.push(`update_section "${op.sectionKey}" had no allowed fields - skipped.`)
          continue
        }

        const safeChanges = sanitizeChanges(filteredChanges, op.sectionKey)
        sanitized.push({ ...op, changes: safeChanges })
        break
      }

      case "reorder_sections": {
        const isRoot = !op.pageSlug || op.pageSlug === "index" || op.pageSlug === "/"
        const unknownKeys = op.newOrder.filter((k) => !ALL_SECTION_IDS.has(k))
        if (unknownKeys.length > 0) {
          errors.push(`Unknown section keys in reorder: ${unknownKeys.join(", ")} - rejected.`)
          continue
        }
        const lockedKeys = op.newOrder.filter((k) => disallowedSectionIds.has(k))
        if (lockedKeys.length > 0) {
          errors.push(`Reorder includes locked sections: ${lockedKeys.join(", ")} - rejected.`)
          continue
        }

        const deduped = [...new Set(op.newOrder)]
        if (deduped.length !== op.newOrder.length) {
          errors.push(`Reorder contains duplicate section keys - deduplicated.`)
        }

        if (!isRoot) {
          sanitized.push({ ...op, newOrder: deduped })
          continue
        }

        if (!op.newOrder.includes("hero")) {
          errors.push(`Homepage reorder must include "hero" section.`)
          continue
        }

        const currentSet = new Set(simulated)
        const newSet = new Set(deduped)
        const dropped = [...currentSet].filter((k) => !newSet.has(k))
        const added = [...newSet].filter((k) => !currentSet.has(k))
        if (dropped.length > 0) {
          errors.push(`Reorder would silently drop sections: ${dropped.join(", ")} - rejected.`)
          continue
        }
        if (added.length > 0) {
          errors.push(`Reorder cannot introduce new sections: ${added.join(", ")} - rejected.`)
          continue
        }
        sanitized.push({ ...op, newOrder: deduped })
        break
      }

      case "update_global": {
        const allowedGlobalKeys = new Set([
          "colorTheme",
          "typographyStyle",
          "darkMode",
          "footerStyle",
          "footer",
          "brand",
          "navigation",
          "headerStyle",
        ])

        const filteredChanges: Record<string, any> = {}
        for (const [k, v] of Object.entries(op.changes)) {
          if (allowedGlobalKeys.has(k)) filteredChanges[k] = v
          else errors.push(`update_global: field "${k}" is not allowed - stripped.`)
        }

        if (Object.keys(filteredChanges).length === 0) {
          errors.push(`update_global had no allowed fields - skipped.`)
          continue
        }

        const safeChanges = sanitizeChanges(filteredChanges)
        sanitized.push({ ...op, changes: safeChanges })
        break
      }

      case "add_page": {
        if (currentPageCount >= maxPages) {
          return {
            valid: false,
            errors: [
              "Adding new pages requires a Pro plan. Upgrade to continue, or rephrase your request to edit the existing page.",
            ],
            sanitizedOperations: [],
          }
        }
        if (!op.slug || typeof op.slug !== "string") {
          errors.push(`add_page: missing or invalid slug.`)
          continue
        }
        if (!op.label || typeof op.label !== "string") {
          errors.push(`add_page: missing or invalid label.`)
          continue
        }
        sanitized.push(op)
        break
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitizedOperations: sanitized,
  }
}

/**
 * Recursively strip unsafe markup and enforce max length limits.
 * For custom-html section:
 * - `html` allows sanitized markup
 * - `css` allows sanitized CSS
 */
function sanitizeChanges(changes: Record<string, any>, sectionKey?: string): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [key, value] of Object.entries(changes)) {
    out[key] = sanitizeValue(value, key, sectionKey)
  }
  return out
}

function sanitizeValue(value: unknown, path: string, sectionKey?: string): unknown {
  if (typeof value === "string") {
    if (sectionKey === "custom-html") {
      if (path === "html") return sanitizeCustomSectionHtml(value)
      if (path === "css") return sanitizeCustomSectionCss(value)
    }

    const stripped = value.replace(/<[^>]*>/g, "").trim()
    return stripped.length > MAX_STRING_LENGTH
      ? stripped.slice(0, MAX_STRING_LENGTH)
      : stripped
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeValue(item, `${path}[${index}]`, sectionKey))
  }

  if (value !== null && typeof value === "object") {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      const nextPath = path ? `${path}.${k}` : k
      out[k] = sanitizeValue(v, nextPath, sectionKey)
    }
    return out
  }

  return value
}
