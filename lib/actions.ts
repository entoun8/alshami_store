"use server";

import { signIn, signOut } from "./auth";
import { supabase, supabaseAdmin } from "./supabase";
import { CartItem, ShippingAddress } from "@/types";
import { auth } from "./auth";
import { cookies } from "next/headers";
import { formatError, roundTwo } from "./utils";
import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderSchema,
  updateProfileSchema,
  insertProductSchema,
} from "./validators";
import { getMyCart, getProductById, getUserById, findUniqueSlug } from "./data-service";
import { revalidatePath } from "next/cache";

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

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundTwo(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );

  const shippingPrice = 0;
  const taxPrice = 0;
  const totalPrice = itemsPrice;

  return {
    items_price: itemsPrice.toFixed(2),
    shipping_price: shippingPrice.toFixed(2),
    tax_price: taxPrice.toFixed(2),
    total_price: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    const cookieStore = await cookies();
    const sessionCartId = cookieStore.get("sessionCartId")?.value || null;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    const session = await auth();
    const userId = session?.user?.profileId || undefined;

    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);

    const product = await getProductById(item.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      const newCart = insertCartSchema.parse({
        user_id: userId || null,
        items: [item],
        session_cart_id: sessionCartId,
        ...calcPrice([item]),
      });

      const { error } = await supabase.from("cart").insert([newCart]);

      if (error) {
        throw new Error(`Failed to create cart: ${error.message}`);
      }

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: "Product added to cart!",
      };
    }

    const existItem = cart.items.find(
      (x: CartItem) => x.product_id === item.product_id
    );

    if (existItem) {
      if (product.stock < existItem.qty + 1) {
        throw new Error("Not enough stock");
      }

      const updatedItems = cart.items.map((x: CartItem) =>
        x.product_id === item.product_id ? { ...x, qty: x.qty + 1 } : x
      );

      const { error } = await supabase
        .from("cart")
        .update({
          items: updatedItems,
          ...calcPrice(updatedItems),
        })
        .eq("id", cart.id);

      if (error) {
        throw new Error(`Failed to update cart: ${error.message}`);
      }

      revalidatePath(`/products/${product.slug}`);

      return {
        success: true,
        message: `${product.name} updated in cart`,
      };
    }

    if (product.stock < 1) {
      throw new Error("Not enough stock");
    }

    const updatedItems = [...cart.items, item];

    const { error } = await supabase
      .from("cart")
      .update({
        items: updatedItems,
        ...calcPrice(updatedItems),
      })
      .eq("id", cart.id);

    if (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }

    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: `${product.name} added to cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    const product = await getProductById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const cart = await getMyCart();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const exist = cart.items.find((x: CartItem) => x.product_id === productId);

    if (!exist) {
      throw new Error("Item not found");
    }

    let updatedItems: CartItem[];

    if (exist.qty === 1) {
      updatedItems = cart.items.filter(
        (x: CartItem) => x.product_id !== productId
      );
    } else {
      updatedItems = cart.items.map((x: CartItem) =>
        x.product_id === productId ? { ...x, qty: x.qty - 1 } : x
      );
    }

    const { error } = await supabase
      .from("cart")
      .update({
        items: updatedItems,
        ...calcPrice(updatedItems),
      })
      .eq("id", cart.id);

    if (error) {
      throw new Error(`Failed to update cart: ${error.message}`);
    }

    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    if (!session?.user?.profileId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await getUserById(session.user.profileId);

    if (!currentUser) {
      throw new Error("User not found");
    }

    const address = shippingAddressSchema.parse(data);

    const { error: updateError } = await supabaseAdmin
      .from("user_profile")
      .update({ address })
      .eq("id", currentUser.id);

    if (updateError) {
      throw new Error(`Failed to update address: ${updateError.message}`);
    }

    revalidatePath("/shipping-address");

    return { success: true, message: "User address updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function mergeSessionCartToUser(
  sessionCartId: string,
  userId: string
) {
  try {
    await supabase.from("cart").delete().eq("user_id", userId);

    const { error } = await supabase
      .from("cart")
      .update({ user_id: userId })
      .eq("id", sessionCartId);

    if (error) {
      throw new Error(`Failed to merge cart: ${error.message}`);
    }
  } catch (error) {
    console.error("Error merging cart:", error);
  }
}

export async function updateUserPaymentMethod(data: { type: string }) {
  try {
    const session = await auth();

    if (!session?.user?.profileId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await getUserById(session.user.profileId);

    if (!currentUser) {
      throw new Error("User not found");
    }

    const paymentMethod = paymentMethodSchema.parse(data);

    const { error: updateError } = await supabaseAdmin
      .from("user_profile")
      .update({ payment_method: paymentMethod.type })
      .eq("id", currentUser.id);

    if (updateError) {
      throw new Error(
        `Failed to update payment method: ${updateError.message}`
      );
    }

    revalidatePath("/payment-method");

    return {
      success: true,
      message: "Payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function createOrder() {
  try {
    const session = await auth();

    if (!session?.user?.profileId) {
      throw new Error("User is not authenticated");
    }

    const cart = await getMyCart();

    const user = await getUserById(session.user.profileId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.payment_method) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    for (const item of cart.items as CartItem[]) {
      const product = await getProductById(item.product_id);

      if (!product) {
        return {
          success: false,
          message: `Product "${item.name}" not found`,
          redirectTo: "/cart",
        };
      }

      if (product.stock < item.qty) {
        return {
          success: false,
          message: `Insufficient stock for "${item.name}". Available: ${product.stock}`,
          redirectTo: "/cart",
        };
      }
    }

    const orderData = insertOrderSchema.parse({
      user_id: session.user.profileId,
      shipping_address: user.address,
      payment_method: user.payment_method,
      items_price: cart.items_price,
      shipping_price: cart.shipping_price,
      tax_price: cart.tax_price,
      total_price: cart.total_price,
      order_items: cart.items.map((item: CartItem) => ({
        product_id: Number(item.product_id),
        name: item.name,
        slug: item.slug,
        quantity: item.qty,
        price: item.price,
        image: item.image,
      })),
      isPaid: false,
      paidAt: null,
    });

    const { data: orderId, error: orderError } = await supabaseAdmin.rpc(
      "create_order_atomic",
      {
        p_user_id: orderData.user_id,
        p_shipping_address: orderData.shipping_address,
        p_payment_method: orderData.payment_method,
        p_items_price: orderData.items_price,
        p_shipping_price: orderData.shipping_price,
        p_tax_price: orderData.tax_price,
        p_total_price: orderData.total_price,
        p_order_items: orderData.order_items,
        p_cart_id: cart.id,
        p_ispaid: orderData.isPaid,
        p_paidat: orderData.paidAt,
      }
    );

    if (orderError || !orderId) {
      throw new Error(
        `Failed to create order: ${orderError?.message || "Unknown error"}`
      );
    }

    revalidatePath("/cart");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${orderId}`,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateUserProfile(data: {
  fullName: string;
  address: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
}): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();

    if (!session?.user?.profileId) {
      return { success: false, message: "Unauthorized" };
    }

    const validated = updateProfileSchema.parse(data);

    const { error } = await supabaseAdmin
      .from("user_profile")
      .update({
        full_name: validated.fullName,
        address: validated.address,
      })
      .eq("id", session.user.profileId);

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    revalidatePath("/user/profile");

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get unique slug for product creation (client-side preview)
export async function getUniqueSlug(
  slug: string
): Promise<{ success: boolean; slug: string }> {
  try {
    const uniqueSlug = await findUniqueSlug(slug);
    return { success: true, slug: uniqueSlug };
  } catch {
    return { success: false, slug };
  }
}

