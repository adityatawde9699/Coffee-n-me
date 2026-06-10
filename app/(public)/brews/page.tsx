import { Coffee, Clock, Flame, Snowflake, Droplets, Armchair, Music, Wifi, Sun, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Brew Guide",
  description:
    "Our vision of great coffee — the brews we love, how to make them, and what makes a coffee shop worth lingering in.",
};

const brews = [
  {
    icon: Flame,
    name: "Espresso",
    tagline: "The heartbeat of every café",
    time: "25–30 sec",
    character: "Intense · Syrupy · Honest",
    desc: "Nine bars of pressure, eighteen grams of finely ground beans, and absolutely nowhere to hide. A great espresso is the truest expression of a roast — bittersweet, full-bodied, finished with a hazelnut crema.",
  },
  {
    icon: Droplets,
    name: "Pour-Over",
    tagline: "Patience in a cone",
    time: "3–4 min",
    character: "Bright · Clean · Floral",
    desc: "A slow spiral of water over a paper filter, blooming the grounds before the real pour. Pour-over rewards attention: it brings out the citrus, berry, and tea-like notes that espresso steamrolls past.",
  },
  {
    icon: Coffee,
    name: "French Press",
    tagline: "The reader's companion",
    time: "4 min",
    character: "Heavy · Rich · Rustic",
    desc: "Full immersion, metal mesh, no paper to steal the oils. The result is a thick, velvety cup that pairs perfectly with a long chapter. Coarse grind, four minutes, press slowly — never rush a press.",
  },
  {
    icon: Snowflake,
    name: "Cold Brew",
    tagline: "Summer, distilled",
    time: "12–18 hrs",
    character: "Smooth · Sweet · Low-acid",
    desc: "Time does the work heat usually would. Steeped overnight, cold brew trades acidity for chocolate-smooth sweetness. It's the brew for slow mornings on a sunlit balcony with yesterday's unfinished essay.",
  },
];

const shopQualities = [
  {
    icon: Armchair,
    title: "Seats you can sink into",
    desc: "The best shops are designed for staying, not turning tables. Worn leather, window nooks, a bench by the bookshelf.",
  },
  {
    icon: Music,
    title: "Sound that hums, never shouts",
    desc: "A low murmur of conversation, the hiss of the steam wand, a record playing somewhere — quiet enough to think, alive enough to feel.",
  },
  {
    icon: Sun,
    title: "Light worth reading by",
    desc: "Big windows, warm lamps in the evening. Light shapes the mood of a room more than any menu ever could.",
  },
  {
    icon: Users,
    title: "Baristas who remember you",
    desc: "Great coffee shops are personal. Your order, your name, your usual corner — small recognitions that turn a shop into a place.",
  },
  {
    icon: Wifi,
    title: "Room to work, grace to linger",
    desc: "Outlets that exist, Wi-Fi that works, and no side-eye when one cup stretches into a whole afternoon of writing.",
  },
  {
    icon: BookOpen,
    title: "Something to discover",
    desc: "A shelf of borrowed books, local art on the walls, a single-origin you've never tried. A reason to look up from your cup.",
  },
];

export default function BrewsPage() {
  return (
    <div className="pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-14 sm:py-20 md:py-28">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-6">
              <Coffee className="w-4 h-4" />
              <span className="tracking-widest uppercase">The Brew Guide</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
              Our vision of a{" "}
              <span className="gradient-text">perfect cup</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-serif italic leading-relaxed max-w-xl">
              The brews we keep coming back to, how to make them well, and what
              separates a coffee shop you visit from one you belong to.
            </p>
          </div>
        </div>
      </section>

      {/* Brews */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-[2px] bg-primary rounded-full" />
          <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
            The Brews We Swear By
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
          {brews.map(({ icon: Icon, name, tagline, time, character, desc }) => (
            <article key={name} className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-4 group hover:border-primary/30 transition-colors duration-300">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-heading text-muted-foreground border border-border/50 rounded-full px-3 py-1">
                  <Clock className="w-3 h-3" />
                  {time}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold tracking-tight">{name}</h3>
                <p className="text-sm text-primary font-serif italic mt-0.5">{tagline}</p>
              </div>
              <p className="text-muted-foreground font-serif leading-relaxed">{desc}</p>
              <p className="text-xs font-heading uppercase tracking-widest text-muted-foreground/70 mt-auto pt-2">
                {character}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Coffee shop vision */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-primary rounded-full" />
            <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
              What Makes a Great Coffee Shop
            </h2>
          </div>
          <p className="text-muted-foreground font-serif italic text-lg leading-relaxed">
            It was never just about the coffee. The best shops are third places —
            not home, not work, but somewhere your thoughts get room to breathe.
            Here&apos;s what we look for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {shopQualities.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card rounded-xl p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-base">{title}</h3>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="glass-card rounded-2xl p-10 md:p-14 text-center animate-fade-in-up">
          <Coffee className="w-8 h-8 text-primary mx-auto mb-4 animate-float" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight mb-3">
            Found your brew? Now find your story.
          </h2>
          <p className="text-muted-foreground font-serif italic mb-8 max-w-md mx-auto">
            Pour the cup you just learned to make and settle into the archive.
          </p>
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
          >
            Browse the Archive
          </Link>
        </div>
      </section>
    </div>
  );
}
