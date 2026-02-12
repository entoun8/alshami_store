import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { getMyCart } from "@/lib/data-service";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review your shopping cart items. Secure checkout with Stripe payment processing.",
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <section>
      <CartView cart={cart} />
    </section>
  );
}
