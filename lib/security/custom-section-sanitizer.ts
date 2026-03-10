const MAX_CUSTOM_HTML_LENGTH = 12000
const MAX_CUSTOM_CSS_LENGTH = 6000

function clamp(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value
}

/**
 * Sanitizes custom section HTML for safe multi-tenant rendering.
 * We allow markup/layout tags, but strip scripts, external embeds, event handlers,
 * and javascript: URLs.
 */
export function sanitizeCustomSectionHtml(input: unknown): string {
  if (typeof input !== "string") return ""

  let value = clamp(input, MAX_CUSTOM_HTML_LENGTH)

  // Remove high-risk tags and their bodies.
  value = value.replace(/<\s*(script|iframe|object|embed|applet|meta|link|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
  // Remove self-closing high-risk tags.
  value = value.replace(/<\s*(script|iframe|object|embed|applet|meta|link|base)\b[^>]*\/?>/gi, "")
  // Remove inline event handlers like onclick="...".
  value = value.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
  value = value.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
  // Remove javascript: URLs in href/src.
  value = value.replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, " $1=\"#\"")
  value = value.replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, " $1=\"#\"")

  return value.trim()
}

/**
 * Sanitizes custom section CSS.
 * We block imports/remote execution vectors while keeping normal styling features.
 */
export function sanitizeCustomSectionCss(input: unknown): string {
  if (typeof input !== "string") return ""

  let value = clamp(input, MAX_CUSTOM_CSS_LENGTH)

  value = value.replace(/@import[\s\S]*?;/gi, "")
  value = value.replace(/expression\s*\([^)]*\)/gi, "")
  value = value.replace(/javascript\s*:/gi, "")
  value = value.replace(/behavior\s*:\s*url\s*\([^)]*\)/gi, "")
  value = value.replace(/-moz-binding\s*:[^;]+;/gi, "")

  return value.trim()
}
