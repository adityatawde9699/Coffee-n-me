import { ArticleGridSkeleton } from "@/components/article/ArticleCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <div className="h-4 w-20 rounded bg-muted animate-pulse mb-4" />
        <div className="h-10 w-64 rounded bg-muted animate-pulse mb-6" />
        <div className="h-10 w-full max-w-md rounded-full bg-muted animate-pulse" />
      </div>
      <ArticleGridSkeleton count={6} />
    </div>
  );
}
