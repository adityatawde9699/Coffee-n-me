import { absoluteUrl } from "@/lib/site";

interface Crumb {
  name: string;
  /** Path relative to site root, e.g. "/archive". Omit for the current page. */
  path?: string;
}

/** Emits BreadcrumbList structured data for richer search results. */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
