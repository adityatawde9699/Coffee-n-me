import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { updateUserRole } from "@/lib/actions/admin";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const ROLES = ["READER", "WRITER", "ADMIN"] as const;

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
  });

  async function setRole(formData: FormData) {
    "use server";
    const userId = String(formData.get("userId"));
    const role = String(formData.get("role")) as (typeof ROLES)[number];
    if (!ROLES.includes(role)) throw new Error("Invalid role");
    await updateUserRole(userId, role);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading tracking-tight mb-2">Users</h1>
        <p className="text-muted-foreground font-serif italic">
          Manage roles and access. Promote readers to writers to let them publish.
        </p>
      </div>

      <div className="border rounded-xl overflow-hidden bg-muted/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">User</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Posts</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Joined</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium">{user.name ?? "Unnamed"}</div>
                  <div className="text-muted-foreground text-xs">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{user._count.posts}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {format(user.createdAt, "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">
                  <form action={setRole} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      aria-label={`Role for ${user.name ?? user.email}`}
                      className="rounded-md border border-border/60 bg-background px-2 py-1 text-sm"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
