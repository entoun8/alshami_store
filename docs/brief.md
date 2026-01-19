# Project Brief: Alshami Store

> **Version:** 1.0
> **Created:** January 2026
> **Status:** Ready for Implementation

---

## Executive Summary

**Alshami Store** is a modern e-commerce platform specializing in premium herbs, coffees, and Middle Eastern specialty products. Built with Next.js 16, React 19, and TypeScript, it provides a complete shopping experience with Google authentication, Stripe payments, and a responsive dark/light mode interface.

**Current Status:** ~85% complete - fully functional for browsing, cart management, checkout, and payment collection

**Primary Challenge:** The platform needs final deployment preparation including email notifications after payment, Stripe webhook integration, user profile/order history pages, search functionality, admin dashboard, and production environment configuration.

**Target Market:** Middle Eastern community seeking authentic herbs, spices, and specialty coffees (Alshami Coffee, Alattar products)

**Key Value Proposition:** A trustworthy, modern online store bringing authentic premium Middle Eastern products with a seamless shopping experience.

---

## Problem Statement

### Current State

Alshami Store is a functional e-commerce platform at ~85% completion. Users can browse products, add to cart, checkout, and pay via Stripe. However, critical production gaps exist.

### Pain Points

1. **No order confirmation** - Users complete payment but receive no email confirmation
2. **No product search** - Users must browse categories manually; no quick search option
3. **Unnecessary home page** - Extra click required before reaching products
4. **Incomplete Stripe flow** - Payment succeeds but order `isPaid` status doesn't update (no webhook)
5. **No user profile/order history** - Customers can't view their past orders or manage profile
6. **No admin dashboard** - Client can't manage products without developer help
7. **Development environment config** - URLs hardcoded to localhost, secrets need production setup

### Impact

- Users lack confidence without email confirmation
- Poor UX without search (especially as product catalog grows)
- Extra friction with landing page before products
- Business risk: orders marked unpaid despite successful payment
- Client dependency on developer for product management

### Why Now

The platform is being delivered to a client and must be production-ready, professional, and trustworthy.

---

## Proposed Solution

### Approach: Complete the Final 15% with Minimal, Production-Ready Changes

### 1. Home Page → Products Redirect
- Remove hero/banner landing page
- Redirect `/` directly to `/products`
- Keep About and Contact pages accessible from header

### 2. Product Search
- Add search input to header (always visible)
- Simple client-side filtering by product name
- Instant results as user types
- Clean, minimal UI matching existing design

### 3. User Profile Page
- Display user info (name, email, profile image)
- Allow editing of profile information
- Show saved shipping address

### 4. Order History Page
- List all past orders for logged-in user
- Show order status, date, total, items
- Link to individual order details

### 5. Stripe Webhook Integration
- Create `/api/webhooks/stripe` endpoint
- Listen for `payment_intent.succeeded` event
- Update order `isPaid: true` and `paidAt` timestamp
- Trigger confirmation email from webhook

### 6. Email Notifications (Post-Payment)
- Integrate **Resend** (simple, Next.js-friendly email service)
- Send order confirmation email after successful Stripe payment
- Include: Order ID, items purchased, shipping address, total

### 7. Admin Dashboard
- Protected route for admin users only
- CRUD operations for products (add/edit/delete)
- Image upload to Supabase Storage

### 8. Production Deployment Setup
- Create `.env.example` with all required variables
- Update `NEXTAUTH_URL` and `SERVER_URL` for production
- Deploy to **Vercel** (native Next.js support)
- Configure Stripe webhook URL in Stripe Dashboard

### Why This Approach

- Uses existing tech stack (no new major dependencies except Resend)
- Minimal code changes with maximum impact
- Professional, production-standard patterns
- Each feature is independent and can be implemented/tested separately

---

## Target Users

### Primary User Segment: End Customers

