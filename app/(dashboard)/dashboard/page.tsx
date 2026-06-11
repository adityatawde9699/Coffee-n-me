import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle2, PencilLine } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const authorScope = isAdmin ? {} : { authorId: session?.user?.id };

  const [total, published, drafts, subscribers, recentDrafts, recentPublished] =
    await Promise.all([
      prisma.post.count({ where: authorScope }),
      prisma.post.count({ where: { ...authorScope, published: true } }),
      prisma.post.count({ where: { ...authorScope, published: false } }),
      prisma.subscriber.count(),
      prisma.post.findMany({
        where: { ...authorScope, published: false },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.post.findMany({
        where: { ...authorScope, published: true },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: { id: true, title: true, slug: true, publishedAt: true },
      }),
    ]);

  const stats = [
    { name: "Total Posts", value: total, icon: FileText },
    { name: "Published", value: published, icon: CheckCircle2 },
    { name: "Drafts", value: drafts, icon: PencilLine },
    { name: "Subscribers", value: subscribers, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading tracking-tight mb-2">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-muted-foreground font-serif italic">
          Here is what&apos;s happening with your stories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {item.name}
              </CardTitle>
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentDrafts.length > 0 ? (
              <ul className="divide-y">
                {recentDrafts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/dashboard/editor/${post.id}`}
                      className="flex items-center justify-between py-3 group"
                    >
                      <span className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-4">
                        {format(post.updatedAt, "MMM d")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground italic font-serif">
                  No active drafts. Start a new story!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recently Published</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPublished.length > 0 ? (
              <ul className="divide-y">
                {recentPublished.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/article/${post.slug}`}
                      className="flex items-center justify-between py-3 group"
                    >
                      <span className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-4">
                        {post.publishedAt ? format(post.publishedAt, "MMM d") : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground italic font-serif">
                  Articles will appear here once published.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
