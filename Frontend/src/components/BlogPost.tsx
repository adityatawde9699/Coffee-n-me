import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CommentSection } from './CommentSection';
import { RecommendationSlider } from './RecommendationSlider';
import { FadeInSection } from './AnimatedContent';
import { ReadingProgress } from './ReadingProgress';
import { TableOfContents } from './TableOfContents';
import { ShareModal } from './ShareModal';
import { Coffee, Calendar, User, ArrowLeft, Share2, Bookmark, BookmarkCheck, Eye, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { BlogPost } from '../data/blogData'
import { useBookmarks } from '../hooks/useBookmarks';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { useParams } from 'react-router-dom';




import { API_BASE_URL } from '../config';

interface BlogPostProps {
  onBack: () => void;
  onBlogClick: (id: string) => void;
}

export function BlogPost({ onBack, onBlogClick }: BlogPostProps) {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { addToHistory } = useReadingHistory();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setBlog(data);
        addToHistory(data.id);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, addToHistory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D2691E]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>{error || 'Post not found'}</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Back to Blogs
        </Button>
      </div>
    );
  }

  const recommendations = blog.related_posts || [];
  const bookmarked = isBookmarked(blog.id);



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ReadingProgress />
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={blog.featured_image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Showcase Overlay */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%),
            radial-gradient(ellipse at top, rgba(60, 36, 21, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at bottom, rgba(139, 69, 19, 0.2) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(60, 36, 21, 0.4) 100%)
          `
        }}>
          {/* Vignette effect */}
          <div className="absolute inset-0" style={{
            boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.5), inset 0 0 80px rgba(60, 36, 21, 0.3)'
          }}></div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute top-8 left-4 md:left-8 z-10"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-[#FFFEF9]/90 hover:bg-[#FFFEF9] border-[#E8D5B7] text-[#3C2415] backdrop-blur-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </motion.div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span
                className="inline-block bg-[#D2691E] text-white px-4 py-2 rounded-full mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {blog.category?.name || 'Uncategorized'}
              </span>

              <h1
                className="text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {blog.title}
              </h1>

              <div className="flex items-center justify-center flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    Author {blog.author.first_name} {blog.author.last_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-[#CD853F]" />
                  <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {blog.reading_time}
                  </span>
                </div>

                {blog.views && (
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {blog.views.toLocaleString()} views
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents content={[]} />
            {/* TODO: Re-implement Table of Contents for HTML content */}
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <FadeInSection delay={0.2}>
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <Tag className="h-4 w-4 text-[#8B4513]" />
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F5E6D3] text-[#8B4513] rounded-full text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-[#E8D5B7]">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBookmark(blog.id)}
                    className={`flex items-center gap-2 transition-colors ${bookmarked ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'
                      }`}
                  >
                    {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                    <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {bookmarked ? 'Saved' : 'Save'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-2 text-[#8B4513] hover:text-[#D2691E] transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Share
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Article Text - UPDATED FOR SUMMERNOTE */}
              <article className="prose prose-lg max-w-none text-[#3C2415] font-sans">
                {/* We use dangerouslySetInnerHTML, but sanitized via DOMPurify.
                   The 'prose' class from Tailwind Typography plugin (if installed) 
                   handles the styling of h1, h2, b, i, img tags automatically.
                */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blog.content)
                  }}
                />
              </article>

              {/* Author Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 p-8 bg-gradient-to-br from-[#F5E6D3] to-[#FFFEF9] rounded-2xl"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#D2691E] rounded-full flex items-center justify-center">
                      <span
                        className="text-2xl text-white"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {blog.author.first_name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3
                      className="text-2xl text-[#3C2415] mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Author {blog.author.first_name} {blog.author.last_name}
                    </h3>
                    <p
                      className="text-[#8B4513] leading-relaxed"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      A passionate writer and thinker, exploring the intersections of {blog.category?.name?.toLowerCase() || 'life'},
                      mindfulness, and intentional living. Dedicated to crafting thoughtful content that
                      inspires reflection and meaningful conversation.
                    </p>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>

            {/* Comments Section */}
            <FadeInSection delay={0.3}>
              <div className="mt-16">
                <CommentSection />
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={blog.title}
      />

      {/* Recommendations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeInSection delay={0.4}>
          <RecommendationSlider
            recommendations={recommendations}
            onBlogClick={onBlogClick}
          />
        </FadeInSection>
      </div>
    </motion.div>
  );
}


