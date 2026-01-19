# 9. Coding Standards

## Existing Standards Compliance

All new code MUST follow the standards established in the existing codebase and documented in `CLAUDE.md`.

| Standard | Existing Pattern | Compliance Requirement |
|----------|------------------|------------------------|
| **Code Style** | TypeScript strict mode, ESLint with Next.js rules | All new code must pass `npm run lint` |
| **Linting Rules** | `eslint-config-next/core-web-vitals` + `/typescript` | No ESLint errors or warnings |
| **Testing Patterns** | None established (no test files found) | New tests follow Jest/Vitest patterns if added |
| **Documentation Style** | JSDoc not used; code is self-documenting | Keep code readable; add comments only for complex logic |

## UI Development Standards (from CLAUDE.md)

### 1. Component Library - shadcn/ui ONLY

**NEVER create custom UI components that shadcn/ui provides.**

```bash
# Install before creating new UI
npx shadcn@latest add [component-name]
```

```tsx
// ✅ CORRECT
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ❌ INCORRECT - Never create custom versions
const CustomButton = () => <button className="...">Click</button>;
```

### 2. Color System - CSS Variables ONLY

**NEVER use arbitrary Tailwind colors** like `bg-blue-500`, `text-red-600`.

```tsx
// ✅ CORRECT - Semantic CSS variables
<div className="bg-background text-foreground border-border">
  <Button className="bg-primary text-primary-foreground">Click</Button>
  <p className="text-muted-foreground">Secondary text</p>
</div>

// ❌ INCORRECT - Arbitrary colors
<div className="bg-white text-gray-900 border-gray-200">
  <Button className="bg-blue-600 text-white">Click</Button>
</div>
```

**Available semantic colors:**
- `bg-background`, `text-foreground` - Main background/text
- `bg-card`, `text-card-foreground` - Card components
- `bg-primary`, `text-primary-foreground` - Primary brand color
- `bg-secondary`, `text-secondary-foreground` - Secondary backgrounds
- `bg-muted`, `text-muted-foreground` - Muted/disabled states
- `bg-accent`, `text-accent-foreground` - Accent/hover states
- `bg-destructive` - Error/danger states
- `border-border`, `border-input` - Border colors

### 3. Layout - `.wrapper` Class

**ALWAYS use `.wrapper` for content containers:**

```tsx
// ✅ CORRECT
<main className="wrapper">
  <h1 className="h1-bold">Page Title</h1>
  {/* content */}
</main>

// ❌ INCORRECT - Custom containers
<div className="max-w-6xl mx-auto px-4">
  {/* content */}
</div>
```

### 4. Typography - Predefined Classes

```tsx
// ✅ CORRECT
<h1 className="h1-bold">Main Title</h1>    // font-bold text-3xl lg:text-4xl
<h2 className="h2-bold">Section</h2>        // font-bold text-2xl lg:text-3xl
<h3 className="h3-bold">Subsection</h3>     // font-bold text-xl lg:text-2xl

// ❌ INCORRECT
<h1 className="text-4xl font-bold">Title</h1>
```

## Enhancement-Specific Standards

### Server Components vs Client Components

```tsx
// Default: Server Component (no directive needed)
export default async function Page() {
  const data = await getData(); // Can fetch data directly
  return <div>{/* ... */}</div>;
}

// Client Component: Only when needed
"use client";

import { useState } from "react";

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

**Use Client Components ONLY for:**
- Event handlers (onClick, onChange, onSubmit)
- React hooks (useState, useEffect, useTransition)
- Browser APIs (localStorage, window)
- Third-party client libraries (Stripe Elements)

### Server Actions Pattern

```tsx
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(3),
});

export async function myAction(
  data: z.infer<typeof schema>
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Validate input
    const validated = schema.parse(data);

    // 2. Check authentication/authorization
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    // 3. Perform database operation
    const { error } = await supabase
      .from("table")
      .insert(validated);

    if (error) throw error;

    // 4. Revalidate affected paths
    revalidatePath("/affected-path");

    // 5. Return success
    return { success: true, message: "Success message" };

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
```

### Form Handling Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";

export function MyForm({ defaultValues }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await serverAction(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields using shadcn Form components */}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
```

### Price Handling

```tsx
// Database: numeric type
// API/Client: string with 2 decimal places

// ✅ CORRECT - Price validation
const priceSchema = z.string().regex(/^[0-9]+(\.[0-9]{2})?$/, "Invalid price format");

// ✅ CORRECT - Display formatting
import { formatNumberWithDecimal } from "@/lib/utils";
<span>${formatNumberWithDecimal(product.price)}</span>

// ✅ CORRECT - Calculations (convert to number, then back to string)
const total = roundTwo(Number(price) * quantity).toString();
```

## Critical Integration Rules

| Rule | Implementation |
|------|----------------|
| **Existing API Compatibility** | Never modify existing function signatures in `data-service.ts` or `actions.ts`; add new functions alongside |
| **Database Integration** | All Supabase queries use the appropriate client: anon for user operations, service role for admin/webhook |
| **Error Handling** | All Server Actions return `{ success: boolean, message: string }`; use `formatError()` for consistent error messages |
| **Logging Consistency** | Use `console.error()` for errors that need investigation; avoid excessive logging in production |
| **Path Aliases** | Always use `@/` prefix for imports from project root |
| **Type Safety** | All new functions must be fully typed; no `any` types unless absolutely necessary |

## Import Organization

```tsx
// 1. React/Next.js imports
import { useState, useTransition } from "react";
import { redirect } from "next/navigation";

// 2. Third-party imports
import { z } from "zod";
import { useForm } from "react-hook-form";

// 3. Internal imports (absolute paths with @/)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/data-service";
import { Product } from "@/types";

// 4. Relative imports (only for same-feature files)
import { ChildComponent } from "./ChildComponent";
```

## Admin-Specific Standards

```tsx
// Admin Server Actions must verify role
export async function adminAction(data: Data) {
  const session = await auth();

  // Double-check admin role (defense in depth)
  if (session?.user?.role !== "admin") {
    return { success: false, message: "Forbidden: Admin access required" };
  }

  // Use admin Supabase client for privileged operations
  const supabase = createSupabaseAdmin();

  // ... rest of action
}
```

## Webhook-Specific Standards

```tsx
// Route Handler for webhooks
export async function POST(request: NextRequest) {
  // 1. Get raw body for signature verification
  const body = await request.text();

  // 2. Verify signature BEFORE any processing
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      request.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Log and return 400 for invalid signatures
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3. Use service role client (webhook is not user-authenticated)
  const supabase = createSupabaseAdmin();

  // 4. Always return 200 for successfully received events
  // (even if processing fails - prevents Stripe retries)
  return NextResponse.json({ received: true });
}
```

---
