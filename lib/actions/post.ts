"use server";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { PostInput, postSchema } from "@/lib/validation/post";
import { estimateReadingTime } from "@/lib/utils/reading-time";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

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

  // Validate + whitelist incoming fields (never trust the client payload).
  const parsed = postSchema.partial().safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid post data";
    console.error("[updatePost] Validation failed:", JSON.stringify(parsed.error.issues));
    throw new Error(msg);
  }

  // Unchecked variant lets us set scalar foreign keys (categoryId) directly.
  const updateData: Prisma.PostUncheckedUpdateInput = { ...parsed.data };

  // Sanitize + recompute reading time whenever content changes.
  if (typeof parsed.data.content === "string") {
    const clean = sanitizeArticleHtml(parsed.data.content);
    updateData.content = clean;
    updateData.readingTime = estimateReadingTime(clean);
  }

  let post;
  try {
    post = await prisma.post.update({
      where: { id },
      data: updateData,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("That slug is already taken. Please choose another.");
    }
    console.error("[updatePost] Database error:", err);
    throw err;
  }

  revalidateTag("posts");
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
      readingTime: estimateReadingTime(existingPost.content),
    },
  });

  revalidateTag("posts");
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

  revalidateTag("posts");
  revalidatePath("/dashboard/posts");
}

export async function unpublishPost(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existingPost) throw new Error("Post not found");
  if (existingPost.authorId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id },
    data: { published: false, publishedAt: null },
  });

  revalidateTag("posts");
  revalidatePath("/");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/article/${post.slug}`);
  return post;
}

export async function setPostFeatured(id: string, featured: boolean) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized — only admins can feature posts");
  }

  const post = await prisma.post.update({
    where: { id },
    data: { featured },
  });

  revalidateTag("posts");
  revalidatePath("/");
  return post;
}

export async function updatePostTags(postId: string, tagIds: string[]) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!existingPost) throw new Error("Post not found");
  if (existingPost.authorId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      tags: {
        set: tagIds.map((tagId) => ({ id: tagId })),
      },
    },
  });

  revalidateTag("posts");
  return post;
}

