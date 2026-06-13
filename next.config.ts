import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    // Content Security Policy
    // - default-src 'self' — only allow same-origin resources by default
    // - script-src 'self' 'unsafe-inline' — needed for Next.js inline scripts (theme toggle)
    // - style-src 'self' 'unsafe-inline' — Tailwind CSS inlines styles
    // - img-src — allow Cloudinary CDN, Google/GitHub avatars, and data URIs for tiny icons
    // - connect-src — allow PostHog analytics endpoint
    // - frame-ancestors 'none' — redundant with X-Frame-Options but belt-and-suspenders
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://app.posthog.com ${isDev ? "'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      "connect-src 'self' https://app.posthog.com https://api.cloudinary.com",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    // Remote hosts allowed for next/image. OAuth avatar providers + Cloudinary CDN.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatars
      { protocol: "https", hostname: "res.cloudinary.com" }, // Cloudinary delivery
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
