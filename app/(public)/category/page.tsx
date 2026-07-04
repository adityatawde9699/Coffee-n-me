import { getCategoriesWithPostCount } from "@/lib/db/queries/category";
import { InView } from "@/components/ui/InView";
import Link from "next/link";
import { Coffee, ArrowRight, ArrowLeft, Palette, Cpu, Compass } from "lucide-react";
import { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse stories by category on Coffee'n me — pick a shelf and start reading.",
  alternates: { canonical: absoluteUrl("/category") },
};

export const revalidate = 300;

// Icon + one-line blurb per known category slug. Anything created later
// that isn't listed here still gets a sensible generic look.
const CATEGORY_META: Record<string, { icon: typeof Coffee; blurb: string }> = {
  casual: { icon: Coffee, blurb: "Easy reads for a slow afternoon." },
  culture: { icon: Palette, blurb: "Ideas, art, and the world around us." },
  tech: { icon: Cpu, blurb: "Code, tools, and the machines we build." },
  travel: { icon: Compass, blurb: "Notes from the road, one cup at a time." },
};

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
        <InView className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.slug];
            const Icon = meta?.icon ?? Coffee;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative glass-card card-hover rounded-2xl p-6 flex flex-col gap-5 overflow-hidden"
              >
                {/* Hover glow, matching the language ArticleCard uses */}
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border/50 px-3 py-1 text-xs font-heading font-medium text-muted-foreground">
                    {cat._count.posts}{" "}
                    {cat._count.posts === 1 ? "story" : "stories"}
                  </span>
                </div>

                <div className="relative flex-1">
                  <h2 className="mb-1.5 truncate font-heading text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary">
                    {cat.name}
                  </h2>
                  <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                    {meta?.blurb ?? `Stories filed under ${cat.name}.`}
                  </p>
                </div>

                <span className="relative inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary">
                  Browse the shelf
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </InView>
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
