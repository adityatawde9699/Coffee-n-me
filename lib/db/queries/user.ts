import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";

export const getUserById = unstable_cache(
  async (id: string) => {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, image: true },
      });
    } catch {
      return null;
    }
  },
  ["user-by-id"],
  { tags: ["users"], revalidate: 600 }
);
