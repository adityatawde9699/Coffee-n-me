"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Coffee, RotateCw } from "lucide-react";
import { reportError } from "@/lib/monitoring";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "public", digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Coffee className="w-14 h-14 text-primary/40 mx-auto mb-6 animate-pulse-soft" />
        <p className="text-sm font-heading font-semibold uppercase tracking-widest text-primary mb-3">
          Something spilled
        </p>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-4">
          We hit a snag brewing this page
        </h1>
        <p className="text-muted-foreground font-serif italic mb-8 leading-relaxed">
          An unexpected error occurred. Try again in a moment — if it keeps
          happening, the kettle may need attention.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all duration-300"
          >
            <RotateCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-muted-foreground font-heading font-medium text-sm hover:text-foreground hover:border-foreground/20 transition-all duration-300"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
