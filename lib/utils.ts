import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deepMerge<T extends Record<string, any>>(a: T, b: T): T {
  const out: any = Array.isArray(a) ? [...a] : { ...a }
  if (!b || typeof b !== 'object') return out
  for (const k of Object.keys(b)) {
    const av = (a as any)?.[k]
    const bv = (b as any)[k]
    if (
      av && bv &&
      typeof av === 'object' && typeof bv === 'object' &&
      !Array.isArray(av) && !Array.isArray(bv)
    ) {
      out[k] = deepMerge(av, bv)
    } else {
      out[k] = bv
    }
  }
  return out
}

/**
 * Normalizes a full site config snapshot before saving as draft.
 * Ensures required top-level keys exist and pages are always an array.
 */
export function normalizeConfig(config: Record<string, any>): Record<string, any> {
  const normalized = { ...config }
  // Ensure pages is always an array
  if (!Array.isArray(normalized.pages)) {
    normalized.pages = []
  }
  // Ensure activeSections is always an array
  if (!Array.isArray(normalized.activeSections)) {
    normalized.activeSections = normalized.activeSections
      ? [normalized.activeSections]
      : []
  }
  // Ensure brand object exists
  if (!normalized.brand || typeof normalized.brand !== 'object') {
    normalized.brand = {}
  }
  // Ensure seo object exists
  if (!normalized.seo || typeof normalized.seo !== 'object') {
    normalized.seo = {}
  }
  return normalized
}