| Attribute | Description |
|-----------|-------------|
| **Profile** | Middle Eastern community members, food enthusiasts, coffee lovers |
| **Location** | Australia (AUD currency configured) |
| **Behavior** | Shop online for specialty items not easily found in local stores |
| **Needs** | Authentic herbs, premium coffee, trusted quality, easy checkout |
| **Goals** | Find and purchase familiar products from home; convenient delivery |

**User Journey:**
1. Discover store (word of mouth, social media - Instagram/Facebook linked)
2. Browse products by category or search
3. Add items to cart
4. Sign in with Google (simple, no password to remember)
5. Complete checkout with Stripe
6. Receive confirmation email
7. View order history anytime
8. Await delivery

### Secondary User Segment: Store Owner/Client

| Attribute | Description |
|-----------|-------------|
| **Profile** | Business owner receiving this platform |
| **Needs** | Simple, reliable store that works without technical intervention |
| **Goals** | Sell products, receive payments, fulfill orders, manage inventory |
| **Technical Level** | Non-technical; needs things to "just work" |

---

## Goals & Success Metrics

### Business Objectives

| Objective | Success Criteria |
|-----------|------------------|
| Launch production-ready store | Deployed to Vercel with custom domain |
| Enable self-service for client | Admin can add/edit/delete products without developer help |
| Reliable payment processing | 100% of successful payments update order status |
| Professional customer experience | Every order triggers confirmation email |

### User Success Metrics

- **Find products easily** → Search returns relevant results instantly
- **Complete purchase smoothly** → Checkout flow works without errors
- **Feel confident** → Receive email confirmation within seconds of payment
- **Track orders** → View order history and status anytime
- **Return to shop again** → Clean, fast, trustworthy experience

### Key Performance Indicators (KPIs)

| KPI | Target |
|-----|--------|
| Checkout completion rate | > 80% of carts that reach shipping step |
| Payment success rate | > 95% (Stripe handles this) |
| Email delivery rate | > 99% (Resend handles this) |
| Page load time | < 3 seconds |
| Uptime | 99.9% (Vercel SLA) |

---

## MVP Scope

### Already Complete (~85%)

| Feature | Status |
|---------|--------|
| Product catalog with categories | Done |
| Product detail pages | Done |
| Shopping cart (add/remove/update) | Done |
| User authentication (Google OAuth) | Done |
| 3-step checkout flow | Done |
| Stripe payment integration | Done |
| Order creation & storage | Done |
| Responsive design + dark mode | Done |
| About & Contact pages | Done |
| Error handling (404, error boundary) | Done |
| Loading states | Done |

### Remaining Work for Production (~15%)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | **Home → Products Redirect** | Remove hero banner, redirect `/` to `/products` | High |
| 2 | **Product Search** | Search bar in header, filter by product name | High |
| 3 | **User Profile Page** | View/edit profile info, shipping address | High |
| 4 | **Order History Page** | List past orders with status and details | High |
| 5 | **Stripe Webhook** | `/api/webhooks/stripe` to update `isPaid` status | Critical |
| 6 | **Email Notifications** | Order confirmation email via Resend | Critical |
| 7 | **Admin Dashboard** | Add/edit/delete products (protected route) | High |
| 8 | **Production Deployment** | Vercel setup, env vars, domain config | Critical |

**Supporting Tasks:**
- Migrate images to Supabase Storage
- Add RLS policies to all tables
- Create `.env.example` documentation

### Out of Scope for MVP

- Multiple payment methods (Stripe only is sufficient)
- Product reviews/ratings
- Wishlist/favorites
- Advanced filtering (price, brand)
- Inventory alerts/low stock notifications
- PDF invoice generation
- Refund handling UI (handle via Stripe dashboard)

### MVP Success Criteria

The project is **production-ready** when:
1. Customer can search, browse, purchase, and receive email confirmation
2. Customer can view profile and order history
3. Payment status updates automatically via webhook
4. Client can add/edit products via admin dashboard
5. Site is deployed with custom domain and HTTPS
6. All environment variables properly configured for production

---

## Technical Considerations

