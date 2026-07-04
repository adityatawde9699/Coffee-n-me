import { searchPosts } from "@/lib/db/queries/search";
import { ArticleCard } from "@/components/article/ArticleCard";
import { InView } from "@/components/ui/InView";
import { SearchBar } from "@/components/layout/SearchBar";
import { Coffee, Search as SearchIcon } from "lucide-react";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description: "Search stories on Coffee'n me.",
    robots: { index: false, follow: true },
  };
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const posts = query ? await searchPosts(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-12 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <SearchIcon className="w-4 h-4" />
          <span className="tracking-widest uppercase">Search</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
          {query ? "Search results" : "Find a story"}
        </h1>
        <SearchBar defaultValue={query} className="max-w-md" />
        {query && (
          <p className="mt-4 text-sm text-muted-foreground" role="status">
            {posts.length} result{posts.length === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
          </p>
        )}
      </header>

      {query && posts.length > 0 && (
        <InView className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </InView>
      )}

      {query && posts.length === 0 && (
        <div className="py-24 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <Coffee className="w-12 h-12 text-primary/40 animate-float" />
            <p className="text-muted-foreground italic font-serif text-lg">
              No stories matched &ldquo;{query}&rdquo;.
            </p>
            <p className="text-sm text-muted-foreground/60">
              Try a different keyword or browse the archive.
            </p>
          </div>
        </div>
      )}

      {!query && (
        <p className="text-muted-foreground font-serif italic">
          Type a keyword above to search titles, excerpts, and article text.
        </p>
      )}
    </div>
  );
}
