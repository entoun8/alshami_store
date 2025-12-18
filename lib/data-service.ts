import { supabase } from "./supabase";
import { Product } from "@/types";

// Get all products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
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
    console.error(error);
    return null;
  }
  return data;
}
