import prisma from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit2, Eye } from "lucide-react";
import { format } from "date-fns";
import { createDraft } from "@/lib/actions/post";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const posts = await prisma.post.findMany({
    where: session.user.role === "ADMIN" ? {} : { authorId: session.user.id },
    include: {
      author: {
        select: { name: true }
      },
      category: {
        select: { name: true }
      }
    },
    orderBy: { updatedAt: "desc" },
  });

  async function handleCreate() {
    "use server";
    const post = await createDraft();
    redirect(`/dashboard/editor/${post.id}`);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading tracking-tight mb-2">My Stories</h1>
          <p className="text-muted-foreground font-serif italic">
            Manage your drafts and published articles.
          </p>
        </div>
        <form action={handleCreate}>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            New Story
          </Button>
        </form>
      </div>

      <div className="border rounded-xl overflow-hidden bg-muted/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Title</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Category</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Updated</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-base mb-1">{post.title}</div>
                  <div className="text-muted-foreground text-xs font-mono">{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium",
                    post.published 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {post.category?.name || "Uncategorized"}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {format(post.updatedAt, "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link 
                    href={post.published ? `/article/${post.slug}` : `/dashboard/editor/${post.id}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/dashboard/editor/${post.id}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground italic font-serif text-lg">
              You haven&apos;t started any stories yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
