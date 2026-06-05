import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { buttonVariants } from "@/components/ui/button";

export async function PublicNav() {
  const session = await auth();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-heading tracking-tight">
              Coffee&apos;n me
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/category/essays" className="hover:text-foreground transition-colors">Essays</Link>
              <Link href="/category/tech" className="hover:text-foreground transition-colors">Tech</Link>
              <Link href="/category/culture" className="hover:text-foreground transition-colors">Culture</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
