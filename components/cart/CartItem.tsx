"use client";

import { CartItem as CartItemType } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatNumberWithDecimal } from "@/lib/utils";

type CartItemProps = {
  item: CartItemType;
  variant?: "desktop" | "mobile";
};

export default function CartItem({ item, variant = "desktop" }: CartItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.product_id);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.refresh();
      }
    });
  };

  const handleAdd = () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.refresh();
      }
    });
  };

  if (variant === "mobile") {
    return (
      <div className="border border-border rounded-lg p-4">
        <div className="flex gap-4 mb-4">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-lg w-auto h-auto"
          />
          <div className="flex-1">
            <Link
              href={`/products/${item.slug}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
            <p className="text-lg font-bold mt-2">
              ${formatNumberWithDecimal(Number(item.price) * item.qty)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border"
              disabled={isPending}
              onClick={handleRemove}
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </Button>
            <span className="w-8 text-center font-semibold">{item.qty}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border"
              disabled={isPending}
              onClick={handleAdd}
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TableRow className="border-border">
      <TableCell>
        <div className="flex items-center gap-4">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-lg w-auto h-auto"
          />
          <div>
            <Link
              href={`/products/${item.slug}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border"
            disabled={isPending}
            onClick={handleRemove}
          >
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
          </Button>
          <span className="w-8 text-center font-semibold">{item.qty}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-border"
            disabled={isPending}
            onClick={handleAdd}
          >
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right font-semibold">
        ${formatNumberWithDecimal(Number(item.price) * item.qty)}
      </TableCell>
    </TableRow>
  );
}
