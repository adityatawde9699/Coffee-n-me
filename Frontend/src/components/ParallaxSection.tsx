import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { CoffeeFloatingElements } from './ParallaxContainer';

export function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  return (
    <div ref={containerRef} className="relative h-40 md:h-60 overflow-hidden">
      {/* Parallax background with coffee texture */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <div 
          className="w-full h-full bg-gradient-to-br from-[#F5E6D3] via-[#E8D5B7] to-[#D2B48C]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(210, 105, 30, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(205, 133, 63, 0.08) 0%, transparent 50%)
            `
          }}
        />
      </motion.div>
      
      {/* Floating coffee elements */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute inset-0"
      >
        <CoffeeFloatingElements />
      </motion.div>
      
      {/* Additional coffee beans scattered */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/6 w-3 h-4 bg-[#8B4513] rounded-full opacity-20 transform -rotate-12" />
        <div className="absolute top-1/3 right-1/5 w-2 h-3 bg-[#CD853F] rounded-full opacity-15 transform rotate-45" />
        <div className="absolute bottom-1/3 left-2/3 w-2.5 h-3.5 bg-[#D2691E] rounded-full opacity-12 transform rotate-12" />
      </motion.div>
      
      {/* Overlay for depth */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/50 to-transparent"
      />
    </div>
  );
}