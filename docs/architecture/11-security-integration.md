# 11. Security Integration

## Existing Security Measures

| Aspect | Current Implementation |
|--------|------------------------|
| **Authentication** | NextAuth v5 with Google OAuth; session-based |
| **Authorization** | Middleware protects routes (`/shipping-address`, `/payment-*`, `/place-order`, `/order/*`) |
| **Data Protection** | ❌ **CRITICAL: RLS disabled on all tables** |
| **Security Tools** | HTTPS (via Vercel), secure cookies, CSRF protection (NextAuth) |

## Current Security Issues (from Supabase Advisors)

| Level | Issue | Affected | Status |
|-------|-------|----------|--------|
| 🔴 **ERROR** | RLS Disabled | `Product`, `cart`, `order`, `order_item`, `user_profile` | To be fixed in Story 1.1 |
| 🔴 **ERROR** | Policies exist but RLS not enabled | `user_profile` | To be fixed in Story 1.1 |
| 🟡 **WARN** | Function search_path mutable | `create_order_atomic` | To be fixed in Story 1.1 |
| 🟡 **WARN** | Function search_path mutable | `update_updated_at_column` | To be fixed in Story 1.1 |
| 🟡 **WARN** | Leaked password protection disabled | Auth | N/A - using OAuth only |

## Enhancement Security Requirements

### Defense in Depth Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                        LAYER 1: Edge                            │
│  • HTTPS (Vercel automatic)                                     │
│  • DDoS protection (Vercel)                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 2: Application                         │
│  • NextAuth session validation                                  │
│  • Middleware route protection                                  │
│  • Admin role check in layouts                                  │
│  • Server Action role verification                              │
│  • Zod input validation                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     LAYER 3: Database                           │
│  • Supabase RLS policies                                        │
│  • Row-level access control                                     │
│  • Service role isolation                                       │
└─────────────────────────────────────────────────────────────────┘
```

### New Security Measures

| Measure | Implementation | Story |
|---------|----------------|-------|
| **Row Level Security** | Enable RLS on all 5 tables with appropriate policies | 1.1 |
| **Admin Route Protection** | `(admin)/layout.tsx` checks `session.user.role === 'admin'` | 1.8 |
| **Admin Action Protection** | Each admin Server Action verifies admin role | 1.8 |
| **Webhook Signature Verification** | Stripe signature verification before processing | 1.6 |
| **Service Role Isolation** | Separate Supabase client for privileged operations | 1.6, 1.8 |
| **Input Validation** | Zod schemas for all new forms and actions | All |
| **File Upload Validation** | Type and size validation for image uploads | 1.9 |

## Security Implementation Details

### 1. Row Level Security Policies (Story 1.1)

**Principle:** Users can only access their own data; admins have elevated access for product management.

```sql
-- CRITICAL: Enable RLS on all tables
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- Product: Public read, admin write
CREATE POLICY "public_read" ON public."Product" FOR SELECT USING (true);
CREATE POLICY "admin_insert" ON public."Product" FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_update" ON public."Product" FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_delete" ON public."Product" FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin'));

