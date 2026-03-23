/**
 * CSRF mitigation for this stack:
 * - Supabase cookies use SameSite=Lax (see lib/supabase/middleware.ts).
 * - Mutating /api requests additionally reject a mismatched Origin/Referer in middleware
 *   (see shouldBlockCrossSiteMutation in request-origin.ts). Requests whose Origin matches
 *   the request URL (same page / custom domain) are allowed; webhooks use path skips.
 *
 * Next.js Server Actions use built-in origin checks; no double-submit token is required
 * for typical same-site dashboard usage.
 */

export {
  shouldBlockCrossSiteMutation,
  isAllowedRequestOrigin,
  MUTATION_ORIGIN_SKIP_PREFIXES,
} from './request-origin'
