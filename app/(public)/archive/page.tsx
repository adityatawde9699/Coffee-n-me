import { getPublishedPosts } from "@/lib/db/queries/post";
import { getCategories } from "@/lib/db/queries/category";
import { ArticleCard } from "@/components/article/ArticleCard";
import { InView } from "@/components/ui/InView";
import Link from "next/link";
import { Coffee, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse all articles on Coffee'n me — essays, technology, culture and more.",
};

// Reads `page` from searchParams → rendered dynamically, but the underlying
// post queries are data-cached (unstable_cache, "posts" tag), so this does not
// hit Postgres on every request.
const PER_PAGE = 12;

interface ArchivePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPublishedPosts({ page, perPage: PER_PAGE }),
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
        <>
          <InView className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </InView>

          {totalPages > 1 && (
            <nav
              className="mt-16 flex items-center justify-center gap-4"
              aria-label="Pagination"
            >
              {page > 1 ? (
                <Link
                  href={`/archive?page=${page - 1}`}
                  rel="prev"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm font-heading hover:text-primary hover:border-primary/30 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/30 text-sm font-heading text-muted-foreground/40">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </span>
              )}

              <span className="text-sm text-muted-foreground" aria-current="page">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/archive?page=${page + 1}`}
                  rel="next"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm font-heading hover:text-primary hover:border-primary/30 transition-all duration-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/30 text-sm font-heading text-muted-foreground/40">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          )}
        </>
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
