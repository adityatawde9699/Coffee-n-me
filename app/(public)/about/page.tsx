import { Coffee, BookOpen, Pen, Heart } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Coffee'n me — a calm space for reading and writing.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Coffee className="w-4 h-4" />
          <span className="tracking-widest uppercase">Our Story</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
          About Coffee&apos;n me
        </h1>
        <div className="warm-divider mb-8" />
      </header>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg leading-relaxed animate-fade-in-up space-y-8">
        <p className="text-xl text-muted-foreground italic leading-relaxed">
          Coffee&apos;n me is a calm corner of the internet — a place where words brew slowly and ideas are served warm.
        </p>

        <p>
          We believe great writing deserves to be read unhurriedly, the way you&apos;d enjoy a good cup of coffee. No algorithmic noise, no infinite scroll traps — just thoughtful stories for curious minds.
        </p>

        <p>
          This publication sits at the intersection of technology, culture, and everyday life. We write essays that ask bigger questions, explore ideas that don&apos;t fit neatly into a tweet, and share stories worth your time.
        </p>
      </div>

      {/* Values */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        {[
          {
            icon: BookOpen,
            title: "Thoughtful Reading",
            desc: "Every piece is crafted for depth, not clicks. We prioritize quality over quantity.",
          },
          {
            icon: Pen,
            title: "Honest Writing",
            desc: "We write what we actually think, not what the algorithm wants to hear.",
          },
          {
            icon: Heart,
            title: "Built with Care",
            desc: "From typography to layout, every detail is chosen to make reading a pleasure.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-base">{title}</h3>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 glass-card rounded-2xl p-10 text-center animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <Coffee className="w-8 h-8 text-primary mx-auto mb-4 animate-float" />
        <h2 className="text-2xl font-heading font-bold tracking-tight mb-3">
          Pour yourself a cup
        </h2>
        <p className="text-muted-foreground font-serif italic mb-6">
          Start exploring stories that are worth your time.
        </p>
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
        >
          Browse the Archive
        </Link>
      </div>
    </div>
  );
}
