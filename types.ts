import { z } from "zod";
import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
} from "./lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  created_at: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

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
