import type { Metadata } from "next";
import { Suspense } from "react";
import CategoryFilterWrapper from "@/components/products/CategoryFilterWrapper";
import ProductList from "@/components/products/ProductList";
import ProductListSkeleton from "@/components/products/ProductListSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse our curated selection of premium herbs, coffees, and more. Discover quality products from trusted brands like Alattar and Alshami Coffee.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <div className="wrapper my-8">
      <div className="mb-8">
        <h1 className="h1-bold mb-6">Our Products</h1>

        <Suspense fallback={<Skeleton className="h-10 w-full max-w-sm" />}>
          <CategoryFilterWrapper />
        </Suspense>
      </div>

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </div>
  );
}
