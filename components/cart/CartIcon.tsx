import { ShoppingCart } from "lucide-react";
import { getMyCart } from "@/lib/data-service";

export default async function CartIcon() {
  const cart = await getMyCart();
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.qty, 0) || 0;

  return (
    <div className="relative inline-block">
      <ShoppingCart className="h-5 w-5" />
      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
        {cartItemCount}
      </span>
    </div>
  );
}
