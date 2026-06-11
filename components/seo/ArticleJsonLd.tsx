import { absoluteUrl, siteConfig } from "@/lib/site";

interface ArticleJsonLdProps {
  post: {
    title: string;
    excerpt: string | null;
    slug: string;
    publishedAt: Date | null;
    updatedAt: Date;
    mainImage: string | null;
    category: { name: string; slug: string } | null;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const url = absoluteUrl(`/article/${post.slug}`);
  const image = post.mainImage || absoluteUrl(`/article/${post.slug}/opengraph-image`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name || "Editorial Team",
      url: absoluteUrl(`/author/${post.author.id}`),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(post.category && { articleSection: post.category.name }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
