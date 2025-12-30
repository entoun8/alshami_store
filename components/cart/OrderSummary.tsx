import { Cart } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type OrderSummaryProps = {
  cart: Cart;
};

export default function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardContent className="px-6 py-4">
        <h2 className="h3-bold mb-4">Order Summary</h2>
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
          <div className="border-t border-border pt-3">
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="h3-bold text-primary">${cart.total_price}</span>
            </div>
          </div>
        </div>
        <Button className="w-full mt-6 bg-primary text-primary-foreground">
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
