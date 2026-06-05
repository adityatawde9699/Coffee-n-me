import prisma from "@/lib/db/prisma";

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
  } catch {
    return null;
  }
}
