import { supabase } from "./supabase";
import { Product } from "@/types";

// Get all products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Products could not be loaded");
  }
  return data;
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return null;
  }
  return data;
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }
  return data;
}

// Get user profile by email
export async function getUserProfile(email: string) {
  const { data, error } = await supabase
    .from("user_profile")
    .select("id, email, full_name, image, role, created_at, updated_at")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

// Get user profile by ID
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("User not found");
  }

  return data;
}

// Get cart by session cart ID
export async function getCartBySessionId(sessionCartId: string) {
  const { data, error } = await supabase
    .from("cart")
    .select("id")
    .eq("session_cart_id", sessionCartId)
    .maybeSingle();

  if (error || !data) return null;

  return data;
}

// Get my cart
export async function getMyCart() {
  const { cookies } = await import("next/headers");
  const { auth } = await import("./auth");

  const cookieStore = await cookies();
  const sessionCartId = cookieStore.get("sessionCartId")?.value || null;

  const session = await auth();
  const userId = session?.user?.profileId
    ? String(session.user.profileId)
    : undefined;

  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq(userId ? "user_id" : "session_cart_id", userId || sessionCartId)
    .maybeSingle();

  if (error || !data) return undefined;

  return {
    ...data,
    items_price: data.items_price.toString(),
    total_price: data.total_price.toString(),
    shipping_price: data.shipping_price.toString(),
    tax_price: data.tax_price.toString(),
  };
}

// Get order by ID
export async function getOrderById(orderId: string) {
  // Step 1: Get the order
  const { data: order, error: orderError } = await supabase
    .from("order")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return null;
  }

  // Step 2: Get the order items
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_item")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) {
    return null;
  }

  // Step 3: Get user info (only name and email)
  const { data: user, error: userError } = await supabase
    .from("user_profile")
    .select("full_name, email")
    .eq("id", order.user_id)
    .single();

  if (userError) {
    return null;
  }

  // Step 4: Combine everything and convert numeric fields to strings
  return {
    ...order,
    items_price: order.items_price?.toString() || "0.00",
    shipping_price: order.shipping_price?.toString() || "0.00",
    tax_price: order.tax_price?.toString() || "0.00",
    total_price: order.total_price?.toString() || "0.00",
    isPaid: order.isPaid ?? false,
    paidAt: order.paidAt ?? null,
    order_items:
      orderItems?.map((item) => ({
        ...item,
        price: item.price?.toString() || "0.00",
      })) || [],
    user: user,
  };
}
