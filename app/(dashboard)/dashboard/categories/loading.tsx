export default function TablePageLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-muted rounded-lg" />
        <div className="h-4 w-56 bg-muted/60 rounded" />
      </div>
      <div className="flex gap-3 max-w-md">
        <div className="flex-1 h-10 bg-muted rounded-md" />
        <div className="h-10 w-20 bg-muted rounded-md" />
      </div>
      <div className="border rounded-xl overflow-hidden bg-muted/10">
        <div className="bg-muted/30 px-6 py-4">
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-t flex gap-6 items-center">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted/60 rounded" />
            <div className="h-4 w-6 bg-muted/60 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
