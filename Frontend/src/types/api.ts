/**
 * API Type Definitions for Coffee'n me
 * 
 * These types mirror the Django REST Framework serializer outputs
 * and provide type safety for frontend API interactions.
 */

// =============================================================================
// User Types
// =============================================================================

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    posts_count: number;
}

export interface CurrentUser extends User {
    is_staff: boolean;
    is_superuser: boolean;
    date_joined: string;
}

// =============================================================================
// Category & Tag Types
// =============================================================================

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    posts_count: number;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

// =============================================================================
// Post Types
// =============================================================================

export interface PostListItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: User;
    category: Category | null;
    tags: Tag[];
    featured_image: string | null;
    is_featured: boolean;
    created_at: string;
    published_at: string | null;
    reading_time: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_bookmarked: boolean;
    status: 'draft' | 'published' | 'archived';
}

export interface PostDetail extends PostListItem {
    content: string;
    updated_at: string;
    comments: Comment[];
    related_posts: PostListItem[];
    meta_description: string;
    meta_keywords: string;
}

export interface PostCreateUpdate {
    title: string;
    content: string;
    excerpt?: string;
    category?: number | null;
    tags?: number[];
    featured_image?: File | null;
    is_featured?: boolean;
    status?: 'draft' | 'published' | 'archived';
    meta_description?: string;
    meta_keywords?: string;
}

// =============================================================================
// Comment Types
// =============================================================================

export interface Comment {
    id: number;
    post: string;
    author: User;
    content: string;
    parent: number | null;
    created_at: string;
    updated_at: string;
    is_approved: boolean;
    replies: Comment[];
    replies_count: number;
}

export interface CommentCreate {
    post: string;
    content: string;
    parent?: number | null;
}

// =============================================================================
// Like & Bookmark Types
// =============================================================================

export interface Like {
    id: number;
    post: string;
    user: User;
    created_at: string;
}

export interface Bookmark {
    id: number;
    post: PostListItem;
    created_at: string;
}

export interface LikeResponse {
    status: 'liked' | 'unliked';
    likes_count: number;
}

export interface BookmarkResponse {
    status: 'bookmarked' | 'removed';
}

// =============================================================================
// API Response Types
// =============================================================================

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface HomeResponse {
    featured_post: PostDetail | null;
    latest_posts: PostListItem[];
    popular_categories: Category[];
    trending_posts: PostListItem[];
    stats: {
        total_posts: number;
        total_categories: number;
        total_tags: number;
    };
}

export interface AdminDashboardResponse {
    stats: {
        total_posts: number;
        total_views: number;
        total_likes: number;
    };
    recent_drafts: PostListItem[];
    pending_comments: Comment[];
}

// =============================================================================
// Auth Types
// =============================================================================

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenResponse {
    token: string;
}

export interface AuthError {
    detail?: string;
    non_field_errors?: string[];
    username?: string[];
    password?: string[];
}

// =============================================================================
// API Error Types
// =============================================================================

export interface APIError {
    detail?: string;
    error?: string;
    [key: string]: string | string[] | undefined;
}
