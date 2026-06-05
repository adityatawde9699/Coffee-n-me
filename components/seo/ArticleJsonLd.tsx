interface ArticleJsonLdProps {
  post: {
    title: string;
    excerpt: string | null;
    slug: string;
    publishedAt: Date | null;
    updatedAt: Date;
    mainImage: string | null;
    author: {
      name: string | null;
      image: string | null;
    };
  };
}

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://coffeenme.com"}/article/${post.slug}`;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.mainImage || "https://coffeenme.com/og-default.jpg",
    "datePublished": post.publishedAt?.toISOString(),
    "dateModified": post.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author.name || "Editorial Team",
      "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://coffeenme.com"}/author/${post.author.name}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Coffee'n me",
      "logo": {
        "@type": "ImageObject",
        "url": "https://coffeenme.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
