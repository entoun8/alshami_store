"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import StripeForm from "./StripeForm";

type Props = {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function StripePayment({
  priceInCents,
  orderId,
  clientSecret,
}: Props) {
  const { theme, systemTheme } = useTheme();

  const stripeTheme =
    theme === "dark"
      ? "night"
      : theme === "light"
      ? "stripe"
      : systemTheme === "light"
      ? "stripe"
      : "night";

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: stripeTheme },
      }}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
}
