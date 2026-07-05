import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config (no DB access). Shared between middleware and the
 * full Node auth instance in src/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin-panel/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin-panel/login";
      if (isLoginPage) return true;
      // Every other /admin-panel route requires a session.
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
