import prisma from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import { EditorInterface } from "@/components/editor/EditorInterface";

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: EditorPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect "new" shortcut to posts list where they can click "New Story"
  if (id === "new") {
    redirect("/dashboard/posts");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: { select: { id: true, name: true } },
    },
  });

  if (!post) {
    notFound();
  }

  // Auth check — author or admin only
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <EditorInterface
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        published: post.published,
        featured: post.featured,
        mainImage: post.mainImage,
        categoryId: post.categoryId,
        tags: post.tags,
        role: session.user.role,
      }}
    />
  );
}
