# 3. Tech Stack

## Existing Technology Stack

| Category | Current Technology | Version | Usage in Enhancement | Notes |
|----------|-------------------|---------|---------------------|-------|
| **Framework** | Next.js (App Router) | 16.0.10 | All new pages, Route Handler for webhook | Server Components default |
| **UI Library** | React | 19.2.1 | All new components | RSC + Client Components pattern |
| **Language** | TypeScript | 5.x | All new code | Strict mode enabled |
| **Styling** | Tailwind CSS | 4.x | All new UI styling | CSS variables, @theme inline |
| **Components** | shadcn/ui | Latest | Search command, admin forms, dialogs | New York style, Lucide icons |
| **Database** | Supabase (PostgreSQL) | 17.6.1 | RLS policies, Storage bucket | Enable RLS on all tables |
| **Auth** | NextAuth v5 | 5.0.0-beta.30 | Admin role check, protected routes | Role-based access control |
| **Payments** | Stripe | 20.1.0 | Webhook handler integration | payment_intent.succeeded event |
| **Validation** | Zod | 4.2.1 | New schemas for profile, admin forms | Consistent with existing patterns |
| **Forms** | React Hook Form | Latest | Profile form, admin product forms | With @hookform/resolvers |
| **Toasts** | Sonner | Latest | Feedback for all new actions | Consistent with existing usage |
| **Themes** | next-themes | Latest | No changes needed | Dark mode already works |

## New Technology Additions

| Technology | Version | Purpose | Rationale | Integration Method |
|------------|---------|---------|-----------|-------------------|
| **Resend** | Latest | Email delivery service | Simple API, excellent DX, reliable delivery, good free tier (100 emails/day) | `npm install resend`, new `lib/email.ts` module |
| **@supabase/supabase-js (Service Role)** | 2.87.3 | Admin operations bypassing RLS | Already installed; need to create second client instance with service role key | New `lib/supabase-admin.ts` for service role client |

## shadcn/ui Components to Install

The following shadcn components need to be installed for new features:

| Component | Story | Usage |
|-----------|-------|-------|
| `command` | 1.4 (Search) | Command palette for product search |
| `dialog` | 1.4 (Search) | Modal wrapper for search command |
| `badge` | 1.5 (Order History) | Order status indicators (Paid/Unpaid) |
| `avatar` | 1.3 (Profile) | User profile image display |
| `alert-dialog` | 1.8 (Admin) | Delete confirmation dialogs |
| `table` | 1.8 (Admin) | Product management table |

**Installation Command:**
```bash
npx shadcn@latest add command dialog badge avatar alert-dialog table
```

## Environment Variables (New)

| Variable | Purpose | Environment |
|----------|---------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin/webhook operations | Server-only (never expose to client) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification | Server-only |
| `RESEND_API_KEY` | Email service authentication | Server-only |
| `EMAIL_FROM_ADDRESS` | Sender address for order confirmations | Server-only |

---
