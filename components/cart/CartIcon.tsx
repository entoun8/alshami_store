import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const CartIcon = () => {
  const cartItemCount = 0;

  return (
    <Link href="/cart" className="relative inline-block">
      <ShoppingCart className="h-5 w-5" />
      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
        {cartItemCount}
      </span>
    </Link>
  );
};

export default CartIcon;
