import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FadeInSection, StaggeredGrid } from './AnimatedContent';
import { Coffee, Search, Filter, BookmarkCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';

import { BlogPost } from '../data/blogData';

interface BlogsProps {
  onBlogClick: (id: string) => void;
}

import { API_BASE_URL } from '../config';

export function Blogs({ onBlogClick }: BlogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { bookmarks } = useBookmarks();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category_slug', selectedCategory.toLowerCase());
        }

        const response = await fetch(`${API_BASE_URL}/api/posts/?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // The /api/posts/ endpoint now returns paginated response { count, next, previous, results: [...] }
        setBlogPosts(data.results || []);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Lifestyle', 'Productivity', 'Growth', 'Technology'];

  const filteredBlogs = blogPosts.filter(blog => {
    const matchesBookmark = !showBookmarked || bookmarks.includes(blog.id);
    return matchesBookmark;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D2691E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-[#FAF7F2] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInSection delay={0.1}>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-4 bg-[#F5E6D3] px-4 py-2 rounded-full"
            >
              <Coffee className="h-5 w-5 text-[#D2691E]" />
              <span
                className="text-[#8B4513]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Coffee Break Reads
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl text-[#3C2415] mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              All Blog Posts
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-[#8B4513] max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Thoughtfully curated content on lifestyle, productivity, growth, and technology.
              Find your perfect read for today's coffee break.
            </motion.p>
          </div>
        </FadeInSection>

        {/* Search and Filter */}
        <FadeInSection delay={0.3}>
          <div className="mb-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B4513]" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-white border-[#E8D5B7] focus:border-[#D2691E] text-[#3C2415] rounded-xl"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[#8B4513]">
                <Filter className="h-4 w-4" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Filter:
                </span>
              </div>

              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                  variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? 'default' : 'outline'}
                  className={
                    selectedCategory === category || (category === 'All' && !selectedCategory)
                      ? 'bg-[#D2691E] hover:bg-[#B8581A] text-white'
                      : 'bg-white border-[#E8D5B7] text-[#8B4513] hover:bg-[#F5E6D3]'
                  }
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {category}
                </Button>
              ))}

              <div className="border-l border-[#E8D5B7] h-8" />

              <Button
                variant={showBookmarked ? 'default' : 'outline'}
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={showBookmarked
                  ? 'bg-[#D2691E] hover:bg-[#B8581A] text-white'
                  : 'bg-white border-[#E8D5B7] text-[#8B4513] hover:bg-[#F5E6D3]'
                }
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <BookmarkCheck className="h-4 w-4 mr-2" />
                Saved ({bookmarks.length})
              </Button>
            </div>
          </div>
        </FadeInSection>

        {/* Blog Grid */}
        <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              onClick={() => onBlogClick(blog.id)}
              className="group cursor-pointer"
            >
              <div className="bg-[#FFFEF9] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="h-full w-full"
                  >
                    <ImageWithFallback
                      src={blog.featured_image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <div className="absolute top-4 left-4">
                    <span
                      className="bg-[#D2691E] text-white px-3 py-1 rounded-full text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {blog.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-[#8B4513] mb-3">
                    <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Coffee className="h-4 w-4 text-[#CD853F]" />
                      <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
                        {blog.reading_time}
                      </span>
                    </div>
                  </div>

                  <h3
                    className="text-xl md:text-2xl text-[#3C2415] mb-3 group-hover:text-[#D2691E] transition-colors line-clamp-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {blog.title}
                  </h3>

                  <p
                    className="text-[#8B4513] leading-relaxed mb-4 line-clamp-3 flex-1"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  >
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F5E6D3]">
                    <span
                      className="text-sm text-[#8B4513]"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      By Author {blog.author.first_name ? `${blog.author.first_name} ${blog.author.last_name}` : blog.author.username}
                    </span>

                    <motion.span
                      className="text-[#D2691E] group-hover:text-[#B8581A] transition-colors"
                      whileHover={{ x: 5 }}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Read More →
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggeredGrid>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Coffee className="h-20 w-20 text-[#E8D5B7] mx-auto mb-4" />
            <h3
              className="text-2xl text-[#3C2415] mb-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              No articles found
            </h3>
            <p
              className="text-[#8B4513]"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
