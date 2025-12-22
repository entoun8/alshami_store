"use server";

import { signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/",
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}

// Create a new user profile (called from auth signIn callback)
export async function createUserProfile(profileData: {
  email: string;
  full_name: string;
  image?: string;
}) {
  const { data, error } = await supabase
    .from("user_profile")
    .insert([
      {
        email: profileData.email,
        full_name: profileData.full_name,
        image: profileData.image,
        role: "user",
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

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
