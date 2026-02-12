# Deploying EstabWeb to Vercel

This guide outlines the steps to deploy the EstabWeb platform to Vercel with support for multi-tenant subdomains and custom domains.

## 1. Prerequisites
- A Vercel account.
- A Supabase project.
- Your project pushed to a GitHub/GitLab/Bitbucket repository.

## 2. Environment Variables
Configure the following environment variables in your Vercel project settings:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `DATABASE_URL`: Your Supabase PostgreSQL connection string (Transaction Pooler recommended).

### Platform Configuration
- `NEXT_PUBLIC_SITE_URL`: The primary URL of your platform (e.g., `https://estabweb.com`).
- `NEXT_PUBLIC_ROOT_DOMAIN`: The base domain without protocol (e.g., `estabweb.com`).

## 3. Custom Domain & Wildcard Setup (Optional but Recommended)
To support subdomains (e.g., `client.estabweb.com`) and custom domains:
1. Add your root domain (e.g., `estabweb.com`) to Vercel.
2. Add a wildcard domain (e.g., `*.estabweb.com`) to the same project.
3. If using custom domains for clients, ensure they CNAME to `cname.vercel-dns.com`.

## 4. Supabase Auth Redirects
In your Supabase Dashboard, go to **Authentication > URL Configuration**:
1. Set **Site URL** to your `NEXT_PUBLIC_SITE_URL`.
2. Add **Redirect URLs**:
   - `https://estabweb.com/api/auth/callback`
   - `https://admin.estabweb.com/api/auth/callback` (if using admin subdomain)
   - `http://localhost:3000/api/auth/callback` (for local development)

## 5. Deployment
Once the environment variables are set, Vercel will automatically build and deploy your project on every push to the main branch.

### Note on Middleware
The `middleware.ts` handles all the heavy lifting for routing subdomains and custom domains to the correct internal routes (`/(sites)/[domain]`). No additional Vercel rewrites are required in `vercel.json`.
