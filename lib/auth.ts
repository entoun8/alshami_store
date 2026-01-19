import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserProfile, getCartBySessionId } from "./data-service";
import { createUserProfile, mergeSessionCartToUser } from "./actions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const existingProfile = await getUserProfile(user.email!);

        if (!existingProfile) {
          await createUserProfile({
            email: user.email!,
            full_name: user.name || user.email!.split("@")[0],
            image: user.image || undefined,
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        const profile = await getUserProfile(user.email!);

        if (profile) {
          token.role = profile.role;
          token.profileId = profile.id;
        }

        if (trigger === "signIn") {
          const cookiesObj = await cookies();
          const sessionCartId = cookiesObj.get("sessionCartId")?.value;

          if (sessionCartId && profile) {
            const sessionCart = await getCartBySessionId(sessionCartId);

            if (sessionCart) {
              await mergeSessionCartToUser(sessionCart.id, profile.id);
            }
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.profileId = token.profileId as string;
      session.user.id = token.sub as string;

      return session;
    },

    authorized({ request, auth }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        return false;
      }

      const hasCartCookie = request.cookies.get("sessionCartId");

      if (!hasCartCookie) {
        const sessionCartId = crypto.randomUUID();

        const newHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: {
            headers: newHeaders,
          },
        });

        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      }

      return true;
    },
  },
});
