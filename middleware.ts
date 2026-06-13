import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

/**
 * Route-level auth guard for the /dashboard route group.
 * Runs on every request to /dashboard and its sub-routes — catches new pages
 * that might forget to call auth() themselves.
 *
 * NOTE: Auth.js v5 provides its own middleware helper; we call auth() here
 * which checks the session cookie server-side.
 */
export default auth((req: NextRequest & { auth: unknown }) => {
  const isAuthed = !!(req as { auth?: { user?: unknown } }).auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isAuthed) {
    const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all /dashboard routes. Exclude static files and Next.js internals.
     */
    "/dashboard/:path*",
  ],
};
