# 4. Technical Constraints and Integration Requirements

## 4.1 Existing Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.0.10 |
| UI Library | React | 19.2.1 |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | Latest |
| Database | Supabase (PostgreSQL) | 17.6.1 |
| Auth | NextAuth v5 | 5.0.0-beta.30 |
| Payments | Stripe | 20.1.0 |
| Validation | Zod | 4.2.1 |
| Forms | React Hook Form | Latest |
| Toasts | Sonner | Latest |
| Themes | next-themes | Latest |

## 4.2 Security Advisors - CRITICAL ISSUES

| Level | Issue | Table/Entity | Action Required |
|-------|-------|--------------|-----------------|
| 🔴 ERROR | RLS Disabled | `Product` | Enable RLS + add policies |
| 🔴 ERROR | RLS Disabled | `cart` | Enable RLS + add policies |
| 🔴 ERROR | RLS Disabled | `order` | Enable RLS + add policies |
| 🔴 ERROR | RLS Disabled | `order_item` | Enable RLS + add policies |
| 🔴 ERROR | RLS Disabled | `user_profile` | Enable RLS (policies exist!) |
| 🟡 WARN | Function search_path mutable | `create_order_atomic` | Set `search_path = ''` |
| 🟡 WARN | Function search_path mutable | `update_updated_at_column` | Set `search_path = ''` |

## 4.3 Database Schema (Verified)

| Table | Key Fields | RLS |
|-------|-----------|-----|
| `Product` | id, name, slug, category, brand, price, stock, image, description | ❌ Disabled |
| `cart` | id, user_id, session_cart_id, items (JSONB), prices | ❌ Disabled |
| `order` | id, user_id, shipping_address (JSONB), isPaid, paidAt, prices | ❌ Disabled |
| `order_item` | order_id, product_id, quantity, price, name, slug, image | ❌ Disabled |
| `user_profile` | id, email, full_name, image, role, **address (JSONB)**, payment_method | ❌ Disabled (policies exist) |

**Key Finding:** `user_profile.address` JSONB field already exists - no migration needed for profile address storage.

## 4.4 Integration Approach

**Database Integration:**
- Read operations: `lib/data-service.ts` (Server Components)
- Write operations: Server Actions in `lib/actions.ts`
- New operations via Supabase migrations

**API Integration:**
- Stripe webhook: Route Handler at `/api/webhooks/stripe/route.ts`
- Email: Server-side via Resend SDK
- All other mutations: Server Actions with `"use server"`

**Frontend Integration:**
- New pages in existing route groups
- Install shadcn components as needed
- Client components only for interactivity

## 4.5 New File Structure

```
app/
├── (root)/
│   └── user/
│       ├── profile/page.tsx
│       └── orders/page.tsx
├── (admin)/
│   ├── layout.tsx
│   └── products/
│       ├── page.tsx
│       ├── new/page.tsx
│       └── [id]/edit/page.tsx
└── api/
    └── webhooks/
        └── stripe/route.ts

components/
├── search/
│   └── SearchCommand.tsx
└── admin/
    ├── ProductForm.tsx
    └── ProductTable.tsx

lib/
└── email.ts
```

## 4.6 Environment Variables

| Variable | Dev | Prod |
|----------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ |
| `NEXTAUTH_URL` | localhost:3000 | your-domain.com |
| `NEXTAUTH_SECRET` | ✅ | ✅ |
| `AUTH_GOOGLE_ID` | ✅ | ✅ |
| `AUTH_GOOGLE_SECRET` | ✅ | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_* | pk_live_* |
| `STRIPE_SECRET_KEY` | sk_test_* | sk_live_* |
| `STRIPE_WEBHOOK_SECRET` | whsec_* | whsec_* |
| `RESEND_API_KEY` | re_* | re_* |
| `SERVER_URL` | localhost:3000 | your-domain.com |

## 4.7 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stripe webhook signature verification fails | Medium | High | Test with Stripe CLI; log payloads |
| Email delivery fails silently | Low | Medium | Resend webhooks; order page shows status |
| Admin auth bypass | Low | Critical | Check role at layout AND Server Actions |
| RLS policies block legitimate operations | Medium | High | Test all CRUD after enabling RLS |
| Google OAuth redirect fails in production | Medium | Critical | Test OAuth URLs before go-live |

---
