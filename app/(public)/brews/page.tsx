import {
  Coffee,
  Clock,
  Flame,
  Snowflake,
  Droplets,
  Beaker,
  CookingPot,
  Scale,
  Thermometer,
  Timer,
  Leaf,
  Quote,
  Armchair,
  Music,
  Wifi,
  Sun,
  Users,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Brew Guide",
  description:
    "Our vision of great coffee — the brews we love, the recipes we dial in, and what makes a coffee shop worth lingering in.",
};

type Brew = {
  icon: typeof Coffee;
  name: string;
  tagline: string;
  moment: string;
  recipe: { ratio: string; grind: string; water: string; time: string };
  notes: string[];
  desc: string;
  barista: string;
};

const brews: Brew[] = [
  {
    icon: Flame,
    name: "Espresso",
    tagline: "The heartbeat of every café",
    moment: "Dawn shot",
    recipe: { ratio: "1:2 — 18g in, 36g out", grind: "Fine, like table salt", water: "93°C", time: "25–30 sec" },
    notes: ["Intense", "Syrupy", "Hazelnut crema"],
    desc: "Nine bars of pressure, eighteen grams of finely ground beans, and absolutely nowhere to hide. A great espresso is the truest expression of a roast — bittersweet, full-bodied, finished with a crema that clings to the spoon.",
    barista: "Watch the pour: a slow, honey-thick stream that turns blonde near the end means your grind and dose are dialed in.",
  },
  {
    icon: Droplets,
    name: "Pour-Over",
    tagline: "Patience in a paper cone",
    moment: "Slow morning",
    recipe: { ratio: "1:16 — 20g coffee, 320g water", grind: "Medium", water: "94°C", time: "3–4 min" },
    notes: ["Bright", "Clean", "Floral"],
    desc: "A slow spiral of water over a paper filter, blooming the grounds for thirty seconds before the real pour begins. Pour-over rewards attention — it lifts the citrus, berry, and tea-like notes that espresso steamrolls past.",
    barista: "Pour in gentle concentric circles and keep the bed flat. A sunken crater in the middle is a sign you rushed it.",
  },
  {
    icon: Coffee,
    name: "French Press",
    tagline: "The reader's companion",
    moment: "Rainy afternoon",
    recipe: { ratio: "1:15 — 30g coffee, 450g water", grind: "Coarse, like sea salt", water: "96°C", time: "4 min steep" },
    notes: ["Heavy", "Rich", "Rustic"],
    desc: "Full immersion, a metal mesh, no paper to steal the oils. The result is a thick, velvety cup built for a long chapter. Coarse grind, four minutes, then press slowly and pour it all out — never let it sit on the grounds.",
    barista: "Break the crust at four minutes, skim the foam, and press with the flat of your palm. Patience tastes better than muscle.",
  },
  {
    icon: Snowflake,
    name: "Cold Brew",
    tagline: "Summer, distilled",
    moment: "Sun's out",
    recipe: { ratio: "1:8 — 100g coffee, 800g water", grind: "Extra coarse", water: "Cold, overnight", time: "12–18 hrs" },
    notes: ["Smooth", "Sweet", "Low-acid"],
    desc: "Time does the work heat usually would. Steeped cold and slow, it trades sharp acidity for chocolate-smooth sweetness. This is the brew for unhurried mornings on a sunlit balcony with yesterday's unfinished essay.",
    barista: "Brew it as a concentrate and cut it with water or milk to taste. Stronger steeps keep for a week in the fridge.",
  },
  {
    icon: Beaker,
    name: "AeroPress",
    tagline: "The traveller's secret",
    moment: "On the move",
    recipe: { ratio: "1:14 — 15g coffee, 210g water", grind: "Medium-fine", water: "88°C", time: "1.5 min" },
    notes: ["Sweet", "Forgiving", "Versatile"],
    desc: "A plunger, a paper filter, and a minute of your morning. Hard to get wrong and easy to fall in love with — it brews clean like a pour-over but bold like an espresso, and it cleans up in a single satisfying push.",
    barista: "Try it inverted: steep upside-down, cap it, flip onto the cup, and plunge. Slightly cooler water keeps the sweetness in.",
  },
  {
    icon: CookingPot,
    name: "Moka Pot",
    tagline: "The kitchen-stove classic",
    moment: "Sunday kitchen",
    recipe: { ratio: "Fill the basket level", grind: "Fine-medium", water: "Hot, to the valve", time: "4–5 min" },
    notes: ["Bold", "Nostalgic", "Concentrated"],
    desc: "The percolating gurgle of a stovetop pot is the sound of a hundred kitchens. It pushes hot water up through the grounds for a brew somewhere between espresso and drip — strong, comforting, and gloriously unfussy.",
    barista: "Start with hot water and pull it off the heat the moment it gurgles. Walk away and you'll scorch the pour bitter.",
  },
];

