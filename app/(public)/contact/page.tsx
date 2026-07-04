import { Mail, Code2, MessageCircle, Coffee } from "lucide-react";
import { InView } from "@/components/ui/InView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Coffee'n me team.",
};

const channels = [
  {
    icon: Mail,
    title: "Email",
    desc: "For anything — feedback, story pitches, account requests, or just to say hi.",
    href: "mailto:monkeydluffy55gear5@gmail.com",
    label: "Write to us",
  },
  {
    icon: Code2,
    title: "GitHub",
    desc: "Found a bug or have an idea for the platform? Open an issue on the repository.",
    href: "https://github.com/adityatawde9699",
    label: "Visit GitHub",
  },
  {
    icon: MessageCircle,
    title: "Write for us",
    desc: "Want to publish on Coffee'n me? Email us a short pitch and a writing sample.",
    href: "mailto:monkeydluffy55gear5@gmail.com?subject=Writing%20for%20Coffee'n%20me",
    label: "Pitch a story",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Coffee className="w-4 h-4" />
          <span className="tracking-widest uppercase">Say Hello</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
          Get in touch
        </h1>
        <div className="warm-divider mb-8" />
        <p className="text-xl text-muted-foreground font-serif italic leading-relaxed">
          The door&apos;s open and the pot is fresh. Pick whichever channel suits you.
        </p>
      </header>

      <InView className="grid grid-cols-1 gap-6 animate-fade-in-up stagger-children">
        {channels.map(({ icon: Icon, title, desc, href, label }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="glass-card rounded-xl p-6 flex items-start gap-5 group hover:border-primary/30 transition-colors duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{desc}</p>
              <span className="text-sm font-heading font-medium text-primary mt-2 group-hover:underline underline-offset-4">
                {label} →
              </span>
            </div>
          </a>
        ))}
      </InView>
    </div>
  );
}
