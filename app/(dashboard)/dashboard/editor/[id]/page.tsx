import prisma from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { notFound, redirect } from "next/navigation";
import { EditorInterface } from "@/components/editor/EditorInterface";

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Handle "new" post creation
  if (id === "new") {
    // We'll handle this with a client component or a separate route 
    // but for now redirecting to a list where they can click "Create"
    redirect("/dashboard/posts");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Auth check
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <EditorInterface post={post} />;
}
