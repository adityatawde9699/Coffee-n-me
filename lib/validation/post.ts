import { z } from "zod";

// Helper: coerce empty string OR null → null before further validation.
// Used for all optional fields that come from HTML form selects/inputs
// which send "" when nothing is selected instead of null.
const nullish = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" || val === null ? null : val), schema.nullable().optional());

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  content: z.string().min(1, "Content is required").max(200_000, "Content is too long"),
  // excerpt: null from the DB becomes "" in state, but null can also arrive directly.
  excerpt: nullish(z.string().max(500, "Excerpt must be 500 characters or fewer")),
  categoryId: nullish(z.string().uuid()),
  mainImage: nullish(z.string().url()),
  featured: z.boolean().default(false),
});

export type PostInput = z.infer<typeof postSchema>;
