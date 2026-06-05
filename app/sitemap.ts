import { MetadataRoute } from "next";
import prisma from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://coffeenme.com";

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:51213")) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }

  try {
    // Fetch all published posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/article/${post.slug}`,
      lastModified: post.updatedAt,
    }));

    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      ...postUrls,
      ...categoryUrls,
    ];
  } catch {
    // If DB is offline during build, return basic sitemap gracefully
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
