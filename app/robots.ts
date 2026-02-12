import type { MetadataRoute } from "next";
import { SERVER_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/*", "/about", "/contact"],
        disallow: [
          "/user/",
          "/cart",
          "/shipping-address",
          "/payment-method",
          "/place-order",
          "/order/",
          "/admin/",
          "/sign-in",
          "/api/",
        ],
      },
    ],
    sitemap: `${SERVER_URL}/sitemap.xml`,
  };
}
