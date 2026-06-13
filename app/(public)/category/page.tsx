import { getCategoriesWithPostCount } from "@/lib/db/queries/category";
import Link from "next/link";
import { Coffee, ArrowRight, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse stories by category on Coffee'n me — pick a shelf and start reading.",
  alternates: { canonical: absoluteUrl("/category") },
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const categories = await getCategoriesWithPostCount();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      {/* Back link */}
      <Link
        href="/archive"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-10 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
        All stories
      </Link>

      {/* Header */}
      <header className="mb-14 animate-fade-in max-w-2xl">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Coffee className="w-4 h-4" />
          <span className="tracking-widest uppercase">Categories</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
          Browse by <span className="gradient-text">category</span>
        </h1>
        <p className="text-muted-foreground font-serif italic text-lg">
          Every story finds its shelf. Pick a flavour and settle in with a cup.
        </p>
        <div className="warm-divider mt-8" />
      </header>

      {/* Categories grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="glass-card card-hover rounded-2xl p-6 flex items-center gap-5 group"
            >
              <span className="w-14 h-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-heading font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {cat.name.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-heading font-semibold text-lg tracking-tight truncate">
                  {cat.name}
                </span>
                <span className="block text-sm text-muted-foreground font-serif">
                  {cat._count.posts}{" "}
                  {cat._count.posts === 1 ? "story" : "stories"}
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <Coffee className="w-12 h-12 text-primary/40 animate-float mx-auto mb-4" />
          <p className="text-muted-foreground italic font-serif text-lg">
            No categories yet.
          </p>
          <Link
            href="/archive"
            className="mt-2 inline-block text-sm font-heading text-primary hover:underline"
          >
            Browse all stories →
          </Link>
        </div>
      )}
    </div>
  );
}
