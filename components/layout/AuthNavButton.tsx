"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";

/**
 * Client-side auth indicator. Keeping the session check out of the server
 * render path lets the public layout (and all content pages) be statically
 * prerendered / ISR-cached instead of forced dynamic on every request.
 */
export function AuthNavButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-[4.5rem] rounded-md bg-muted/40 animate-pulse" aria-hidden="true" />;
  }

  return session ? (
    <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
      Dashboard
    </Link>
  ) : (
    <Link href="/auth/signin" className={buttonVariants({ variant: "outline", size: "sm" })}>
      Sign In
    </Link>
  );
}
