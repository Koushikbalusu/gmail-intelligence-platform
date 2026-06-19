# Prompt Change Log: 002-supabase-client

## Goal
Establish a secure, clean database client module for Supabase that supports browser-safe, server-safe, and service-role database connections to enable layered features (authentication, background syncing, data ingestion).

## Target Files
- [lib/db/client.ts](file:///home/koushik/Documents/gmail-intelligence-platform/lib/db/client.ts)
- [docs/prompts/002-supabase-client.md](file:///home/koushik/Documents/gmail-intelligence-platform/docs/prompts/002-supabase-client.md)
- [docs/prompts/BUILD_LOG.md](file:///home/koushik/Documents/gmail-intelligence-platform/docs/prompts/BUILD_LOG.md)
- [docs/BUILD_LOG.md](file:///home/koushik/Documents/gmail-intelligence-platform/docs/BUILD_LOG.md)

## Architecture Context
The platform implements Next.js 15+ App Router, utilizing Supabase for storage and authentication. We need different modes of database interaction:
1. Client-side browser components that read/write data according to user authentication scope.
2. Server-side Route Handlers/Server Actions that must read credentials from cookies to retrieve/verify the logged-in user.
3. Server-side background routines (such as Gmail API synchronization and AI generation ingestion) that run outside of request loops and require high-privilege access using the Supabase Service Role key (bypassing RLS).

## What Was Implemented
- Created `lib/db/client.ts` implementing:
  - `createBrowserDbClient`: Generates a client-side Supabase client using `@supabase/ssr` `createBrowserClient` with public URL and anon key.
  - `createServerDbClient`: Generates an asynchronous server-side client using `@supabase/ssr` `createServerClient` and Next.js `cookies()`.
  - `createAdminDbClient`: Generates a service-role client using `@supabase/supabase-js` `createClient` with a safety check preventing execution in browser environments (`typeof window !== 'undefined'`).
- Set up informative error logging if environment configuration keys are missing.

## Why It Matters
- **Security**: Prevents leakage of the sensitive `SUPABASE_SERVICE_ROLE_KEY` to browser bundles.
- **Session Continuity**: Handles cookies natively on the server, ensuring Supabase session authentication works cleanly within Next.js App Router server features.
- **Layer Reuse**: Exposes predictable client factories for both UI components and background sync workers without duplicating client-generation boilerplate.

## Assumptions
- Next.js environment configurations are fully set up in target host settings.
- The `SUPABASE_SERVICE_ROLE_KEY` environment variable is only populated in server runtimes.

## Manual Review Checklist
- [ ] No database schema queries or helpers are included in `lib/db/client.ts`.
- [ ] No OAuth client configuration logic is present in `lib/db/client.ts`.
- [ ] Direct import or execution of `createAdminDbClient` throws an exception if loaded in client-side bundles.
- [ ] Environment variables load correctly and fall back with clear error messages.
