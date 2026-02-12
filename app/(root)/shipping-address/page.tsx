import type { Metadata } from "next";
import { getMyCart, getUserById } from "@/lib/data-service";
import auth from "@/middleware";
import { redirect } from "next/navigation";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import type { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Shipping Address",
  description: "Enter your shipping address for order delivery.",
};

export default async function ShippingAddress() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const session = await auth();
  const userID = session?.user?.profileId;

  if (!userID) {
    redirect("/sign-in");
  }

  const user = await getUserById(userID);

  return (
    <section className="wrapper my-8">
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </section>
  );
}
