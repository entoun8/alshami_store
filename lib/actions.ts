"use server";

import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

// Add your create/update/delete operations here
// Example:
// export async function createProduct(formData: FormData) {
//   const newProduct = {
//     name: formData.get("name") as string,
//     price: Number(formData.get("price")),
//     // ... other fields
//   };
//
//   const { error } = await supabase.from("products").insert([newProduct]);
//
//   if (error) {
//     throw new Error("Product could not be created");
//   }
//
//   revalidatePath("/products");
// }
