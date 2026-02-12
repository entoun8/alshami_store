import type { Metadata } from "next";
import Stripe from "stripe";
import { getOrderById } from "@/lib/data-service";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatId, formatNumberWithDecimal } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  CreditCard,
  MapPin,
  Calendar,
  User,
  Mail,
} from "lucide-react";
import StripePayment from "@/components/checkout/StripePayment";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details, shipping information, and payment status.",
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage(props: Props) {
  const { id } = await props.params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const { dateTime } = formatDateTime(order.created_at);

  let clientSecret: string | null = null;

  if (!order.isPaid && order.payment_method === "Stripe") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total_price) * 100),
      currency: "aud",
      metadata: {
        orderId: order.id,
      },
    });

    clientSecret = paymentIntent.client_secret;
  }

  return (
    <section className="wrapper my-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="h1-bold">Order Details</h1>
            <p className="text-muted-foreground mt-1">
              Order ID: {formatId(order.id)}
            </p>
          </div>
          <Badge
            className="bg-primary text-primary-foreground w-fit"
            variant="outline"
          >
            {order.isPaid ? "Paid" : "Not Paid"}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Order Date</p>
                  <p className="text-sm text-muted-foreground">{dateTime}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    {order.payment_method}
                  </p>
                  {order.isPaid && order.paidAt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Paid on {formatDateTime(order.paidAt).dateTime}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Customer Name</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.full_name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shipping_address.fullName}</p>
                <p className="text-muted-foreground">
                  {order.shipping_address.streetAddress}
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.postalCode}
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_address.country}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map(
                    (item: (typeof order.order_items)[0]) => (
                      <TableRow key={item.product_id}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex items-center gap-3 hover:underline"
                          >
                            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${formatNumberWithDecimal(item.price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          $
                          {formatNumberWithDecimal(
                            Number(item.price) * item.quantity
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground md:ml-auto md:w-96">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">
                ${formatNumberWithDecimal(order.items_price)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                ${formatNumberWithDecimal(order.shipping_price)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">
                ${formatNumberWithDecimal(order.tax_price)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">
                ${formatNumberWithDecimal(order.total_price)}
              </span>
            </div>

            {!order.isPaid &&
              order.payment_method === "Stripe" &&
              clientSecret && (
                <>
                  <Separator />
                  <StripePayment
                    priceInCents={Math.round(Number(order.total_price) * 100)}
                    orderId={order.id}
                    clientSecret={clientSecret}
                  />
                </>
              )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
