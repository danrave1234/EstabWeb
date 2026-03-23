/**
 * Generic plain-text helpers for API inputs (not HTML — use custom-section-sanitizer for that).
 */

const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

/** Removes ASCII control characters and trims. */
export function sanitizePlainText(input: unknown, maxLen = 10_000): string {
  if (typeof input !== 'string') return ''
  const s = input.replace(CTRL, '').trim()
  return s.length > maxLen ? s.slice(0, maxLen) : s
}

/** Safe filename segment for uploads (no path separators). */
export function sanitizeFilenameSegment(input: unknown, maxLen = 200): string {
  const s = sanitizePlainText(input, maxLen)
  return s.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '-')
}
