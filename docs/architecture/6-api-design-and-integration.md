# 6. API Design and Integration

## API Integration Strategy

| Aspect | Approach |
|--------|----------|
| **API Integration Strategy** | Server Actions for all application mutations; Route Handler only for external webhook |
| **Authentication** | NextAuth session for user identity; Supabase service role for privileged operations |
| **Versioning** | Not applicable - internal APIs only; no public API exposed |

## New Server Actions (lib/actions.ts)

### updateUserProfile

**Purpose:** Update user's profile information (name, address)

**Integration:** Called from UserProfileForm component

```typescript
"use server"

export async function updateUserProfile(data: {
  fullName: string;
  address: ShippingAddress;
}): Promise<{ success: boolean; message: string }> {
  // 1. Get session, verify authenticated
  // 2. Validate data with Zod schema
  // 3. Update user_profile via Supabase (anon key - RLS handles auth)
  // 4. Revalidate /user/profile path
  // 5. Return success/error
}
```

**Request Schema:**
```typescript
const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  address: shippingAddressSchema, // Reuse existing schema
});
```

---

### createProduct (Admin)

**Purpose:** Create a new product in the catalog

**Integration:** Called from AdminProductForm component (new product mode)

```typescript
"use server"

export async function createProduct(
  data: z.infer<typeof insertProductSchema>
): Promise<{ success: boolean; message: string; productId?: string }> {
  // 1. Get session, verify admin role
  // 2. Validate data with insertProductSchema
  // 3. Generate slug from name if not provided
  // 4. Insert via Supabase admin client (service role)
  // 5. Revalidate /products and /admin/products paths
  // 6. Return success with productId
}
```

---

### updateProduct (Admin)

**Purpose:** Update an existing product

**Integration:** Called from AdminProductForm component (edit mode)

```typescript
"use server"

export async function updateProduct(
  productId: number,
  data: z.infer<typeof insertProductSchema>
): Promise<{ success: boolean; message: string }> {
  // 1. Get session, verify admin role
  // 2. Validate data with insertProductSchema
  // 3. Update via Supabase admin client (service role)
  // 4. Revalidate /products, /products/[slug], /admin/products paths
  // 5. Return success/error
}
```

---

### deleteProduct (Admin)

**Purpose:** Delete a product from the catalog

**Integration:** Called from AdminProductTable delete confirmation

```typescript
"use server"

export async function deleteProduct(
  productId: number
): Promise<{ success: boolean; message: string }> {
  // 1. Get session, verify admin role
  // 2. Check product has no active order_items (optional: soft delete)
  // 3. Delete via Supabase admin client (service role)
  // 4. Revalidate /products and /admin/products paths
  // 5. Return success/error
}
```

---

### uploadProductImage (Admin)

**Purpose:** Upload image to Supabase Storage

**Integration:** Called from ImageUpload component

```typescript
"use server"

export async function uploadProductImage(
  formData: FormData
): Promise<{ success: boolean; message: string; url?: string }> {
  // 1. Get session, verify admin role
  // 2. Extract file from FormData
  // 3. Validate file type (jpg, png, webp) and size (max 2MB)
  // 4. Generate unique filename (uuid + extension)
  // 5. Upload to 'products' bucket via Supabase admin client
  // 6. Return public URL
}
```

---

## New Data Service Functions (lib/data-service.ts)

### getUserOrders

**Purpose:** Get paginated order history for authenticated user

```typescript
export async function getUserOrders(
  page: number = 1,
  limit: number = 10
): Promise<{ orders: OrderSummary[]; totalPages: number }> {
  // 1. Get session, get user profileId
  // 2. Query orders where user_id = profileId
  // 3. Order by created_at DESC
  // 4. Include count of order_items per order
  // 5. Apply pagination (offset, limit)
  // 6. Return orders with total page count
}
```

**Response Type:**
```typescript
type OrderSummary = {
  id: string;
  createdAt: string;
  isPaid: boolean;
  paidAt: string | null;
  itemCount: number;
  totalPrice: string;
};
```

