# Module Boundaries

This repo now follows explicit ownership boundaries to keep complexity manageable as routes and components grow.

## Ownership

- `app/`: Next.js entrypoints and orchestration only (route handlers, layouts, pages).
- `components/`: UI and presentation logic only.
- `lib/`: shared domain logic, utilities, adapters, and integration helpers.
- `config/`: static product and plan configuration.
- `scripts/`: operational tooling.

## Import Rules

- `app/api/**` must not import from `components/**`.
- `components/**` must not import from `app/api/**`.
- `lib/**` must not import from `app/**` or `components/**`.

These rules are enforced by:

```bash
npm run check:boundaries
```

Current temporary exceptions:

- `lib/utils/block-props.tsx`
- `lib/utils/dynamic.ts`

## Practical Guidance

- If API routes and components need shared behavior, extract it into `lib/**`.
- Keep side effects (DB writes, revalidation, external HTTP) at route/service boundaries.
- Prefer pure helper functions in `lib/**` for logic that needs unit tests.
