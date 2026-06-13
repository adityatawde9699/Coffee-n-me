/**
 * Lightweight in-memory rate limiter for Next.js API routes.
 * Uses a sliding-window counter keyed by IP address.
 *
 * NOTE: This is per-instance — for multi-replica deployments, use
 * Redis (e.g. Upstash) instead. For a free-tier Vercel deploy, this works
 * since each region has few instances.
 */

interface RateLimitState {
  count: number;
  windowStart: number;
}

// IP → { count, windowStart }
const store = new Map<string, RateLimitState>();

// Periodically purge stale entries to prevent unbounded growth.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, state] of store.entries()) {
      if (now - state.windowStart > 60_000 * 5) {
        store.delete(key);
      }
    }
  },
  60_000 // purge every minute
);

interface RateLimitOptions {
  /** Maximum requests allowed within `windowMs`. Default: 10 */
  limit?: number;
  /** Window duration in milliseconds. Default: 60_000 (1 minute) */
  windowMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in this window */
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  resetAt: number;
}

export function rateLimit(ip: string, options: RateLimitOptions = {}): RateLimitResult {
  const { limit = 10, windowMs = 60_000 } = options;
  const now = Date.now();

  const state = store.get(ip);

  if (!state || now - state.windowStart >= windowMs) {
    // New window
    store.set(ip, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  state.count += 1;

  if (state.count > limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: state.windowStart + windowMs,
    };
  }

  return {
    success: true,
    remaining: limit - state.count,
    resetAt: state.windowStart + windowMs,
  };
}

/**
 * Extract the real client IP from a Next.js request, respecting the
 * x-forwarded-for header set by Vercel's edge network.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
