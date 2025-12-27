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
