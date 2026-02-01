import AdminProductForm from "@/components/admin/AdminProductForm";

export const metadata = {
  title: "Add New Product",
};

export default function NewProductPage() {
  return (
    <section className="wrapper my-8">
      <h1 className="h1-bold mb-6">Add New Product</h1>
      <AdminProductForm />
    </section>
  );
}
