import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Coffee } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { CoffeeFloatingElements } from './ParallaxContainer';
import { useRef } from 'react';

interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  readTime: string;
  onClick?: () => void;
}

export function FeaturedArticle({ title, excerpt, imageUrl, readTime, onClick }: FeaturedArticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 0.95]);

  return (
    <motion.section
      ref={containerRef}
      className="relative bg-white overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[500px] md:h-[600px]">
          {/* Parallax Background Image */}
          <motion.div
            style={{ y: backgroundY, scale }}
            className="absolute inset-0 w-full h-full"
          >
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Coffee floating elements for added depth */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            className="absolute inset-0"
          >
            <CoffeeFloatingElements />
          </motion.div>

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

          {/* Content with parallax */}
          <motion.div
            style={{ y: contentY }}
            className="absolute inset-0 flex items-center"
          >
            <motion.div
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              >
                {title}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              >
                {excerpt}
              </motion.p>
              <motion.div
                className="flex items-center justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
              >
                <Coffee className="h-4 w-4 text-[#CD853F] mr-2" />
                <span className="text-white/80 text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {readTime} min read
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onClick}
                  className="bg-[#D2691E] hover:bg-[#B8581A] text-white px-8 py-3 text-lg shadow-lg"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Read More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}