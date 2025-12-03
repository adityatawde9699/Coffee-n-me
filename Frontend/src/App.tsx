import { Header } from './components/Header';
import { FeaturedArticle } from './components/FeaturedArticle';
import { ArticleCard } from './components/ArticleCard';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { AnimatedContent, FadeInSection, StaggeredGrid } from './components/AnimatedContent';
import { ParallaxSection } from './components/ParallaxSection';
import { Categories } from './components/Categories';
import { Blogs } from './components/Blogs';
import { BlogPost as BlogPostComponent } from './components/BlogPost';
import { SearchModal } from './components/SearchModal';
import { Newsletter } from './components/Newsletter';
import { ScrollToTop } from './components/ScrollToTop';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { BlogPost } from './data/blogData';


import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/admin/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { WriteBlog } from './pages/admin/WriteBlog';
import { ProtectedRoute } from './components/ProtectedRoute';

import { API_BASE_URL } from './config';

function Home({ onBlogClick }: { onBlogClick: (id: string) => void }) {
  const [featuredArticle, setFeaturedArticle] = useState<BlogPost | null>(null);
  const [recentArticles, setRecentArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home/`);
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const data = await response.json();

        setFeaturedArticle(data.featured_post || null);
        setRecentArticles(data.latest_posts || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Featured Article with Parallax */}
      {featuredArticle && (
        <FeaturedArticle
          title={featuredArticle.title}
          excerpt={featuredArticle.excerpt}
          imageUrl={featuredArticle.featured_image || "https://images.unsplash.com/photo-1744725134127-8ad8f63f1831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjB3b3Jrc3BhY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzU4NjU0MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
          readTime={featuredArticle.reading_time.replace(' min read', '')}
          onClick={() => onBlogClick(featuredArticle.id)}
        />
      )}

      {/* Parallax Transition Section */}
      <ParallaxSection />

      {/* Recent Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeInSection delay={0.2}>
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-semibold text-[#3C2415] mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Recent Coffee Breaks
            </h2>
            <p
              className="text-lg text-[#8B4513] max-w-2xl mx-auto"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Thoughtful reads on lifestyle, tech, and personal growth. Perfect for your next coffee break.
            </p>
          </div>
        </FadeInSection>

        <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              imageUrl={article.featured_image || "https://images.unsplash.com/photo-1588660355452-8a4e6696a7c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwcHJvZHVjdGl2aXR5JTIwbGFwdG9wfGVufDF8fHx8MTc1ODY1NDEyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
              readTime={article.reading_time.replace(' min read', '')}
              category={article.category || 'Uncategorized'}
              onClick={() => onBlogClick(article.id)}
            />
          ))}
        </StaggeredGrid>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Newsletter />
      </section>
    </motion.div>
  );
}

function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="text-center">
        <h1
          className="text-4xl md:text-5xl text-[#3C2415] mb-6"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          About Coffee'n me
        </h1>
        <p
          className="text-lg text-[#8B4513] max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          We curate thoughtful reads on lifestyle, technology, and personal growth.
          Each article is crafted to be the perfect companion for your coffee break—
          insightful, engaging, and just the right length to fit into your day.
        </p>
      </div>
    </motion.div>
  );
}

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark');
  };

  const handleNavigation = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'blogs') navigate('/blogs');
    else if (page === 'categories') navigate('/categories');
    else if (page === 'about') navigate('/about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBlogClick = (id: string) => {
    navigate(`/post/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlogs = () => {
    navigate('/blogs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] relative overflow-x-hidden">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(245, 230, 211, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(232, 213, 183, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(210, 105, 30, 0.05) 0%, transparent 70%)
          `,
          backgroundSize: '400px 400px, 600px 600px, 800px 800px',
          backgroundPosition: '0 0, 200px 200px, 400px 400px'
        }}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <AnimatedContent>
              <Header
                currentPage={location.pathname === '/' ? 'home' : location.pathname.substring(1)}
                onNavigate={handleNavigation}
                onSearchClick={() => setIsSearchOpen(true)}
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
              />

              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onBlogClick={handleBlogClick}
              />

              <main>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home onBlogClick={handleBlogClick} />} />
                    <Route path="/blogs" element={<Blogs onBlogClick={handleBlogClick} />} />
                    <Route path="/post/:id" element={<BlogPostComponent onBack={handleBackToBlogs} onBlogClick={handleBlogClick} />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/about" element={<About />} />


                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="write" element={<WriteBlog />} />
                      <Route path="bookmarks" element={<div>Bookmarks (Coming Soon)</div>} />
                      <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
                    </Route>
                  </Routes>
                </AnimatePresence>
              </main>

              <FadeInSection delay={0.3}>
                <Footer />
              </FadeInSection>

              <ScrollToTop />
            </AnimatedContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}