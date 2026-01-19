# 6. Epic 1: Alshami Store Production Readiness

**Epic Goal:** Complete the final 15% of Alshami Store to deliver a production-ready e-commerce platform with search, user profiles, order history, automated payment status updates, email confirmations, and admin product management.

**Integration Requirements:**
- All features must work with existing auth (NextAuth + Google OAuth)
- All database operations must comply with RLS policies
- All UI must follow existing design system
- All forms must use React Hook Form + Zod validation
- Existing checkout, cart, and product flows must remain fully functional

---

## Story 1.1: Enable Row Level Security Policies

**As a** store owner,
**I want** my customer data protected by row-level security,
**so that** users can only access their own data and the platform meets security standards.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | RLS is enabled on all 5 public tables: `Product`, `cart`, `order`, `order_item`, `user_profile` |
| AC2 | `Product` table has policy: Anyone can SELECT (public catalog) |
| AC3 | `Product` table has policy: Only admin role can INSERT, UPDATE, DELETE |
| AC4 | `cart` table has policy: Users can only access their own cart (by `user_id` or `session_cart_id`) |
| AC5 | `order` table has policy: Users can only SELECT their own orders; INSERT requires authenticated user |
| AC6 | `order_item` table has policy: Users can only access items for their own orders |
| AC7 | `user_profile` table has existing policies activated |
| AC8 | Functions `create_order_atomic` and `update_updated_at_column` have `search_path` set to `''` |
| AC9 | All Supabase security advisor ERROR-level issues are resolved |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Existing product browsing works (anonymous users can view products) |
| IV2 | Existing cart functionality works (add/remove/update items) |
| IV3 | Existing checkout flow completes successfully |
| IV4 | Existing order detail page loads for order owner |
| IV5 | User cannot access another user's cart or orders |

---

## Story 1.2: Home Page Redirect to Products

**As a** customer,
**I want** to land directly on the products page when visiting the store,
**so that** I can start shopping immediately without extra clicks.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Visiting `/` redirects to `/products` (HTTP 307 or 308 redirect) |
| AC2 | The hero/banner landing page content is removed or archived |
| AC3 | About and Contact pages remain accessible from header navigation |
| AC4 | SEO metadata is updated appropriately |
| AC5 | Any internal links pointing to `/` are updated if needed |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Header navigation still works |
| IV2 | Footer links still work |
| IV3 | Logo click behavior is appropriate |

---

## Story 1.3: User Profile Page

**As a** logged-in customer,
**I want** to view and edit my profile information,
**so that** I can manage my account details and save my shipping address.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Profile page exists at `/user/profile` and requires authentication |
| AC2 | Page displays user's name, email, and profile image |
| AC3 | Page displays user's saved shipping address (from `user_profile.address`) |
| AC4 | User can edit their full name via a form |
| AC5 | User can edit/add their shipping address |
| AC6 | Form uses React Hook Form + Zod validation |
| AC7 | Success/error feedback via Sonner toast |
| AC8 | Unauthenticated users are redirected to sign-in |
| AC9 | Profile link accessible from user dropdown menu |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Existing user dropdown menu still functions |
| IV2 | Profile updates persist correctly in database |
| IV3 | RLS allows user to update only their own profile |

---

## Story 1.4: Product Search

**As a** customer,
**I want** to search for products by name,
**so that** I can quickly find what I'm looking for.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Search trigger button/icon visible in header |
| AC2 | Clicking opens command palette modal (shadcn `command` + `dialog`) |
| AC3 | User can type to filter products by name (case-insensitive) |
| AC4 | Results appear instantly as user types |
| AC5 | Each result shows product name, category, and price |
| AC6 | Clicking result navigates to product detail page |
| AC7 | Keyboard navigation: ↑↓ to navigate, Enter to select, Esc to close |
| AC8 | Empty state shown when no results |
| AC9 | Modal closes after selection or Esc |
| AC10 | Optional: Cmd+K / Ctrl+K shortcut |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Header layout intact on desktop and mobile |
| IV2 | Existing category filtering still works |
| IV3 | Product detail pages load correctly from search |

---

## Story 1.5: Order History Page

**As a** logged-in customer,
**I want** to view my past orders,
**so that** I can track my purchase history.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Order history page at `/user/orders` requires authentication |
| AC2 | Lists all orders for authenticated user, newest first |
| AC3 | Each order shows: Order ID, date, status, item count, total |
| AC4 | Status uses Badge: green for Paid, amber for Unpaid |
| AC5 | Clicking order navigates to order detail page |
| AC6 | Empty state if no orders |
| AC7 | Pagination if >10 orders |
| AC8 | Link accessible from user dropdown |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Existing order detail page still works |
| IV2 | RLS ensures users only see their own orders |
| IV3 | Status correctly reflects `isPaid` field |

