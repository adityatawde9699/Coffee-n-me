"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  PenTool,
  Users,
  Grid,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const writerNavigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "My Posts", href: "/dashboard/posts", icon: FileText, exact: false },
  { name: "New Post", href: "/dashboard/editor/new", icon: PlusCircle, exact: false },
];

const adminNavigation = [
  { name: "Categories", href: "/dashboard/categories", icon: Grid, exact: false },
  { name: "Tags", href: "/dashboard/tags", icon: Tag, exact: false },
  { name: "Users", href: "/dashboard/users", icon: Users, exact: false },
  { name: "Site Settings", href: "/dashboard/settings", icon: Settings, exact: false },
];

interface SidebarProps {
  role: string;
  userName?: string | null;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl">
          <PenTool className="w-5 h-5" />
          <span>Coffee&apos;n me</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {/* Writer section — shown to WRITER and ADMIN */}
        {(role === "WRITER" || role === "ADMIN") && (
          <div>
            <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Writer
            </h3>
            <nav className="space-y-1">
              {writerNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted hover:text-foreground text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Overview for READERs */}
        {role === "READER" && (
          <div>
            <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </h3>
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/dashboard"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted hover:text-foreground text-muted-foreground"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </Link>
            </nav>
            <div className="mt-4 px-3 py-3 rounded-lg bg-muted/40 border">
              <p className="text-xs text-muted-foreground font-serif italic">
                You have reader access. Contact an admin to become a writer.
              </p>
            </div>
          </div>
        )}

        {/* Admin section */}
        {role === "ADMIN" && (
          <div>
            <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </h3>
            <nav className="space-y-1">
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted hover:text-foreground text-muted-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Footer: user name + logout */}
      <div className="p-4 border-t space-y-2">
        {userName && (
          <p className="px-3 text-xs text-muted-foreground truncate">{userName}</p>
        )}
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/5"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Link>
      </div>
    </div>
  );
}
