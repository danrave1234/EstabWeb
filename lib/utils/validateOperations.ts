/**
 * Validation Layer for AI Operations
 * Validates operations before showing them to the user.
 * Rejects unknown section keys, enforces guardrails.
 */

import { BLOCK_REGISTRY } from "@/lib/utils/block-registry"
import type { Operation } from "@/lib/utils/applyOperations"
import { isLegalPageSlug } from "@/lib/utils/site-pages"

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

export function validateOperations(
  operations: Operation[],
  currentActiveSections: string[],
  maxSections: number = 20,
  maxPages: number = 1,
  currentPageCount: number = 1
): ValidationResult {
  const errors: string[] = []
  const sanitized: Operation[] = []

  // Guard: cap total operation count
  if (operations.length > MAX_OPERATIONS) {
    errors.push(
      `Too many operations (${operations.length}). Maximum allowed is ${MAX_OPERATIONS}.`
    )
    operations = operations.slice(0, MAX_OPERATIONS)
  }

  // Simulate activeSections as we process ops to catch duplicates
  const simulated = [...currentActiveSections]

  for (const op of operations) {
    switch (op.type) {
      case "add_section": {
        if (!ALL_SECTION_IDS.has(op.sectionKey)) {
          errors.push(`Unknown section key: "${op.sectionKey}" — rejected.`)
          continue
        }
        if (simulated.includes(op.sectionKey)) {
          // Skip silently — already active, not an error
          continue
        }
        if (simulated.length >= maxSections) {
          errors.push(
            `Section limit reached (${maxSections}). Cannot add "${op.sectionKey}".`
          )
          continue
        }
        // Clamp position to valid range
        const rawPos = op.position ?? simulated.length
        const safePos = Math.min(Math.max(rawPos, 0), simulated.length)
        simulated.splice(safePos, 0, op.sectionKey)
        sanitized.push({ ...op, position: safePos })
        break
      }

      case "remove_section": {
        if (PROTECTED_SECTIONS.has(op.sectionKey)) {
          errors.push(`Cannot remove protected section: "${op.sectionKey}".`)
          continue
        }
        if (isLegalPageSlug(op.sectionKey)) {
          errors.push(`Cannot remove legal page section: "${op.sectionKey}".`)
          continue
        }
        const idx = simulated.indexOf(op.sectionKey)
        if (idx !== -1) simulated.splice(idx, 1)
        sanitized.push(op)
        break
      }

      case "update_section": {
        if (!ALL_SECTION_IDS.has(op.sectionKey)) {
          errors.push(`Unknown section key in update: "${op.sectionKey}" — rejected.`)
          continue
        }
        // Strip blocked structural keys before sanitizing
        const filteredChanges: Record<string, any> = {}
        for (const [k, v] of Object.entries(op.changes)) {
          if (BLOCKED_SECTION_CHANGE_KEYS.has(k)) {
            errors.push(`update_section: field "${k}" is a protected key — stripped.`)
          } else {
            filteredChanges[k] = v
          }
        }
        if (Object.keys(filteredChanges).length === 0) {
          errors.push(`update_section "${op.sectionKey}" had no allowed fields — skipped.`)
          continue
        }
        const safeChanges = sanitizeChanges(filteredChanges)
        sanitized.push({ ...op, changes: safeChanges })
        break
      }

      case "reorder_sections": {
        const unknownKeys = op.newOrder.filter((k) => !ALL_SECTION_IDS.has(k))
        if (unknownKeys.length > 0) {
          errors.push(`Unknown section keys in reorder: ${unknownKeys.join(", ")} — rejected.`)
          continue
        }
        if (!op.newOrder.includes("hero")) {
          errors.push(`Reorder must include "hero" section.`)
          continue
        }
        // Ensure no duplicates
        const deduped = [...new Set(op.newOrder)]
        if (deduped.length !== op.newOrder.length) {
          errors.push(`Reorder contains duplicate section keys — deduplicated.`)
        }
        // Ensure set equality: no sections silently dropped or added
        const currentSet = new Set(simulated)
        const newSet = new Set(deduped)
        const dropped = [...currentSet].filter((k) => !newSet.has(k))
        const added = [...newSet].filter((k) => !currentSet.has(k))
        if (dropped.length > 0) {
          errors.push(`Reorder would silently drop sections: ${dropped.join(", ")} — rejected.`)
          continue
        }
        if (added.length > 0) {
          errors.push(`Reorder cannot introduce new sections: ${added.join(", ")} — rejected.`)
          continue
        }
        sanitized.push({ ...op, newOrder: deduped })
        break
      }

      case "update_global": {
        // Only allow colorTheme, typographyStyle, darkMode, footerStyle, footer — strip everything else
        const ALLOWED_GLOBAL_KEYS = new Set(["colorTheme", "typographyStyle", "darkMode", "footerStyle", "footer", "brand", "navigation", "headerStyle"])
        const filteredChanges: Record<string, any> = {}
        for (const [k, v] of Object.entries(op.changes)) {
          if (ALLOWED_GLOBAL_KEYS.has(k)) filteredChanges[k] = v
          else errors.push(`update_global: field "${k}" is not allowed — stripped.`)
        }
        if (Object.keys(filteredChanges).length === 0) {
          errors.push(`update_global had no allowed fields — skipped.`)
          continue
        }
        const safeChanges = sanitizeChanges(filteredChanges)
        sanitized.push({ ...op, changes: safeChanges })
        break
      }

      case "add_page": {
        if (currentPageCount >= maxPages) {
          // Hard failure — entire request must be rejected, not just this op stripped
          return {
            valid: false,
            errors: [`Adding new pages requires a Pro plan. Upgrade to continue, or rephrase your request to edit the existing page.`],
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
 * Recursively strip raw HTML tags, script-like content, and enforce string length limits.
 * Handles deeply nested objects and arrays.
 */
function sanitizeChanges(changes: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [key, value] of Object.entries(changes)) {
    out[key] = sanitizeValue(value)
  }
  return out
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    const stripped = value.replace(/<[^>]*>/g, "").trim()
    // Enforce max string length
    return stripped.length > MAX_STRING_LENGTH
      ? stripped.slice(0, MAX_STRING_LENGTH)
      : stripped
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value !== null && typeof value === "object") {
    return sanitizeChanges(value as Record<string, any>)
  }
  return value
}
