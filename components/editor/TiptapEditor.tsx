"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import debounce from "lodash.debounce";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-neutral prose-lg dark:prose-invert focus:outline-none max-w-none font-serif",
      },
    },
    onUpdate: ({ editor }) => {
      debouncedUpdate(editor.getHTML());
    },
  });

  const debouncedUpdate = debounce((html: string) => {
    onChange(html);
  }, 1000);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
