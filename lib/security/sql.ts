/**
 * SQL injection and Supabase (PostgREST)
 *
 * The Supabase JS client does **not** send raw SQL from your app. Queries go to PostgREST
 * with **bound parameters** for values (`.eq('id', userId)`, `.insert({ ... })`, `.rpc('fn', { p: v })`).
 * User strings in those positions are **not** concatenated into SQL text, so classic SQL
 * injection through the client API is **not** applicable the same way as hand-built `query("... "+ input)`.
 *
 * Risks to still watch:
 * - **LIKE / ILIKE**: `%` and `_` are wildcards; escape user search terms with `escapeLikePattern`.
 * - **Dynamic table/column names**: never build identifiers from user input; use `assertSafeIdentifier` if you must pick from a constrained set.
 * - **Raw SQL** (server `pg`, `supabase.sql`, Edge Functions): always use parameterized queries / bound args only.
 */

const IDENT_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/

/**
 * PostgreSQL LIKE/ILIKE: escape `%`, `_`, and `\` so user search text is literal.
 */
export function escapeLikePattern(input: string): string {
  return input.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

/**
 * Optional: wrap for `ILIKE '%...%'` style search after escaping.
 */
export function literalLikeContains(userSearch: string): string {
  return `%${escapeLikePattern(userSearch)}%`
}

/**
 * Use only when a column/table name comes from a **whitelist** at runtime.
 * Rejects anything that is not a simple SQL identifier (alphanumeric + underscore).
 */
export function assertSafeIdentifier(name: string, maxLen = 63): string {
  const s = name.slice(0, maxLen)
  if (!IDENT_RE.test(s)) {
    throw new Error('Invalid SQL identifier')
  }
  return s
}

/**
 * Returns the string if safe, or null (caller should reject the request).
 */
export function trySafeIdentifier(name: string, maxLen = 63): string | null {
  try {
    return assertSafeIdentifier(name, maxLen)
  } catch {
    return null
  }
}
