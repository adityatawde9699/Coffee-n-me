"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";
import { Check, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      setMessage(result.message);
      setSucceeded(result.success);
      if (result.success) setEmail("");
    });
  }

  return (
    <div className="flex flex-col w-full md:w-auto gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={isPending}
          className="flex-1 md:w-72 px-5 py-3 rounded-full bg-background/50 border border-border/50 text-sm font-heading placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-300 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 whitespace-nowrap disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : succeeded ? (
            <Check className="w-4 h-4" />
          ) : null}
          Subscribe
        </button>
      </form>
      {message && (
        <p
          className={`text-sm font-heading px-2 ${
            succeeded ? "text-primary" : "text-destructive"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
