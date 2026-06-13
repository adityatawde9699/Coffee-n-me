import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [GitHub, Google],
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.role = (token.role as any) || "READER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
