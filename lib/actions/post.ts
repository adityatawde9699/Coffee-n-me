"use server";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { PostInput } from "@/lib/validation/post";
import { revalidatePath } from "next/cache";

export async function createDraft() {
  const session = await auth();

  if (!session || (session.user.role !== "WRITER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.create({
    data: {
      title: "Untitled Post",
      slug: `untitled-${Date.now()}`,
      content: "",
      authorId: session.user.id,
    },
  });

  revalidatePath("/dashboard/posts");
  return post;
}

export async function updatePost(id: string, data: Partial<PostInput>) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (existingPost.authorId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard/posts");
  revalidatePath(`/article/${post.slug}`);
  return post;
}

export async function publishPost(id: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true, title: true, content: true },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (existingPost.authorId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!existingPost.title || !existingPost.content) {
    throw new Error("Title and content are required to publish");
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      published: true,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/article/${post.slug}`);
  return post;
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  if (existingPost.authorId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/dashboard/posts");
}
