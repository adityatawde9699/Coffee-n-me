import { Coffee, Search, Menu, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onSearchClick?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Header({ currentPage = 'home', onNavigate, onSearchClick, isDarkMode = false, onToggleDarkMode }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header 
      className="bg-[#FFFEF9] border-b border-[#E8D5B7] sticky top-0 z-50 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Coffee className="h-6 w-6 text-[#D2691E]" />
            </motion.div>
            <span className="text-xl font-semibold text-[#3C2415]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Coffee'n me
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('blogs')}
              className={`transition-colors ${currentPage === 'blogs' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Blogs
            </button>
            <button 
              onClick={() => handleNavClick('categories')}
              className={`transition-colors ${currentPage === 'categories' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Categories
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`transition-colors ${currentPage === 'about' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              About
            </button>
            <Button variant="ghost" size="sm" onClick={onSearchClick}>
              <Search className="h-4 w-4" />
            </Button>
            {onToggleDarkMode && (
              <Button variant="ghost" size="sm" onClick={onToggleDarkMode}>
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8D5B7]">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavClick('home')}
                className={`text-left transition-colors ${currentPage === 'home' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('blogs')}
                className={`text-left transition-colors ${currentPage === 'blogs' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Blogs
              </button>
              <button 
                onClick={() => handleNavClick('categories')}
                className={`text-left transition-colors ${currentPage === 'categories' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Categories
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className={`text-left transition-colors ${currentPage === 'about' ? 'text-[#D2691E]' : 'text-[#8B4513] hover:text-[#D2691E]'}`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                About
              </button>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}