import { getPostsByTag, getTagBySlug } from "@/lib/db/queries/tag";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Coffee, ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? slug;
  return {
    title: `#${name}`,
    description: `Stories tagged ${name} on Coffee'n me.`,
    alternates: { canonical: absoluteUrl(`/tag/${slug}`) },
  };
}

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const prisma = (await import("@/lib/db/prisma")).default;
    const tags = await prisma.tag.findMany({ select: { slug: true } });
    return tags.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  const tag = await getTagBySlug(slug);
  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <Link
        href="/archive"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-10 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
        All stories
      </Link>

      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Hash className="w-4 h-4" />
          <span className="tracking-widest uppercase">Tag</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
          #{tag.name}
        </h1>
        <p className="text-muted-foreground font-serif italic text-lg max-w-xl">
          Every story tagged with {tag.name}.
        </p>
        <div className="warm-divider mt-8" />
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <Coffee className="w-12 h-12 text-primary/40 animate-float" />
            <p className="text-muted-foreground italic font-serif text-lg">
              No stories tagged #{tag.name} yet.
            </p>
            <Link
              href="/archive"
              className="mt-2 text-sm font-heading text-primary hover:underline"
            >
              Browse all stories →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
