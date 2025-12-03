import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedContentProps {
  children: ReactNode;
}

export function AnimatedContent({ children }: AnimatedContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeInSection({ children, delay = 0, direction = 'up' }: FadeInSectionProps) {
  const directionVariants = {
    up: { y: 20, opacity: 0 },
    down: { y: -20, opacity: 0 },
    left: { x: 20, opacity: 0 },
    right: { x: -20, opacity: 0 }
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredGridProps {
  children: ReactNode[];
  className?: string;
}

export function StaggeredGrid({ children, className }: StaggeredGridProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.08,
            ease: "easeOut"
          }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}