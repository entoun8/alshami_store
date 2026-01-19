# 1. Existing Project Analysis

## Current Project State

- **Primary Purpose:** E-commerce platform for premium herbs, coffees, and specialty products targeting the Middle Eastern community in Australia
- **Current Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, Supabase (PostgreSQL 17.6.1), NextAuth v5, Stripe, Zod 4
- **Architecture Style:** Server-first React with Server Components by default, Client Components only for interactivity; Server Actions for mutations; Route Groups for layout organization
- **Deployment Method:** Currently development-only; targeting Vercel for production

## Available Documentation

- **CLAUDE.md:** Comprehensive project setup, commands, architecture patterns, coding standards, and development workflow (✅ Complete)
- **docs/UI_GUIDELINES.md:** Detailed UI design rules, color system, layout patterns (✅ Complete)
- **docs/brief.md:** Project context and business requirements (✅ Complete)
- **docs/ZOD_VALIDATION_GUIDELINES.md:** Validation patterns and schema best practices (✅ Complete)
- **docs/SUPABASE_GUIDELINES.md:** Database and authentication integration (✅ Complete)
- **API Documentation:** Partial - Server Actions documented in lib/actions.ts but no formal API spec

## Identified Constraints

- **NextAuth v5 Beta:** Using beta.30 - API may change; must monitor for breaking changes
- **Supabase Anon Key Exposure:** Client-side operations use anon key; ALL data access MUST be protected by RLS
- **React 19:** Latest React version - some ecosystem libraries may have compatibility issues
- **Tailwind CSS 4:** New version with different configuration approach (@theme inline in CSS)
- **No Service Role Key in Client:** Service role key must NEVER be exposed to client; only used in server-side webhook handlers and admin Server Actions
- **Existing Cart Session Pattern:** Cookie-based sessionCartId must be preserved for anonymous cart → user cart merge flow

---
