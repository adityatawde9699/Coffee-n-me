import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://coffeenme.com"),
  title: {
    default: "Coffee'n me | A calm reading experience",
    template: "%s | Coffee'n me",
  },
  description: "A premium publishing platform optimized for elegant reading and editorial excellence.",
  openGraph: {
    title: "Coffee'n me",
    description: "A calm space for reading and writing.",
    url: "https://coffeenme.com",
    siteName: "Coffee'n me",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee'n me",
    description: "A calm space for reading and writing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { PostHogProvider } from "@/components/analytics/PostHogProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${sourceSerif.variable} font-serif antialiased`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
