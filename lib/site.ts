/** Single source of truth for site-wide identity used by SEO/metadata. */
export const siteConfig = {
  name: "Coffee'n me",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://coffee-n-me.vercel.app",
  description:
    "A calm, editorial publishing platform — stories brewed with care, served warm.",
  twitter: "@coffeenme",
} as const;

/** Absolute URL helper. Pass a path like "/article/foo". */
export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
