# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Alshami Store** - A modern e-commerce platform for premium herbs, coffees, and more, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

## Development Commands

### Running the Application
```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Create production build
npm start          # Start production server (run build first)
npm run lint       # Run ESLint
npm run seed       # Seed products to database (tsx scripts/seed-products.ts)
```

### Installing shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

Components install to `components/ui/` with the following configuration:
- Style: **New York**
- Base color: **Slate**
- Icon library: **Lucide React**
- RSC (React Server Components): Enabled

## Architecture

### Project Structure

```
app/
├── (auth)/              # Auth route group
│   └── sign-in/         # Sign-in page
├── (root)/              # Route group for main pages
│   ├── layout.tsx       # Root group layout wrapper
│   ├── page.tsx         # Home page
│   ├── products/        # Products listing and detail pages
│   │   ├── page.tsx     # Products page with filtering
│   │   ├── loading.tsx  # Loading skeleton
│   │   └── [slug]/      # Product detail page
│   ├── cart/            # Shopping cart page
│   ├── shipping-address/# Checkout: shipping address
│   ├── payment-method/  # Checkout: payment method
│   ├── place-order/     # Checkout: order review
│   ├── order/[id]/      # Order details & payment
│   ├── about/           # About page
│   └── contact/         # Contact page
├── layout.tsx           # Root layout (metadata, fonts, global providers)
├── globals.css          # Global styles, CSS variables, utility classes
├── error.tsx            # Global error boundary
├── not-found.tsx        # 404 page
└── loading.tsx          # Global loading state

components/
├── ui/                  # shadcn/ui components (auto-installed)
├── authentication/      # SignInButton, SignOutButton, UserMenu
├── cart/                # AddToCart, CartView, CartItem, CartIcon, OrderSummary
├── checkout/            # CheckoutSteps, ShippingAddressForm, PaymentMethodForm, PlaceOrderButton, StripePayment
├── layout/              # Header, Footer, Logo, ThemeToggle
│   └── root_layout/     # Root layout components (Header, Footer)
├── products/            # ProductCard, ProductList, CategoryFilter, ProductPagination, Skeletons
└── providers/           # ThemeProvider

lib/
├── constants.ts     # App constants (APP_NAME, PAYMENT_METHODS, etc.)
├── utils.ts         # Utility functions (cn(), formatNumberWithDecimal())
├── supabase.ts      # Supabase client configuration
├── auth.ts          # NextAuth configuration
├── data-service.ts  # Database read operations (Server Components)
├── actions.ts       # Server Actions for mutations (CREATE/UPDATE/DELETE)
└── validators.ts    # Zod validation schemas

types.ts             # TypeScript type definitions (Product, Cart, Order, etc.)
```

### Key Patterns

**Route Groups**: The `(root)/` directory is a route group that doesn't affect the URL structure. Use route groups to organize layouts without adding URL segments.

**Path Aliases**: Use `@/` prefix for imports from the root directory:
```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Product } from "@/types";
import { getProducts } from "@/lib/data-service";
```

**Class Name Utilities**: Use `cn()` from `@/lib/utils` to merge Tailwind classes with shadcn component variants:
```tsx
<Button className={cn("additional-classes", className)} />
```

## UI Development - CRITICAL RULES

**IMPORTANT**: Before implementing any UI components, **always check `docs/UI_GUIDELINES.md`** for detailed design guidelines, patterns, and examples specific to this project.

### 1. Component Library (shadcn/ui ONLY)

**NEVER create custom UI components that shadcn/ui provides.** Always install and use shadcn components:

```bash
npx shadcn@latest add button card input select dialog
```

Available shadcn components:
- **Layout**: Card, Separator, Tabs, Accordion, Collapsible
- **Forms**: Input, Button, Checkbox, Radio, Select, Textarea, Label, Form
- **Navigation**: NavigationMenu, Dropdown Menu, Context Menu, Menubar, Breadcrumb
- **Feedback**: Alert, Toast, Dialog, Alert Dialog, Sheet, Popover, Tooltip
- **Data**: Table, Data Table, Badge, Avatar, Progress, Skeleton

### 2. Color System (CSS Variables ONLY)

**NEVER use arbitrary Tailwind color classes** like `bg-blue-500`, `text-red-600`, etc.

**ALWAYS use semantic CSS variables** defined in `app/globals.css`:

