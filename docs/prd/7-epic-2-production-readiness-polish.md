# 7. Epic 2: Production Readiness & Polish

**Epic Goal:** Prepare Alshami Store for production deployment by addressing security, code quality, UX polish, and critical bug fixes to ensure a reliable, maintainable, and production-safe e-commerce platform.

**Why This Epic:** Before deploying to production (Story 1.10), the application requires security hardening, consistency review, and critical bug fixes. This epic ensures the codebase meets production-quality standards.

---

## Existing System Context

- **Current Functionality:** Fully functional e-commerce store with product browsing, cart, checkout, Stripe payments, order history, admin product management, and image uploads
- **Technology Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase (Auth bypass via NextAuth), Stripe, Resend
- **Integration Points:** Supabase database/storage, Stripe webhooks, Resend email, NextAuth authentication
- **Completed Stories:** 1.1-1.9 (RLS, Products, Profile, Search, Orders, Webhooks, Email, Admin Dashboard, Image Upload)

---

## Epic Constraints (Apply to All Stories)

1. **Supabase MCP Required:** All database, storage, and auth configuration must use Supabase MCP tools
2. **shadcn MCP Required:** All shadcn/ui component interactions must use shadcn MCP tools
3. **No Over-Engineering:** Keep implementations minimal and readable
4. **Match Existing Patterns:** Follow established codebase conventions exactly
5. **Speed & Correctness:** Prioritize working solutions over perfect solutions

---

## Story 2.1: Security & Supabase Configuration Review

**As a** store owner,
**I want** Supabase security configuration reviewed and hardened,
**so that** the application is secure and production-safe.

### Acceptance Criteria

| #   | Criteria                                                             |
| --- | -------------------------------------------------------------------- |
| AC1 | All required environment variables documented and validated          |
| AC2 | Service role key usage audited (only in Server Actions after auth)   |
| AC3 | RLS policies reviewed for all tables (Product, cart, order, etc.)    |
| AC4 | No sensitive data exposed in client-side code                        |
| AC5 | Supabase security advisor shows no ERROR-level issues                |
| AC6 | Storage bucket policies reviewed (products bucket)                   |
| AC7 | Any security findings documented with remediation actions            |

### Integration Verification

| #   | Verification                                          |
| --- | ----------------------------------------------------- |
| IV1 | Existing functionality works after any policy changes |
| IV2 | Admin operations still function correctly             |
| IV3 | User data isolation verified                          |

---

## Story 2.2: Codebase Consistency Review

**As a** developer,
**I want** the codebase reviewed for consistency,
**so that** architecture and patterns are uniform across the project.

### Acceptance Criteria

| #   | Criteria                                                       |
| --- | -------------------------------------------------------------- |
| AC1 | Folder structure follows established architecture              |
| AC2 | All pages use `.wrapper` class for content containers          |
| AC3 | All colors use semantic CSS variables (no arbitrary Tailwind)  |
| AC4 | Typography uses established utility classes (h1-bold, etc.)    |
| AC5 | All forms use React Hook Form + Zod + useTransition pattern    |
| AC6 | Server Components vs Client Components used appropriately      |
| AC7 | Data fetching follows data-service.ts (reads) / actions.ts (writes) pattern |
| AC8 | Any inconsistencies documented and corrected                   |

### Integration Verification

| #   | Verification                                     |
| --- | ------------------------------------------------ |
| IV1 | All pages render correctly after any corrections |
| IV2 | Dark mode works on all pages                     |
| IV3 | Mobile responsiveness maintained                 |

---

## Story 2.3: Loading States & Deployment Readiness

**As a** customer,
**I want** smooth loading experiences,
**so that** I never see broken, flashing, or incomplete UI states.

### Acceptance Criteria

| #   | Criteria                                                        |
| --- | --------------------------------------------------------------- |
| AC1 | All async data fetching has appropriate loading states          |
| AC2 | Loading skeletons used where data takes time to load            |
| AC3 | No layout shift during loading transitions                      |
| AC4 | Error boundaries handle component failures gracefully           |
| AC5 | `npm run build` completes without errors                        |
| AC6 | `npm run lint` passes without errors                            |
| AC7 | No console errors in browser during normal usage                |
| AC8 | All pages load correctly in production build (`npm start`)      |

### Integration Verification

| #   | Verification                                       |
| --- | -------------------------------------------------- |
| IV1 | Product listing shows skeleton during load         |
| IV2 | Cart updates don't cause flashing                  |
| IV3 | Order pages handle loading states                  |
| IV4 | Admin dashboard loads smoothly                     |

---

## Story 2.4: SEO & Metadata Optimization

**As a** store owner,
**I want** proper SEO configuration on all pages,
**so that** the store ranks well in search engines.

### Acceptance Criteria

| #   | Criteria                                                            |
| --- | ------------------------------------------------------------------- |
| AC1 | All pages have appropriate `<title>` tags                           |
| AC2 | All pages have meta descriptions                                    |
| AC3 | Product pages have dynamic titles including product name            |
| AC4 | Open Graph metadata configured for social sharing (og:title, og:description, og:image) |
| AC5 | Canonical URLs set appropriately                                    |
| AC6 | robots.txt and sitemap.xml present (if applicable)                  |
| AC7 | No duplicate title tags or meta descriptions                        |

