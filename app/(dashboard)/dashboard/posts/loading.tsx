export default function PostsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-muted rounded-lg" />
          <div className="h-4 w-56 bg-muted/60 rounded" />
        </div>
        <div className="h-9 w-28 bg-muted rounded-full" />
      </div>

      <div className="border rounded-xl overflow-hidden bg-muted/10">
        <div className="bg-muted/30 px-6 py-4 flex gap-8">
          {["Title", "Status", "Category", "Updated", ""].map((h) => (
            <div key={h} className="h-3 w-16 bg-muted rounded" />
          ))}
        </div>
        <div className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-6 py-5 flex items-center gap-8">
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted/60 rounded" />
              </div>
              <div className="h-5 w-16 bg-muted rounded-full" />
              <div className="h-4 w-20 bg-muted/60 rounded" />
              <div className="h-4 w-16 bg-muted/60 rounded" />
              <div className="flex gap-2 ml-auto">
                <div className="h-8 w-8 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