---

### searchProducts

**Purpose:** Search products by name (for command palette)

**Note:** This could be client-side filtering instead if all products are pre-loaded

```typescript
export async function searchProducts(
  query: string
): Promise<Product[]> {
  // 1. Query products where name ILIKE %query%
  // 2. Limit to 10 results
  // 3. Return matching products
}
```

---

## Route Handler: Stripe Webhook

**Location:** `app/api/webhooks/stripe/route.ts`

**Purpose:** Receive Stripe webhook events for payment status updates

**Why Route Handler (not Server Action):**
- Stripe sends HTTP POST requests to a URL endpoint
- Server Actions are RPC-style and cannot receive external HTTP requests
- Route Handlers expose standard HTTP endpoints

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmation } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  // 1. Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Handle payment_intent.succeeded event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      const supabase = createSupabaseAdmin();

      // 3. Update order status
      const { data: order, error } = await supabase
        .from("order")
        .update({ isPaid: true, paidAt: new Date().toISOString() })
        .eq("id", orderId)
        .select("*, user_profile(*), order_item(*)")
        .single();

      if (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      // 4. Send confirmation email (non-blocking)
      try {
        await sendOrderConfirmation(order);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the webhook - order is already marked paid
      }
    }
  }

  // 5. Return 200 for all events (including unhandled)
  return NextResponse.json({ received: true });
}
```

**Request (from Stripe):**
```json
{
  "id": "evt_xxx",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_xxx",
      "metadata": {
        "orderId": "uuid-xxx"
      }
    }
  }
}
```

**Responses:**
| Status | Condition |
|--------|-----------|
| 200 OK | Event processed successfully or unhandled event type |
| 400 Bad Request | Invalid webhook signature |
| 500 Internal Server Error | Database update failed |

---

## External API Integration: Resend Email

**Location:** `lib/email.ts`

**Purpose:** Send transactional emails (order confirmations)

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: OrderWithDetails) {
  const { user_profile, order_item, ...orderData } = order;

  await resend.emails.send({
    from: process.env.EMAIL_FROM_ADDRESS || "orders@alshami.com",
    to: user_profile.email,
    subject: `Order Confirmation - #${orderData.id.slice(0, 8)}`,
    html: generateOrderEmailHtml(orderData, order_item, user_profile),
  });
}

function generateOrderEmailHtml(
  order: Order,
  items: OrderItem[],
  user: UserProfile
): string {
  // Generate professional HTML email template
  // Include: Order ID, date, items table, shipping address, totals
  return `
    <h1>Thank you for your order!</h1>
    <p>Order #${order.id.slice(0, 8)}</p>
    <!-- ... full template ... -->
  `;
}
```

**API Details:**
| Attribute | Value |
|-----------|-------|
| **Service** | Resend |
| **Documentation** | https://resend.com/docs |
| **Base URL** | https://api.resend.com |
| **Authentication** | API Key (Bearer token) |
| **Integration Method** | SDK (`resend` npm package) |

**Key Endpoints Used:**
- `POST /emails` - Send transactional email

**Error Handling:**
- Catch and log errors but don't fail the webhook
- Order status update takes priority over email delivery
- Consider: Add retry logic or queue for failed emails in future

---

## Existing Stripe Integration Update

The existing Stripe payment flow in `components/checkout/StripeForm.tsx` needs to include `orderId` in the PaymentIntent metadata:

**Current Flow:**
1. User clicks "Pay with Stripe"
2. StripeForm creates PaymentIntent
3. User completes payment
4. Redirect to success page

**Required Update:**
When creating the PaymentIntent (likely in a Server Action), include the orderId in metadata:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(order.totalPrice * 100),
  currency: "aud",
  metadata: {
    orderId: order.id, // <-- CRITICAL: Required for webhook
  },
});
```

This allows the webhook to identify which order to update when payment succeeds.

---
