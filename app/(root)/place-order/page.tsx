import type { Metadata } from "next";
import { getMyCart, getUserById } from "@/lib/data-service";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShippingAddress, CartItem } from "@/types";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import PlaceOrderButton from "@/components/checkout/PlaceOrderButton";

export const metadata: Metadata = {
  title: "Place Order",
  description: "Review your order details and complete your purchase.",
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

  const shippingAddress = user.address as ShippingAddress;

  return (
    <section className="wrapper my-8">
      <CheckoutSteps current={3} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="h3-bold">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {shippingAddress.streetAddress}
                </p>
                <p className="text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">
                  {shippingAddress.country}
                </p>
              </div>
              <Link
                href="/shipping-address"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                Edit
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="h3-bold">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{user.payment_method}</p>
              <Link
                href="/payment-method"
                className="text-sm text-primary hover:underline mt-4 inline-block"
              >
                Edit
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="h3-bold">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item: CartItem) => (
                  <div key={item.product_id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="h3-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span>${cart.items_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>${cart.shipping_price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${cart.tax_price}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="h3-bold text-primary">
                    ${cart.total_price}
                  </span>
                </div>
              </div>

              <PlaceOrderButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
