"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { paymentMethodSchema } from "@/lib/validators";
import { updateUserPaymentMethod } from "@/lib/actions";
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD } from "@/lib/constants";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Loader } from "lucide-react";

type PaymentMethodFormProps = {
  preferredPaymentMethod?: string | null;
};

export default function PaymentMethodForm({
  preferredPaymentMethod,
}: PaymentMethodFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  function onSubmit(values: z.infer<typeof paymentMethodSchema>) {
    startTransition(async () => {
      const result = await updateUserPaymentMethod(values);

      if (result.success) {
        toast.success(result.message);
        router.push("/place-order");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="h2-bold">Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-3"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <div
                          key={method}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem value={method} id={method} />
                          <label
                            htmlFor={method}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {method}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
                className="w-full sm:flex-1"
              >
                Back to Shipping
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground w-full sm:flex-1"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Continue to Review</span>
                    <span className="sm:hidden">Continue</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
