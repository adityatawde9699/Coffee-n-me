import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";

// All published-post reads share the "posts" cache tag. Mutations
// (create/update/publish/delete) call revalidateTag("posts") to invalidate.
const POSTS_TAG = "posts";
const REVALIDATE = 300; // seconds — safety net if a tag invalidation is missed

const cardSelect = {
  author: { select: { name: true } },
  category: true,
} as const;

export const getFeaturedPost = unstable_cache(
  async () => {
    try {
      return await prisma.post.findFirst({
        where: { published: true, featured: true },
        include: { author: { select: { name: true, image: true } }, category: true },
        orderBy: { publishedAt: "desc" },
      });
    } catch {
      return null;
    }
  },
  ["featured-post"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);

export const getLatestPosts = unstable_cache(
  async (limit = 10) => {
    try {
      return await prisma.post.findMany({
        where: { published: true },
        include: { author: { select: { name: true, image: true } }, category: true },
        orderBy: { publishedAt: "desc" },
        take: limit,
      });
    } catch {
      return [];
    }
  },
  ["latest-posts"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);

export const getPublishedPosts = unstable_cache(
  async ({ page = 1, perPage = 12 }: { page?: number; perPage?: number } = {}) => {
    try {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: { published: true },
          include: cardSelect,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.post.count({ where: { published: true } }),
      ]);
      return { posts, total, totalPages: Math.max(1, Math.ceil(total / perPage)) };
    } catch {
      return { posts: [], total: 0, totalPages: 1 };
    }
  },
  ["published-posts"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);

export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.post.findUnique({
        where: { slug, published: true },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
          tags: true,
        },
      });
    } catch {
      return null;
    }
  },
  ["post-by-slug"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);

export const getPostsByCategory = unstable_cache(
  async (categorySlug: string) => {
    try {
      return await prisma.post.findMany({
        where: { category: { slug: categorySlug }, published: true },
        include: cardSelect,
        orderBy: { publishedAt: "desc" },
      });
    } catch {
      return [];
    }
  },
  ["posts-by-category"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);

export const getPostsByAuthor = unstable_cache(
  async (authorId: string) => {
    try {
      return await prisma.post.findMany({
        where: { authorId, published: true },
        include: cardSelect,
        orderBy: { publishedAt: "desc" },
      });
    } catch {
      return [];
    }
  },
  ["posts-by-author"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);

export const getRelatedPosts = unstable_cache(
  async (postId: string, categoryId: string | null, limit = 3) => {
    try {
      return await prisma.post.findMany({
        where: {
          published: true,
          id: { not: postId },
          ...(categoryId ? { categoryId } : {}),
        },
        include: cardSelect,
        orderBy: { publishedAt: "desc" },
        take: limit,
      });
    } catch {
      return [];
    }
  },
  ["related-posts"],
  { tags: [POSTS_TAG], revalidate: REVALIDATE }
);