### Current Tech Stack (Keep As-Is)

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.0.10 |
| UI Library | React | 19.2.1 |
| Language | TypeScript | 5.x (strict) |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | Latest |
| Database | Supabase (PostgreSQL) | - |
| Auth | NextAuth v5 (Google OAuth) | 5.0.0-beta.30 |
| Payments | Stripe | 20.1.0 |
| Validation | Zod | 4.2.1 |
| Forms | React Hook Form | - |

### MCP Tools for Development

| MCP Server | Usage |
|------------|-------|
| **shadcn MCP** | Search/install components (DataTable for admin, Dialog for modals, Command for search palette) |
| **Supabase MCP** | List tables, execute SQL, apply migrations, generate TypeScript types, check advisors |

### New Dependencies

| Feature | Package | Why |
|---------|---------|-----|
| Email | `resend` | Simple API, great Next.js support, free tier (100 emails/day) |

### shadcn Components Needed

| Feature | Components to Install |
|---------|----------------------|
| Product Search | `command`, `dialog`, `popover` |
| Admin Dashboard | `data-table`, `dialog`, `dropdown-menu`, `form`, `input`, `textarea`, `select` |
| Confirmations | `alert-dialog` (delete confirmation) |

### Architecture for New Features

**1. Stripe Webhook**
```
/app/api/webhooks/stripe/route.ts
- POST handler
- Verify Stripe signature
- Handle payment_intent.succeeded
- Update order in Supabase
- Trigger email
```

**2. Product Search** (using shadcn `command`)
```
/components/layout/root_layout/SearchBar.tsx
- Command palette style (Cmd+K trigger optional)
- Or simple popover with search input
- Client-side filtering of products
```

**3. User Profile & Order History**
```
/app/(root)/user/
├── profile/page.tsx    # User profile view/edit
└── orders/page.tsx     # Order history list
```

**4. Admin Dashboard**
```
/app/(admin)/
├── layout.tsx      # Protected, admin-only layout
├── dashboard/      # Overview
└── products/       # CRUD for products
    ├── page.tsx    # DataTable with edit/delete
    ├── new/        # Add product form
    └── [id]/edit/  # Edit product form
```

**5. Email Service**
```
/lib/email.ts
- Resend client setup
- sendOrderConfirmation(order, user)
```

### Environment Variables (Production)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Auth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=xxx
AUTH_GOOGLE_ID=xxx
AUTH_GOOGLE_SECRET=xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
RESEND_API_KEY=re_xxx

