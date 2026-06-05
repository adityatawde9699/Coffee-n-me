import prisma from "@/lib/db/prisma";

export async function getFeaturedPost() {
  try {
    return await prisma.post.findFirst({
      where: {
        published: true,
        featured: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  } catch {
    return null;
  }
}

export async function getLatestPosts(limit = 10) {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getPostsByCategory(categorySlug: string) {
  try {
    return await prisma.post.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function getPostsByAuthor(authorId: string) {
  try {
    return await prisma.post.findMany({
      where: {
        authorId,
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}
