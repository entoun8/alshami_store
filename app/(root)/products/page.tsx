import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddToCart from "@/components/cart/AddToCart";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getMyCart } from "@/lib/data-service";

export default async function ProductsPage() {
  const products = await getProducts();
  const totalProducts = products.length;

  const cart = await getMyCart();

  return (
    <div className="wrapper my-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="h1-bold mb-4">Product Catalog</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {totalProducts}
            </span>{" "}
            Products Found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="best-selling">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col group">
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

            <CardFooter className="p-4 pt-0">
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
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="pointer-events-none opacity-50 hover:bg-accent hover:text-accent-foreground"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="hover:bg-primary/10 hover:text-primary border-border"
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="hover:bg-primary/10 hover:text-primary border-border"
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              className="hover:bg-primary/10 hover:text-primary border-border"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
