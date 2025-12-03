import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { BlogPost } from '../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { API_BASE_URL } from '../config';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogClick: (id: string) => void;
}

export function SearchModal({ isOpen, onClose, onBlogClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/posts/?search=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.results || []);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleBlogClick = (id: string) => {
    onBlogClick(id);
    onClose();
    setSearchQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-[#FFFEF9] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-6 border-b border-[#E8D5B7]">
            <div className="flex items-center gap-4">
              <Search className="h-6 w-6 text-[#8B4513]" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-lg text-[#3C2415] placeholder-[#8B4513] outline-none"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F5E6D3] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#8B4513]" />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {searchQuery.trim() ? (
              <div className="p-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p
                      className="text-sm text-[#8B4513] px-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </p>
                    {searchResults.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleBlogClick(post.id)}
                        className="flex gap-4 p-4 bg-[#FAF7F2] hover:bg-[#F5E6D3] rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-[#3C2415] mb-1 line-clamp-1"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {post.title}
                          </h4>
                          <p
                            className="text-sm text-[#8B4513] line-clamp-2"
                            style={{ fontFamily: 'Open Sans, sans-serif' }}
                          >
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className="text-xs text-[#D2691E]"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {post.category?.name || 'Uncategorized'}
                            </span>
                            <span className="text-xs text-[#8B4513]">•</span>
                            <span className="text-xs text-[#8B4513]">
                              {post.reading_time}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-[#E8D5B7] mx-auto mb-4" />
                    <p
                      className="text-[#8B4513]"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      No results found for "{searchQuery}"
                    </p>
                    <p
                      className="text-sm text-[#8B4513] mt-2"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      Try different keywords or browse categories
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#8B4513]" />
                        <h3
                          className="text-[#3C2415]"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Recent Searches
                        </h3>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-[#D2691E] hover:text-[#B8581A]"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="px-4 py-2 bg-[#F5E6D3] hover:bg-[#E8D5B7] rounded-full text-sm text-[#3C2415] transition-colors"
                          style={{ fontFamily: 'Open Sans, sans-serif' }}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-[#8B4513]" />
                    <h3
                      className="text-[#3C2415]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Trending Topics
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Productivity', 'Mindfulness', 'Growth', 'Technology', 'Lifestyle'].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSearchQuery(topic)}
                        className="px-4 py-2 bg-[#F5E6D3] hover:bg-[#E8D5B7] rounded-full text-sm text-[#3C2415] transition-colors"
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