---

## Story 1.6: Stripe Webhook Integration

**As a** store owner,
**I want** order payment status to update automatically,
**so that** orders are marked paid after successful payment.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Route Handler at `/api/webhooks/stripe/route.ts` |
| AC2 | Verifies Stripe signature using `STRIPE_WEBHOOK_SECRET` |
| AC3 | Handles `payment_intent.succeeded` event |
| AC4 | Updates order `isPaid` to `true` |
| AC5 | Sets order `paidAt` to current timestamp |
| AC6 | Order identified by payment intent metadata |
| AC7 | Returns 200 OK for processed events |
| AC8 | Returns 400 for invalid signatures |
| AC9 | Returns 200 for unhandled event types |
| AC10 | Errors are logged |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Existing Stripe payment flow works |
| IV2 | Order detail page reflects updated status |
| IV3 | Testable with Stripe CLI |

---

## Story 1.7: Order Confirmation Email

**As a** customer,
**I want** to receive an email confirmation after payment,
**so that** I have a record of my purchase.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Resend SDK installed and configured |
| AC2 | Email service at `lib/email.ts` with `sendOrderConfirmation` |
| AC3 | Email triggered from webhook after order marked paid |
| AC4 | Sent to customer's email address |
| AC5 | Includes: Order ID, date, items, shipping address, totals |
| AC6 | Professional HTML format |
| AC7 | "From" address configurable |
| AC8 | Delivery failures logged but don't break webhook |
| AC9 | Works in dev and production |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Webhook returns 200 even if email fails |
| IV2 | Order marked paid regardless of email status |
| IV3 | Email data matches order detail page |

---

## Story 1.8: Admin Dashboard - Product Management

**As a** store owner (admin),
**I want** to manage products through a web interface,
**so that** I can update inventory without developer help.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Admin route group at `/(admin)/` with layout auth check |
| AC2 | Non-admin users get 403 or redirect |
| AC3 | Dashboard at `/admin/products` |
| AC4 | Products table with: name, category, price, stock, actions |
| AC5 | "Add Product" → `/admin/products/new` |
| AC6 | Form includes all fields with slug auto-generation |
| AC7 | Validation uses `insertProductSchema` |
| AC8 | Edit form at `/admin/products/[id]/edit` |
| AC9 | Delete shows `alert-dialog` confirmation |
| AC10 | Toast feedback for all actions |
| AC11 | Image field accepts URL (upload separate story) |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Products created appear on public site |
| IV2 | Edits reflected on product detail |
| IV3 | Deletes remove from public site |
| IV4 | RLS allows admin operations |

---

## Story 1.9: Image Migration to Supabase Storage

**As a** store owner,
**I want** product images in Supabase Storage,
**so that** I can upload images via admin dashboard.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Supabase Storage bucket `products` created (public read) |
| AC2 | Existing images migrated from `/public/images/` |
| AC3 | `Product.image` URLs updated to Supabase URLs |
| AC4 | Admin form includes image upload |
| AC5 | Upload validates type (jpg, png, webp) and size (max 2MB) |
| AC6 | Unique filenames prevent conflicts |
| AC7 | Image preview in admin form |
| AC8 | `/public/images/` can be removed after verification |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | Existing product images display correctly |
| IV2 | Product detail pages show correct images |
| IV3 | Cart shows correct product images |
| IV4 | New products can use uploaded images |

---

## Story 1.10: Production Deployment

**As a** store owner,
**I want** the store deployed to production,
**so that** customers can access the live store.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | `.env.example` documents all required variables |
| AC2 | Deployed to Vercel |
| AC3 | Custom domain configured with HTTPS |
| AC4 | All env vars set in Vercel |
| AC5 | `NEXTAUTH_URL` and `SERVER_URL` point to production |
| AC6 | Google OAuth URIs updated for production |
| AC7 | Stripe webhook configured in Dashboard |
| AC8 | Stripe keys switched to live mode |
| AC9 | Resend domain verified |
| AC10 | E2E test: Browse → Cart → Checkout → Pay → Email |

### Integration Verification

| # | Verification |
|---|-------------|
| IV1 | All pages load on production domain |
| IV2 | Google OAuth works |
| IV3 | Stripe payment completes with live keys |
| IV4 | Webhook updates order status |
| IV5 | Email received |
| IV6 | Admin dashboard functional |

---
