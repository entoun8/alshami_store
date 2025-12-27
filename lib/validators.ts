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

export const cartItemSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z
    .number()
    .int()
    .nonnegative({ message: "Quantity must be a positive number" }),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  items_price: currency,
  total_price: currency,
  shipping_price: currency,
  tax_price: currency,
  session_cart_id: z.string().min(1, "Session cart ID is required"),
  user_id: z.string().optional().nullable(),
});
