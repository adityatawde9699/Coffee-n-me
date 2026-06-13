"use client";

import { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updatePost,
  publishPost,
  unpublishPost,
  setPostFeatured,
  updatePostTags,
  deletePost,
} from "@/lib/actions/post";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  ArrowLeft,
  Loader2,
  Star,
  StarOff,
  EyeOff,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading editor…</span>
      </div>
    ),
  }
);

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface EditorInterfaceProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    slug: string;
    published: boolean;
    featured: boolean;
    mainImage: string | null;
    categoryId: string | null;
    tags: { id: string; name: string }[];
    role: "READER" | "WRITER" | "ADMIN";
  };
}

async function uploadImage(file: File): Promise<string> {
  const sigRes = await fetch("/api/upload", { method: "POST" });
  if (!sigRes.ok) throw new Error("Failed to authorize upload");
  const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", "coffeenme");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) throw new Error("Upload failed");
  const data = await uploadRes.json();
  return data.secure_url as string;
}

export function EditorInterface({ post }: EditorInterfaceProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [slug, setSlug] = useState(post.slug);
  const [categoryId, setCategoryId] = useState<string>(post.categoryId ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post.tags.map((t) => t.id)
  );
  const [mainImage, setMainImage] = useState<string>(post.mainImage ?? "");
  const [featured, setFeatured] = useState(post.featured);
  const [published, setPublished] = useState(post.published);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const router = useRouter();

  const isAdmin = post.role === "ADMIN";

  // Fetch categories and tags on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setTags)
      .catch(() => {});
  }, []);

  const handleSave = () => {
    setStatusMsg(null);
    startTransition(async () => {
      try {
        await updatePost(post.id, {
          title,
          content,
          excerpt,
          slug,
          categoryId: categoryId || null,
          mainImage: mainImage || null,
        });
        await updatePostTags(post.id, selectedTagIds);
        setStatusMsg("Saved!");
        router.refresh();
      } catch (e: unknown) {
        setStatusMsg(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  const handlePublish = () => {
    if (!confirm("Publish this story? It will be visible to everyone.")) return;
    setStatusMsg(null);
    startTransition(async () => {
      try {
        await updatePost(post.id, {
          title,
          content,
          excerpt,
          slug,
          categoryId: categoryId || null,
          mainImage: mainImage || null,
        });
        await updatePostTags(post.id, selectedTagIds);
        await publishPost(post.id);
        setPublished(true);
        router.push(`/article/${slug}`);
      } catch (e: unknown) {
        setStatusMsg(e instanceof Error ? e.message : "Publish failed");
      }
    });
  };

  const handleUnpublish = () => {
    if (!confirm("Revert this story to draft? It will be hidden from readers.")) return;
    startTransition(async () => {
      try {
        await unpublishPost(post.id);
        setPublished(false);
        setStatusMsg("Reverted to draft.");
        router.refresh();
      } catch (e: unknown) {
        setStatusMsg(e instanceof Error ? e.message : "Failed to unpublish");
      }
    });
  };

  const handleToggleFeatured = () => {
    startTransition(async () => {
      try {
        await setPostFeatured(post.id, !featured);
        setFeatured((f) => !f);
        setStatusMsg(featured ? "Removed from featured." : "Set as featured!");
      } catch (e: unknown) {
        setStatusMsg(e instanceof Error ? e.message : "Failed");
      }
    });
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Permanently delete this story? This cannot be undone."
      )
    )
      return;
    startTransition(async () => {
      try {
        await deletePost(post.id);
        router.push("/dashboard/posts");
      } catch (e: unknown) {
        setStatusMsg(e instanceof Error ? e.message : "Delete failed");
      }
    });
  };

  const handleCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const url = await uploadImage(file);
      setMainImage(url);
    } catch {
      setImageError("Image upload failed. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Sticky header toolbar */}
      <header className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/posts"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Editor</span>
            <span className="text-xs text-muted-foreground italic">
              {published ? "Published" : "Draft"}
              {featured && " · ⭐ Featured"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {statusMsg && (
            <span className="text-xs text-muted-foreground italic">{statusMsg}</span>
          )}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>
          {published ? (
            <Button variant="outline" size="sm" onClick={handleUnpublish} disabled={isPending}>
              <EyeOff className="w-4 h-4 mr-2" />
              Unpublish
            </Button>
          ) : (
            <Button size="sm" onClick={handlePublish} disabled={isPending}>
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main editor */}
        <div className="lg:col-span-3 space-y-8">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story Title"
            className="text-4xl md:text-5xl font-heading tracking-tight border-none focus-visible:ring-0 px-0 h-auto py-0 bg-transparent placeholder:text-muted-foreground/30"
          />
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        {/* Metadata sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Slug */}
          <div className="p-5 bg-muted/20 rounded-xl border space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              URL
            </h3>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-sm font-mono"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="p-5 bg-muted/20 rounded-xl border space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Excerpt
            </h3>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary for cards and SEO…"
              className="text-sm h-28 font-serif resize-none"
            />
          </div>

          {/* Category */}
          <div className="p-5 bg-muted/20 rounded-xl border space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Post category"
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="p-5 bg-muted/20 rounded-xl border space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-heading font-medium transition-colors duration-200",
                      selectedTagIds.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cover image */}
          <div className="p-5 bg-muted/20 rounded-xl border space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cover Image
            </h3>
            {mainImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt="Cover"
                className="w-full aspect-video object-cover rounded-lg border"
              />
            )}
            <label
              className={cn(
                "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed text-sm text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-primary transition-colors duration-200",
                imageUploading && "opacity-50 pointer-events-none"
              )}
            >
              {imageUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              {mainImage ? "Replace image" : "Upload cover image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImage}
                className="hidden"
              />
            </label>
            {mainImage && (
              <button
                type="button"
                onClick={() => setMainImage("")}
                className="text-xs text-destructive hover:underline"
              >
                Remove cover image
              </button>
            )}
            {imageError && (
              <p className="text-xs text-destructive">{imageError}</p>
            )}
          </div>

          {/* Admin-only controls */}
          {isAdmin && (
            <div className="p-5 bg-muted/20 rounded-xl border space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </h3>
              <button
                type="button"
                onClick={handleToggleFeatured}
                disabled={isPending}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  featured
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {featured ? (
                  <StarOff className="w-4 h-4" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
                {featured ? "Remove from Featured" : "Set as Featured"}
              </button>
            </div>
          )}

          {/* Danger zone */}
          <div className="p-5 bg-destructive/5 rounded-xl border border-destructive/20 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-destructive/70">
              Danger Zone
            </h3>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Story
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
