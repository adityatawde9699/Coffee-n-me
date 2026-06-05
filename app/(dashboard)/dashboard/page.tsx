import { auth } from "@/lib/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  const stats = [
    { name: "Total Posts", value: "0", icon: FileText, change: "+0", changeType: "increase" },
    { name: "Total Views", value: "0", icon: Eye, change: "+0", changeType: "increase" },
    { name: "Subscribers", value: "0", icon: Users, change: "+0", changeType: "increase" },
    { name: "Engagement Rate", value: "0%", icon: TrendingUp, change: "+0%", changeType: "increase" },
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
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">{item.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-heading">Recent Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground italic font-serif">
                No active drafts. Start a new story!
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="font-heading">Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-10 text-center border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground italic font-serif">
                Articles will appear here once published.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
