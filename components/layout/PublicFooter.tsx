import Link from "next/link";
import { Coffee, Globe, X, ArrowUpRight } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-card/50">
      {/* Warm gradient top border */}
      <div className="warm-divider" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Coffee className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-heading font-semibold tracking-tight">
                Coffee&apos;n me
              </span>
            </Link>
            <p className="text-muted-foreground font-serif italic text-base leading-relaxed max-w-sm">
              A calm space where words brew slowly and ideas are served warm.
              Pour yourself a cup and stay a while.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="Twitter"
              >
                <X className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="GitHub"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Explore
            </h4>
            {[
              { href: "/category/essays", label: "Essays" },
              { href: "/category/tech", label: "Technology" },
              { href: "/category/culture", label: "Culture" },
              { href: "/archive", label: "Archive" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1 group"
              >
                {link.label}
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Info Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Info
            </h4>
            {[
              { href: "/about", label: "About" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1 group"
              >
                {link.label}
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Coffee&apos;n me. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Coffee className="w-3.5 h-3.5 text-primary animate-pulse-soft" /> and love
          </p>
        </div>
      </div>
    </footer>
  );
}
