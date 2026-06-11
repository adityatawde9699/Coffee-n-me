import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  content: z.string().min(1, "Content is required").max(200_000, "Content is too long"),
  excerpt: z.string().max(300).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  mainImage: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
});

export type PostInput = z.infer<typeof postSchema>;
