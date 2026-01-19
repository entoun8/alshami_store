import { getProducts, getMyCart } from "@/lib/data-service";
import ProductCard from "./ProductCard";

export default async function ProductList({
  category,
}: {
  category?: string;
}) {
  const [products, cart] = await Promise.all([
    getProducts(category),
    getMyCart(),
  ]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} cart={cart} />
      ))}
    </div>
  );
}
