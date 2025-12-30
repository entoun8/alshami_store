"use client";

import React from "react";
import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  current?: number;
};

export default function CheckoutSteps({ current = 0 }: CheckoutStepsProps) {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                "flex-1 w-full md:w-auto px-4 py-3 rounded-lg text-center text-sm font-medium transition-colors",
                index === current
                  ? "bg-primary text-primary-foreground"
                  : index < current
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step}
            </div>

            {index < steps.length - 1 && (
              <div className="hidden md:block w-12 h-[2px] bg-border" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
