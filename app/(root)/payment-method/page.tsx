import type { Metadata } from "next";
import { getMyCart, getUserById } from "@/lib/data-service";
import auth from "@/middleware";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import PaymentMethodForm from "@/components/checkout/PaymentMethodForm";

export const metadata: Metadata = {
  title: "Payment Method",
  description: "Select your preferred payment method for checkout.",
};

export default async function PaymentMethodPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const session = await auth();
  const userId = session?.user?.profileId;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById(userId);

  return (
    <section className="wrapper my-8">
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.payment_method} />
    </section>
  );
}
