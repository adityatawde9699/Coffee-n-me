"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { EditorToolbar } from "@/components/editor/EditorToolbar";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  // Stable, debounced change handler — created once, not per render, so the
  // 1s debounce window actually batches keystrokes.
  const debouncedUpdate = useMemo(
    () => debounce((html: string) => onChange(html), 800),
    [onChange]
  );

  const editor = useEditor({
    // Required for SSR (Next.js App Router) to avoid hydration mismatches.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      // No base64 — images go through the signed Cloudinary upload (https URLs),
      // keeping data: URIs (a potential XSS vector) out of stored content.
      Image,
      Placeholder.configure({ placeholder: "Tell your story…" }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral prose-lg dark:prose-invert focus:outline-none max-w-none font-serif min-h-[50vh]",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor.getHTML());
    },
  });

  // Flush pending debounced writes and tear it down on unmount.
  useEffect(() => {
    return () => {
      debouncedUpdate.flush();
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  // Sync external content changes (e.g. router.refresh) without clobbering edits.
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
