import { getPostsByAuthor } from "@/lib/db/queries/post";
import { getUserById } from "@/lib/db/queries/user";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import Image from "next/image";

interface AuthorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const author = await getUserById(id);
  
  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthor(id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-16 border-b pb-8 flex items-center gap-6">
        {author.image && (
          <div className="relative w-24 h-24">
            <Image 
              src={author.image} 
              alt={author.name ?? "Author"} 
              fill
              className="rounded-full border shadow-sm object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-4xl md:text-5xl font-heading tracking-tight mb-2">
            {author.name}
          </h1>
          <p className="text-muted-foreground italic font-serif text-lg">
            Contributing writer at Coffee&apos;n me.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground italic font-serif text-lg">
            This author hasn&apos;t published any articles yet.
          </p>
        </div>
      )}
    </div>
  );
}
