import Link from "next/link";
import { Coffee, Mail, ArrowUpRight } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55C20.22 21.38 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

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
                href="https://github.com/adityatawde9699"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:monkeydluffy55gear5@gmail.com"
                className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Explore
            </h4>
            {[
              { href: "/category", label: "Categories" },
              { href: "/brews", label: "Brew Guide" },
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
