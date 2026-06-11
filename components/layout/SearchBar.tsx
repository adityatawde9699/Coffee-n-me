import { Search } from "lucide-react";

/**
 * Progressive-enhancement search box: a plain GET form that submits to /search.
 * Works without JS (server-rendered results page). Rendered in the public nav.
 */
export function SearchBar({
  defaultValue = "",
  className = "",
}: {
  defaultValue?: string;
  className?: string;
}) {
  return (
    <form
      action="/search"
      role="search"
      className={`relative flex items-center ${className}`}
    >
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search stories…"
        aria-label="Search stories"
        className="w-full rounded-full border border-border/50 bg-background/50 py-2 pl-9 pr-4 text-sm font-heading placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300"
      />
    </form>
  );
}
