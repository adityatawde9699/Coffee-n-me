import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Coffee, ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    readingTime: number | null;
    mainImage?: string | null;
    author: {
      name: string | null;
    };
    category: {
      name: string;
      slug: string;
    } | null;
  };
  featured?: boolean;
}

export function ArticleCard({ post, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <article className="group relative glass-card rounded-2xl overflow-hidden card-hover">
        {/* Gradient accent border top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary opacity-60" />

        {/* Cover image */}
        {post.mainImage && (
          <div className="relative w-full aspect-[21/9] overflow-hidden">
            <Image
              src={post.mainImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            {post.category && (
              <Link
                href={`/category/${post.category.slug}`}
                className="text-xs font-heading font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
              >
                {post.category.name}
              </Link>
            )}
            <span className="text-xs text-muted-foreground">
              {post.publishedAt ? format(post.publishedAt, "MMMM d, yyyy") : "Draft"}
            </span>
          </div>

          <Link href={`/article/${post.slug}`} className="flex flex-col gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground font-serif leading-relaxed line-clamp-3 max-w-2xl">
                {post.excerpt}
              </p>
            )}
          </Link>

          <div className="flex items-center justify-between mt-2 pt-5 border-t border-border/30">
            <span className="text-sm font-medium text-foreground">{post.author.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Coffee className="w-3.5 h-3.5 text-primary" />
                <span>{post.readingTime ?? 0} min read</span>
              </div>
              <Link
                href={`/article/${post.slug}`}
                className="p-2 rounded-full border border-border/50 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all duration-300"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group glass-card rounded-xl overflow-hidden card-hover flex flex-col">
      {/* Cover image */}
      {post.mainImage ? (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={post.mainImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      ) : (
        /* Subtle top accent when no image */
        <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      )}

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2.5">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="text-[11px] font-heading font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
            >
              {post.category.name}
            </Link>
          )}
          <span className="text-[11px] text-muted-foreground">
            {post.publishedAt ? format(post.publishedAt, "MMM d, yyyy") : "Draft"}
          </span>
        </div>

        <Link href={`/article/${post.slug}`} className="flex flex-col gap-2.5 flex-1">
          <h3 className="text-xl font-heading font-semibold tracking-tight leading-snug group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground font-serif leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
          <span className="text-xs font-medium text-foreground/80">{post.author.name}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Coffee className="w-3 h-3 text-primary/70" />
            <span>{post.readingTime ?? 0} min</span>
          </div>
        </div>
      </div>
    </article>
  );
}
