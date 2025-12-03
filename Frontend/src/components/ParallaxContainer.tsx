import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useScroll } from 'motion/react';

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

export function ParallaxContainer({ children, speed = 0.5, className = '', offset = 0 }: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset - (100 * speed)]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  backgroundElements?: React.ReactNode;
  className?: string;
}

export function ParallaxBackground({ children, backgroundElements, className = '' }: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Background layer with slower movement */}
      {backgroundElements && (
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          {backgroundElements}
        </motion.div>
      )}
      
      {/* Foreground content with faster movement */}
      <motion.div
        style={{ y: foregroundY }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ScrollTriggeredParallaxProps {
  children: React.ReactNode;
  speed?: number;
  triggerOnce?: boolean;
  className?: string;
}

export function ScrollTriggeredParallax({ 
  children, 
  speed = 0.3, 
  triggerOnce = false,
  className = '' 
}: ScrollTriggeredParallaxProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.7]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !isVisible)) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [triggerOnce, isVisible]);

  return (
    <motion.div
      ref={ref}
      style={{ y: isVisible ? y : 0, opacity }}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Coffee-themed floating elements for background
export function CoffeeFloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Coffee bean shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-3 bg-[#8B4513] rounded-full opacity-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-1.5 h-2.5 bg-[#CD853F] rounded-full opacity-15"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-2.5 h-3.5 bg-[#D2691E] rounded-full opacity-8"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      {/* Steam-like curves */}
      <motion.div
        className="absolute top-1/6 right-1/4 w-1 h-8 bg-gradient-to-t from-transparent to-[#F5E6D3] opacity-20 rounded-full"
        animate={{
          scaleY: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/6 w-1 h-6 bg-gradient-to-t from-transparent to-[#E8D5B7] opacity-15 rounded-full"
        animate={{
          scaleY: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}