# 7. Source Tree

## Existing Project Structure (Relevant Parts)

```
alshami_store/
├── app/
│   ├── (auth)/
│   │   └── sign-in/page.tsx
│   ├── (root)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home page (to be redirected)
│   │   ├── loading.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── shipping-address/page.tsx
│   │   ├── payment-method/page.tsx
│   │   ├── place-order/page.tsx
│   │   ├── order/[id]/
│   │   │   ├── page.tsx
│   │   │   └── stripe-payment-success/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── authentication/
│   │   ├── SignInButton.tsx
│   │   ├── SignOutButton.tsx
│   │   └── UserMenu.tsx
│   ├── cart/
│   │   ├── AddToCart.tsx
│   │   ├── CartIcon.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartView.tsx
│   │   └── OrderSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutSteps.tsx
│   │   ├── ShippingAddressForm.tsx
│   │   ├── PaymentMethodForm.tsx
│   │   ├── PlaceOrderButton.tsx
│   │   ├── StripePayment.tsx
│   │   └── StripeForm.tsx
│   ├── layout/
│   │   ├── Logo.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── root_layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── products/
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   ├── ProductListSkeleton.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── CategoryFilterWrapper.tsx
│   │   └── ProductPagination.tsx
│   └── providers/
│       └── ThemeProvider.tsx
│
├── lib/
│   ├── constants.ts
│   ├── utils.ts
│   ├── supabase.ts
│   ├── auth.ts
│   ├── data-service.ts
│   └── actions.ts
│   └── validators.ts
│
├── types.ts
├── middleware.ts
└── supabase/
    └── migrations/
```

## New File Organization

```
alshami_store/
├── app/
│   ├── (root)/
│   │   ├── page.tsx                    # MODIFY: Add redirect to /products
│   │   │
│   │   └── user/                       # NEW: User account pages
│   │       ├── profile/
│   │       │   └── page.tsx            # NEW: User profile page
│   │       └── orders/
│   │           └── page.tsx            # NEW: Order history page
│   │
│   ├── (admin)/                        # NEW: Admin route group
│   │   ├── layout.tsx                  # NEW: Admin layout with auth check
│   │   └── admin/
│   │       └── products/
│   │           ├── page.tsx            # NEW: Product list/table
│   │           ├── new/
│   │           │   └── page.tsx        # NEW: Create product form
│   │           └── [id]/
│   │               └── edit/
│   │                   └── page.tsx    # NEW: Edit product form
│   │
│   └── api/
│       └── webhooks/
│           └── stripe/
│               └── route.ts            # NEW: Stripe webhook handler
│
├── components/
│   ├── search/                         # NEW: Search feature
│   │   └── SearchCommand.tsx           # NEW: Command palette search
│   │
│   ├── user/                           # NEW: User account components
│   │   ├── UserProfileForm.tsx         # NEW: Profile edit form
│   │   └── OrderHistoryList.tsx        # NEW: Order history display
│   │
│   ├── admin/                          # NEW: Admin components
│   │   ├── AdminProductTable.tsx       # NEW: Product management table
│   │   ├── AdminProductForm.tsx        # NEW: Product create/edit form
│   │   ├── ImageUpload.tsx             # NEW: Image upload component
│   │   └── DeleteProductDialog.tsx     # NEW: Delete confirmation
│   │
│   ├── layout/
│   │   └── root_layout/
│   │       └── Header.tsx              # MODIFY: Add search trigger
│   │
│   └── authentication/
│       └── UserMenu.tsx                # MODIFY: Add Profile/Orders links
│
├── lib/
│   ├── supabase-admin.ts               # NEW: Service role Supabase client
│   ├── email.ts                        # NEW: Email service (Resend)
│   ├── data-service.ts                 # MODIFY: Add getUserOrders, etc.
│   ├── actions.ts                      # MODIFY: Add admin actions, updateProfile
│   └── validators.ts                   # MODIFY: Add updateProfileSchema
│
└── supabase/
    └── migrations/
        ├── YYYYMMDD_enable_rls.sql     # NEW: RLS policies migration
        └── YYYYMMDD_create_storage.sql # NEW: Storage bucket migration
```

