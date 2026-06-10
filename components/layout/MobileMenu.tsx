"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/category/essays", label: "Essays" },
  { href: "/category/tech", label: "Tech" },
  { href: "/category/culture", label: "Culture" },
  { href: "/brews", label: "Brew Guide" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when navigating to a new page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-background/95 backdrop-blur-md animate-fade-in">
          <nav className="flex flex-col px-6 py-8 gap-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3.5 px-4 rounded-xl text-lg font-heading font-medium text-foreground/90 hover:text-primary hover:bg-primary/5 transition-colors duration-200 border-b border-border/20 last:border-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
