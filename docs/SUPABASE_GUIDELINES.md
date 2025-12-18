# Supabase Guidelines

How to use Supabase based on The Wild Oasis project patterns.

---

## Client Setup

**File:** `lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
```

- Single client instance with service role key
- Import from this file everywhere: `import { supabase } from "@/lib/supabase"`
- Never create multiple clients

---

## Authentication

**File:** `app/_lib/auth.ts`

### Setup with NextAuth v5

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  })],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      // Auto-create user in database on first login
      const existingGuest = await getGuest(user.email);
      if (!existingGuest) {
        await createGuest({ email: user.email, fullName: user.name });
      }
      return true;
    },
    async session({ session }) {
      // Add database ID to session
      const guest = await getGuest(session.user.email);
      if (guest) session.user.guestId = guest.id;
      return session;
    },
  },
});
```

### Key Points

- Auto-create users on first sign-in
- Enrich session with database ID (`guestId`)
- Use email as lookup key between OAuth and database

### Route Protection

**File:** `middleware.ts`

```typescript
export const middleware = auth;
export const config = {
  matcher: ["/account"], // Protected routes
};
```

---

## Database Operations

### READ (Data Service)

**File:** `lib/data-service.ts`

```typescript
// Single record
export async function getCabin(id: number): Promise<Cabin> {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    notFound(); // 404 for missing resources
    console.error(error);
  }
  return data;
}

// Multiple records
export async function getCabins(): Promise<Cabin[]> {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image") // Only needed fields
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

// With foreign key (JOIN)
export async function getBookings(guestId: number): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, startDate, endDate, cabins(name, image)") // table(fields) for joins
    .eq("guestId", guestId)
    .order("startDate");

  if (error) throw new Error("Bookings could not be loaded");
  return data as unknown as Booking[];
}
```

### CREATE/UPDATE/DELETE (Server Actions)

**File:** `lib/actions.ts`

```typescript
"use server"

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// CREATE
export async function createBooking(bookingData: BookingData, formData: FormData) {
  // 1. Verify auth
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  // 2. Validate & prepare data
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations") || "",
  };

  // 3. Insert
  const { error } = await supabase.from("bookings").insert([newBooking]);
  if (error) throw new Error(`Booking could not be created: ${error.message}`);

  // 4. Revalidate & redirect
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

// UPDATE
export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  // Validate
  const nationalID = formData.get("nationalId") as string;
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Invalid national ID");
  }

  const updateData = { nationalId: nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error(`Guest could not be updated: ${error.message}`);

  revalidatePath("/account/profile");
  redirect("/account/profile");
}

// DELETE
export async function deleteBooking(bookingId: number) {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  // Verify ownership
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(b => b.id);
  if (!guestBookingIds.includes(bookingId)) {
    throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);
  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}
```

---

## Key Patterns

### Server Action Flow

1. Check authentication
2. Validate input
3. Check authorization (user owns resource)
4. Execute database operation
5. Revalidate paths
6. Redirect

### Authorization

Always verify ownership before update/delete:

```typescript
// Get user's records
const guestBookings = await getBookings(session.user.guestId);
const guestBookingIds = guestBookings.map(b => b.id);

// Check if target ID belongs to user
if (!guestBookingIds.includes(bookingId)) {
  throw new Error("Not authorized");
}
```

Never trust client-provided user IDs - always use `session.user.guestId`.

### Error Handling

```typescript
const { data, error } = await supabase.from("table").select("*");

if (error) {
  console.error(error); // Log for debugging
  throw new Error("User-friendly message"); // Throw for user
}
```

For 404 scenarios:

```typescript
if (error) {
  notFound(); // Triggers Next.js 404 page
  console.error(error);
}
```

---

## Type Definitions

**File:** `types/index.ts`

```typescript
export interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
}

export interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationality: string;
  nationalId: string;
  countryFlag: string;
}

export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  cabins?: { // For joined data
    name: string;
    image: string;
  };
}

export interface SessionWithGuestId {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    guestId: number;
  };
}
```

---

## File Storage

**File:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
```

- Create public bucket in Supabase
- Store full URL in database
- Use Next.js Image component

---

## Cache Management

Always revalidate after mutations:

```typescript
revalidatePath("/account/reservations"); // List page
revalidatePath(`/account/reservations/${id}`); // Detail page
redirect("/account/reservations");
```

Revalidate before redirect.

---

## Environment Variables

**File:** `.env.local`

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
AUTH_SECRET=your-nextauth-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

Use service role key (not anon key) for server operations.

---

## Quick Checklist

- [ ] Single Supabase client with service role key
- [ ] Auto-create users on first sign-in
- [ ] Add database ID to session
- [ ] Read functions in `data-service.ts`
- [ ] Mutations in `actions.ts` with `"use server"`
- [ ] Always verify authentication
- [ ] Validate input before database operations
- [ ] Check authorization (user owns resource)
- [ ] Handle errors with descriptive messages
- [ ] Revalidate paths after mutations
- [ ] Redirect after successful mutations
- [ ] Define types for all database tables

---

## Common Mistakes to Avoid

- Don't trust client-provided user IDs
- Don't skip ownership verification
- Don't forget to revalidate paths
- Don't redirect before revalidating
- Don't select `*` when you only need specific fields
- Don't use API routes for mutations (use Server Actions)
