import prisma from "@/lib/db/prisma";

export async function searchPosts(query: string) {
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
        author: {
          select: { name: true, image: true },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 20,
    });
  } catch {
    return [];
  }
}
