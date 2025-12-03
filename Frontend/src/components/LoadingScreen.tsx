import { motion } from 'motion/react';
import { Coffee } from 'lucide-react';
import { useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#3C2415] flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Coffee cup with steam animation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-4 relative"
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ duration: 1.5, repeat: 2, ease: "easeInOut" }}
          >
            <Coffee className="w-full h-full text-[#D2691E]" />
          </motion.div>
          
          {/* Simplified steam animation */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-4 bg-gradient-to-t from-[#D2691E] to-transparent rounded-full absolute"
                style={{ left: `${i * 3 - 1.5}px` }}
                animate={{
                  opacity: [0, 0.8, 0],
                  y: [-5, -15],
                }}
                transition={{
                  duration: 1,
                  repeat: 2,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Brand name with typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1
            className="text-4xl font-bold text-[#FAF7F2] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Coffee'n me
          </motion.h1>
          
          <motion.p
            className="text-[#CD853F] text-lg"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Thoughtful reads for your coffee breaks
          </motion.p>
        </motion.div>

        {/* Loading progress */}
        <motion.div
          className="mt-8 w-48 h-1 bg-[#8B4513] rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-[#D2691E] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}