import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCart from "@/components/cart/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Cart } from "@/types";

interface ProductCardProps {
  product: Product;
  cart: Cart | undefined;
}

export default function ProductCard({ product, cart }: ProductCardProps) {
  return (
    <Card className="flex flex-col group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-muted overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`}>
          <h3 className="h3-bold mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        <p className="text-2xl font-bold mt-auto">${product.price}</p>
      </CardContent>

      <CardFooter className="px-4">
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
      </CardFooter>
    </Card>
  );
}
