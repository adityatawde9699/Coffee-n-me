import { getPostBySlug, getRelatedPosts } from "@/lib/db/queries/post";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ReadingProgressCup } from "@/components/article/ReadingProgressCup";
import { ArticleCard } from "@/components/article/ArticleCard";
import { InView } from "@/components/ui/InView";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { absoluteUrl } from "@/lib/site";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: {
      canonical: absoluteUrl(`/article/${post.slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name || "Editorial Team"],
      images: post.mainImage ? [post.mainImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.mainImage ? [post.mainImage] : undefined,
    },
  };
}

export const revalidate = 300;

// Prerender the most recent published articles at build; the rest render
// on-demand and are then ISR-cached (dynamicParams defaults to true).
export async function generateStaticParams() {
  try {
    const prisma = (await import("@/lib/db/prisma")).default;
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 50,
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId);

  return (
    <>
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          ...(post.category
            ? [{ name: post.category.name, path: `/category/${post.category.slug}` }]
            : []),
          { name: post.title },
        ]}
      />
      <ReadingProgressCup />
      <article className="pb-20">
        <header className="py-20 bg-muted/20 border-b mb-16">
          <div className="prose-container">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6 animate-fade-in">
              {post.category && (
                <Link href={`/category/${post.category.slug}`} className="hover:text-primary transition-colors">
                  {post.category.name}
                </Link>
              )}
              {post.category && <span>•</span>}
              <span>{post.publishedAt ? format(post.publishedAt, "MMMM d, yyyy") : "Draft"}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading tracking-tight mb-8 leading-tight animate-fade-in-up">
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className="text-xl md:text-2xl text-muted-foreground font-serif italic mb-10 leading-relaxed animate-fade-in-up"
                style={{ animationDelay: "120ms" }}
              >
                {post.excerpt}
              </p>
            )}

            <div
              className="flex items-center justify-between py-6 border-t border-b animate-fade-in-up"
              style={{ animationDelay: "220ms" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{post.author.name}</span>
                  <span className="text-sm text-muted-foreground italic">Author</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime ?? 0} min read</span>
              </div>
            </div>
          </div>
        </header>

        <div
          className="prose-container font-serif text-lg md:text-xl leading-relaxed space-y-8 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
            className="prose prose-neutral prose-lg max-w-none dark:prose-invert"
          />
        </div>

        {post.tags.length > 0 && (
          <footer className="prose-container mt-20 pt-10 border-t">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 text-sm rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </footer>
        )}
      </article>

      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[2px] bg-primary rounded-full" />
            <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
              Related stories
            </h2>
          </div>
          <InView className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {relatedPosts.map((related) => (
              <ArticleCard key={related.id} post={related} />
            ))}
          </InView>
        </section>
      )}
    </>
  );
}
