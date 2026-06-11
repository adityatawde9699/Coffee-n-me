import { Coffee } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <Coffee className="h-8 w-8 text-primary/40 animate-pulse" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
