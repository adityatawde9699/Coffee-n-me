import { getLatestPosts } from "@/lib/db/queries/post";
import { getCategories } from "@/lib/db/queries/category";
import { ArticleCard } from "@/components/article/ArticleCard";
import Link from "next/link";
import { Coffee, Filter } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse all articles on Coffee'n me — essays, technology, culture and more.",
};

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const [posts, categories] = await Promise.all([
    getLatestPosts(50),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Coffee className="w-4 h-4" />
          <span className="tracking-widest uppercase">All Stories</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
          The Archive
        </h1>
        <p className="text-muted-foreground font-serif italic text-lg max-w-xl">
          Every cup we&apos;ve ever brewed. Explore the full collection of stories.
        </p>
      </header>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-12 animate-fade-in-up">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-heading uppercase tracking-wider">Filter</span>
          </div>
          <Link
            href="/archive"
            className="px-4 py-1.5 rounded-full text-sm font-heading font-medium bg-primary text-primary-foreground transition-all duration-300"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-4 py-1.5 rounded-full text-sm font-heading font-medium glass-card hover:border-primary/30 hover:text-primary transition-all duration-300"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

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
              Brewing new stories...
            </p>
            <p className="text-sm text-muted-foreground/60">
              Check back soon for fresh content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
