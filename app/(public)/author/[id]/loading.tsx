import { ArticleGridSkeleton } from "@/components/article/ArticleCardSkeleton";

export default function AuthorLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16 border-b pb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        <div className="space-y-3">
          <div className="h-10 w-56 rounded bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <ArticleGridSkeleton count={6} />
    </div>
  );
}
