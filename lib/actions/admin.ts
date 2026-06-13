"use server";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath, revalidateTag } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Category name is required");

  const slug = slugify(name);
  if (!slug) throw new Error("Category name must contain letters or numbers");

  const exists = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (exists) throw new Error("A category with that name already exists");

  await prisma.category.create({ data: { name, slug } });
  revalidateTag("categories");
  revalidatePath("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidateTag("categories");
  revalidatePath("/dashboard/categories");
}

export async function updateUserRole(
  userId: string,
  role: "READER" | "WRITER" | "ADMIN"
) {
  const session = await requireAdmin();

  // Guard against an admin demoting themselves and locking everyone out.
  if (session.user.id === userId && role !== "ADMIN") {
    throw new Error("You cannot change your own admin role");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidateTag("users");
  revalidatePath("/dashboard/users");
}

// ─── Tag Management ──────────────────────────────────────────────────────────

export async function createTag(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Tag name is required");

  const slug = slugify(name);
  if (!slug) throw new Error("Tag name must contain letters or numbers");

  const exists = await prisma.tag.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (exists) throw new Error("A tag with that name already exists");

  await prisma.tag.create({ data: { name, slug } });
  revalidateTag("tags");
  revalidatePath("/dashboard/tags");
}

export async function deleteTag(id: string) {
  await requireAdmin();
  await prisma.tag.delete({ where: { id } });
  revalidateTag("tags");
  revalidatePath("/dashboard/tags");
}

