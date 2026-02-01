import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteProductDialog from "./DeleteProductDialog";
import { formatNumberWithDecimal } from "@/lib/utils";
import { Product } from "@/types";

interface AdminProductTableProps {
  products: Product[];
}

export default function AdminProductTable({ products }: AdminProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No products found.</p>
        <Link href="/admin/products/new" className="text-primary hover:underline">
          Add your first product
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="text-right">
              ${formatNumberWithDecimal(product.price)}
            </TableCell>
            <TableCell className="text-right">{product.stock}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <DeleteProductDialog
                  productId={Number(product.id)}
                  productName={product.name}
                  trigger={
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
