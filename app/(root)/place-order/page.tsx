import { getMyCart, getUserById } from "@/lib/data-service";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Place Order",
};

export default async function PlaceOrderPage() {
  const session = await auth();

  const userId = session?.user?.profileId;

  if (!userId) {
    redirect("/sign-in");
  }

  const cart = await getMyCart();
  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  if (!user.address) {
    redirect("/shipping-address");
  }

  if (!user.payment_method) {
    redirect("/payment-method");
  }

  const userAddress = user.address as ShippingAddress;

  return <></>;
}
