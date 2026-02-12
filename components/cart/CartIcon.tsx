import { ShoppingCart } from "lucide-react";
import { getMyCart } from "@/lib/data-service";
import { CartItem } from "@/types";

export default async function CartIcon() {
  const cart = await getMyCart();
  const cartItemCount = cart?.items?.reduce((acc: number, item: CartItem) => acc + item.qty, 0) || 0;

  return (
    <div className="relative inline-flex items-center">
      <ShoppingCart className="h-4 w-4" />
      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
        {cartItemCount}
      </span>
    </div>
  );
}
