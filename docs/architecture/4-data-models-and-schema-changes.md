# 4. Data Models and Schema Changes

## Existing Database Schema (Verified via Supabase MCP)

| Table | Primary Key | Key Fields | RLS Status |
|-------|-------------|------------|------------|
| **user_profile** | `id` (UUID) | email, full_name, image, role, address (JSONB), payment_method | ❌ Disabled (policies exist but not activated) |
| **Product** | `id` (bigint, identity) | name, slug, category, brand, price, stock, image, description | ❌ Disabled |
| **cart** | `id` (UUID) | user_id (FK), session_cart_id, items (JSONB), price fields | ❌ Disabled |
| **order** | `id` (UUID) | user_id (FK), shipping_address (JSONB), payment_method, isPaid, paidAt, price fields | ❌ Disabled |
| **order_item** | `order_id + product_id` (composite) | quantity, price, name, slug, image | ❌ Disabled |

## New Data Models

**No new tables required.** The existing schema fully supports all enhancement features:

| Feature | Data Storage | Existing Support |
|---------|--------------|------------------|
| User Profile | `user_profile.address` (JSONB) | ✅ Already exists |
| Order History | `order` table with `user_id` filter | ✅ Already exists |
| Product Search | `Product` table | ✅ Already exists |
| Payment Status | `order.isPaid`, `order.paidAt` | ✅ Already exists |
| Admin Products | `Product` table CRUD | ✅ Already exists |

## Schema Integration Strategy

### Database Changes Required

| Change Type | Details |
|-------------|---------|
| **New Tables** | None |
| **Modified Tables** | None - schema is complete |
| **New Indexes** | Consider: `CREATE INDEX idx_order_user_id ON public.order(user_id)` for order history performance |
| **Migration Strategy** | RLS policies only - no data migration needed |

### RLS Policy Design (Story 1.1)

**Product Table:**
```sql
-- Enable RLS
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;

-- Public read access (catalog browsing)
CREATE POLICY "Anyone can view products" ON public."Product"
  FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admins can insert products" ON public."Product"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON public."Product"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON public."Product"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin')
  );
```

**Cart Table:**
```sql
-- Enable RLS
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Users can access their own cart (by user_id OR session_cart_id)
CREATE POLICY "Users can view own cart" ON public.cart
  FOR SELECT USING (
    user_id = auth.uid() OR
    session_cart_id = current_setting('request.cookies')::json->>'sessionCartId'
  );

CREATE POLICY "Users can insert own cart" ON public.cart
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

CREATE POLICY "Users can update own cart" ON public.cart
  FOR UPDATE USING (
    user_id = auth.uid() OR
    session_cart_id = current_setting('request.cookies')::json->>'sessionCartId'
  );

CREATE POLICY "Users can delete own cart" ON public.cart
  FOR DELETE USING (
    user_id = auth.uid() OR
    session_cart_id = current_setting('request.cookies')::json->>'sessionCartId'
  );
```

**Order Table:**
```sql
-- Enable RLS
ALTER TABLE public."order" ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public."order"
  FOR SELECT USING (user_id = auth.uid());

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders" ON public."order"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Service role can update any order (for webhook)
-- Note: Service role bypasses RLS, so no explicit policy needed
```

**Order Item Table:**
```sql
-- Enable RLS
ALTER TABLE public.order_item ENABLE ROW LEVEL SECURITY;

-- Users can view items for their own orders
CREATE POLICY "Users can view own order items" ON public.order_item
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public."order" o
      WHERE o.id = order_item.order_id AND o.user_id = auth.uid()
    )
  );

-- Insert handled by create_order_atomic function (service role)
CREATE POLICY "Authenticated users can insert order items" ON public.order_item
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."order" o
      WHERE o.id = order_item.order_id AND o.user_id = auth.uid()
    )
  );
```

**User Profile Table:**
```sql
-- Enable RLS (policies already exist, just need activation)
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- Existing policies will become active:
-- - "Anyone can view profiles"
-- - "Users can insert own profile"
-- - "Users can update own profile"
```

### Function Security Fixes

```sql
-- Fix search_path for create_order_atomic
ALTER FUNCTION public.create_order_atomic SET search_path = '';

-- Fix search_path for update_updated_at_column
ALTER FUNCTION public.update_updated_at_column SET search_path = '';
```

## Backward Compatibility

| Measure | Implementation |
|---------|----------------|
| **Existing reads work** | SELECT policies allow same access patterns as before RLS |
| **Existing cart flow works** | Session cart ID pattern preserved in RLS policy |
| **Existing checkout works** | Order creation still works for authenticated users |
| **Service role for webhooks** | Webhook handler uses service role to bypass RLS for order updates |
| **Service role for admin** | Admin CRUD uses service role for Product table operations |

## Supabase Storage Bucket (Story 1.9)

```sql
-- Create products bucket for image storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Admin-only upload
CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin-only delete
CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM public.user_profile WHERE id = auth.uid() AND role = 'admin')
  );
```

---
