export default function ArticleLoading() {
  return (
    <div className="pb-20" role="status" aria-label="Loading article">
      <header className="py-20 bg-muted/20 border-b mb-16">
        <div className="prose-container">
          <div className="h-4 w-40 rounded bg-muted animate-pulse mb-6" />
          <div className="space-y-3 mb-8">
            <div className="h-12 w-full rounded bg-muted animate-pulse" />
            <div className="h-12 w-3/4 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-6 w-2/3 rounded bg-muted animate-pulse mb-10" />
          <div className="flex items-center justify-between py-6 border-t border-b">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </header>
      <div className="prose-container space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-muted animate-pulse"
            style={{ width: `${90 - (i % 3) * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}
