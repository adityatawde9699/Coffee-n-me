import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "(not set)";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading tracking-tight mb-2">Site Settings</h1>
        <p className="text-muted-foreground font-serif italic">
          Configuration overview for Coffee&apos;n me.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Your account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Name" value={session.user.name ?? "—"} />
          <Row label="Email" value={session.user.email ?? "—"} />
          <Row label="Role" value={session.user.role} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Public URL" value={siteUrl} />
          <Row label="Environment" value={process.env.NODE_ENV} />
        </CardContent>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Site-wide settings such as branding and SEO defaults are managed via
            environment variables and code. This panel is read-only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
