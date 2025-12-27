import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getMyCart } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";
import AddToCart from "@/components/cart/AddToCart";

type Params = Promise<{ slug: string }>;

export default async function ProductDetails({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  return (
    <div className="wrapper my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0 aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Brand */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/5 px-3 py-1 rounded-full">
              {product.brand}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="h1-bold mb-6">{product.name}</h1>

          {/* Price and Stock */}
          <div className="flex items-baseline gap-4 mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light text-muted-foreground">$</span>
              <span className="text-5xl font-bold tracking-tighter">{product.price}</span>
            </div>
            {product.stock > 0 ? (
              <Badge className="bg-primary/10 text-primary">In Stock</Badge>
            ) : (
              <Badge className="bg-destructive/10 text-destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Add to Cart Button */}
          <AddToCart
            item={{
              product_id: String(product.id),
              name: product.name,
              slug: product.slug,
              qty: 1,
              image: product.image,
              price: String(product.price),
            }}
            cart={cart}
          />
        </div>
      </div>
    </div>
  );
}
