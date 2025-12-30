import CartView from "@/components/cart/CartView";
import { getMyCart } from "@/lib/data-service";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <section>
      <CartView cart={cart} />
    </section>
  );
}
