"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/lib/actions";

export default function PlaceOrderButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handlePlaceOrder() {
    startTransition(async () => {
      const result = await createOrder();

      if (result.success) {
        toast.success(result.message);
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast.error(result.message);
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      }
    });
  }

  return (
    <Button
      onClick={handlePlaceOrder}
      disabled={isPending}
      className="w-full bg-primary text-primary-foreground"
      size="lg"
    >
      {isPending ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <ShoppingBag className="mr-2 h-5 w-5" />
          Place Order
        </>
      )}
    </Button>
  );
}
