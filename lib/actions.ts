"use server";

import { signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { CartItem, ShippingAddress } from "@/types";
import { auth } from "./auth";
import { cookies } from "next/headers";
import { formatError, roundTwo } from "./utils";
import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
  paymentMethodSchema,
} from "./validators";
import { getMyCart, getProductById, getUserById } from "./data-service";
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

  const shippingPrice = roundTwo(itemsPrice < 100 ? 10 : 0);
  const taxPrice = roundTwo(itemsPrice * 0.15);
  const totalPrice = roundTwo(itemsPrice + shippingPrice + taxPrice);

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

    const { error: updateError } = await supabase
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

    const { error: updateError } = await supabase
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