# App
SERVER_URL=https://your-domain.com
```

---

## Constraints & Assumptions

### Constraints

| Category | Constraint |
|----------|------------|
| **Budget** | Minimal - using free tiers where possible (Vercel Hobby → Pro $20/mo, Resend free tier, Supabase free tier) |
| **Timeline** | Project needs to be production-ready for client handoff |
| **Resources** | Solo developer with learning goals alongside delivery |
| **Technical** | Must use existing tech stack (Next.js, Supabase, Stripe) - no major rewrites |
| **Auth** | Google OAuth only (no email/password - keeps it simple) |
| **Payment** | Stripe only, AUD currency |
| **Hosting** | Vercel (optimal for Next.js) |
| **Images** | Migrate to Supabase Storage (required for admin dashboard) |

### Key Assumptions

1. Client has a Google Workspace or Gmail account for OAuth admin
2. Client has Stripe account configured for AUD payments
3. Client will provide custom domain for deployment
4. Product catalog is small-medium (<500 products) - client-side search sufficient
5. Low-medium traffic expected initially (<1000 visitors/month)
6. Client is okay with Google-only sign-in for customers
7. No complex inventory management needed (just stock count)
8. Shipping is flat rate ($10 under $100, free over $100) - no complex calculations
9. Tax is fixed 15% - no complex tax rules by region
10. Admin access will be limited to client (single admin user initially)
11. Current 25 products will be migrated to Supabase Storage

### Image Migration Plan

| Step | Action |
|------|--------|
| 1 | Create `products` bucket in Supabase Storage (public) |
| 2 | Upload existing images from `/public/images/` to bucket |
| 3 | Update `Product.image` URLs in database to Supabase URLs |
| 4 | Admin dashboard will upload directly to Supabase Storage |
| 5 | Remove `/public/images/` from codebase |

### Free Tier Limits to Monitor

| Service | Free Limit | Action if Exceeded |
|---------|------------|-------------------|
| Vercel Hobby | 100GB bandwidth, non-commercial | Upgrade to Pro ($20/mo) |
| Supabase | 500MB database, 1GB storage | Upgrade to Pro ($25/mo) |
| Resend | 100 emails/day | Upgrade to Pro ($20/mo) |
| Stripe | No limit, 2.9% + 30¢ per transaction | N/A - pay per use |

---

## Risks & Open Questions

### Key Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Stripe webhook fails silently** | Orders marked unpaid despite payment | Medium | Add logging, test thoroughly, monitor Stripe dashboard |
| **Email delivery fails** | Customer has no confirmation | Low | Resend has 99%+ delivery; add order lookup by ID as backup |
| **Client can't use admin dashboard** | Products not updated | Medium | Create simple documentation, walkthrough video |
| **Image migration breaks existing products** | Product images don't load | Low | Test on staging first, keep backup of old URLs |
| **Google OAuth config issues in production** | Users can't sign in | Medium | Test OAuth redirect URLs before launch |
| **Supabase free tier limits hit** | Service degradation | Low | Monitor usage, upgrade path is clear ($25/mo) |
| **RLS policies missing** | Data security vulnerability | High | Run Supabase security advisors, add RLS before launch |

### Open Questions

| # | Question | Who Decides |
|---|----------|-------------|
| 1 | What custom domain will be used? | Client |
| 2 | Does client have Stripe account ready or need help setting up? | Client |
| 3 | Who will be the admin user(s)? Just client or others? | Client |
| 4 | What email address should order confirmations come from? | Client |
| 5 | Does client need help with product photography/images? | Client |

### Areas Needing Further Research

| Topic | Why |
|-------|-----|
| **Supabase RLS policies** | Currently disabled on all tables - security risk |
| **Admin role verification** | How to restrict admin dashboard to admin users only |
| **Resend email templates** | Best format for order confirmation email |
| **Stripe test vs live mode** | Ensure smooth transition from test to production keys |

---

## Next Steps

### Implementation Order

**Phase 1: Quick Wins** (Simple, high impact)
1. Home → Products redirect
2. User Profile page

**Phase 2: Core Customer Features**
3. Product Search
4. Order History page

**Phase 3: Critical Backend**
5. Stripe Webhook (payment status updates)
6. Email Notifications (order confirmation)

**Phase 4: Admin & Infrastructure**
7. Migrate images to Supabase Storage
8. Admin Dashboard (CRUD products)
9. Add RLS policies

**Phase 5: Launch**
10. Production deployment to Vercel
11. Configure production environment variables
12. Test end-to-end on production
13. Client handoff

### Immediate Actions

1. **Start Phase 1** → Home redirect + User Profile page
2. **Ask client** → Domain name, Stripe account status, admin email

---

## Appendix

### Database Schema (Current)

| Table | Purpose | RLS |
|-------|---------|-----|
| `Product` | Product catalog (25 items) | Disabled |
| `cart` | Shopping carts (session + user) | Disabled |
| `order` | Customer orders | Disabled |
| `order_item` | Order line items | Disabled |
| `user_profile` | User accounts | Disabled |

### Supabase Project

- **Project ID:** `qfsgcdkalznxfrwnmnnp`
- **Name:** Alshami_Store
- **Region:** ap-southeast-2 (Sydney)
- **Status:** ACTIVE_HEALTHY

---

*This Project Brief provides the full context for Alshami Store completion. Switch to Dev mode to begin implementation with step-by-step guidance and explanations.*
