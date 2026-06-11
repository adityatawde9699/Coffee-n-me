"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { reportError } from "@/lib/monitoring";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "dashboard", digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-destructive/70 mx-auto mb-6" />
        <h1 className="text-2xl font-heading font-bold tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-muted-foreground font-serif italic mb-8">
          {error.message === "Unauthorized"
            ? "You don't have permission to do that."
            : "We couldn't load this part of your dashboard."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            Retry
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border text-muted-foreground font-heading font-medium text-sm hover:text-foreground transition-all"
          >
            Dashboard home
          </Link>
        </div>
      </div>
    </div>
  );
}
