# 13. Next Steps

## Story Manager Handoff

**Prompt for Story Manager / Product Owner:**

> The Brownfield Enhancement Architecture for Alshami Store is complete. This document (`docs/architecture.md`) defines how to implement the final 15% of features for production readiness.
>
> **Key Integration Requirements (Validated):**
> - All new features integrate with existing NextAuth authentication
> - RLS policies must be enabled FIRST (Story 1.1) as security foundation
> - Admin access requires both NextAuth role check AND Supabase service role
> - Stripe webhook requires PaymentIntent metadata update in existing code
>
> **Existing System Constraints:**
> - Server Components for data fetching; Client Components only for interactivity
> - All forms use React Hook Form + Zod + Sonner toast pattern
> - shadcn/ui exclusively; CSS variables for colors; `.wrapper` for layout
> - Server Actions return `{ success: boolean, message: string }`
>
> **Story Sequence (from PRD):**
> 1. Story 1.1: RLS Policies (MUST be first)
> 2. Story 1.2: Home Redirect
> 3. Story 1.3: User Profile
> 4. Story 1.4: Product Search
> 5. Story 1.5: Order History
> 6. Story 1.6: Stripe Webhook (requires 1.5 complete)
> 7. Story 1.7: Email Notifications (requires 1.6 complete)
> 8. Story 1.8: Admin Dashboard
> 9. Story 1.9: Image Migration (requires 1.8 complete)
> 10. Story 1.10: Production Deployment (requires all above)
>
> **First Story to Implement:** Story 1.1 - Enable Row Level Security Policies
>
> Detailed stories are in `docs/prd/6-epic-1-alshami-store-production-readiness.md`

---

## Developer Handoff

**Prompt for Developers Starting Implementation:**

> **Reference Documents:**
> - Architecture: `docs/architecture.md` (this document)
> - PRD & Stories: `docs/prd/`
> - Coding Standards: `CLAUDE.md`
> - UI Guidelines: `docs/UI_GUIDELINES.md`
>
> **Before Starting:**
> 1. Read CLAUDE.md for project setup and coding standards
> 2. Run `npm install` and `npm run dev` to verify local setup
> 3. Ensure access to Supabase dashboard for RLS policy creation
> 4. Install Stripe CLI for webhook testing: `brew install stripe/stripe-cli/stripe`
>
> **Key Technical Decisions:**
> - **Supabase Clients:** Use `lib/supabase.ts` (anon) for user operations; create `lib/supabase-admin.ts` (service role) for webhook/admin
> - **Admin Auth:** Check role in BOTH layout AND Server Actions (defense in depth)
> - **Search:** Client-side filtering of pre-fetched products (not server-side)
> - **Forms:** React Hook Form + Zod + useTransition + Sonner toast
>
> **Critical First Step:**
> Story 1.1 must be completed first. It enables RLS on all tables. Without this, subsequent stories may work in development but fail with security issues in production.
>
> **Implementation Order:**
> ```
> 1.1 RLS ──▶ 1.2-1.5 (parallel possible) ──▶ 1.6 Webhook ──▶ 1.7 Email ──▶ 1.8 Admin ──▶ 1.9 Images ──▶ 1.10 Deploy
> ```
>
> **shadcn Components to Install:**
> ```bash
> npx shadcn@latest add command dialog badge avatar alert-dialog table
> ```
>
> **New Dependencies to Install:**
> ```bash
> npm install resend
> ```
>
> **Environment Variables to Add:**
> - `SUPABASE_SERVICE_ROLE_KEY` - Get from Supabase dashboard → Settings → API
> - `STRIPE_WEBHOOK_SECRET` - Get from Stripe CLI or Dashboard
> - `RESEND_API_KEY` - Get from Resend dashboard
> - `EMAIL_FROM_ADDRESS` - Your sending email address

---

## Implementation Sequence Diagram

```
Week 1: Foundation & Core Features
├── Story 1.1: RLS Policies (CRITICAL - DO FIRST)
├── Story 1.2: Home Redirect (simple)
├── Story 1.3: User Profile
└── Story 1.4: Product Search

Week 2: Order & Payment Features
├── Story 1.5: Order History
├── Story 1.6: Stripe Webhook
└── Story 1.7: Email Notifications

Week 3: Admin & Deployment
├── Story 1.8: Admin Dashboard
├── Story 1.9: Image Migration
└── Story 1.10: Production Deployment
```

*Note: Timeline is indicative only - actual duration depends on developer velocity*

---
