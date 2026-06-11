/**
 * Next.js instrumentation hook — runs once when the server process starts.
 * Used here to validate environment configuration early and loudly.
 */
export async function register() {
  // Only run on the Node.js server runtime (not edge / browser).
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();
  }
}