// Admin Product Actions
export async function createProduct(
  data: {
    name: string;
    slug: string;
    category: string;
    brand: string;
    description: string;
    stock: number;
    image: string;
    price: string;
  }
): Promise<{ success: boolean; message: string; productId?: string }> {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return { success: false, message: "Forbidden: Admin access required" };
    }

    const validated = insertProductSchema.parse(data);

    // Ensure slug uniqueness - append numeric suffix if needed
    const uniqueSlug = await findUniqueSlug(validated.slug);

    const { data: product, error } = await supabaseAdmin
      .from("Product")
      .insert([{ ...validated, slug: uniqueSlug }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
      productId: product.id.toString(),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProduct(
  productId: number,
  data: {
    name: string;
    slug: string;
    category: string;
    brand: string;
    description: string;
    stock: number;
    image: string;
    price: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return { success: false, message: "Forbidden: Admin access required" };
    }

    const validated = insertProductSchema.parse(data);

    const { error } = await supabaseAdmin
      .from("Product")
      .update(validated)
      .eq("id", productId);

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    revalidatePath("/products");
    revalidatePath(`/products/${validated.slug}`);
    revalidatePath("/admin/products");

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteProduct(
  productId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return { success: false, message: "Forbidden: Admin access required" };
    }

    const { error } = await supabaseAdmin
      .from("Product")
      .delete()
      .eq("id", productId);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function uploadProductImage(
  formData: FormData
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    // 1. Verify admin role
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, message: "Forbidden: Admin access required" };
    }

    // 2. Extract file from FormData
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // 3. Validate file type (jpg, png, webp only)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return { success: false, message: "Only JPG, PNG, WebP images allowed" };
    }

    // 4. Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, message: "Image must be less than 2MB" };
    }

    // 5. Generate unique filename (uuid + extension)
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;

    // 6. Upload to 'products' bucket via Supabase admin client
    const { error } = await supabaseAdmin.storage
      .from("products")
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, message: "Failed to upload image" };
    }

    // 7. Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(filename);

    return { success: true, message: "Image uploaded", url: urlData.publicUrl };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