const principles = [
  {
    icon: Scale,
    title: "Weigh, don't guess",
    desc: "A kitchen scale turns a good cup into a repeatable one. Ratios are the difference between luck and craft.",
  },
  {
    icon: Leaf,
    title: "Grind fresh, grind right",
    desc: "Whole beans hold their aroma; pre-ground loses it within minutes. Match the grind to the method, every time.",
  },
  {
    icon: Thermometer,
    title: "Mind the water",
    desc: "Just off the boil, never roaring. Too hot scorches and turns it bitter; too cool and it tastes flat and sour.",
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
    desc: "Big windows by day, warm lamps by evening. Light shapes the mood of a room more than any menu ever could.",
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
      {/* Header — café sign */}
      <section className="relative overflow-hidden py-14 sm:py-20 md:py-28">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-heading font-medium text-primary">
                <Coffee className="w-4 h-4" />
                <span className="tracking-widest uppercase">The Brew Guide</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-heading text-muted-foreground border border-border/60 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                Open · pour by pour
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
              Our vision of a{" "}
              <span className="gradient-text">perfect cup</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-serif italic leading-relaxed max-w-xl">
              The brews we keep coming back to, the recipes we&apos;ve dialed in
              over a thousand mornings, and what separates a coffee shop you
              visit from one you belong to.
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="warm-divider mb-10" />
        <figure className="max-w-3xl mx-auto text-center">
          <Quote className="w-7 h-7 text-primary/60 mx-auto mb-4" aria-hidden />
          <blockquote className="text-2xl md:text-3xl font-serif italic leading-snug text-foreground/90">
            &ldquo;Coffee is a language in itself. The brew is the grammar — the
            care you pour into it is the poetry.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm font-heading uppercase tracking-widest text-muted-foreground/70">
            — from behind our counter
          </figcaption>
        </figure>
        <div className="warm-divider mt-10" />
      </section>

      {/* Brews — the menu board */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-primary rounded-full" />
            <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
              The Brews We Swear By
            </h2>
          </div>
          <p className="text-sm font-serif italic text-muted-foreground">
            Six methods · one obsession
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
          {brews.map(({ icon: Icon, name, tagline, moment, recipe, notes, desc, barista }) => (
            <article
              key={name}
              className="glass-card card-hover rounded-2xl p-6 sm:p-8 flex flex-col gap-5 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold tracking-tight leading-none">{name}</h3>
                    <p className="text-sm text-primary font-serif italic mt-1.5">{tagline}</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-heading uppercase tracking-wider text-muted-foreground border border-border/50 rounded-full px-3 py-1">
                  <Clock className="w-3 h-3" />
                  {moment}
                </span>
              </div>

              {/* Recipe spec sheet */}
              <dl className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border border-border/50 bg-border/40 text-sm">
                <div className="bg-card/80 px-4 py-3">
                  <dt className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground/70 mb-0.5">Ratio</dt>
                  <dd className="font-medium">{recipe.ratio}</dd>
                </div>
                <div className="bg-card/80 px-4 py-3">
                  <dt className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground/70 mb-0.5">Grind</dt>
                  <dd className="font-medium">{recipe.grind}</dd>
                </div>
                <div className="bg-card/80 px-4 py-3">
                  <dt className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground/70 mb-0.5 inline-flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> Water
                  </dt>
                  <dd className="font-medium">{recipe.water}</dd>
                </div>
                <div className="bg-card/80 px-4 py-3">
                  <dt className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground/70 mb-0.5 inline-flex items-center gap-1">
                    <Timer className="w-3 h-3" /> Brew
                  </dt>
                  <dd className="font-medium">{recipe.time}</dd>
                </div>
              </dl>

              <p className="text-muted-foreground font-serif leading-relaxed">{desc}</p>

              {/* Barista's note */}
              <p className="text-sm font-serif italic text-foreground/80 border-l-2 border-primary/40 pl-4">
                <span className="font-heading not-italic text-xs uppercase tracking-widest text-primary/80 block mb-1">
                  Barista&apos;s note
                </span>
                {barista}
              </p>

              {/* Tasting notes */}
              <div className="flex flex-wrap gap-2 mt-auto pt-1">
                {notes.map((note) => (
                  <span
                    key={note}
                    className="text-xs font-heading rounded-full bg-accent/50 text-accent-foreground/90 px-3 py-1"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dialing it in — barista principles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-primary rounded-full" />
            <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
              Three Rules We Brew By
            </h2>
          </div>
          <p className="text-muted-foreground font-serif italic text-lg leading-relaxed">
            Whatever the method, the fundamentals never change. Get these three
            right and almost any brew turns out worth sitting down for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {principles.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="glass-card card-hover rounded-2xl p-7 flex flex-col gap-3 relative">
              <span className="absolute top-6 right-6 text-4xl font-heading font-bold text-primary/10 leading-none select-none">
                0{i + 1}
              </span>
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{desc}</p>
            </div>
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
            <div key={title} className="glass-card card-hover rounded-xl p-6 flex flex-col gap-3">
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
