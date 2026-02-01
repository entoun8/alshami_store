import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminProductTable from "@/components/admin/AdminProductTable";
import { getAllProducts } from "@/lib/data-service";

export const metadata = {
  title: "Product Management",
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <section className="wrapper my-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="h1-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <AdminProductTable products={products} />
    </section>
  );
}
