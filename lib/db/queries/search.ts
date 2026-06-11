import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";

export const searchPosts = unstable_cache(
  async (query: string) => {
    if (!query) return [];

    try {
      return await prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          author: { select: { name: true } },
          category: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 20,
      });
    } catch {
      return [];
    }
  },
  ["search-posts"],
  { tags: ["posts"], revalidate: 120 }
);
