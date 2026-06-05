import { getPostsByCategory } from "@/lib/db/queries/post";
import { getCategoryBySlug } from "@/lib/db/queries/category";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Coffee, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Friendly display names for known categories
const KNOWN_CATEGORIES: Record<string, string> = {
  essays: "Essays",
  tech: "Technology",
  culture: "Culture",
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const displayName = KNOWN_CATEGORIES[slug] ?? slug;
  return {
    title: displayName,
    description: `Explore ${displayName} stories on Coffee'n me.`,
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Try to get category from DB; fall back to known-category list so the
  // page still renders while the database is offline in development.
  const category = await getCategoryBySlug(slug);
  const displayName = category?.name ?? KNOWN_CATEGORIES[slug];

  // If neither DB nor known-category list has it → genuine 404
  if (!displayName) {
    notFound();
  }

  const posts = await getPostsByCategory(slug);

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
      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Coffee className="w-4 h-4" />
          <span className="tracking-widest uppercase">Category</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
          {displayName}
        </h1>
        <p className="text-muted-foreground font-serif italic text-lg max-w-xl">
          Exploring ideas, stories, and insights in {displayName}.
        </p>
        <div className="warm-divider mt-8" />
      </header>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <Coffee className="w-12 h-12 text-primary/40 animate-float" />
            <p className="text-muted-foreground italic font-serif text-lg">
              No articles in {displayName} yet.
            </p>
            <p className="text-sm text-muted-foreground/60">
              Check back soon for fresh content.
            </p>
            <Link
              href="/archive"
              className="mt-2 text-sm font-heading text-primary hover:underline"
            >
              Browse all stories →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
