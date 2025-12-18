# Zod Validation Pattern Guide

Simple guide for using Zod validation in projects (based on ProStore implementation).

## 1. Define Schemas in One Place

Create all Zod schemas in `lib/validators.ts`:

```typescript
import { z } from "zod";

// Reusable custom validator
const currency = z
  .string()
  .refine(
    (val) => /^[0-9]+(\.[0-9]{2})?$/.test(formatNumberWithDecimal(val)),
    "Price must have exactly two decimal places"
  );

// Example schema
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  price: currency,
  stock: z.coerce.number(), // Converts string to number
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(), // Can be null
});

// Schema with cross-field validation
export const signUpFormSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error appears on this field
  });
```

## 2. Generate TypeScript Types

In `types/index.ts`, use `z.infer<>` to create types:

```typescript
import { z } from "zod";
import { insertProductSchema, shippingAddressSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  createdAt: Date;
};

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
```

## 3. Validate in Server Actions

Always use `.parse()` in server actions - it throws on invalid data:

```typescript
export async function addToCart(data: CartItem) {
  // Validate incoming data
  const item = cartItemSchema.parse(data);

  // Use validated data
  await prisma.cart.create({
    data: {
      items: [item],
      // ...
    },
  });
}

export async function signUp(formData: FormData) {
  // Extract and validate
  const user = signUpFormSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // Use validated user
  await createUser(user);
}
```

## 4. Client-Side Form Validation

### Option A: React Hook Form + Zod (Complex Forms)

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const form = useForm<z.infer<typeof shippingAddressSchema>>({
  resolver: zodResolver(shippingAddressSchema),
  defaultValues: address || undefined,
});

const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
  values
) => {
  const res = await updateUserAddress(values);
};

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage /> {/* Shows validation errors */}
        </FormItem>
      )}
    />
  </form>
);
```

### Option B: Simple Forms (Server-Side Only)

```typescript
const [data, action] = useActionState(signInWithCredentials, {
  success: false,
  message: "",
});

return (
  <form action={action}>
    <Input name="email" type="email" required />
    <Input name="password" type="password" required />
    {data && !data.success && (
      <div className="text-destructive">{data.message}</div>
    )}
  </form>
);
```

## Common Patterns

### Custom Validators
```typescript
const currency = z.string().refine(
  (val) => /regex/.test(val),
  "Error message"
);
```

### Type Coercion
```typescript
stock: z.coerce.number() // "5" → 5
```

### Optional/Nullable
```typescript
userId: z.string().optional().nullable()
```

### Arrays with Validation
```typescript
images: z.array(z.string()).min(1, "At least one image required")
```

### Nested Objects
```typescript
const cartItemSchema = z.object({
  productId: z.string(),
  qty: z.number(),
});

const cartSchema = z.object({
  items: z.array(cartItemSchema),
});
```

## Key Rules

1. **One source of truth**: All schemas in `lib/validators.ts`
2. **Always validate server actions**: Use `.parse()` to throw on invalid data
3. **Generate types**: Use `z.infer<>` instead of manually writing types
4. **Choose validation approach**:
   - Complex forms → React Hook Form + `zodResolver`
   - Simple forms → Server-side validation only
5. **Clear error messages**: Include helpful messages in every validator
