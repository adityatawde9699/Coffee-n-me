"use client";

import { Trash2 } from "lucide-react";

export function DeletePostButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      aria-label={`Delete ${title}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      onClick={(e) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
