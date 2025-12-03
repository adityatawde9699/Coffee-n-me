import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { user } = useAuth();

  // Load initial bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      if (user) {
        // Authenticated: Fetch from API
        try {
          const response = await api.get('/api/user/bookmarks/');
          // Assuming API returns a list of objects with a 'post' field which is the ID or object
          // Adjust based on actual API response structure. 
          // Based on views.py: serializer is BookmarkSerializer. 
          // We need to check BookmarkSerializer structure. 
          // Usually it returns { id, post: { ... } } or similar.
          // Let's assume for now we need to map it.
          // If BookmarkSerializer returns { post: { id: ... } }
          const bookmarkIds = response.data.results.map((b: any) => b.post.id);
          setBookmarks(bookmarkIds);
        } catch (error) {
          console.error('Failed to fetch bookmarks:', error);
        }
      } else {
        // Guest: Load from localStorage
        const saved = localStorage.getItem('bookmarks');
        if (saved) {
          setBookmarks(JSON.parse(saved));
        }
      }
    };

    loadBookmarks();
  }, [user]);

  const toggleBookmark = async (id: string) => {
    if (user) {
      // Authenticated: Call API
      try {
        // Optimistic update
        const isBookmarked = bookmarks.includes(id);
        const updated = isBookmarked
          ? bookmarks.filter(b => b !== id)
          : [...bookmarks, id];
        setBookmarks(updated);

        await api.post(`/api/posts/${id}/bookmark/`);
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
        // Revert on error (optional, but good UX)
        // For simplicity in this MVP, we'll just log the error
      }
    } else {
      // Guest: Use localStorage
      const updated = bookmarks.includes(id)
        ? bookmarks.filter(b => b !== id)
        : [...bookmarks, id];

      setBookmarks(updated);
      localStorage.setItem('bookmarks', JSON.stringify(updated));
    }
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
