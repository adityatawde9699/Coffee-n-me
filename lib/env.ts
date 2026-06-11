import "server-only";

/**
 * Lightweight environment validation run once at server startup
 * (see instrumentation.ts). Required vars hard-fail in production; recommended
 * vars (OAuth, Cloudinary) only warn so the app still boots with partial config.
 */

const REQUIRED = ["DATABASE_URL", "AUTH_SECRET", "NEXT_PUBLIC_APP_URL"] as const;

const RECOMMENDED = [
  "AUTH_GITHUB_ID",
  "AUTH_GITHUB_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

const isPlaceholder = (v: string | undefined) =>
  !v || v.startsWith("your-") || v.includes("your-") || v.trim() === "";

export function validateEnv(): void {
  const missingRequired = REQUIRED.filter((k) => isPlaceholder(process.env[k]));
  const missingRecommended = RECOMMENDED.filter((k) => isPlaceholder(process.env[k]));

  if (missingRequired.length > 0) {
    const message = `❌ Missing required environment variables: ${missingRequired.join(", ")}`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }
    console.error(`${message} (continuing in development)`);
  }

  if (missingRecommended.length > 0) {
    console.warn(
      `⚠️  Missing/placeholder env vars (some features disabled): ${missingRecommended.join(", ")}`
    );
  }

  if (missingRequired.length === 0 && missingRecommended.length === 0) {
    console.log("✅ Environment variables validated.");
  }
}
