import { ArticleGridSkeleton } from "@/components/article/ArticleCardSkeleton";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="h-4 w-24 rounded bg-muted animate-pulse mb-10" />
      <div className="mb-16">
        <div className="h-4 w-20 rounded bg-muted animate-pulse mb-4" />
        <div className="h-10 w-56 rounded bg-muted animate-pulse mb-4" />
        <div className="h-4 w-72 rounded bg-muted animate-pulse" />
      </div>
      <ArticleGridSkeleton count={6} />
    </div>
  );
}
