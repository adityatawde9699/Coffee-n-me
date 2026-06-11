/** Placeholder card shown while a post grid loads. Mirrors ArticleCard's shape. */
export function ArticleCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col" aria-hidden="true">
      <div className="h-[1px] bg-border/30" />
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-6 w-5/6 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-11/12 rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-12 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="status"
      aria-label="Loading stories"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
