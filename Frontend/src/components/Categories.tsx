import { CategoryCard } from './CategoryCard';
import { FadeInSection, StaggeredGrid } from './AnimatedContent';
import { motion } from 'motion/react';
import { Coffee, Lightbulb, TrendingUp, Laptop, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  description: string;
  posts_count: number;
  icon?: string;
}

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'lifestyle': return <Coffee className="h-6 w-6" />;
    case 'productivity': return <Lightbulb className="h-6 w-6" />;
    case 'growth': return <TrendingUp className="h-6 w-6" />;
    case 'technology': return <Laptop className="h-6 w-6" />;
    default: return <Sparkles className="h-6 w-6" />;
  }
};

const getImageUrl = (name: string) => {
  switch (name.toLowerCase()) {
    case 'lifestyle': return 'https://images.unsplash.com/photo-1672707069442-91a5854ce1c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBjb2ZmZWUlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDIwNTAxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    case 'productivity': return 'https://images.unsplash.com/photo-1622086674545-1346776dfef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0aXZpdHklMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2MDE1MzcxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    case 'growth': return 'https://images.unsplash.com/photo-1725452119277-c302b6ce936f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGdyb3d0aCUyMGpvdXJuYWx8ZW58MXx8fHwxNzYwMjA1MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    case 'technology': return 'https://images.unsplash.com/photo-1555631545-e5143ba3bced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbW9kZXJuJTIwbWluaW1hbHxlbnwxfHx8fDE3NjAyMDUwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    default: return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wfGVufDF8fHx8MTc1ODY1NDEyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  }
};

import { API_BASE_URL } from '../config';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.results || data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D2691E]"></div>
      </div>
    );
  }

  return (
    <section className="relative bg-[#FAF7F2] py-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Coffee className="h-32 w-32 text-[#D2691E]" />
        </motion.div>
      </div>

      <div className="absolute bottom-20 left-10 opacity-10">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-24 w-24 text-[#CD853F]" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <FadeInSection delay={0.1}>
          <div className="text-center mb-16">
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
                Explore Topics
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl text-[#3C2415] mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Browse by Category
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-[#8B4513] max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover thoughtfully curated content across lifestyle, productivity, growth, and technology.
              Find your perfect reading companion for your next coffee break.
            </motion.p>
          </div>
        </FadeInSection>

        {/* Category Cards Grid */}
        <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <CategoryCard
                name={category.name}
                description={category.description}
                articleCount={category.posts_count}
                imageUrl={getImageUrl(category.name)}
                icon={getIcon(category.name)}
              />
            </motion.div>
          ))}
        </StaggeredGrid>

        {/* Stats Section */}
        <FadeInSection delay={0.8}>
          <motion.div
            className="mt-20 bg-gradient-to-br from-[#F5E6D3] to-[#FFFEF9] rounded-2xl p-8 md:p-12 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <motion.div
                  className="text-4xl md:text-5xl text-[#D2691E] mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {categories.reduce((acc, cat) => acc + cat.posts_count, 0)}+
                </motion.div>
                <p
                  className="text-[#8B4513]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Articles
                </p>
              </div>

              <div>
                <motion.div
                  className="text-4xl md:text-5xl text-[#D2691E] mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {categories.length}
                </motion.div>
                <p
                  className="text-[#8B4513]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Categories
                </p>
              </div>

              <div>
                <motion.div
                  className="text-4xl md:text-5xl text-[#D2691E] mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  6min
                </motion.div>
                <p
                  className="text-[#8B4513]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Avg Read
                </p>
              </div>

              <div>
                <motion.div
                  className="text-4xl md:text-5xl text-[#D2691E] mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  ∞
                </motion.div>
                <p
                  className="text-[#8B4513]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Insights
                </p>
              </div>
            </div>
          </motion.div>
        </FadeInSection>
      </div>
    </section>
  );
}
