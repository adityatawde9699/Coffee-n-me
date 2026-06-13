import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar role={session.user.role} userName={session.user.name} />
      </div>

      {/* Mobile top bar — shown only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileDashboardNav role={session.user.role} userName={session.user.name} />
      </div>

      <main className="flex-1 overflow-y-auto md:p-8 p-4 pt-20 md:pt-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
