import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  articleCount: number;
  icon: React.ReactNode;
}

export function CategoryCard({ name, description, imageUrl, articleCount, icon }: CategoryCardProps) {
  return (
    <motion.div
      className="group relative bg-[#FFFEF9] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3C2415]/80 via-[#3C2415]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Icon Badge */}
        <motion.div 
          className="absolute top-4 left-4 bg-[#D2691E] text-white p-3 rounded-xl shadow-lg"
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        
        {/* Article Count Badge */}
        <div className="absolute top-4 right-4 bg-[#FFFEF9] text-[#3C2415] px-3 py-1 rounded-full shadow-md">
          <span className="text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {articleCount} article{articleCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 
            className="text-2xl text-[#3C2415] group-hover:text-[#D2691E] transition-colors duration-300"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {name}
          </h3>
          <motion.div
            className="text-[#D2691E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <ArrowRight className="h-6 w-6" />
          </motion.div>
        </div>
        
        <p 
          className="text-[#8B4513] leading-relaxed mb-4"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {description}
        </p>
        
        {/* Decorative Coffee Bean Elements */}
        <div className="flex gap-2 pt-4 border-t border-[#F5E6D3]">
          <motion.div
            className="w-2 h-2 rounded-full bg-[#CD853F]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-[#CD853F]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-[#CD853F]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-[#D2691E] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
}
