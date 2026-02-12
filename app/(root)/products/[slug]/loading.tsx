import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="wrapper my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <Skeleton className="w-full max-w-md mx-auto lg:mx-0 aspect-square rounded-lg" />

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Brand */}
          <div className="inline-flex items-center gap-2 mb-4">
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          {/* Product Name */}
          <Skeleton className="h-10 w-3/4 mb-6" />

          {/* Price and Stock */}
          <div className="flex items-baseline gap-4 mb-6">
            <div className="flex items-baseline gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-14 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-2 mb-8">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-12 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}
