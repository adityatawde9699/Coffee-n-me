import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut,
  PenTool,
  Users,
  Grid
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Posts", href: "/dashboard/posts", icon: FileText },
  { name: "New Post", href: "/dashboard/editor/new", icon: PlusCircle },
];

const adminNavigation = [
  { name: "Categories", href: "/dashboard/categories", icon: Grid },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Site Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl">
          <PenTool className="w-5 h-5" />
          <span>Coffee&apos;n me</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Writer
          </h3>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-muted hover:text-foreground text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

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
                    "hover:bg-muted hover:text-foreground text-muted-foreground"
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

      <div className="p-4 border-t">
        <Link 
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Link>
      </div>
    </div>
  );
}