## Integration Guidelines

| Guideline | Implementation |
|-----------|----------------|
| **File Naming** | kebab-case for files matching existing pattern (e.g., `data-service.ts`), PascalCase for components (e.g., `SearchCommand.tsx`) |
| **Folder Organization** | Feature-based grouping: `components/search/`, `components/user/`, `components/admin/` |
| **Import/Export Patterns** | Named exports for utilities/actions, default exports for components; use `@/` path alias |

## New Files Summary

| File | Story | Type | Purpose |
|------|-------|------|---------|
| `app/(root)/user/profile/page.tsx` | 1.3 | Page | User profile view/edit |
| `app/(root)/user/orders/page.tsx` | 1.5 | Page | Order history list |
| `app/(admin)/layout.tsx` | 1.8 | Layout | Admin auth check wrapper |
| `app/(admin)/admin/products/page.tsx` | 1.8 | Page | Product management list |
| `app/(admin)/admin/products/new/page.tsx` | 1.8 | Page | Create product |
| `app/(admin)/admin/products/[id]/edit/page.tsx` | 1.8 | Page | Edit product |
| `app/api/webhooks/stripe/route.ts` | 1.6 | Route Handler | Stripe webhook |
| `components/search/SearchCommand.tsx` | 1.4 | Component | Search command palette |
| `components/user/UserProfileForm.tsx` | 1.3 | Component | Profile form |
| `components/user/OrderHistoryList.tsx` | 1.5 | Component | Order history |
| `components/admin/AdminProductTable.tsx` | 1.8 | Component | Product table |
| `components/admin/AdminProductForm.tsx` | 1.8 | Component | Product form |
| `components/admin/ImageUpload.tsx` | 1.9 | Component | Image uploader |
| `components/admin/DeleteProductDialog.tsx` | 1.8 | Component | Delete confirmation |
| `lib/supabase-admin.ts` | 1.6/1.8 | Utility | Service role client |
| `lib/email.ts` | 1.7 | Utility | Resend email service |

## Modified Files Summary

| File | Story | Modification |
|------|-------|--------------|
| `app/(root)/page.tsx` | 1.2 | Add redirect to `/products` |
| `components/layout/root_layout/Header.tsx` | 1.4 | Add search trigger button |
| `components/authentication/UserMenu.tsx` | 1.3/1.5 | Add Profile and Orders links |
| `lib/data-service.ts` | 1.3/1.5 | Add `getUserOrders`, `getUserProfile` by ID |
| `lib/actions.ts` | 1.3/1.8 | Add `updateUserProfile`, admin CRUD actions |
| `lib/validators.ts` | 1.3 | Add `updateProfileSchema` |
| `components/checkout/StripeForm.tsx` or related | 1.6 | Add `orderId` to PaymentIntent metadata |

## Route Structure After Enhancement

| Route | Type | Auth Required | Admin Only |
|-------|------|---------------|------------|
| `/` | Redirect | No | No |
| `/products` | Page | No | No |
| `/products/[slug]` | Page | No | No |
| `/cart` | Page | No | No |
| `/shipping-address` | Page | Yes | No |
| `/payment-method` | Page | Yes | No |
| `/place-order` | Page | Yes | No |
| `/order/[id]` | Page | Yes | No |
| `/user/profile` | Page | Yes | No |
| `/user/orders` | Page | Yes | No |
| `/admin/products` | Page | Yes | Yes |
| `/admin/products/new` | Page | Yes | Yes |
| `/admin/products/[id]/edit` | Page | Yes | Yes |
| `/api/webhooks/stripe` | Route Handler | No* | No |
| `/sign-in` | Page | No | No |
| `/about` | Page | No | No |
| `/contact` | Page | No | No |

*Webhook authenticated via Stripe signature, not user session

---
