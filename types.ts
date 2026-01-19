import { z } from "zod";
import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
  insertOrderSchema,
  orderItemSchema,
} from "./lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  created_at: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderItem = z.infer<typeof orderItemSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  image: string | null;
  role: string;
  address: ShippingAddress | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profileId?: string;
      role: string;
    };
  }

  interface User {
    role?: string;
  }

  interface JWT {
    role?: string;
    profileId?: string;
  }
}
