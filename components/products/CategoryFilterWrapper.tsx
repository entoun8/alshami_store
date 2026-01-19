import { getCategories } from "@/lib/data-service";
import CategoryFilter from "./CategoryFilter";

export default async function CategoryFilterWrapper() {
  const categories = await getCategories();

  return <CategoryFilter categories={categories} />;
}
