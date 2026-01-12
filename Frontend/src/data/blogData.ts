// Define the shape of the Author object coming from API
export interface Author {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

// Define the shape of the Category object coming from API
export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string; // CHANGED: UUIDs are strings
  title: string;
  excerpt: string;
  content: string;
  author: Author; // CHANGED: Now an object, not a string/number
  created_at: string;
  featured_image: string;
  is_featured: boolean;
  category: Category | null; // CHANGED: Now an object, not a string
  reading_time: string;
  views?: number;
  tags?: Tag[];
  related_posts?: BlogPost[];
}

// Keep these helper functions if needed, but they might need adjusting for UUIDs
export const blogPosts: BlogPost[] = []; // Empty array as default