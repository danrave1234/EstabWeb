# EstabWeb

EstabWeb is a multi-tenant, DNA-configured website generation platform that allows you to instantly deploy structured, industry-optimized websites while retaining architectural control and performance integrity.

## Architecture & Core Tech

- **Framework:** Next.js 15 (App Router), React 19, Tailwind CSS 4.
- **Backend:** Supabase (Auth, PostgreSQL, Storage), NestJS.
- **DNA-Driven Rendering:** A centralized renderer (`SiteBlockRenderer.tsx`) that transforms JSON site configurations (DNA) into fully functional, high-performance UI blocks.
- **Multi-Tenancy:** Advanced middleware routing for subdomains and custom domains, ensuring data and style isolation across clients.

## Key Features

- **Instant Deployment:** Apply template codes to generate complete, industry-specific sites in seconds.
- **Developer-Centric Customization:** A live admin editor to manipulate site DNA, including color themes, typography, and section visibility.
- **Client Management Dashboard:** A streamlined interface for clients to preview sites and request content updates.
- **Administrative Suite:** Complete control over template codes, redemption limits, and client projects.
- **Optimized Performance:** Centralized skeleton loading, dynamic component hydration, and automated technical SEO.

## Getting Started

1. **Environment Setup:** Configure your `.env.local` with Supabase and site URL credentials.
2. **Database:** Initialize your Supabase instance using the provided `supabase_schema.sql`.
3. **Run Platform:**
   ```bash
   npm run dev
   ```
4. **Access Admin:** Navigate to `/admin` to manage templates and client projects.

---
*Built for scale, performance, and architectural integrity.*