# 2. Enhancement Scope and Integration Strategy

## Enhancement Overview

| Attribute | Value |
|-----------|-------|
| **Enhancement Type** | New Feature Addition + External Integration + Production Deployment |
| **Scope** | Complete final 15% for production readiness: Search, User Profile, Order History, Stripe Webhooks, Email Notifications, Admin Dashboard, Image Storage, Production Deployment |
| **Integration Impact** | Moderate - Most features are additive; RLS and webhook require careful integration with existing flows |

## Integration Approach

### Code Integration Strategy

New features will be implemented as **additive extensions** to the existing codebase:

| Integration Point | Approach |
|-------------------|----------|
| **New Pages** | Add to existing `(root)/` route group for user features; create new `(admin)/` route group for admin dashboard |
| **New Components** | Create new feature folders (`components/search/`, `components/admin/`, `components/user/`) following existing patterns |
| **Data Service Extensions** | Add new functions to `lib/data-service.ts` for reads (getUserOrders, searchProducts) |
| **Server Action Extensions** | Add new functions to `lib/actions.ts` for writes (updateProfile, CRUD products) |
| **New Validators** | Extend `lib/validators.ts` with profileUpdateSchema, adminProductSchema |

### Database Integration

| Aspect | Approach |
|--------|----------|
| **Schema Changes** | Minimal - `user_profile.address` already exists; no new tables required |
| **RLS Policies** | Enable RLS on all 5 tables with appropriate policies (Story 1.1) |
| **Supabase Storage** | Create `products` bucket for image uploads (Story 1.9) |
| **Service Role Key** | New environment variable for webhook handler and admin operations |

### API Integration

| Aspect | Approach |
|--------|----------|
| **Stripe Webhook** | New Route Handler at `/api/webhooks/stripe/route.ts` - NOT a Server Action (webhooks require HTTP endpoints) |
| **Email Service** | New `lib/email.ts` module using Resend SDK, called from webhook handler |
| **Admin Operations** | Server Actions with service role key for bypassing RLS where needed |
| **Search** | Client-side filtering of pre-fetched products (no new API endpoint) |

### UI Integration

| Aspect | Approach |
|--------|----------|
| **Search** | Command palette modal (shadcn `command` + `dialog`) triggered from Header |
| **User Menu** | Extend existing `UserMenu` dropdown with Profile and Orders links |
| **Admin Layout** | New `(admin)/layout.tsx` with role check and admin-specific navigation |
| **Consistency** | All new UI uses shadcn/ui, CSS variables, `.wrapper` class |

## Compatibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Existing API Compatibility** | All existing `data-service.ts` functions remain unchanged; new functions added alongside |
| **Database Schema Compatibility** | No breaking changes to existing tables; RLS policies added non-destructively |
| **UI/UX Consistency** | shadcn/ui New York style, semantic CSS variables, `.wrapper` layout, `.h1-bold`/`.h2-bold` typography |
| **Integration Compatibility** | Google OAuth, Stripe checkout, cart management all preserved; webhook enhances (not replaces) payment flow |
| **Route Compatibility** | All existing routes unchanged; new routes added in parallel |
| **Session Compatibility** | Cookie-based sessionCartId + user merge flow completely preserved |

## Performance Constraints

| Constraint | Target |
|------------|--------|
| **Search Response** | < 200ms (client-side filtering) |
| **Email Delivery** | < 5 seconds from webhook receipt |
| **Admin Dashboard Load** | < 2 seconds for 500 products |
| **Existing Page Performance** | No degradation (< 3 seconds) |

---
