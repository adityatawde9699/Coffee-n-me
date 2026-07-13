import { z } from "zod";

// Coerce empty strings to null before running uuid/url validation.
// The editor <select> sends "" when nothing is selected, but Prisma
// expects null for optional foreign-key and image fields.
const emptyToNull = z.preprocess(
  (val) => (val === "" ? null : val),
  z.string().nullable().optional()
);

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  content: z.string().min(1, "Content is required").max(200_000, "Content is too long"),
  excerpt: z.string().max(300).optional(),
  categoryId: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().uuid().nullable().optional()
  ),
  mainImage: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().nullable().optional()
  ),
  featured: z.boolean().default(false),
});

// emptyToNull is exported in case other schemas need the same pattern.
export { emptyToNull };

export type PostInput = z.infer<typeof postSchema>;
