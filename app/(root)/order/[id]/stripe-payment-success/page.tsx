import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import { getOrderById } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment Success",
};

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    payment_intent?: string;
  }>;
};

export default async function StripePaymentSuccessPage(props: Props) {
  const { id } = await props.params;
  const { payment_intent } = await props.searchParams;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  if (order.isPaid) {
    redirect(`/order/${id}`);
  }

  if (!payment_intent) {
    redirect(`/order/${id}`);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  if (
    paymentIntent.metadata.orderId !== order.id ||
    paymentIntent.status !== "succeeded"
  ) {
    redirect(`/order/${id}`);
  }

  return (
    <section className="wrapper my-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="h2-bold text-center">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Your payment has been processed successfully.
              </p>
              <p className="text-sm text-muted-foreground">
                Payment Intent ID: {payment_intent}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-md space-y-2">
              <p className="text-sm font-medium">What happens next?</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Your order is being processed</li>
                <li>You will receive a confirmation email shortly</li>
                <li>Track your order status in your account</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href={`/order/${id}`}>View Order Details</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
