import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { AuthNavButton } from "@/components/layout/AuthNavButton";

export function PublicNav() {
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
              <Link href="/brews" className="hover:text-foreground transition-colors">Brew Guide</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar className="hidden lg:flex w-52" />
            <ThemeToggle />
            <AuthNavButton />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
