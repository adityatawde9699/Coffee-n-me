import { ArticleGridSkeleton } from "@/components/article/ArticleCardSkeleton";

export default function ArchiveLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <div className="h-4 w-24 rounded bg-muted animate-pulse mb-4" />
        <div className="h-10 w-64 rounded bg-muted animate-pulse mb-4" />
        <div className="h-4 w-80 rounded bg-muted animate-pulse" />
      </div>
      <ArticleGridSkeleton count={9} />
    </div>
  );
}