```tsx
// ✅ CORRECT
<div className="bg-background text-foreground border-border">
  <Button className="bg-primary text-primary-foreground">Click</Button>
  <p className="text-muted-foreground">Secondary text</p>
</div>

// ❌ INCORRECT
<div className="bg-white text-gray-900 border-gray-200">
  <Button className="bg-blue-600 text-white">Click</Button>
  <p className="text-gray-500">Secondary text</p>
</div>
```

Available semantic colors:
- `bg-background`, `text-foreground` - Main background/text
- `bg-card`, `text-card-foreground` - Card components
- `bg-primary`, `text-primary-foreground` - Primary brand color (purple/blue)
- `bg-secondary`, `text-secondary-foreground` - Secondary backgrounds
- `bg-muted`, `text-muted-foreground` - Muted/disabled states
- `bg-accent`, `text-accent-foreground` - Accent/hover states
- `bg-destructive` - Error/danger states
- `border-border`, `border-input` - Border colors
- `ring-ring` - Focus ring colors

Colors automatically support dark mode via `.dark` class.

### 3. Layout Wrapper

**ALWAYS use `.wrapper` class** for content containers (defined in globals.css):

```tsx
// ✅ CORRECT - Page layout
export default function HomePage() {
  return (
    <main className="wrapper">
      <h1 className="h1-bold">Welcome</h1>
      {/* content */}
    </main>
  );
}

// ✅ CORRECT - Section with background
<section className="bg-muted">
  <div className="wrapper">
    <h2 className="h2-bold">Section Title</h2>
  </div>
</section>

// ❌ INCORRECT - Don't create custom containers
<div className="max-w-6xl mx-auto px-4">
  {/* content */}
</div>
```

`.wrapper` provides:
- Max width: `7xl` (1280px)
- Centering: Auto margins on large screens
- Responsive padding: `p-5` default, `md:px-10` on medium+

### 4. Typography Utilities

**USE predefined heading classes** from globals.css:

```tsx
// ✅ CORRECT
<h1 className="h1-bold">Main Title</h1>    // font-bold text-3xl lg:text-4xl
<h2 className="h2-bold">Section</h2>        // font-bold text-2xl lg:text-3xl
<h3 className="h3-bold">Subsection</h3>     // font-bold text-xl lg:text-2xl

// ❌ INCORRECT
<h1 className="text-4xl font-bold">Title</h1>
```

## Styling System

### Tailwind CSS 4

