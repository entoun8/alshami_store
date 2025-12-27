"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { CartItem, Cart } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions";
import { useTransition } from "react";

type AddToCartProps = {
  item: CartItem;
  cart?: Cart;
};

export default function AddToCart({ item, cart }: AddToCartProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const existItem = cart?.items.find(
    (x: CartItem) => x.product_id === item.product_id
  );

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message, {
        action: {
          label: "Go to cart",
          onClick: () => router.push("/cart"),
        },
      });

      router.refresh();
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.product_id);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.refresh();
    });
  };

  return existItem ? (
    <div className="flex items-center gap-2 w-full lg:w-auto">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <span className="px-4 py-2 font-medium min-w-12 text-center">
        {existItem.qty}
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      onClick={handleAddToCart}
      className="w-full lg:w-auto"
      disabled={isPending}
    >
      {isPending ? "Adding..." : "Add to Cart"}
      <Plus className="ml-2 h-4 w-4" />
    </Button>
  );
}
