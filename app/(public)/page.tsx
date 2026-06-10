import { getFeaturedPost, getLatestPosts } from "@/lib/db/queries/post";
import { ArticleCard } from "@/components/article/ArticleCard";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import Link from "next/link";
import { Coffee, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredPost = await getFeaturedPost();
  const latestPosts = await getLatestPosts(6);

  return (
    <div className="pb-20">
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32 lg:py-40">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            {/* Tagline */}
            <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-6">
              <Coffee className="w-4 h-4" />
              <span className="tracking-widest uppercase">Stories brewed with care</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
              Where words{" "}
              <span className="gradient-text">brew slowly</span>
              {" "}and ideas are served warm.
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground font-serif italic leading-relaxed max-w-xl mb-10">
              A calm reading space for the curious mind. Pour yourself a cup, settle in, and explore stories worth your time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/archive"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                Start Reading
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 text-muted-foreground font-heading font-medium text-sm hover:text-foreground hover:border-foreground/20 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED ARTICLE
          ═══════════════════════════════════════════ */}
      {featuredPost && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-20 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-widest text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Story</span>
          </div>
          <ArticleCard post={featuredPost} featured />
        </section>
      )}

      {/* ═══════════════════════════════════════════
          LATEST ARTICLES GRID
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-primary rounded-full" />
            <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
              Latest Articles
            </h2>
          </div>
          <Link
            href="/archive"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1.5 group"
          >
            View Archive
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {latestPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <Coffee className="w-12 h-12 text-primary/40 animate-float" />
              </div>
              <p className="text-muted-foreground italic font-serif text-lg">
                Brewing new stories...
              </p>
              <p className="text-sm text-muted-foreground/60">
                Check back soon for fresh content.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER CTA
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-10 md:p-16">
          {/* Decorative gradient blobs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-md">
              <h3 className="text-2xl md:text-3xl font-heading font-bold tracking-tight">
                Stay caffeinated.
              </h3>
              <p className="text-muted-foreground font-serif italic">
                Get the latest stories delivered straight to your inbox. No spam, just good reads.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
