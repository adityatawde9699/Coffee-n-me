import { MetadataRoute } from "next";
import prisma from "@/lib/db/prisma";
import { siteConfig, absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/archive"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/brews"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:51213")) {
    return staticRoutes;
  }

  try {
    const [posts, categories, tags] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ select: { slug: true } }),
      prisma.tag.findMany({ select: { slug: true } }),
    ]);

    return [
      ...staticRoutes,
      ...posts.map((post) => ({
        url: absoluteUrl(`/article/${post.slug}`),
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...categories.map((c) => ({
        url: absoluteUrl(`/category/${c.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
      ...tags.map((t) => ({
        url: absoluteUrl(`/tag/${t.slug}`),
        changeFrequency: "weekly" as const,
        priority: 0.4,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