### Integration Verification

| #   | Verification                                       |
| --- | -------------------------------------------------- |
| IV1 | Social media preview shows correct information     |
| IV2 | Search engine can crawl public pages               |
| IV3 | Admin pages excluded from search indexing          |

---

## Story 2.5: Purchase Email Delivery Fix (Critical)

**As a** customer,
**I want** to receive purchase confirmation emails,
**so that** I have proof of my order.

### Problem Statement

The system currently shows successful payment but does not send purchase confirmation emails, even in testing. This is a critical bug affecting customer experience.

### Acceptance Criteria

| #   | Criteria                                                          |
| --- | ----------------------------------------------------------------- |
| AC1 | Root cause of email delivery failure identified                   |
| AC2 | Resend API configuration verified (API key, domain, sender)       |
| AC3 | Email sending logic in webhook handler reviewed                   |
| AC4 | Error logging added to email sending for debugging                |
| AC5 | Email successfully sent after Stripe payment in test mode         |
| AC6 | Email successfully sent after Stripe payment in live mode         |
| AC7 | Email contains correct order details (ID, items, totals, address) |

### Integration Verification

| #   | Verification                                              |
| --- | --------------------------------------------------------- |
| IV1 | Complete test purchase flow → email received              |
| IV2 | Webhook returns 200 regardless of email success/failure   |
| IV3 | Order status updates correctly even if email fails        |
| IV4 | Email delivery logged for monitoring                      |

---

## Story 2.6: Product Slug Auto-Generation

**As an** admin,
**I want** product slugs auto-generated from the product name,
**so that** I don't have to manually create SEO-friendly URLs.

### Acceptance Criteria

| #   | Criteria                                                           |
| --- | ------------------------------------------------------------------ |
| AC1 | Slug field auto-populates when admin types product name            |
| AC2 | Slug is kebab-case (lowercase, hyphens instead of spaces)          |
| AC3 | Special characters removed from slug                               |
| AC4 | Slug field is read-only or hidden (not manually editable)          |
| AC5 | Slug uniqueness validated before product creation                  |
| AC6 | Existing products with manually entered slugs remain unchanged     |
| AC7 | Edit form shows current slug but doesn't allow modification        |

### Integration Verification

| #   | Verification                                         |
| --- | ---------------------------------------------------- |
| IV1 | New products accessible via auto-generated slug      |
| IV2 | Product detail pages load correctly with new slugs   |
| IV3 | No slug conflicts when creating products             |

---

## Story 2.7: Image Upload Verification

**As a** store owner,
**I want** image uploads verified,
**so that** I can be confident product images work correctly.

### Acceptance Criteria

| #   | Criteria                                                     |
| --- | ------------------------------------------------------------ |
| AC1 | Image upload to Supabase Storage works (all file types)      |
| AC2 | Uploaded images stored with correct content types            |
| AC3 | Public URLs are valid and accessible                         |
| AC4 | No silent upload failures (errors shown to user)             |
| AC5 | Image preview displays correctly after upload                |
| AC6 | Uploaded images display correctly on product pages           |
| AC7 | Large images handled appropriately (size validation working) |

### Integration Verification

| #   | Verification                                    |
| --- | ----------------------------------------------- |
| IV1 | Upload JPG, PNG, WebP → all succeed             |
| IV2 | Upload invalid types → clear error message      |
| IV3 | Upload oversized files → clear error message    |
| IV4 | Products display uploaded images on public site |

---

## Definition of Done (Epic-Level)

- [ ] All 7 stories completed with acceptance criteria met
- [ ] No ERROR-level security issues in Supabase advisor
- [ ] `npm run build` and `npm run lint` pass
- [ ] Purchase confirmation emails working reliably
- [ ] All pages render correctly with proper loading states
- [ ] Codebase follows consistent patterns throughout
- [ ] Ready for Story 1.10 (Production Deployment)

---

## Risk Mitigation

| Risk                              | Mitigation                                          |
| --------------------------------- | --------------------------------------------------- |
| Security review reveals issues    | Address issues before deployment, document all findings |
| Email fix requires Resend changes | Have backup email provider ready if needed          |
| Consistency fixes break features  | Test each change before moving to next              |
| Time constraints                  | Prioritize: Security > Email Fix > Others           |

---

## Recommended Story Order

1. **Story 2.5** - Email Fix (Critical bug, highest priority)
2. **Story 2.1** - Security Review (Must-do before production)
3. **Story 2.6** - Slug Auto-Generation (UX improvement)
4. **Story 2.7** - Image Verification (Confidence check)
5. **Story 2.2** - Codebase Consistency (Quality)
6. **Story 2.3** - Loading States (UX polish)
7. **Story 2.4** - SEO Optimization (Enhancement)

---

## Change Log

| Date       | Version | Description         | Author     |
| ---------- | ------- | ------------------- | ---------- |
| 2026-02-01 | 1.0     | Initial epic draft  | PM (John)  |

