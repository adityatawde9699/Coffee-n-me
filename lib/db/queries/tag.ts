import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";
import { revivePosts } from "./post";

export const getTagBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.tag.findUnique({ where: { slug } });
    } catch {
      return null;
    }
  },
  ["tag-by-slug"],
  { tags: ["tags"], revalidate: 600 }
);

const _getPostsByTag = unstable_cache(
  async (tagSlug: string) => {
    try {
      return await prisma.post.findMany({
        where: { published: true, tags: { some: { slug: tagSlug } } },
        include: { author: { select: { name: true } }, category: true },
        orderBy: { publishedAt: "desc" },
      });
    } catch {
      return [];
    }
  },
  ["posts-by-tag"],
  { tags: ["posts", "tags"], revalidate: 300 }
);
export const getPostsByTag = async (tagSlug: string) =>
  revivePosts(await _getPostsByTag(tagSlug));
