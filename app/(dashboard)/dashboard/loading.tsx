export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded-lg" />
        <div className="h-4 w-48 bg-muted/60 rounded" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-muted/20 p-6 space-y-3">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-8 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Recent posts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-muted/20 p-6 space-y-4">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-4 w-12 bg-muted/60 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
