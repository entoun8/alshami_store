# 10. Testing Strategy

## Integration with Existing Tests

| Aspect | Current State |
|--------|---------------|
| **Existing Test Framework** | None - no test files found in codebase |
| **Test Organization** | N/A |
| **Coverage Requirements** | None established |

**Decision:** Given no existing test infrastructure, this enhancement will focus on **manual testing** with documented test cases rather than introducing automated testing. Automated testing can be added as a future enhancement.

## New Testing Requirements

### Manual Testing Approach

All features will be verified through documented manual test cases executed before each deployment.

#### Story 1.1: RLS Policies - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| RLS-1 | Anonymous user can view products | Visit `/products` without logging in | Products display correctly |
| RLS-2 | Anonymous user cannot view others' carts | Attempt to query cart table directly via Supabase | Query returns empty or error |
| RLS-3 | Logged-in user sees only own cart | Log in, add items, check cart | Only user's cart items visible |
| RLS-4 | Logged-in user sees only own orders | Log in, visit `/user/orders` | Only user's orders displayed |
| RLS-5 | User cannot access other user's order | Try to visit `/order/[other-user-order-id]` | 404 or access denied |
| RLS-6 | Admin can CRUD products | Log in as admin, create/edit/delete product | All operations succeed |
| RLS-7 | Non-admin cannot CRUD products | Log in as regular user, attempt admin actions | Operations fail with 403 |

#### Story 1.2: Home Redirect - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| REDIR-1 | Root redirects to products | Visit `/` | Redirected to `/products` |
| REDIR-2 | Navigation still works | Click logo, header links | All navigation functional |

#### Story 1.3: User Profile - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| PROF-1 | Profile page requires auth | Visit `/user/profile` logged out | Redirected to sign-in |
| PROF-2 | Profile displays user data | Log in, visit profile | Name, email, image shown |
| PROF-3 | Can update name | Edit name, save | Name updated, toast shown |
| PROF-4 | Can update address | Edit address fields, save | Address saved, toast shown |
| PROF-5 | Validation works | Submit invalid data | Error messages displayed |

#### Story 1.4: Product Search - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| SRCH-1 | Search opens with click | Click search icon in header | Command palette opens |
| SRCH-2 | Search opens with keyboard | Press Cmd+K / Ctrl+K | Command palette opens |
| SRCH-3 | Search filters products | Type product name | Matching products shown |
| SRCH-4 | Search is case-insensitive | Type lowercase for uppercase product | Product found |
| SRCH-5 | Empty state shows | Search for nonexistent product | "No results" message |
| SRCH-6 | Selection navigates | Click or Enter on result | Navigates to product page |
| SRCH-7 | Escape closes | Press Escape | Modal closes |

#### Story 1.5: Order History - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| ORD-1 | Order history requires auth | Visit `/user/orders` logged out | Redirected to sign-in |
| ORD-2 | Orders display correctly | Log in with orders, visit page | All orders listed |
| ORD-3 | Order status shows correctly | Check paid vs unpaid orders | Correct badge colors |
| ORD-4 | Order links work | Click order row | Navigates to order detail |
| ORD-5 | Empty state shows | New user with no orders | "No orders yet" message |
| ORD-6 | Pagination works | User with 11+ orders | Pagination controls shown |

#### Story 1.6: Stripe Webhook - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| WH-1 | Webhook receives events | Use Stripe CLI to send test event | 200 response logged |
| WH-2 | Invalid signature rejected | Send request without valid signature | 400 response |
| WH-3 | Order status updates | Complete payment, check order | `isPaid=true`, `paidAt` set |
| WH-4 | Order page reflects status | Visit order page after payment | Shows "Paid" status |

**Stripe CLI Testing Command:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

#### Story 1.7: Order Confirmation Email - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| EMAIL-1 | Email sent after payment | Complete payment, check inbox | Email received |
| EMAIL-2 | Email contains order details | Open email | Order ID, items, total shown |
| EMAIL-3 | Email failure doesn't break webhook | Simulate email error | Order still marked paid |

#### Story 1.8: Admin Dashboard - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| ADMIN-1 | Admin page requires admin role | Visit `/admin/products` as regular user | 403 or redirect |
| ADMIN-2 | Admin can view products | Log in as admin, visit dashboard | Product list shown |
| ADMIN-3 | Admin can create product | Fill form, submit | Product created, appears in list |
| ADMIN-4 | Admin can edit product | Click edit, change data, save | Product updated |
| ADMIN-5 | Admin can delete product | Click delete, confirm | Product removed |
| ADMIN-6 | Slug auto-generates | Enter name, check slug | Slug generated from name |
| ADMIN-7 | Validation works | Submit invalid data | Error messages shown |

#### Story 1.9: Image Upload - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| IMG-1 | Can upload valid image | Select JPG/PNG/WebP < 2MB | Image uploaded, preview shown |
| IMG-2 | Invalid type rejected | Select PDF or GIF | Error message shown |
| IMG-3 | Oversized file rejected | Select image > 2MB | Error message shown |
| IMG-4 | Image displays on product | Create product with image | Image shows on product page |

#### Story 1.10: Production Deployment - Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| PROD-1 | Site loads on production URL | Visit production domain | Home page loads |
| PROD-2 | HTTPS works | Check browser padlock | Valid SSL certificate |
| PROD-3 | Google OAuth works | Click sign in, complete OAuth | Successfully logged in |
| PROD-4 | Full purchase flow | Add to cart → Checkout → Pay | Order created, email received |
| PROD-5 | Admin dashboard works | Log in as admin, CRUD product | All operations succeed |

## Integration Tests (Manual)

**Full User Journey Test:**
```
1. Visit site (anonymous)
2. Browse products
3. Search for a product
4. Add items to cart
5. Sign in with Google
6. Verify cart items preserved
7. Proceed to checkout
8. Enter shipping address
9. Select payment method
10. Review and place order
11. Complete Stripe payment
12. Verify order status updates to "Paid"
13. Check email for confirmation
14. Visit order history
15. Verify order appears in history
```

**Admin Journey Test:**
```
1. Sign in as admin user
2. Navigate to /admin/products
3. Create new product with image
4. Verify product appears on public site
5. Edit product details
6. Verify changes reflected
7. Delete product
8. Verify product removed from public site
```

## Regression Testing

| Area | Verification Steps |
|------|-------------------|
| **Existing Product Browsing** | Products page loads, filtering works, pagination works |
| **Existing Cart Flow** | Add/remove/update items, cart persists |
| **Existing Checkout Flow** | All 3 steps work, order created |
| **Existing Order Detail** | Order page loads with items and totals |
| **Existing Authentication** | Sign in/out works, session persists |
| **Dark Mode** | Toggle works, all pages render correctly |
| **Mobile Responsiveness** | Test on mobile viewport, navigation works |

## Automated Testing Recommendation (Future)

If automated testing is introduced in the future:

| Test Type | Recommended Tool | Priority |
|-----------|------------------|----------|
| **Unit Tests** | Vitest | Medium - for utility functions, validators |
| **Component Tests** | Vitest + Testing Library | Medium - for form components |
| **E2E Tests** | Playwright | High - for critical user journeys |
| **API Tests** | Vitest | Low - Server Actions are type-safe |

**Suggested Future Test Structure:**
```
__tests__/
├── unit/
│   ├── utils.test.ts
│   └── validators.test.ts
├── components/
│   ├── SearchCommand.test.tsx
│   └── UserProfileForm.test.tsx
└── e2e/
    ├── purchase-flow.spec.ts
    └── admin-dashboard.spec.ts
```

---
