import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '../data/blogData';

interface RecommendationSliderProps {
  recommendations: BlogPost[];
  onBlogClick: (id: string) => void;
}

export function RecommendationSlider({ recommendations, onBlogClick }: RecommendationSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Determine how many slides to show based on screen size
  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  // Update slidesToShow on window resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setSlidesToShow(getSlidesToShow());
    });
  }

  const maxIndex = Math.max(0, recommendations.length - slidesToShow);

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleRecommendations = recommendations.slice(
    currentIndex,
    currentIndex + slidesToShow
  );

  return (
    <section className="bg-gradient-to-br from-[#F5E6D3] to-[#FFFEF9] py-16 px-4 sm:px-6 lg:px-8 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 bg-[#FFFEF9] px-4 py-2 rounded-full shadow-sm">
            <Coffee className="h-5 w-5 text-[#D2691E]" />
            <span
              className="text-[#8B4513]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Continue Reading
            </span>
          </div>

          <h2
            className="text-3xl md:text-4xl text-[#3C2415] mb-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            You Might Also Like
          </h2>

          <p
            className="text-lg text-[#8B4513] max-w-2xl mx-auto"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            More thoughtful reads to enjoy with your coffee
          </p>
        </motion.div>

        <div className="relative px-4 md:px-12">
          {/* Previous Button */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10 bg-[#D2691E] hover:bg-[#B8581A] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Slider Container */}
          <div className="overflow-hidden relative">
            <div className={`grid gap-6 ${slidesToShow === 3 ? 'grid-cols-1 lg:grid-cols-3' :
              slidesToShow === 2 ? 'grid-cols-1 md:grid-cols-2' :
                'grid-cols-1'
              }`}>
              <AnimatePresence initial={false} custom={direction}>
                {visibleRecommendations.map((blog) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => onBlogClick(blog.id)}
                      className="bg-[#FFFEF9] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer h-full"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="h-full w-full"
                        >
                          <ImageWithFallback
                            src={blog.featured_image}
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

                      <div className="p-6">
                        <h3
                          className="text-xl text-[#3C2415] mb-3 line-clamp-2"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {blog.title}
                        </h3>

                        <p
                          className="text-[#8B4513] mb-4 line-clamp-2 leading-relaxed"
                          style={{ fontFamily: 'Open Sans, sans-serif' }}
                        >
                          {blog.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coffee className="h-4 w-4 text-[#CD853F]" />
                            <span
                              className="text-sm text-[#8B4513]"
                              style={{ fontFamily: 'Open Sans, sans-serif' }}
                            >
                              {blog.reading_time}
                            </span>
                          </div>

                          <span
                            className="text-sm text-[#D2691E] hover:text-[#B8581A] transition-colors"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            Read More →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Next Button */}
          {currentIndex < maxIndex && (
            <button
              onClick={handleNext}
              className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10 bg-[#D2691E] hover:bg-[#B8581A] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Dots Indicator */}
        {recommendations.length > slidesToShow && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-[#D2691E] scale-125'
                  : 'bg-[#E8D5B7] hover:bg-[#D2691E]'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
