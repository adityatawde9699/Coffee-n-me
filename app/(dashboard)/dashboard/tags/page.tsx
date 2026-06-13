import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { createTag, deleteTag } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  async function handleDelete(formData: FormData) {
    "use server";
    await deleteTag(String(formData.get("id")));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading tracking-tight mb-2">Tags</h1>
        <p className="text-muted-foreground font-serif italic">
          Organize stories with keyword tags.
        </p>
      </div>

      <form action={createTag} className="flex items-end gap-3 max-w-md">
        <div className="flex-1 space-y-2">
          <Label htmlFor="name">New tag</Label>
          <Input id="name" name="name" placeholder="e.g. minimalism" required />
        </div>
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="border rounded-xl overflow-hidden bg-muted/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Slug</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Posts</th>
              <th className="px-6 py-4 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4 font-medium">#{tag.name}</td>
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{tag.slug}</td>
                <td className="px-6 py-4 text-muted-foreground">{tag._count.posts}</td>
                <td className="px-6 py-4 text-right">
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={tag.id} />
                    <button
                      type="submit"
                      aria-label={`Delete #${tag.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tags.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground italic font-serif">
              No tags yet. Add your first one above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
