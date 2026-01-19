"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CategoryFilter({
  categories,
}: {
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => handleCategoryClick("all")}
        className={cn(
          "rounded-full border-2 transition-colors",
          selectedCategory === "all"
            ? "bg-primary text-primary-foreground border-primary"
            : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
        )}
      >
        All Products
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "rounded-full border-2 transition-colors",
            selectedCategory === category
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
