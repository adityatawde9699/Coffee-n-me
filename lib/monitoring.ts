/**
 * Central error reporting sink. Today it logs to the console and forwards to
 * PostHog on the client; swap/extend with Sentry, Logtail, etc. in one place.
 * Safe to call from both server and client (error boundaries).
 */
export function reportError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  // Always log — captured by Vercel's function logs on the server.
  console.error("[reportError]", error, context ?? {});

  if (typeof window === "undefined") return;

  // Best-effort client telemetry; never let reporting throw.
  import("posthog-js")
    .then(({ default: posthog }) => {
      const err = error instanceof Error ? error : new Error(String(error));
      posthog.capture("$exception", {
        message: err.message,
        stack: err.stack,
        ...context,
      });
    })
    .catch(() => {});
}
