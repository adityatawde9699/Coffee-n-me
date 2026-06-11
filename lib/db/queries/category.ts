import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";

export const getCategories = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({ orderBy: { name: "asc" } });
    } catch {
      return [];
    }
  },
  ["categories"],
  { tags: ["categories"], revalidate: 600 }
);

export const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.category.findUnique({ where: { slug } });
    } catch {
      return null;
    }
  },
  ["category-by-slug"],
  { tags: ["categories"], revalidate: 600 }
);
