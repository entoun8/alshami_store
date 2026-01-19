"use client";

import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { formatNumberWithDecimal } from "@/lib/utils";
import { Product } from "@/types";

interface SearchCommandProps {
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({
  products,
  open,
  onOpenChange,
}: SearchCommandProps) {
  const router = useRouter();

  const handleSelect = (slug: string) => {
    router.push(`/products/${slug}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Products"
      description="Search for products by name"
    >
      <CommandInput placeholder="Search products..." />
      <CommandList>
        <CommandEmpty>No products found.</CommandEmpty>
        <CommandGroup heading="Products">
          {products.map((product) => (
            <CommandItem
              key={product.id}
              value={product.name}
              onSelect={() => handleSelect(product.slug)}
              className="flex items-center justify-between"
            >
              <span>{product.name}</span>
              <span className="text-muted-foreground">
                ${formatNumberWithDecimal(product.price)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
