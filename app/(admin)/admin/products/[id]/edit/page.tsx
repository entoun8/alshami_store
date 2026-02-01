import { notFound } from "next/navigation";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { getProductById } from "@/lib/data-service";

export const metadata = {
  title: "Edit Product",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="wrapper my-8">
      <h1 className="h1-bold mb-6">Edit Product</h1>
      <AdminProductForm product={product} />
    </section>
  );
}