-- Cart: Owner access only (by user_id or session_cart_id)
-- Order: Owner read, authenticated insert
-- Order Item: Access via order ownership
-- User Profile: Existing policies activated
```

### 2. Admin Authorization Flow

```
Request to /admin/*
        │
        ▼
┌───────────────────┐
│ Middleware Check  │ ─── Not authenticated ──▶ Redirect to /sign-in
│ (middleware.ts)   │
└───────────────────┘
        │ Authenticated
        ▼
┌───────────────────┐
│ Layout Check      │ ─── role !== 'admin' ──▶ Return 403 Forbidden
│ ((admin)/layout)  │
└───────────────────┘
        │ Admin role
        ▼
┌───────────────────┐
│ Render Page       │
└───────────────────┘
        │
        ▼ (on mutation)
┌───────────────────┐
│ Server Action     │ ─── role !== 'admin' ──▶ Return { success: false }
│ Role Check        │
└───────────────────┘
        │ Admin role
        ▼
┌───────────────────┐
│ Supabase Admin    │ ─── Service role key
│ Client Operation  │
└───────────────────┘
```

### 3. Webhook Security

```typescript
// app/api/webhooks/stripe/route.ts

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // SECURITY: Verify signature BEFORE any processing
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Process verified event...

  } catch (err) {
    // SECURITY: Log failed verification attempts
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
```

### 4. Service Role Key Isolation

```typescript
// lib/supabase.ts - ANON KEY (client-safe)
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Safe to expose
);

// lib/supabase-admin.ts - SERVICE ROLE (server-only)
import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // NEVER expose to client
  );
}
```

**Usage Rules:**
| Operation | Client | Reason |
|-----------|--------|--------|
| User reads own data | Anon | RLS allows |
| User writes own data | Anon | RLS allows |
| Admin reads all products | Anon | RLS allows (public read) |
| Admin writes products | Service Role | Bypasses RLS for reliability |
| Webhook updates orders | Service Role | No user session available |

### 5. Input Validation Security

```typescript
// All user input validated with Zod before processing

// Profile update - prevent injection
const updateProfileSchema = z.object({
  fullName: z.string().min(3).max(100), // Length limits
  address: z.object({
    streetAddress: z.string().min(3).max(200),
    city: z.string().min(2).max(100),
    postalCode: z.string().min(3).max(20),
    country: z.string().min(2).max(100),
  }),
});

// File upload - type and size validation
const imageUploadSchema = z.object({
  file: z.custom<File>()
    .refine((f) => f.size <= 2 * 1024 * 1024, "Max 2MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Only JPG, PNG, WebP allowed"
    ),
});
```

### 6. Environment Variable Security

| Variable | Exposure | Verification |
|----------|----------|--------------|
| `NEXT_PUBLIC_*` | Client + Server | Only non-sensitive values |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Never prefix with `NEXT_PUBLIC_` |
| `STRIPE_SECRET_KEY` | Server only | Never prefix with `NEXT_PUBLIC_` |
| `STRIPE_WEBHOOK_SECRET` | Server only | Never prefix with `NEXT_PUBLIC_` |
| `RESEND_API_KEY` | Server only | Never prefix with `NEXT_PUBLIC_` |
| `NEXTAUTH_SECRET` | Server only | Strong random value (32+ chars) |

## Security Testing Requirements

| Test | Method | Expected Result |
|------|--------|-----------------|
| **RLS blocks cross-user access** | Try to query other user's cart/orders | Empty result or error |
| **Admin routes protected** | Access `/admin/*` as non-admin | 403 Forbidden |
| **Admin actions protected** | Call admin action as non-admin | `{ success: false }` |
| **Webhook rejects invalid signature** | Send request without valid signature | 400 Bad Request |
| **Service role key not exposed** | Check browser network tab | Key not visible |
| **Input validation works** | Submit malformed data | Validation errors returned |
| **File upload validation works** | Upload invalid file type/size | Rejection with error message |

## Compliance Considerations

| Area | Status | Notes |
|------|--------|-------|
| **HTTPS** | ✅ Automatic via Vercel | All traffic encrypted |
| **Data Encryption at Rest** | ✅ Supabase default | Database encrypted |
| **PCI Compliance** | ✅ Delegated to Stripe | No card data touches our servers |
| **GDPR** | ⚠️ Partial | User data stored; may need data export/deletion features |
| **Password Security** | N/A | OAuth only, no passwords stored |

## Security Incident Response

| Scenario | Response |
|----------|----------|
| **Suspected data breach** | 1. Rotate all API keys immediately 2. Review Supabase logs 3. Notify affected users |
| **Webhook abuse** | 1. Check Stripe Dashboard for failed webhooks 2. Rotate webhook secret 3. Review logs |
| **Unauthorized admin access** | 1. Revoke admin role 2. Audit recent admin actions 3. Review auth logs |
| **Service role key exposure** | 1. Rotate key immediately in Supabase 2. Update Vercel env vars 3. Audit database for unauthorized changes |

---
