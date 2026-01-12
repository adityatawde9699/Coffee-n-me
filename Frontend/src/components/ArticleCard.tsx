import { ImageWithFallback } from './figma/ImageWithFallback';
import { Coffee } from 'lucide-react';
import { ScrollTriggeredParallax } from './ParallaxContainer';
import { motion } from 'motion/react';

interface ArticleCardProps {
  id?: string | number; // UUID or number
  title: string;
  excerpt: string;
  imageUrl: string;
  readTime: string;
  category: { name: string } | string; // Handle both object (API) and string (legacy)
  onClick?: () => void;
}

export function ArticleCard({ id: _id, title, excerpt, imageUrl, readTime, category, onClick }: ArticleCardProps) {
  // Helper to get category name safely
  const categoryName = typeof category === 'object' && category !== null ? category.name : category;

  return (
    <ScrollTriggeredParallax speed={0.2} className="h-full">
      <motion.article
        onClick={onClick}
        className="bg-[#FFFEF9] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-[#F5E6D3] h-full"
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <motion.span
              className="text-xs uppercase tracking-wide text-[#D2691E] font-medium"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {categoryName} {/* CHANGED: Use the extracted name */}
            </motion.span>
          </div>
          <motion.h3
            className="text-xl font-semibold text-[#3C2415] mb-3 line-clamp-2 group-hover:text-[#D2691E] transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className="text-[#8B4513] text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {excerpt}
          </motion.p>
          <motion.div
            className="flex items-center text-[#8B4513] text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Coffee className="h-3 w-3 text-[#CD853F] mr-1" />
            <span style={{ fontFamily: 'Open Sans, sans-serif' }}>
              {readTime} min read
            </span>
          </motion.div>
        </div>
      </motion.article>
    </ScrollTriggeredParallax>
  );
}