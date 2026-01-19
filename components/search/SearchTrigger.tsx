"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { SearchCommand } from "./SearchCommand";

interface SearchTriggerProps {
  products: Product[];
}

export function SearchTrigger({ products }: SearchTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
        <span className="sr-only">Search products</span>
      </Button>
      <SearchCommand products={products} open={open} onOpenChange={setOpen} />
    </>
  );
}
