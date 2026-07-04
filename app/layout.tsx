import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Coffee'n me | A calm reading experience",
    template: "%s | Coffee'n me",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Coffee'n me",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee'n me",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Scroll-reveal (see components/ui/InView.tsx) needs JS to add
            `.in-view`; without it, keep the content visible. */}
        <noscript>
          <style>{`.stagger-children > * { animation: none !important; } .reveal-group:not(.stagger-children) { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body
        className={`${inter.variable} ${sourceSerif.variable} font-serif antialiased`}
      >
        <SessionProvider>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
