"use client";

import { Cart } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";

type CartViewProps = {
  cart?: Cart;
};

export default function CartView({ cart }: CartViewProps) {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="wrapper my-8">
        <Card className="bg-card text-card-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="h2-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to get started
            </p>
            <Link href="/products">
              <Button className="bg-primary text-primary-foreground">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="wrapper my-8">
      <h1 className="h1-bold mb-6">Shopping Cart</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Cart Items */}
        <div className="md:col-span-2">
          {/* Desktop Table View */}
          <Card className="hidden md:block bg-card text-card-foreground">
            <CardContent className="px-6 py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <CartItem key={item.product_id} item={item} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.product_id} item={item} variant="mobile" />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
