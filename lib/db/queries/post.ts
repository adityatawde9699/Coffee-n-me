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

// unstable_cache JSON-serializes its result, so on a cache HIT every Date
// field comes back as an ISO string (cache MISS returns real Dates from
// Prisma). TypeScript still types these as Date, hiding the mismatch. Re-hydrate
// the top-level date fields so callers can safely call .toISOString()/format().
type PostDates = {
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function reviveDates<T extends PostDates>(post: T): T {
  return {
    ...post,
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  } as T;
}

export function revivePost<T extends PostDates>(post: T | null): T | null {
  return post ? reviveDates(post) : null;
}

export function revivePosts<T extends PostDates>(posts: T[]): T[] {
  return posts.map(reviveDates);
}

const _getFeaturedPost = unstable_cache(
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
export const getFeaturedPost = async () => revivePost(await _getFeaturedPost());

const _getLatestPosts = unstable_cache(
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
export const getLatestPosts = async (limit = 10) =>
  revivePosts(await _getLatestPosts(limit));

const _getPublishedPosts = unstable_cache(
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
export const getPublishedPosts = async (
  args: { page?: number; perPage?: number } = {}
) => {
  const result = await _getPublishedPosts(args);
  return { ...result, posts: revivePosts(result.posts) };
};

const _getPostBySlug = unstable_cache(
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
export const getPostBySlug = async (slug: string) =>
  revivePost(await _getPostBySlug(slug));

const _getPostsByCategory = unstable_cache(
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
export const getPostsByCategory = async (categorySlug: string) =>
  revivePosts(await _getPostsByCategory(categorySlug));

const _getPostsByAuthor = unstable_cache(
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
export const getPostsByAuthor = async (authorId: string) =>
  revivePosts(await _getPostsByAuthor(authorId));

const _getRelatedPosts = unstable_cache(
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
export const getRelatedPosts = async (
  postId: string,
  categoryId: string | null,
  limit = 3
) => revivePosts(await _getRelatedPosts(postId, categoryId, limit));
