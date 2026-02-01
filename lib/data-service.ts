import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "./supabase";
import { auth } from "./auth";
import { Product, OrderSummary } from "@/types";

export async function getProducts(category?: string): Promise<Product[]> {
  let query = supabase
    .from("Product")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Products could not be loaded");
  }
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("Product")
    .select("category")
    .order("category");

  if (error) {
    throw new Error("Categories could not be loaded");
  }

  const uniqueCategories = [...new Set(data.map((item) => item.category))];
  return uniqueCategories;
}

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

export async function getUserProfile(email: string) {
  const { data, error } = await supabase
    .from("user_profile")
    .select("id, email, full_name, image, role, created_at, updated_at")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

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

export async function getCartBySessionId(sessionCartId: string) {
  const { data, error } = await supabase
    .from("cart")
    .select("id")
    .eq("session_cart_id", sessionCartId)
    .maybeSingle();

  if (error || !data) return null;

  return data;
}

export async function getMyCart() {
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

export async function getOrderById(orderId: string) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("order")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return null;
  }

  const { data: orderItems, error: itemsError } = await supabaseAdmin
    .from("order_item")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) {
    return null;
  }

  const { data: user, error: userError } = await supabase
    .from("user_profile")
    .select("full_name, email")
    .eq("id", order.user_id)
    .single();

  if (userError) {
    return null;
  }

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

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Products could not be loaded");
  }
  return data || [];
}

export async function getUserOrders(): Promise<OrderSummary[]> {
  const session = await auth();
  const profileId = session?.user?.profileId;

  if (!profileId) {
    return [];
  }

  const { data: orders, error } = await supabaseAdmin
    .from("order")
    .select("id, created_at, isPaid, paidAt, total_price")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  if (error || !orders) {
    return [];
  }

  const orderSummaries: OrderSummary[] = await Promise.all(
    orders.map(async (order) => {
      const { count } = await supabaseAdmin
        .from("order_item")
        .select("*", { count: "exact", head: true })
        .eq("order_id", order.id);

      return {
        id: order.id,
        created_at: order.created_at,
        isPaid: order.isPaid ?? false,
        paidAt: order.paidAt ?? null,
        itemCount: count ?? 0,
        total_price: order.total_price?.toString() || "0.00",
      };
    }),
  );

  return orderSummaries;
}
