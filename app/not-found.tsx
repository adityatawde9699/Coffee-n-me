import Link from "next/link";
import { Coffee, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Coffee className="w-14 h-14 text-primary/40 mx-auto mb-6 animate-float" />
        <p className="text-sm font-heading font-semibold uppercase tracking-widest text-primary mb-3">
          404 — Not found
        </p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-4">
          This cup is empty
        </h1>
        <p className="text-muted-foreground font-serif italic mb-8 leading-relaxed">
          The page you&apos;re looking for has been finished, moved, or never brewed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-muted-foreground font-heading font-medium text-sm hover:text-foreground hover:border-foreground/20 transition-all duration-300"
          >
            Browse stories
          </Link>
        </div>
      </div>
    </div>
  );
}
