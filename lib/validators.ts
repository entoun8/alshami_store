import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (val) => /^[0-9]+(\.[0-9]{2})?$/.test(formatNumberWithDecimal(val)),
    "Price must have exactly two decimal places"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number().int().min(0, "Stock must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});
