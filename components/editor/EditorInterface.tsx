"use client";

import { useState, useTransition } from "react";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePost, publishPost } from "@/lib/actions/post";
import { useRouter } from "next/navigation";
import { Save, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditorInterfaceProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    slug: string;
    published: boolean;
  };
}

export function EditorInterface({ post }: EditorInterfaceProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [slug, setSlug] = useState(post.slug);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = () => {
    startTransition(async () => {
      await updatePost(post.id, { title, content, excerpt, slug });
      router.refresh();
    });
  };

  const handlePublish = () => {
    if (!confirm("Are you sure you want to publish this story?")) return;
    
    startTransition(async () => {
      await updatePost(post.id, { title, content, excerpt, slug });
      await publishPost(post.id);
      router.push(`/article/${slug}`);
    });
  };

  return (
    <div className="flex flex-col gap-8">
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
              {post.published ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave} 
            disabled={isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            size="sm" 
            onClick={handlePublish} 
            disabled={isPending}
          >
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story Title"
            className="text-4xl md:text-5xl font-heading tracking-tight border-none focus-visible:ring-0 px-0 h-auto py-0 bg-transparent placeholder:text-muted-foreground/30"
          />
          
          <TiptapEditor 
            content={content} 
            onChange={setContent} 
          />
        </div>

        <aside className="lg:col-span-1 space-y-8">
          <div className="space-y-4 p-6 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Metadata
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input 
                id="slug" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea 
                id="excerpt" 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                placeholder="A brief summary for cards and SEO..."
                className="text-sm h-32 font-serif"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