This project uses **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`).

**Key differences from v3:**
- Theme configured via `@theme inline` in globals.css
- Custom variants defined with `@custom-variant` (e.g., dark mode)
- CSS variable integration with `var(--color-*)` pattern

### Dark Mode

Dark mode is implemented via the `.dark` class on elements. Colors automatically adapt using CSS variables defined in `:root` and `.dark` selectors.

### Border Radius

Consistent border radius values via CSS variables:
- `rounded-sm` → `calc(var(--radius) - 4px)`
- `rounded-md` → `calc(var(--radius) - 2px)`
- `rounded-lg` → `var(--radius)` (0.65rem)
- `rounded-xl` → `calc(var(--radius) + 4px)`

## TypeScript Configuration

- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (React 19)
- **Strict mode**: Enabled
- **Path aliases**: `@/*` maps to root directory

## Linting

ESLint configured with Next.js recommended rules:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Ignored directories: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Database & Backend Patterns

### Supabase Integration

**Read Operations** - Use `lib/data-service.ts`:
```tsx
// Server Component
import { getProducts } from "@/lib/data-service";

export default async function ProductsPage() {
  const products = await getProducts(); // Fetches from Supabase
  return <div>{products.map(p => ...)}</div>;
}
```

**Available Data Functions:**
- `getProducts(category?)` - Get all products, optionally filtered by category
- `getCategories()` - Get unique product categories
- `getProductBySlug(slug)` - Get single product by slug
- `getProductById(id)` - Get single product by ID
- `getUserProfile(email)` - Get user profile by email
- `getUserById(userId)` - Get user by ID
- `getMyCart()` - Get current user's cart (uses cookies/session)
- `getCartBySessionId(sessionCartId)` - Get cart by session ID
- `getOrderById(orderId)` - Get order with items and user info

**Write Operations** - Use Server Actions in `lib/actions.ts`:
```tsx
"use server"

export async function createProduct(formData: FormData) {
  // 1. Validate with Zod
  // 2. Insert to Supabase
  // 3. Revalidate path
  // 4. Redirect
}
```

**Key Rules:**
- Read data directly in Server Components (no Server Actions)
- Use Server Actions only for mutations (CREATE/UPDATE/DELETE)
- Always validate with Zod schemas from `lib/validators.ts`
- Types defined in `types.ts` using Zod inference

### Database Tables

**Product Table:**
- `id` (string/UUID)
- `name`, `slug`, `category`, `brand`, `description` (string, min 3 chars)
- `stock` (number, positive integer)
- `image` (string, required)
- `price` (string with 2 decimals)
- `created_at` (timestamp)

**Cart Table:**
- `id`, `session_cart_id`, `user_id`
- `items` (JSON array of cart items)
- `items_price`, `shipping_price`, `tax_price`, `total_price` (currency)

**Order Table:**
- `id`, `user_id`
- `shipping_address` (JSON)
- `payment_method` (string)
- `items_price`, `shipping_price`, `tax_price`, `total_price` (currency)
- `isPaid`, `paidAt`
- Related: `order_item` table for order line items

**User Profile Table:**
- `id`, `email`, `full_name`, `image`, `role`
- `created_at`, `updated_at`

### Validation Schemas

All validation schemas are in `lib/validators.ts`:
- `insertProductSchema` - Product creation/update
- `cartItemSchema` - Individual cart items
- `insertCartSchema` - Full cart with items and prices
- `shippingAddressSchema` - Shipping address form
- `paymentMethodSchema` - Payment method selection
- `orderItemSchema` - Order line items
- `insertOrderSchema` - Full order creation

### Authentication

Using **NextAuth v5** (beta) with the following setup:
- Configuration in `lib/auth.ts`
- Session includes: `id`, `name`, `email`, `image`, `profileId`, `role`
- Types extended in `types.ts` via module augmentation

## Important Constants

Defined in `lib/constants.ts`:
- `APP_NAME`: "Alshami"
- `APP_DESCRIPTION`: "A modern e-commerce platform for premium herbs, coffees, and more."
- `SERVER_URL`: "http://localhost:3000"
- `PAYMENT_METHODS`: ["Stripe"]
- `DEFAULT_PAYMENT_METHOD`: "Stripe"

Used in root layout for metadata configuration.

## Development Workflow

1. **Install shadcn components** before creating new UI:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Use semantic CSS variables** for all colors

3. **Apply `.wrapper` class** for content containers

4. **Use typography utilities** (`.h1-bold`, `.h2-bold`, `.h3-bold`)

5. **Leverage `cn()`** utility for conditional class merging

6. **Follow Next.js App Router patterns**:
   - Server Components by default
   - Use `"use client"` only when needed (event handlers, hooks, browser APIs)
   - Co-locate files in route directories

## Additional Notes

- **Font**: Inter from Google Fonts
- **Icon library**: Lucide React (via shadcn/ui)
- **Animation utilities**: `tw-animate-css` package available
- **Class variance**: Uses `class-variance-authority` for component variants
- **Toast notifications**: Using `sonner` package
- **Theme switching**: Using `next-themes` package
- **Form handling**: Using `react-hook-form` with `@hookform/resolvers` for Zod integration
- **Payment processing**: Stripe integration via `@stripe/stripe-js` and `@stripe/react-stripe-js`

## Key Dependencies

```
next: 16.0.10
react: 19.2.1
next-auth: 5.0.0-beta.30
@supabase/supabase-js: 2.87.3
zod: 4.2.1
stripe: 20.1.0
tailwindcss: 4
```

## Documentation References

For detailed implementation guidelines, refer to:
- **`docs/UI_GUIDELINES.md`**: Complete UI design rules, component usage, color system, and layout patterns
- **`docs/SUPABASE_GUIDELINES.md`**: Database setup, authentication, and Supabase integration guidelines
- **`docs/ZOD_VALIDATION_GUIDELINES.md`**: Form validation patterns, schema definitions, and error handling with Zod

**IMPORTANT**: Before implementing any form validation or data validation, **always check `docs/ZOD_VALIDATION_GUIDELINES.md`** for validation patterns, schema best practices, and integration with Server Actions.
