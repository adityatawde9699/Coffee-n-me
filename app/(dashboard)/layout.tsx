import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Basic role check - initially allowing all logged in users to see dashboard
  // but restricting write actions later.
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role={session.user.role} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
