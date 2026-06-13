"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PenTool,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Users,
  Grid,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDashboardNavProps {
  role: string;
  userName?: string | null;
}

export function MobileDashboardNav({ role, userName }: MobileDashboardNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["READER", "WRITER", "ADMIN"] },
    { name: "My Posts", href: "/dashboard/posts", icon: FileText, roles: ["WRITER", "ADMIN"] },
    { name: "New Post", href: "/dashboard/editor/new", icon: PlusCircle, roles: ["WRITER", "ADMIN"] },
    { name: "Categories", href: "/dashboard/categories", icon: Grid, roles: ["ADMIN"] },
    { name: "Tags", href: "/dashboard/tags", icon: Tag, roles: ["ADMIN"] },
    { name: "Users", href: "/dashboard/users", icon: Users, roles: ["ADMIN"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN"] },
  ].filter((link) => link.roles.includes(role));

  return (
    <>
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between px-4 border-b bg-background/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 font-heading">
          <PenTool className="w-4 h-4" />
          <span>Coffee&apos;n me</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="bg-background border-b shadow-lg px-4 pb-4">
          {userName && (
            <p className="text-xs text-muted-foreground py-3 border-b mb-3">{userName}</p>
          )}
          <nav className="space-y-1">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
