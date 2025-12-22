import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserProfile } from "./data-service";
import { createUserProfile } from "./actions";

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
    signIn: "/login",
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

    async jwt({ token, user }) {
      if (user) {
        const profile = await getUserProfile(user.email!);

        if (profile) {
          token.role = profile.role;
          token.profileId = profile.id;
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

    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
