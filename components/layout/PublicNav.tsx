import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchBar } from "@/components/layout/SearchBar";
import { AuthNavButton } from "@/components/layout/AuthNavButton";
import { LogoWordmark } from "@/components/layout/LogoWordmark";

export function PublicNav() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group" aria-label="Coffee'n me — home">
              <LogoWordmark className="h-10 w-auto text-primary transition-opacity duration-300 group-hover:opacity-80" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/category" className="group relative hover:text-foreground transition-colors">
                Categories
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/archive" className="group relative hover:text-foreground transition-colors">
                Archive
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/brews" className="group relative hover:text-foreground transition-colors">
                Brew Guide
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar className="hidden lg:flex w-52" />
            <AuthNavButton />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
